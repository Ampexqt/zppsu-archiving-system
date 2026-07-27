import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Printer, Download, Search } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
      const accomplishmentReports = response.data.filter(
        (file) => file.document_type === "ACCOMPLISHMENT REPORTS"
      );
      // Sort by newest first
      accomplishmentReports.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setReports(accomplishmentReports);
    } catch (error) {
      console.error(error);
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
      (data.file_location && data.file_location.toLowerCase().includes(query))
    );
  });

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrint.document.write(`
      <html>
        <head>
          <title>Print Masterlist</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid black; padding: 12px; text-align: left; }
            th { font-weight: bold; text-align: center; }
            .header-title { border: 1px solid black; text-align: center; font-weight: bold; font-size: 22px; padding: 12px; }
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
    
    doc.setFontSize(14);
    doc.text("MASTERLIST OF RECORDS FOR ACCOMPLISHMENT REPORTS", 14, 20);
    
    const tableData = filteredReports.map((file) => {
      const data = file.dynamic_data || {};
      return [
        data.access_code || "",
        data.subject || "",
        data.file_location || ""
      ];
    });

    autoTable(doc, {
      startY: 30,
      head: [["ACCESS CODE", "SUBJECT", "FILE LOCATION"]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [0, 0, 0], halign: 'center' },
      bodyStyles: { lineWidth: 0.1, lineColor: [0, 0, 0] },
    });

    doc.save("Masterlist_Accomplishment_Reports.pdf");
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Accomplishment Reports</h1>
          <p className="text-gray-500 font-medium">Manage and generate the masterlist of records.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="h-11 px-6 rounded-md bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <button 
            onClick={handleExportPDF}
            className="h-11 px-6 rounded-md bg-accent text-accent-foreground font-bold hover:bg-accent/90 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <Card className="border-none shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search masterlist..." 
              className="pl-9 h-11 bg-gray-50 border-gray-200 focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0 overflow-x-auto">
          
          {/* Printable Area */}
          <div ref={printRef} className="p-8 min-w-[800px]">
            <div style={{ border: "1px solid black", textAlign: "center", fontWeight: "bold", fontSize: "22px", padding: "12px", borderBottom: "none" }}>
              MASTERLIST OF RECORDS FOR ACCOMPLISHMENT REPORTS
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid black", padding: "12px", width: "20%", textAlign: "center" }}>ACCESS CODE</th>
                  <th style={{ border: "1px solid black", padding: "12px", width: "50%", textAlign: "center" }}>SUBJECT</th>
                  <th style={{ border: "1px solid black", padding: "12px", width: "30%", textAlign: "center" }}>FILE LOCATION</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((file) => {
                    const data = file.dynamic_data || {};
                    return (
                      <tr key={file.id}>
                        <td style={{ border: "1px solid black", padding: "12px" }}>{data.access_code}</td>
                        <td style={{ border: "1px solid black", padding: "12px" }}>{data.subject}</td>
                        <td style={{ border: "1px solid black", padding: "12px" }}>{data.file_location}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3" style={{ border: "1px solid black", padding: "24px", textAlign: "center", color: "#666" }}>
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export default AccomplishmentReport;