import { useEffect, useState } from "react";
import axios from "axios";
import ExcelJS from "exceljs";
import { Download, Search, FileSpreadsheet, Calendar } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { templateConfig } from "./templateConfig";

function MasterlistReports() {
  const [allFiles, setAllFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocType, setSelectedDocType] = useState("ACCOMPLISHMENT REPORTS");
  const [documentTypes, setDocumentTypes] = useState([]);
  
  // Date Filtering State
  const [dateFilter, setDateFilter] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const files = response.data || [];
      // Sort by newest first
      files.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setAllFiles(files);

      // Extract unique document types
      const uniqueTypes = [...new Set(files.map(f => f.document_type).filter(Boolean))].sort();
      setDocumentTypes(uniqueTypes);
      
      if (!uniqueTypes.includes(selectedDocType) && uniqueTypes.length > 0) {
        setSelectedDocType(uniqueTypes[0]);
      }
    } catch (error) {
      console.error("FETCH REPORTS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Determine headers based on selected document type
  const getTableHeaders = (docType) => {
    const config = templateConfig[docType];
    if (config && config.headers) {
      return config.headers;
    }
    // Fallback if missing
    return ["DATE", "ACCESS CODE", "SUBJECT", "STATUS", "FILE LOCATION"];
  };

  const getRowData = (file, headers) => {
    const docType = file.document_type;
    const config = templateConfig[docType];
    const data = file.dynamic_data || {};
    
    if (config && config.getRowData) {
      return config.getRowData(file, data);
    }
    
    // Fallback
    return headers.map(header => {
      switch (header) {
        case "DATE": return data.date || new Date(file.created_at).toLocaleDateString();
        case "ACCESS CODE": return data.access_code || file.access_code || "N/A";
        case "SUBJECT": return data.subject || file.subject || file.title || "-";
        case "STATUS": return file.status || "Active";
        case "FILE LOCATION": return data.file_location || (file.file_box ? `${file.file_box.cabinet?.name || ''} - ${file.file_box.name}` : "Unassigned");
        default: return "-";
      }
    });
  };

  const headers = getTableHeaders(selectedDocType);

  // Filter based on selected type, search query, and date range
  const filteredReports = allFiles.filter((file) => {
    // 1. Filter by Document Type
    if (file.document_type !== selectedDocType && selectedDocType !== "ALL") {
      return false;
    }

    // 2. Filter by Date
    const fileDate = new Date(file.created_at);
    const today = new Date();
    
    if (dateFilter === "today") {
      if (fileDate.toDateString() !== today.toDateString()) return false;
    } else if (dateFilter === "7days") {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      if (fileDate < sevenDaysAgo) return false;
    } else if (dateFilter === "1month") {
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(today.getMonth() - 1);
      if (fileDate < oneMonthAgo) return false;
    } else if (dateFilter === "custom") {
      if (customStartDate && new Date(fileDate).setHours(0,0,0,0) < new Date(customStartDate).setHours(0,0,0,0)) return false;
      if (customEndDate && new Date(fileDate).setHours(23,59,59,999) > new Date(customEndDate).setHours(23,59,59,999)) return false;
    }

    // 3. Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const data = file.dynamic_data || {};
      const matchesSearch = (
        (data.subject && data.subject.toLowerCase().includes(query)) ||
        (data.access_code && data.access_code.toLowerCase().includes(query)) ||
        (data.file_location && data.file_location.toLowerCase().includes(query)) ||
        (file.subject && file.subject.toLowerCase().includes(query)) ||
        (file.access_code && file.access_code.toLowerCase().includes(query))
      );
      if (!matchesSearch) return false;
    }

    return true;
  });

  const handleExportExcel = async () => {
    if (filteredReports.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Masterlist");

    const titleStr = `ZPPSU MASTERLIST OF RECORDS - ${selectedDocType}`;

    // Add Title Row
    const lastColLetter = String.fromCharCode(65 + headers.length - 1);
    sheet.mergeCells(`A1:${lastColLetter}1`);
    const titleCell = sheet.getCell("A1");
    titleCell.value = titleStr;
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Add Headers
    const headerRow = sheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    });

    // Add Data
    filteredReports.forEach(file => {
      const rowData = getRowData(file, headers);
      // Clean undefined to empty string
      const cleanRowData = rowData.map(v => v === undefined || v === null ? "" : v);
      const dataRow = sheet.addRow(cleanRowData);
      dataRow.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      });
    });

    // Set Column Widths based on header name
    sheet.columns = headers.map(header => {
      let width = 30; // default wider
      const hUpper = header.toUpperCase();
      if (hUpper.includes("FILE LOCATION")) width = 35;
      else if (hUpper.includes("SUBJECT") || hUpper.includes("DESCRIPTION") || hUpper.includes("TITLE")) width = 45;
      else if (hUpper.includes("DATE") || hUpper.includes("STATUS") || hUpper.includes("ACTION")) width = 20;
      return { width };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ZPPSU_${selectedDocType.replace(/\s+/g, '_')}_Masterlist.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#1D1A1B]">
              Masterlist Reports Registry
            </h1>
            <p className="text-xs text-[#5F5A5C] mt-0.5">
              Generate and export an Excel masterlist for any specific document type.
            </p>
          </div>
          
          <div className="flex items-center gap-2.5">
            <Button 
              onClick={handleExportExcel}
              disabled={filteredReports.length === 0}
              className="h-9 px-4 rounded-xl bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Excel</span>
            </Button>
          </div>
        </div>

        {/* FILTERS */}
        <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5A5C]" />
              <Input 
                placeholder="Search access code, subject, or location..." 
                className="pl-10 h-10 text-xs bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] rounded-xl focus-visible:ring-[#6B1D2A]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <select
                className="w-full h-10 text-xs bg-[#FFFCF7] border border-[#E8E3E1] text-[#1D1A1B] rounded-xl focus:ring-[#6B1D2A] focus:border-[#6B1D2A] px-3 font-semibold cursor-pointer"
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
              >
                {documentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-48 flex items-center gap-2">
              <select
                className="w-full h-10 text-xs bg-[#FFFCF7] border border-[#E8E3E1] text-[#1D1A1B] rounded-xl focus:ring-[#6B1D2A] focus:border-[#6B1D2A] px-3 font-semibold cursor-pointer"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="1month">Last 1 Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </CardContent>
          
          {/* Custom Date Pickers */}
          {dateFilter === "custom" && (
            <div className="px-4 pb-4 flex flex-col md:flex-row gap-4 items-center border-t border-[#E8E3E1] pt-4 mt-2">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-semibold text-[#5F5A5C]">Start Date:</span>
                <Input type="date" className="h-9 text-xs rounded-lg bg-[#FFFCF7] border-[#E8E3E1]" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-semibold text-[#5F5A5C]">End Date:</span>
                <Input type="date" className="h-9 text-xs rounded-lg bg-[#FFFCF7] border-[#E8E3E1]" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} />
              </div>
            </div>
          )}
        </Card>

        {/* MASTERLIST TABLE */}
        <Card className="border border-[#E8E3E1] shadow-xs overflow-hidden bg-[#FFFCF7] rounded-xl">
          <CardContent className="p-0 overflow-x-auto">
            <div className="p-8 min-w-[700px]">
              <div className="border border-[#1D1A1B] text-center font-extrabold text-base p-3 bg-[#F4E7EA] text-[#1D1A1B] uppercase tracking-wide">
                MASTERLIST OF RECORDS FOR {selectedDocType}
              </div>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F4E7EA]">
                    {headers.map((header, idx) => (
                      <th key={idx} className="border border-[#1D1A1B] p-3 text-center font-bold uppercase text-[#1D1A1B]">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((file) => {
                      const rowData = getRowData(file, headers);
                      return (
                        <tr key={file.id} className="hover:bg-[#F4E7EA]/40">
                          {rowData.map((data, idx) => (
                            <td 
                              key={idx} 
                              className={`border border-[#1D1A1B] p-3 ${
                                headers[idx].includes("ACCESS") 
                                  ? "font-mono font-bold text-center text-[#6B1D2A]"
                                  : headers[idx].includes("SUBJECT")
                                  ? "font-medium text-[#1D1A1B]"
                                  : "text-center text-[#5F5A5C]"
                              }`}
                            >
                              {data}
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={headers.length} className="border border-[#1D1A1B] p-8 text-center text-[#5F5A5C] italic">
                        No records found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default MasterlistReports;
