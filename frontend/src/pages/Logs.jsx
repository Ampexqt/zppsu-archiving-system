import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Download, Calendar, Filter, Activity, X, FileSpreadsheet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import ExcelJS from "exceljs";
import { api } from "../services/api";

function Logs() {
  const [logs, setLogs] = useState([]);
  
  // Filter States
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Export Modal States
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportUserFilter, setExportUserFilter] = useState("all");
  const [exportActionType, setExportActionType] = useState("all");
  const [exportDateRange, setExportDateRange] = useState("all");
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchLogs = async () => {
    try {
      const response = await api.get("/api/logs");
      setLogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter Logic for Table
  const filteredLogs = logs.filter((log) => {
    const term = searchEmail.toLowerCase().trim();
    const matchesTerm =
      !term ||
      (log.user?.email && log.user.email.toLowerCase().includes(term)) ||
      (log.user?.name && log.user.name.toLowerCase().includes(term)) ||
      (log.description && log.description.toLowerCase().includes(term));
    const matchesAction = !selectedAction || log.action === selectedAction;
    return matchesTerm && matchesAction;
  });

  // Unique Actions for Dropdown
  const uniqueActions = [...new Set(logs.map(log => log.action))].sort();
  
  // Unique Users for Export Dropdown
  const uniqueUsersMap = new Map();
  logs.forEach(log => {
    const email = log.user?.email || "System";
    if (!uniqueUsersMap.has(email)) {
      uniqueUsersMap.set(email, log.user?.name ? `${log.user.name} (${email})` : email);
    }
  });
  const uniqueUsers = Array.from(uniqueUsersMap.entries()).map(([email, label]) => ({ email, label })).sort((a, b) => a.label.localeCompare(b.label));

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  // Handle Export (Excel .xlsx with professional styling, or CSV fallback)
  const handleExport = async (format = "xlsx") => {
    let exportData = logs.filter((log) => {
      const logDate = new Date(log.created_at);
      
      // Email Match
      const emailMatch = exportUserFilter === "all" || 
        (log.user?.email || "System") === exportUserFilter;
        
      // Action Match
      const actionMatch = exportActionType === "all" || log.action === exportActionType;
      
      // Date Match
      let dateMatch = true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (exportDateRange === "today") {
        if (logDate < today) dateMatch = false;
      } else if (exportDateRange === "7_days") {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        if (logDate < sevenDaysAgo) dateMatch = false;
      } else if (exportDateRange === "1_month") {
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
        if (logDate < oneMonthAgo) dateMatch = false;
      } else if (exportDateRange === "custom") {
        if (exportStartDate) {
          const start = new Date(exportStartDate);
          start.setHours(0, 0, 0, 0);
          if (logDate < start) dateMatch = false;
        }
        if (exportEndDate) {
          const end = new Date(exportEndDate);
          end.setHours(23, 59, 59, 999);
          if (logDate > end) dateMatch = false;
        }
      }

      return emailMatch && actionMatch && dateMatch;
    });

    if (exportData.length === 0) {
      alert("No logs match the selected export criteria.");
      return;
    }

    if (format === "csv") {
      // Clean CSV with UTF-8 BOM so Excel opens special characters correctly
      const headers = ["No.", "Date", "Time", "User Email", "User Name", "Action", "Description"];
      const rows = exportData.map((log, idx) => [
        idx + 1,
        new Date(log.created_at).toLocaleDateString(),
        new Date(log.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        `"${(log.user?.email || "System").replace(/"/g, '""')}"`,
        `"${(log.user?.name || "System Automated").replace(/"/g, '""')}"`,
        `"${log.action.replace(/"/g, '""')}"`,
        `"${(log.description || "").replace(/"/g, '""')}"`
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `ZPPSU_Audit_Trails_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExportModalOpen(false);
      return;
    }

    // EXCEL (.XLSX) WITH PROFESSIONAL UNIVERSITY DESIGN & GENEROUS COLUMN WIDTHS
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "ZPPSU Archiving System";
      workbook.lastModifiedBy = "ZPPSU Guidance Office";
      workbook.created = new Date();
      workbook.modified = new Date();

      const sheet = workbook.addWorksheet("Audit Trails", {
        views: [{ showGridLines: true }]
      });

      // 1. Institution Header Title (Row 1)
      sheet.mergeCells("A1:G1");
      const headerTitle = sheet.getCell("A1");
      headerTitle.value = "ZAMBOANGA PENINSULA POLYTECHNIC STATE UNIVERSITY";
      headerTitle.font = { name: "Calibri", size: 14, bold: true, color: { argb: "FFFFFFFF" } };
      headerTitle.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4A0E1C" } // University Dark Maroon
      };
      headerTitle.alignment = { horizontal: "center", vertical: "middle" };
      sheet.getRow(1).height = 32;

      // 2. Subtitle Banner (Row 2)
      sheet.mergeCells("A2:G2");
      const subTitle = sheet.getCell("A2");
      subTitle.value = "OFFICE OF THE GUIDANCE SERVICES — SYSTEM AUDIT & ACTIVITY TRAILS";
      subTitle.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
      subTitle.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF6B1D2A" } // Secondary Maroon
      };
      subTitle.alignment = { horizontal: "center", vertical: "middle" };
      sheet.getRow(2).height = 24;

      // 3. Metadata Information Bar (Row 3)
      sheet.mergeCells("A3:G3");
      const metaBar = sheet.getCell("A3");
      const filterSummary = `Generated: ${new Date().toLocaleString()}  |  User Filter: ${exportUserFilter === "all" ? "All Users" : exportUserFilter}  |  Action Filter: ${exportActionType === "all" ? "All Actions" : exportActionType}  |  Period: ${exportDateRange.toUpperCase()}`;
      metaBar.value = filterSummary;
      metaBar.font = { name: "Calibri", size: 9, italic: true, color: { argb: "FF4B5563" } };
      metaBar.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF4E7EA" } // Soft Warm Accent
      };
      metaBar.alignment = { horizontal: "center", vertical: "middle" };
      sheet.getRow(3).height = 20;

      // Row 4: Spacer
      sheet.getRow(4).height = 8;

      // 4. Column Headers (Row 5)
      const headers = [
        "NO.",
        "DATE",
        "TIME",
        "USER / EMAIL",
        "USER NAME",
        "ACTION",
        "DESCRIPTION / EVENT DETAILS"
      ];

      const headerRow = sheet.getRow(5);
      headers.forEach((h, idx) => {
        const cell = headerRow.getCell(idx + 1);
        cell.value = h;
        cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4A0E1C" } // Dark Maroon
        };
        cell.alignment = {
          horizontal: ["NO.", "DATE", "TIME", "ACTION"].includes(h) ? "center" : "left",
          vertical: "middle",
          wrapText: true
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FF2D0710" } },
          left: { style: "thin", color: { argb: "FF2D0710" } },
          bottom: { style: "medium", color: { argb: "FFC99A2E" } }, // Gold Accent Line
          right: { style: "thin", color: { argb: "FF2D0710" } }
        };
      });
      headerRow.height = 28;

      // 5. Data Rows (Row 6 onwards)
      exportData.forEach((log, index) => {
        const rowIndex = 6 + index;
        const row = sheet.getRow(rowIndex);
        
        const logDate = new Date(log.created_at);
        const isEven = index % 2 === 0;
        const rowBgColor = isEven ? "FFFFFFFF" : "FFFDFBF7"; // Gentle zebra striping

        const rowValues = [
          index + 1,
          logDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
          logDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
          log.user?.email || "System Auto",
          log.user?.name || "System Automated",
          log.action,
          log.description || "N/A"
        ];

        rowValues.forEach((val, colIdx) => {
          const cell = row.getCell(colIdx + 1);
          cell.value = val;
          cell.font = { name: "Calibri", size: 10, color: { argb: "FF1F2937" } };
          
          // Action badge styling
          if (colIdx === 5) {
            cell.font = { name: "Calibri", size: 9.5, bold: true, color: { argb: "FF6B1D2A" } };
          }

          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: rowBgColor }
          };

          cell.alignment = {
            horizontal: [0, 1, 2, 5].includes(colIdx) ? "center" : "left",
            vertical: "middle",
            wrapText: colIdx === 6 // Wrap long descriptions cleanly
          };

          cell.border = {
            top: { style: "thin", color: { argb: "FFE5E7EB" } },
            left: { style: "thin", color: { argb: "FFE5E7EB" } },
            bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
            right: { style: "thin", color: { argb: "FFE5E7EB" } }
          };
        });

        row.height = 24;
      });

      // 6. Summary Footer Row
      const summaryRowIdx = 6 + exportData.length;
      sheet.mergeCells(`A${summaryRowIdx}:C${summaryRowIdx}`);
      const summaryCell = sheet.getCell(`A${summaryRowIdx}`);
      summaryCell.value = `TOTAL AUDIT ENTRIES: ${exportData.length}`;
      summaryCell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF4A0E1C" } };
      summaryCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF4E7EA" }
      };
      summaryCell.alignment = { horizontal: "center", vertical: "middle" };
      sheet.getRow(summaryRowIdx).height = 24;

      // Border across summary row
      for (let c = 1; c <= 7; c++) {
        const cell = sheet.getRow(summaryRowIdx).getCell(c);
        if (!cell.fill || !cell.fill.fgColor) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF4E7EA" } };
        }
        cell.border = {
          top: { style: "medium", color: { argb: "FFC99A2E" } },
          bottom: { style: "double", color: { argb: "FF4A0E1C" } }
        };
      }

      // 7. Generous Auto-Fit Column Widths (Prevent tight/crammed columns)
      sheet.getColumn(1).width = 8;   // NO.
      sheet.getColumn(2).width = 16;  // DATE
      sheet.getColumn(3).width = 14;  // TIME
      sheet.getColumn(4).width = 34;  // USER / EMAIL (fits long university emails easily)
      sheet.getColumn(5).width = 24;  // USER NAME
      sheet.getColumn(6).width = 26;  // ACTION (fits 'FILE BOX ASSIGNMENT', 'LOGIN_FAILED', etc.)
      sheet.getColumn(7).width = 65;  // DESCRIPTION / EVENT DETAILS (wide with wrap text)

      // Generate binary buffer & trigger direct download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ZPPSU_Audit_Trails_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Track export activity
      try {
        await api.post("/api/logs/track", {
          action: "EXPORT AUDIT LOGS",
          description: `Exported Excel audit trail (${exportData.length} records)`,
          module: "logs"
        });
      } catch (trackErr) {
        console.error("Export tracking error:", trackErr);
      }

      setIsExportModalOpen(false);
    } catch (err) {
      console.error("Excel generation error:", err);
      alert("Failed to generate Excel file. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans">
        {/* BANNER */}
        <div className="bg-[#4A0E1C] rounded-2xl p-6 sm:p-8 text-[#FFFCF7] shadow-sm relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-widest text-[#C99A2E] font-bold block mb-1">
              ZPPSU Security & Compliance
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-[#FFFCF7]">Activity & Audit Logs</h1>
            <p className="text-white/80 text-sm max-w-xl">
              System audit trails for accountability and transparency. Monitor all user actions securely.
            </p>
          </div>
          
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="h-10 px-5 rounded-xl bg-[#C99A2E] text-[#1D1A1B] font-bold text-xs hover:bg-[#A87818] transition flex items-center justify-center gap-2 shadow-xs whitespace-nowrap z-10 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Logs
          </button>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5A5C]" />
            <Input
              type="text"
              placeholder="Search by user email, name, or description keyword..."
              value={searchEmail}
              onChange={(e) => {
                setSearchEmail(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] placeholder-[#5F5A5C]/60 focus:border-[#6B1D2A]"
            />
          </div>
          <div className="w-full sm:w-64">
            <select
              className="w-full h-10 px-3 rounded-xl border border-[#E8E3E1] bg-[#FFFCF7] text-xs font-medium text-[#1D1A1B] focus:outline-none focus:ring-2 focus:ring-[#6B1D2A]/20"
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Action Types</option>
              {uniqueActions.map((action) => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>
        </div>

        {/* LOGS TABLE */}
        <Card className="border border-[#E8E3E1] shadow-xs overflow-hidden rounded-xl bg-[#FFFCF7]">
          <div className="overflow-x-auto">
            <Table className="w-full text-xs">
              <TableHeader className="bg-[#F4E7EA] border-b border-[#E8E3E1]">
                <TableRow className="border-b border-[#E8E3E1]">
                  <TableHead className="font-bold text-[#5F5A5C] px-5 py-3.5 text-xs uppercase">User / Email</TableHead>
                  <TableHead className="font-bold text-[#5F5A5C] px-5 py-3.5 text-xs uppercase">Action</TableHead>
                  <TableHead className="font-bold text-[#5F5A5C] px-5 py-3.5 text-xs uppercase min-w-[300px]">Description</TableHead>
                  <TableHead className="font-bold text-[#5F5A5C] px-5 py-3.5 text-xs uppercase">Date</TableHead>
                  <TableHead className="font-bold text-[#5F5A5C] px-5 py-3.5 text-xs uppercase">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-[#E8E3E1]">
                {currentLogs.length > 0 ? (
                  currentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F4E7EA]/40 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-[#1D1A1B]">
                        {log.user?.email || (
                          <span className="text-[#5F5A5C] italic">System Auto</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4E7EA] text-[#6B1D2A] uppercase tracking-wide border border-[#E8E3E1]">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#5F5A5C]">
                        {log.description}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-[#1D1A1B] whitespace-nowrap">
                        {new Date(log.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-[#5F5A5C] whitespace-nowrap">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="h-48 text-center text-[#5F5A5C] italic">
                      <div className="flex flex-col items-center justify-center text-[#5F5A5C]">
                        <Activity className="w-10 h-10 mb-2 opacity-30 text-[#5F5A5C]" />
                        <span className="font-medium text-xs">No activity logs found for your current filters.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </TableBody>
            </Table>
          </div>
          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3.5 border-t border-[#E8E3E1] bg-[#FFFCF7] gap-4 text-xs text-[#5F5A5C]">
              <div>
                Showing <span className="font-bold text-[#1D1A1B]">{indexOfFirstItem + 1}</span> to <span className="font-bold text-[#1D1A1B]">{Math.min(indexOfLastItem, filteredLogs.length)}</span> of <span className="font-bold text-[#1D1A1B]">{filteredLogs.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs border border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] rounded-lg disabled:opacity-50 hover:bg-[#F4E7EA] transition font-semibold cursor-pointer"
                >
                  Previous
                </button>
                <div className="text-xs text-[#1D1A1B] font-bold px-2">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs border border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] rounded-lg disabled:opacity-50 hover:bg-[#F4E7EA] transition font-semibold cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* EXPORT LOGS MODAL */}
      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent className="sm:max-w-[460px] bg-[#FFFCF7] border-[#E8E3E1] shadow-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#1D1A1B] font-bold text-lg flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#6B1D2A]" />
              Export Audit & Activity Logs
            </DialogTitle>
            <DialogDescription className="text-[#5F5A5C] text-xs">
              Download institutional activity trails formatted with professional Excel column widths and university styling.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1A1B] uppercase">Search User / Email</label>
              <select 
                className="w-full h-10 px-3 rounded-xl border border-[#E8E3E1] bg-white text-xs font-medium text-[#1D1A1B] focus:outline-none focus:ring-2 focus:ring-[#6B1D2A]/20"
                value={exportUserFilter}
                onChange={(e) => setExportUserFilter(e.target.value)}
              >
                <option value="all">All Users</option>
                {uniqueUsers.map(user => (
                  <option key={user.email} value={user.email}>{user.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1A1B] uppercase">Action Type</label>
              <select 
                className="w-full h-10 px-3 rounded-xl border border-[#E8E3E1] bg-white text-xs font-medium text-[#1D1A1B] focus:outline-none focus:ring-2 focus:ring-[#6B1D2A]/20"
                value={exportActionType}
                onChange={(e) => setExportActionType(e.target.value)}
              >
                <option value="all">All Actions</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1A1B] uppercase">Date Range</label>
              <select 
                className="w-full h-10 px-3 rounded-xl border border-[#E8E3E1] bg-white text-xs font-medium text-[#1D1A1B] focus:outline-none focus:ring-2 focus:ring-[#6B1D2A]/20"
                value={exportDateRange}
                onChange={(e) => setExportDateRange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7_days">Last 7 Days</option>
                <option value="1_month">Last 1 Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {exportDateRange === "custom" && (
              <div className="flex items-center gap-2">
                <div className="space-y-1.5 flex-1">
                  <label className="text-[10px] font-bold text-[#5F5A5C] uppercase">Start Date</label>
                  <Input 
                    type="date"
                    className="h-10 bg-white border-[#E8E3E1] text-[#1D1A1B] text-xs rounded-xl focus-visible:ring-[#6B1D2A]"
                    value={exportStartDate}
                    onChange={(e) => setExportStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 flex-1">
                  <label className="text-[10px] font-bold text-[#5F5A5C] uppercase">End Date</label>
                  <Input 
                    type="date"
                    className="h-10 bg-white border-[#E8E3E1] text-[#1D1A1B] text-xs rounded-xl focus-visible:ring-[#6B1D2A]"
                    value={exportEndDate}
                    onChange={(e) => setExportEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-end gap-2 flex-wrap pt-2">
            <button
              onClick={() => setIsExportModalOpen(false)}
              className="h-10 px-4 rounded-xl border border-[#E8E3E1] bg-transparent text-[#1D1A1B] font-bold text-xs hover:bg-[#F4E7EA] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleExport("csv")}
              className="h-10 px-3.5 rounded-xl border border-[#E8E3E1] bg-white text-[#5F5A5C] font-semibold text-xs hover:bg-[#F4E7EA] transition flex items-center justify-center gap-1.5 cursor-pointer"
              title="Download unformatted comma-separated values"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
            <button
              onClick={() => handleExport("xlsx")}
              className="h-10 px-5 rounded-xl bg-[#6B1D2A] text-[#FFFCF7] font-bold text-xs hover:bg-[#8B3545] transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              title="Download formatted Excel workbook (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#C99A2E]" />
              Download Excel (.xlsx)
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

export default Logs;