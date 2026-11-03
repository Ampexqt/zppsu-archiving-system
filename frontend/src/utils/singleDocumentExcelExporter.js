import ExcelJS from "exceljs";
import { 
  formatLocationWithColorName, 
  getColorNameFromHex, 
  stripColorTag, 
  parseBoxHierarchy 
} from "../components/inventory/storageTaxonomy";
import { getInstitutionalLogoBuffer } from "./excelLogoLoader";

/**
 * Institutional Single Document Excel Exporter
 * Generates an official state university archival spreadsheet (.xlsx)
 * matching Republic of the Philippines / ZPPSU letterhead with official seal,
 * boxed ISO 9001:2015 / NAP RA 9470 Control Standard stamp, and Gold Month Banner (#F2DFB0).
 */
export async function exportSingleDocumentExcel(document, unifiedData = {}) {
  if (!document) {
    throw new Error("No document provided for export.");
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Archival Record Dossier", {
    views: [{ showGridLines: true }],
  });

  const documentIdentifier = document.document_id || document.access_code || `DOC-${document.id || "RECORD"}`;
  const documentType = (document.document_type || "DOCUMENT").toUpperCase();
  const subject = unifiedData.subject || document.subject || document.title || "—";
  
  const formattedDate = document.created_at
    ? new Date(document.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const recordDate = unifiedData.date || formattedDate;
  const accessCode = unifiedData.access_code || document.access_code || "N/A";
  
  const statusOrActionHeader = document.is_generated && unifiedData.action_taken ? "ACTION TAKEN" : "STATUS";
  const statusOrActionValue = document.is_generated && unifiedData.action_taken ? unifiedData.action_taken : (document.status || "Active");
  
  // Storage Location
  const boxParsed = document.file_box ? parseBoxHierarchy(document.file_box.name) : null;
  const computedLocation = document.file_box?.cabinet?.name
    ? `${document.file_box.cabinet.name} - ${document.file_box.name}`
    : (document.file_box?.name || unifiedData.file_location || "Unassigned");
  const fileLocation = formatLocationWithColorName(unifiedData.file_location || computedLocation);

  // Auto-adjust Column Widths based on text lengths with generous uncramped bounds
  const subjectText = String(subject || "");
  const locationText = String(fileLocation || "");
  const dateText = String(recordDate || "");
  const accessText = String(accessCode || "");
  const statusText = String(statusOrActionValue || "");

  const colAWidth = Math.max(22, dateText.length + 4);
  const colBWidth = Math.max(22, accessText.length + 6);
  const colCWidth = Math.min(80, Math.max(50, Math.ceil(subjectText.length * 0.75)));
  const colDWidth = Math.max(20, statusText.length + 6);
  const colEWidth = Math.min(75, Math.max(42, Math.ceil(locationText.length * 0.75)));

  sheet.columns = [
    { width: colAWidth },
    { width: colBWidth },
    { width: colCWidth },
    { width: colDWidth },
    { width: colEWidth },
  ];

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
    fgColor: { argb: "FFF2DFB0" }, // ZPPSU Gold Tint
  };

  // --- 1. EMBED OFFICIAL ZPPSU SEAL (LEFT) ---
  sheet.addRow([]); // Row 1: Top spacing

  try {
    const logoBuffer = await getInstitutionalLogoBuffer();
    if (logoBuffer) {
      const imageId = workbook.addImage({
        buffer: logoBuffer,
        extension: "jpeg",
      });
      sheet.addImage(imageId, {
        tl: { col: 0.22, row: 1.25 },
        ext: { width: 98, height: 98 },
      });
    }
  } catch (imgErr) {
    console.warn("Could not embed institutional logo into single document Excel:", imgErr);
  }

  // --- 2. CENTER UNIVERSITY HEADINGS (COLS B TO D) ---
  // Row 2: Republic of the Philippines
  sheet.mergeCells("B2:D2");
  const r2 = sheet.getCell("B2");
  r2.value = "REPUBLIC OF THE PHILIPPINES";
  r2.font = { bold: true, size: 10, color: { argb: "FF333333" } };
  r2.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(2).height = 18;

  // Row 3: University Name
  sheet.mergeCells("B3:D3");
  const r3 = sheet.getCell("B3");
  r3.value = "ZAMBOANGA PENINSULA POLYTECHNIC STATE UNIVERSITY";
  r3.font = { bold: true, size: 13, color: { argb: "FF1D1A1B" } };
  r3.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(3).height = 22;

  // Row 4: Regional Address
  sheet.mergeCells("B4:D4");
  const r4 = sheet.getCell("B4");
  r4.value = "Region IX - Zamboanga Del Sur, Zamboanga City, Philippines";
  r4.font = { italic: true, size: 9.5, color: { argb: "FF555555" } };
  r4.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(4).height = 17;

  // Row 5: Office Name
  sheet.mergeCells("B5:D5");
  const r5 = sheet.getCell("B5");
  r5.value = "OFFICE OF GUIDANCE AND COUNSELING SERVICES";
  r5.font = { bold: true, size: 10.5, color: { argb: "FF6B1D2A" } };
  r5.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(5).height = 18;

  // Row 6: Archival Unit Name
  sheet.mergeCells("B6:D6");
  const r6 = sheet.getCell("B6");
  r6.value = "ARCHIVAL & RECORDS MANAGEMENT UNIT";
  r6.font = { bold: true, size: 9.5, color: { argb: "FF1D1A1B" } };
  r6.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(6).height = 16;

  // Row 7: Physical Address
  sheet.mergeCells("B7:D7");
  const r7 = sheet.getCell("B7");
  r7.value = "R.T. Lim Boulevard, Baliwasan, Zamboanga City 7000 • records@zppsu.edu.ph";
  r7.font = { size: 8.5, color: { argb: "FF666666" } };
  r7.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(7).height = 16;

  // --- 3. FRAMED CONTROL STANDARD STAMP (RIGHT: COLUMN E) ---
  // E3: Top Stamp Header
  const boxTop = sheet.getCell("E3");
  boxTop.value = "CONTROL STANDARD";
  boxTop.font = { bold: true, size: 8, color: { argb: "FF333333" } };
  boxTop.alignment = { horizontal: "center", vertical: "middle" };
  boxTop.border = {
    top: { style: "thin", color: { argb: "FF000000" } },
    left: { style: "thin", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } },
  };

  // E4: ISO Standard Code
  const boxMid = sheet.getCell("E4");
  boxMid.value = "ISO 9001:2015 CERTIFIED";
  boxMid.font = { bold: true, size: 9.5, color: { argb: "FF6B1D2A" } };
  boxMid.alignment = { horizontal: "center", vertical: "middle" };
  boxMid.border = {
    left: { style: "thin", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } },
  };

  // E5: NAP RA Compliance
  const boxBot = sheet.getCell("E5");
  boxBot.value = "NAP RA 9470 COMPLIANT";
  boxBot.font = { size: 8, color: { argb: "FF555555" } };
  boxBot.alignment = { horizontal: "center", vertical: "middle" };
  boxBot.border = {
    bottom: { style: "thin", color: { argb: "FF000000" } },
    left: { style: "thin", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } },
  };

  // E6: Accession Reference
  const refCell = sheet.getCell("E6");
  refCell.value = `Accession No: ${documentIdentifier}`;
  refCell.font = { bold: true, size: 8.5, color: { argb: "FF1D1A1B" } };
  refCell.alignment = { horizontal: "center", vertical: "middle" };

  // --- 4. LETTERHEAD DIVIDER LINE (ROW 8) ---
  ["A8", "B8", "C8", "D8", "E8"].forEach((ref) => {
    sheet.getCell(ref).border = { bottom: { style: "medium", color: { argb: "FF000000" } } };
  });
  sheet.getRow(8).height = 8;

  sheet.addRow([]); // Row 9: Spacing

  // --- 5. MASTERLIST TABLE ---
  // Row 10: Table Title
  sheet.mergeCells("A10:E10");
  const r10 = sheet.getCell("A10");
  r10.value = `ZPPSU MASTERLIST OF RECORDS- ${documentType}`;
  r10.font = { bold: true, size: 12, color: { argb: "FF1D1A1B" } };
  r10.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  sheet.getRow(10).height = 32;
  ["A10", "B10", "C10", "D10", "E10"].forEach((ref) => {
    sheet.getCell(ref).border = thinBorder;
  });

  // Row 11: Column Headers
  const r11 = sheet.addRow(["Date", "ACCESS CODE", "SUBJECT", statusOrActionHeader, "FILE LOCATION"]);
  r11.height = 26;
  r11.eachCell((cell) => {
    cell.font = { bold: true, size: 10, color: { argb: "FF1D1A1B" } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = thinBorder;
  });

  // Month determination
  const monthName = (() => {
    if (unifiedData.month) return String(unifiedData.month).toUpperCase();
    const d = document.memo_date || document.created_at || (recordDate ? new Date(recordDate) : null);
    if (d && !isNaN(new Date(d).getTime())) {
      return new Date(d).toLocaleDateString("en-US", { month: "long" }).toUpperCase();
    }
    return "JANUARY";
  })();

  // Row 12: Gold Month Banner (Exactly 1 Month Banner for Single Document)
  sheet.mergeCells("A12:E12");
  const r12 = sheet.getCell("A12");
  r12.value = monthName;
  r12.font = { bold: true, size: 10.5, color: { argb: "FF1D1A1B" } };
  r12.fill = goldFill;
  r12.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
  sheet.getRow(12).height = 24;
  ["A12", "B12", "C12", "D12", "E12"].forEach((ref) => {
    sheet.getCell(ref).border = thinBorder;
  });

  // Dynamic Row 13 Height: Calculate line wrapping needs so text is NEVER truncated or cramped
  const cCharsPerLine = colCWidth - 4;
  const eCharsPerLine = colEWidth - 4;
  const linesSubject = Math.max(1, Math.ceil(subjectText.length / cCharsPerLine));
  const linesLocation = Math.max(1, Math.ceil(locationText.length / eCharsPerLine));
  const maxLines = Math.max(linesSubject, linesLocation);
  const dynamicDataRowHeight = Math.max(38, maxLines * 20 + 16);

  // Row 13: Data Record (Centered Horizontally & Vertically)
  const r13 = sheet.addRow([recordDate, accessCode, subject, statusOrActionValue, fileLocation]);
  r13.height = dynamicDataRowHeight;
  r13.eachCell((cell) => {
    cell.font = { size: 10, color: { argb: "FF1D1A1B" } };
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    cell.border = thinBorder;
  });

  // Export buffer & trigger browser download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = `${documentIdentifier}_Archival_Record.xlsx`;
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
