import ExcelJS from "exceljs";
import { formatLocationWithColorName } from "../components/inventory/storageTaxonomy";

/**
 * Institutional Masterlist Excel Exporter
 * Generates an official university records masterlist (.xlsx)
 * matching the exact institutional letterhead, ISO 9001:2015 / NAP RA 9470 compliance standards,
 * table formatting, and Gold Month Banners (#F2DFB0) from Document Center.
 *
 * @param {Array} records - Filtered document records
 * @param {string} selectedDocType - Selected document classification / type
 * @param {Array} headers - Table column headers
 * @param {Function} getRowData - Function mapping a file to row values
 */
export async function exportMasterlistToInstitutionalExcel({
  records = [],
  selectedDocType = "ACCOMPLISHMENT REPORTS",
  headers = ["Date", "ACCESS CODE", "SUBJECT", "STATUS", "FILE LOCATION"],
  getRowData,
}) {
  if (!records || records.length === 0) {
    throw new Error("No records available to export.");
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Masterlist Records", {
    views: [{ showGridLines: true }],
  });

  const numCols = headers.length;
  const lastColLetter = String.fromCharCode(65 + numCols - 1);

  // Helper styles
  const thinBorder = {
    top: { style: "thin", color: { argb: "FF000000" } },
    left: { style: "thin", color: { argb: "FF000000" } },
    bottom: { style: "thin", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } },
  };

  const goldFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF2DFB0" }, // Institutional Gold Accent
  };

  // Helper to extract clean month name from file
  const extractMonth = (file, rowData) => {
    if (file?.dynamic_data?.month) {
      return String(file.dynamic_data.month).toUpperCase();
    }
    // Check if Date is in rowData
    const dateIdx = headers.findIndex((h) => String(h).toUpperCase().includes("DATE"));
    const rawDate = dateIdx >= 0 ? rowData[dateIdx] : file?.memo_date || file?.created_at;
    if (rawDate) {
      const parsed = new Date(rawDate);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
      }
    }
    return "ACTIVE RECORDS";
  };

  // Pre-calculate Column Widths generously to prevent cramped layout
  sheet.columns = headers.map((header, idx) => {
    let width = 22;
    const hUpper = String(header).toUpperCase();
    if (hUpper.includes("LOCATION")) width = 42;
    else if (hUpper.includes("SUBJECT") || hUpper.includes("DESCRIPTION") || hUpper.includes("TITLE")) width = 60;
    else if (hUpper.includes("DATE")) width = 18;
    else if (hUpper.includes("ACCESS")) width = 24;
    else if (hUpper.includes("STATUS") || hUpper.includes("ACTION")) width = 20;

    records.forEach((file) => {
      const row = getRowData ? getRowData(file, headers) : [];
      const val = String(row[idx] || "");
      if (hUpper.includes("SUBJECT") || hUpper.includes("TITLE") || hUpper.includes("DESCRIPTION")) {
        width = Math.min(80, Math.max(width, Math.ceil(val.length * 0.75)));
      } else if (hUpper.includes("LOCATION")) {
        width = Math.min(75, Math.max(width, Math.ceil(val.length * 0.75)));
      } else {
        width = Math.max(width, Math.min(val.length + 4, 35));
      }
    });

    return { width };
  });

  // --- 1. STATE UNIVERSITY INSTITUTIONAL LETTERHEAD ---
  sheet.addRow([]); // Row 1: Top spacing

  // Row 2: Republic of the Philippines
  sheet.mergeCells(`A2:${lastColLetter}2`);
  const r2 = sheet.getCell("A2");
  r2.value = "REPUBLIC OF THE PHILIPPINES";
  r2.font = { bold: true, size: 10, color: { argb: "FF333333" } };
  r2.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(2).height = 18;

  // Row 3: University Name
  sheet.mergeCells(`A3:${lastColLetter}3`);
  const r3 = sheet.getCell("A3");
  r3.value = "ZAMBOANGA PENINSULA POLYTECHNIC STATE UNIVERSITY";
  r3.font = { bold: true, size: 13, color: { argb: "FF1D1A1B" } };
  r3.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(3).height = 24;

  // Row 4: Regional Address
  sheet.mergeCells(`A4:${lastColLetter}4`);
  const r4 = sheet.getCell("A4");
  r4.value = "Region IX - Zamboanga Del Sur, Zamboanga City, Philippines";
  r4.font = { italic: true, size: 9.5, color: { argb: "FF555555" } };
  r4.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(4).height = 18;

  // Row 5: Office Name
  sheet.mergeCells(`A5:${lastColLetter}5`);
  const r5 = sheet.getCell("A5");
  r5.value = "OFFICE OF GUIDANCE AND COUNSELING SERVICES";
  r5.font = { bold: true, size: 10.5, color: { argb: "FF6B1D2A" } };
  r5.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(5).height = 18;

  // Row 6: Archival Unit
  sheet.mergeCells(`A6:${lastColLetter}6`);
  const r6 = sheet.getCell("A6");
  r6.value = "ARCHIVAL & RECORDS MANAGEMENT UNIT";
  r6.font = { bold: true, size: 9.5, color: { argb: "FF1D1A1B" } };
  r6.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(6).height = 17;

  // Row 7: Contact Address
  sheet.mergeCells(`A7:${lastColLetter}7`);
  const r7 = sheet.getCell("A7");
  r7.value = "R.T. Lim Boulevard, Baliwasan, Zamboanga City 7000 • records@zppsu.edu.ph";
  r7.font = { size: 8.5, color: { argb: "FF666666" } };
  r7.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(7).height = 16;

  // Row 8: Standards & Masterlist Reference Control
  const splitColIdx = Math.max(1, Math.min(3, numCols - 2));
  const splitColLetterLeft = String.fromCharCode(65 + splitColIdx - 1);
  const splitColLetterRight = String.fromCharCode(65 + splitColIdx);

  sheet.mergeCells(`A8:${splitColLetterLeft}8`);
  const r8Left = sheet.getCell("A8");
  r8Left.value = "CONTROL STANDARD: ISO 9001:2015 | NAP RA 9470 COMPLIANT";
  r8Left.font = { bold: true, size: 8.5, color: { argb: "FF6B1D2A" } };
  r8Left.alignment = { horizontal: "left", vertical: "middle" };

  sheet.mergeCells(`${splitColLetterRight}8:${lastColLetter}8`);
  const r8Right = sheet.getCell(`${splitColLetterRight}8`);
  const docTypePrefix = selectedDocType.replace(/[^A-Za-z0-9]/g, "").substring(0, 4).toUpperCase();
  r8Right.value = `Ref Accession: ML-${new Date().getFullYear()}-${docTypePrefix}`;
  r8Right.font = { bold: true, size: 8.5, color: { argb: "FF1D1A1B" } };
  r8Right.alignment = { horizontal: "right", vertical: "middle" };
  sheet.getRow(8).height = 18;

  // Letterhead divider line
  for (let c = 0; c < numCols; c++) {
    const colChar = String.fromCharCode(65 + c);
    sheet.getCell(`${colChar}8`).border = {
      bottom: { style: "medium", color: { argb: "FF000000" } },
    };
  }

  sheet.addRow([]); // Row 9: spacing

  // --- 2. MASTERLIST TABLE HEADER ---
  // Row 10: Masterlist Title
  sheet.mergeCells(`A10:${lastColLetter}10`);
  const r10 = sheet.getCell("A10");
  r10.value = `ZPPSU MASTERLIST OF RECORDS- ${selectedDocType.toUpperCase()}`;
  r10.font = { bold: true, size: 12, color: { argb: "FF1D1A1B" } };
  r10.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  sheet.getRow(10).height = 32;
  for (let c = 0; c < numCols; c++) {
    const colChar = String.fromCharCode(65 + c);
    sheet.getCell(`${colChar}10`).border = thinBorder;
  }

  // Row 11: Column Headers
  const r11 = sheet.addRow(headers);
  r11.height = 26;
  r11.eachCell((cell) => {
    cell.font = { bold: true, size: 10, color: { argb: "FF1D1A1B" } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = thinBorder;
  });

  // --- 3. DATA ROWS WITH MONTH BANNERS ---
  let currentMonthGroup = null;

  records.forEach((file) => {
    const rawRow = getRowData ? getRowData(file, headers) : [];
    const cleanRowData = headers.map((_, idx) => {
      const v = rawRow[idx];
      return v === undefined || v === null ? "" : v;
    });

    const fileMonth = extractMonth(file, cleanRowData);

    // Insert Gold Month Banner when month changes
    if (fileMonth !== currentMonthGroup) {
      currentMonthGroup = fileMonth;
      const bannerRow = sheet.addRow([]);
      const bannerRowNum = bannerRow.number;
      sheet.mergeCells(`A${bannerRowNum}:${lastColLetter}${bannerRowNum}`);
      
      const bannerCell = sheet.getCell(`A${bannerRowNum}`);
      bannerCell.value = currentMonthGroup;
      bannerCell.font = { bold: true, size: 10.5, color: { argb: "FF1D1A1B" } };
      bannerCell.fill = goldFill;
      bannerCell.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
      bannerRow.height = 24;

      for (let c = 0; c < numCols; c++) {
        const colChar = String.fromCharCode(65 + c);
        sheet.getCell(`${colChar}${bannerRowNum}`).border = thinBorder;
      }
    }

    // Add Data Row
    const dataRow = sheet.addRow(cleanRowData);
    
    // Dynamic height based on content length
    const maxTextLength = Math.max(...cleanRowData.map((val) => String(val || "").length));
    const dynamicRowHeight = maxTextLength > 90 ? 54 : (maxTextLength > 45 ? 44 : 36);
    dataRow.height = dynamicRowHeight;

    dataRow.eachCell((cell) => {
      cell.font = { size: 10, color: { argb: "FF1D1A1B" } };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.border = thinBorder;
    });
  });

  // Generate Excel buffer & trigger browser download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = window.document.createElement("a");
  link.href = url;
  const safeDocName = selectedDocType.replace(/[^A-Za-z0-9]/g, "_");
  link.download = `ZPPSU_${safeDocName}_Masterlist.xlsx`;
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
