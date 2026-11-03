import ExcelJS from "exceljs";
import { 
  formatLocationWithColorName, 
  getColorNameFromHex, 
  stripColorTag, 
  parseBoxHierarchy 
} from "../components/inventory/storageTaxonomy";

/**
 * Institutional Single Document Excel Exporter
 * Generates an official state university archival spreadsheet (.xlsx)
 * matching Republic of the Philippines / ZPPSU letterhead, ISO 9001:2015 / NAP RA 9470 standards,
 * physical storage custody, styled record tables, and executive signatories.
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
  const category = document.category || "Administrative";
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
  const cabinetName = document.file_box?.cabinet?.name 
    ? `${document.file_box.cabinet.name} (${document.file_box.cabinet.type || "Unit"})`
    : "Unassigned Storage Unit";
  const boxName = stripColorTag(boxParsed?.parentBoxName || (!boxParsed?.isArchfile ? document.file_box?.name : "Direct Placement") || "Unassigned Box Container");
  const archfileName = stripColorTag(document.archfile?.name || document.file_box?.archfile?.name || boxParsed?.archfileName || null);
  const archfileCode = document.archfile?.code || document.file_box?.archfile?.code || null;
  const rawColor = document.archfile?.color_tag || document.file_box?.archfile?.color_tag || boxParsed?.color || null;
  const archfileColorName = getColorNameFromHex(rawColor);

  const archfileInfo = archfileName
    ? `${archfileName}${archfileCode ? ` [${archfileCode}]` : ""}${archfileColorName ? ` (Spine: ${archfileColorName})` : ""}`
    : "Direct Unit / Box Placement (Not filed inside a separate Archfile binder)";

  const computedLocation = document.file_box?.cabinet?.name
    ? `${document.file_box.cabinet.name} - ${document.file_box.name}`
    : (document.file_box?.name || unifiedData.file_location || "Unassigned");
  const fileLocation = formatLocationWithColorName(unifiedData.file_location || computedLocation);

  // Current logged in user
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();
  const staffName = currentUser?.name || "SYSTEM ADMIN";

  // Column Widths (A to E)
  sheet.columns = [
    { width: 18 }, // A: Date / Labels
    { width: 22 }, // B: Access Code / Values
    { width: 44 }, // C: Subject / Values
    { width: 22 }, // D: Action Taken / Status
    { width: 32 }, // E: File Location
  ];

  // Helper styles
  const thinBorder = {
    top: { style: "thin", color: { argb: "FF000000" } },
    left: { style: "thin", color: { argb: "FF000000" } },
    bottom: { style: "thin", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } },
  };

  const maroonFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF6B1D2A" }, // ZPPSU Maroon
  };

  const goldFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF2DFB0" }, // ZPPSU Gold Tint
  };

  const darkFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1D1A1B" }, // Charcoal
  };

  const grayFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF8F6F6" },
  };

  // --- 1. STATE UNIVERSITY LETTERHEAD ---
  sheet.addRow([]); // Row 1

  // Row 2: Republic of the Philippines
  sheet.mergeCells("A2:E2");
  const r2 = sheet.getCell("A2");
  r2.value = "REPUBLIC OF THE PHILIPPINES";
  r2.font = { bold: true, size: 10, color: { argb: "FF333333" } };
  r2.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(2).height = 18;

  // Row 3: University Name
  sheet.mergeCells("A3:E3");
  const r3 = sheet.getCell("A3");
  r3.value = "ZAMBOANGA PENINSULA POLYTECHNIC STATE UNIVERSITY";
  r3.font = { bold: true, size: 13, color: { argb: "FF1D1A1B" } };
  r3.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(3).height = 24;

  // Row 4: Region
  sheet.mergeCells("A4:E4");
  const r4 = sheet.getCell("A4");
  r4.value = "Region IX - Zamboanga Del Sur, Zamboanga City, Philippines";
  r4.font = { italic: true, size: 9.5, color: { argb: "FF555555" } };
  r4.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(4).height = 18;

  // Row 5: Office Name
  sheet.mergeCells("A5:E5");
  const r5 = sheet.getCell("A5");
  r5.value = "OFFICE OF GUIDANCE AND COUNSELING SERVICES";
  r5.font = { bold: true, size: 10.5, color: { argb: "FF6B1D2A" } };
  r5.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(5).height = 18;

  // Row 6: Unit Name
  sheet.mergeCells("A6:E6");
  const r6 = sheet.getCell("A6");
  r6.value = "ARCHIVAL & RECORDS MANAGEMENT UNIT";
  r6.font = { bold: true, size: 9.5, color: { argb: "FF1D1A1B" } };
  r6.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(6).height = 17;

  // Row 7: Address
  sheet.mergeCells("A7:E7");
  const r7 = sheet.getCell("A7");
  r7.value = "R.T. Lim Boulevard, Baliwasan, Zamboanga City 7000 • records@zppsu.edu.ph";
  r7.font = { size: 8.5, color: { argb: "FF666666" } };
  r7.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(7).height = 16;

  // Row 8: Standards & Reference Control
  sheet.mergeCells("A8:C8");
  const r8Left = sheet.getCell("A8");
  r8Left.value = "CONTROL STANDARD: ISO 9001:2015 | NAP RA 9470 COMPLIANT";
  r8Left.font = { bold: true, size: 8.5, color: { argb: "FF6B1D2A" } };
  r8Left.alignment = { horizontal: "left", vertical: "middle" };

  sheet.mergeCells("D8:E8");
  const r8Right = sheet.getCell("D8");
  r8Right.value = `Ref Accession: ${documentIdentifier}`;
  r8Right.font = { bold: true, size: 8.5, color: { argb: "FF1D1A1B" } };
  r8Right.alignment = { horizontal: "right", vertical: "middle" };
  sheet.getRow(8).height = 18;

  // Border separating letterhead
  ["A8", "B8", "C8", "D8", "E8"].forEach((ref) => {
    sheet.getCell(ref).border = { bottom: { style: "medium", color: { argb: "FF000000" } } };
  });

  sheet.addRow([]); // Row 9: spacing

  // --- 2. MASTERLIST TABLE (EXACT MATCH TO 2ND IMAGE) ---
  // Row 10: Table Title
  sheet.mergeCells("A10:E10");
  const r10 = sheet.getCell("A10");
  r10.value = `ZPPSU MASTERLIST OF RECORDS- ${documentType}`;
  r10.font = { bold: true, size: 12, color: { argb: "FF1D1A1B" } };
  r10.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(10).height = 28;
  ["A10", "B10", "C10", "D10", "E10"].forEach((ref) => {
    sheet.getCell(ref).border = thinBorder;
  });

  // Row 11: Column Headers
  const r11 = sheet.addRow(["Date", "ACCESS CODE", "SUBJECT", statusOrActionHeader, "FILE LOCATION"]);
  r11.height = 22;
  r11.eachCell((cell) => {
    cell.font = { bold: true, size: 10, color: { argb: "FF1D1A1B" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
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

  // Row 12: Gold Month Banner (Spanning all columns with #F2DFB0 gold fill)
  sheet.mergeCells("A12:E12");
  const r12 = sheet.getCell("A12");
  r12.value = monthName;
  r12.font = { bold: true, size: 10.5, color: { argb: "FF1D1A1B" } };
  r12.fill = goldFill; // #F2DFB0
  r12.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
  sheet.getRow(12).height = 22;
  ["A12", "B12", "C12", "D12", "E12"].forEach((ref) => {
    sheet.getCell(ref).border = thinBorder;
  });

  // Row 13: Data Record (Centered Horizontally & Vertically)
  const r13 = sheet.addRow([recordDate, accessCode, subject, statusOrActionValue, fileLocation]);
  r13.height = 24;
  r13.eachCell((cell) => {
    cell.font = { size: 10, color: { argb: "FF1D1A1B" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
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
