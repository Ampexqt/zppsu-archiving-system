import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Printer, Download, Search, FileText, FileSpreadsheet } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AccomplishmentReport() {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const printRef = useRef();

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/files", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Filter only Accomplishment Reports
      const accomplishmentReports = (response.data || []).filter(
        (file) => file.document_type === "ACCOMPLISHMENT REPORTS"
      );
      // Sort by newest first
      accomplishmentReports.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setReports(accomplishmentReports);
    } catch (error) {
      console.error("FETCH REPORTS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filter based on search query
  const filteredReports = reports.filter((report) => {
    const query = searchQuery.toLowerCase();
    const data = report.dynamic_data || {};
    return (
      (data.subject && data.subject.toLowerCase().includes(query)) ||
      (data.access_code && data.access_code.toLowerCase().includes(query)) ||
      (data.file_location && data.file_location.toLowerCase().includes(query)) ||
      (report.subject && report.subject.toLowerCase().includes(query)) ||
      (report.access_code && report.access_code.toLowerCase().includes(query))
    );
  });

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const windowPrint = window.open("", "", "left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0");
    windowPrint.document.write(`
      <html>
        <head>
          <title>Masterlist of Accomplishment Reports - ZPPSU Guidance Office</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #1F2937; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
            th, td { border: 1px solid #1F2937; padding: 10px; text-align: left; }
            th { font-weight: bold; background-color: #FDFBF7; text-align: center; }
            .header-title { border: 1px solid #1F2937; text-align: center; font-weight: 800; font-size: 16px; padding: 12px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    windowPrint.document.close();
    windowPrint.focus();
    windowPrint.print();
    windowPrint.close();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(13);
    doc.text("MASTERLIST OF RECORDS FOR ACCOMPLISHMENT REPORTS", 14, 18);
    doc.setFontSize(9);
    doc.text("ZPPSU Guidance & Counseling Office", 14, 24);
    
    const tableData = filteredReports.map((file) => {
      const data = file.dynamic_data || {};
      return [
        data.access_code || file.access_code || "",
        data.subject || file.subject || "",
        data.file_location || file.file_box?.name || ""
      ];
    });

    autoTable(doc, {
      startY: 28,
      head: [["ACCESS CODE", "SUBJECT", "FILE LOCATION"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [107, 29, 42], textColor: [255, 252, 247], fontStyle: "bold", halign: "center" },
      bodyStyles: { fontSize: 9 },
    });

    doc.save("ZPPSU_Accomplishment_Reports_Masterlist.pdf");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#1D1A1B]">
              Accomplishment Reports Registry
            </h1>
            <p className="text-xs text-[#5F5A5C] mt-0.5">
              Official masterlist generator and export archive for university reporting.
            </p>
          </div>
          
          <div className="flex items-center gap-2.5">
            <Button 
              onClick={handlePrint}
              variant="outline"
              className="h-9 px-4 rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] font-bold text-xs hover:bg-[#F4E7EA] shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Preview</span>
            </Button>
            <Button 
              onClick={handleExportPDF}
              className="h-9 px-4 rounded-xl bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF Masterlist</span>
            </Button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl">
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5A5C]" />
              <Input 
                placeholder="Search masterlist by access code, subject, or location..." 
                className="pl-10 h-10 text-xs bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] rounded-xl focus-visible:ring-[#6B1D2A]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* PRINTABLE MASTERLIST TABLE */}
        <Card className="border border-[#E8E3E1] shadow-xs overflow-hidden bg-[#FFFCF7] rounded-xl">
          <CardContent className="p-0 overflow-x-auto">
            <div ref={printRef} className="p-8 min-w-[700px]">
              <div className="border border-[#1D1A1B] text-center font-extrabold text-base p-3 bg-[#F4E7EA] text-[#1D1A1B] uppercase tracking-wide">
                Masterlist of Records for Accomplishment Reports
              </div>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F4E7EA]">
                    <th className="border border-[#1D1A1B] p-3 w-1/4 text-center font-bold uppercase text-[#1D1A1B]">Access Code</th>
                    <th className="border border-[#1D1A1B] p-3 w-1/2 text-center font-bold uppercase text-[#1D1A1B]">Subject / Description</th>
                    <th className="border border-[#1D1A1B] p-3 w-1/4 text-center font-bold uppercase text-[#1D1A1B]">File Location</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((file) => {
                      const data = file.dynamic_data || {};
                      return (
                        <tr key={file.id} className="hover:bg-[#F4E7EA]/40">
                          <td className="border border-[#1D1A1B] p-3 font-mono font-bold text-center text-[#6B1D2A]">
                            {data.access_code || file.access_code || file.document_id}
                          </td>
                          <td className="border border-[#1D1A1B] p-3 font-medium text-[#1D1A1B]">
                            {data.subject || file.subject || file.title || "—"}
                          </td>
                          <td className="border border-[#1D1A1B] p-3 text-[#5F5A5C]">
                            {data.file_location || (file.file_box ? `${file.file_box.cabinet?.name || ''} - ${file.file_box.name}` : "—")}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" className="border border-[#1D1A1B] p-8 text-center text-[#5F5A5C] italic">
                        No accomplishment records found matching search criteria.
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

export default AccomplishmentReport;