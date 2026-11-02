import React, { useState } from "react";
import { X, FileSpreadsheet, Download, Calendar, User, Layers, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShadcnSelect from "@/components/ui/ShadcnSelect";
import ExcelJS from "exceljs";
import { api } from "../../services/api";

/**
 * ExportLogsModal
 * Formatted audit trail exporter supporting Excel (.xlsx) and CSV formats.
 * Fully styled with ShadcnSelect, dynamic live count, and 11-color palette.
 */
export default function ExportLogsModal({
  isOpen,
  onClose,
  logs = [],
  uniqueUsers = [],
  uniqueActions = [],
}) {
  const [exportUserFilter, setExportUserFilter] = useState("all");
  const [exportActionType, setExportActionType] = useState("all");
  const [exportDateRange, setExportDateRange] = useState("all");
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  // Compute matching records in real-time
  const getFilteredLogs = () => {
    return logs.filter((log) => {
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
  };

  const matchingLogs = getFilteredLogs();

  const handleExport = async (format = "xlsx") => {
    setIsExporting(true);
    try {
      const exportData = matchingLogs;

      if (exportData.length === 0) {
        alert("No logs match the selected export criteria.");
        setIsExporting(false);
        return;
      }

      if (format === "csv") {
        const csvHeader = "ID,User Email,User Name,Action,Description,Date,Time\n";
        const csvRows = exportData.map((log) => {
          const d = new Date(log.created_at);
          const dateStr = d.toLocaleDateString();
          const timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const desc = `"${(log.description || "").replace(/"/g, '""')}"`;
          return `${log.id},"${log.user?.email || "System"}","${log.user?.name || "System"}",${log.action},${desc},${dateStr},${timeStr}`;
        });
        const blob = new Blob([csvHeader + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `ZPPSU_Audit_Logs_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        setIsExporting(false);
        onClose();
        return;
      }

      // EXCEL GENERATION VIA EXCELJS
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Audit Trails", {
        views: [{ showGridLines: true }],
      });

      // Header Banner (Rows 1-3)
      sheet.mergeCells("A1:G1");
      const titleCell = sheet.getCell("A1");
      titleCell.value = "ZAMBOANGA PENINSULA POLYTECHNIC STATE UNIVERSITY";
      titleCell.font = { name: "Calibri", size: 14, bold: true, color: { argb: "FFFFFFFF" } };
      titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4A0E1C" } }; // Deep Wine
      titleCell.alignment = { horizontal: "center", vertical: "middle" };
      sheet.getRow(1).height = 26;

      sheet.mergeCells("A2:G2");
      const subCell = sheet.getCell("A2");
      subCell.value = "OFFICE OF GUIDANCE & RECORDS MANAGEMENT — SYSTEM AUDIT TRAIL";
      subCell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FFF4E7EA" } };
      subCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4A0E1C" } };
      subCell.alignment = { horizontal: "center", vertical: "middle" };
      sheet.getRow(2).height = 18;

      sheet.mergeCells("A3:G3");
      const metaCell = sheet.getCell("A3");
      metaCell.value = `Exported: ${new Date().toLocaleString()} | Filter: ${exportActionType} | Records: ${exportData.length}`;
      metaCell.font = { name: "Calibri", size: 9, italic: true, color: { argb: "FFFFFFFF" } };
      metaCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6B1D2A" } }; // Rich Maroon
      metaCell.alignment = { horizontal: "center", vertical: "middle" };
      sheet.getRow(3).height = 18;

      sheet.getRow(4).height = 8; // Spacer

      // Column Headers (Row 5)
      const headers = ["NO.", "DATE", "TIME", "OPERATOR / EMAIL", "OPERATOR NAME", "ACTION TYPE", "ACTIVITY DESCRIPTION"];
      const headerRow = sheet.getRow(5);
      headers.forEach((h, idx) => {
        const cell = headerRow.getCell(idx + 1);
        cell.value = h;
        cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4A0E1C" } };
        cell.alignment = { horizontal: [0, 1, 2, 5].includes(idx) ? "center" : "left", vertical: "middle" };
        cell.border = {
          top: { style: "thin", color: { argb: "FF2D0710" } },
          bottom: { style: "medium", color: { argb: "FFC99A2E" } }, // Gold Accent Line
        };
      });
      headerRow.height = 26;

      // Data Rows
      exportData.forEach((log, index) => {
        const row = sheet.getRow(6 + index);
        const logDate = new Date(log.created_at);
        const isEven = index % 2 === 0;

        const rowValues = [
          index + 1,
          logDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
          logDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
          log.user?.email || "System Service",
          log.user?.name || "System Automated",
          log.action,
          log.description || "N/A",
        ];

        rowValues.forEach((val, colIdx) => {
          const cell = row.getCell(colIdx + 1);
          cell.value = val;
          cell.font = { name: "Calibri", size: 10, color: { argb: "FF1D1A1B" } };
          if (colIdx === 5) {
            cell.font = { name: "Calibri", size: 9.5, bold: true, color: { argb: "FF6B1D2A" } };
          }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: isEven ? "FFFFFFFF" : "FFFDFBF7" },
          };
          cell.alignment = {
            horizontal: [0, 1, 2, 5].includes(colIdx) ? "center" : "left",
            vertical: "middle",
            wrapText: colIdx === 6,
          };
          cell.border = {
            top: { style: "thin", color: { argb: "FFE8E3E1" } },
            bottom: { style: "thin", color: { argb: "FFE8E3E1" } },
          };
        });
        row.height = 22;
      });

      // Auto-fit column widths
      sheet.getColumn(1).width = 8;
      sheet.getColumn(2).width = 16;
      sheet.getColumn(3).width = 14;
      sheet.getColumn(4).width = 32;
      sheet.getColumn(5).width = 24;
      sheet.getColumn(6).width = 24;
      sheet.getColumn(7).width = 60;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ZPPSU_Audit_Ledger_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Track export activity
      try {
        await api.post("/api/logs/track", {
          action: "EXPORT AUDIT LOGS",
          description: `Exported Excel audit ledger (${exportData.length} records)`,
          module: "logs",
        });
      } catch (trackErr) {
        console.error("Export track error:", trackErr);
      }

      onClose();
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export logs. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#1D1A1B]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        className="bg-[#FFFCF7] w-full max-w-md rounded-2xl shadow-xl border border-[#E8E3E1] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-4 px-6 border-b border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center text-[#6B1D2A] shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#1D1A1B] text-sm tracking-tight">
                Export Audit & Activity Ledger
              </h3>
              <p className="text-[11px] text-[#5F5A5C] mt-0.5">
                Download verified institutional audit records (.xlsx or .csv)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="p-1.5 text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA] rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-4 text-xs">
          {/* USER FILTER */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3 h-3 text-[#6B1D2A]" />
              <span>Operator / User Filter</span>
            </label>
            <ShadcnSelect
              value={exportUserFilter}
              onChange={setExportUserFilter}
              options={[
                { value: "all", label: "All Users & Automated Services" },
                ...uniqueUsers.map((u) => ({ value: u.email, label: u.label })),
              ]}
              placeholder="All Users"
              className="h-10"
              popoverWidth="w-72"
            />
          </div>

          {/* ACTION TYPE FILTER */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-[#6B1D2A]" />
              <span>Action Type Filter</span>
            </label>
            <ShadcnSelect
              value={exportActionType}
              onChange={setExportActionType}
              options={[
                { value: "all", label: "All Action Categories" },
                ...uniqueActions.map((a) => ({ value: a, label: a })),
              ]}
              placeholder="All Actions"
              className="h-10"
              popoverWidth="w-72"
            />
          </div>

          {/* DATE RANGE FILTER */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-[#6B1D2A]" />
              <span>Date Period</span>
            </label>
            <ShadcnSelect
              value={exportDateRange}
              onChange={setExportDateRange}
              options={[
                { value: "all", label: "All Time (Complete History)" },
                { value: "today", label: "Today Only" },
                { value: "7_days", label: "Last 7 Days" },
                { value: "1_month", label: "Last 1 Month" },
                { value: "custom", label: "Custom Date Range" },
              ]}
              placeholder="All Time"
              className="h-10"
              popoverWidth="w-72"
            />
          </div>

          {/* CUSTOM DATE RANGE PICKER */}
          {exportDateRange === "custom" && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5F5A5C] uppercase">Start Date</label>
                <Input
                  type="date"
                  value={exportStartDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                  className="h-9 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5F5A5C] uppercase">End Date</label>
                <Input
                  type="date"
                  value={exportEndDate}
                  onChange={(e) => setExportEndDate(e.target.value)}
                  className="h-9 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
                />
              </div>
            </div>
          )}

          {/* LIVE MATCHING COUNT BADGE */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FCFAF8] border border-[#E8E3E1] text-xs">
            <div className="flex items-center gap-2 text-[#1D1A1B]">
              <History className="w-4 h-4 text-[#6B1D2A]" />
              <span className="font-medium">Records targeted for export:</span>
            </div>
            <span className="font-mono font-bold text-xs text-[#6B1D2A] bg-[#F4E7EA] border border-[#E8E3E1] px-2.5 py-0.5 rounded-md">
              {matchingLogs.length} events
            </span>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 px-6 border-t border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isExporting}
            className="h-9 px-4 rounded-xl text-xs font-semibold text-[#1D1A1B] bg-[#FFFCF7] border-[#E8E3E1] hover:bg-[#F4E7EA] cursor-pointer"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleExport("csv")}
              disabled={isExporting || matchingLogs.length === 0}
              className="h-9 px-3.5 rounded-xl text-xs font-semibold text-[#1D1A1B] bg-[#FFFCF7] border-[#E8E3E1] hover:bg-[#F4E7EA] cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-[#5F5A5C]" />
              <span>CSV</span>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => handleExport("xlsx")}
              disabled={isExporting || matchingLogs.length === 0}
              className="h-9 px-4 rounded-xl text-xs font-bold text-[#FFFCF7] bg-[#6B1D2A] hover:bg-[#8B3545] cursor-pointer shadow-xs inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#C99A2E]" />
              <span>{isExporting ? "Exporting..." : "Download Excel (.xlsx)"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
