import ExcelJS from "exceljs";

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
  const cabinetName = document.file_box?.cabinet?.name 
    ? `${document.file_box.cabinet.name} (${document.file_box.cabinet.type || "Unit"})`
    : "Unassigned Storage Unit";
  const boxName = document.file_box?.name || "Unassigned Box Container";
  const archfileName = document.archfile?.name || document.file_box?.archfile?.name || null;
  const archfileCode = document.archfile?.code || document.file_box?.archfile?.code || null;
  const archfileColor = document.archfile?.color_tag || document.file_box?.archfile?.color_tag || null;

  const archfileInfo = archfileName
    ? `${archfileName}${archfileCode ? ` [${archfileCode}]` : ""}${archfileColor ? ` (Spine: ${archfileColor})` : ""}`
    : "Direct Unit / Box Placement (Not filed inside a separate Archfile binder)";

  const computedLocation = document.file_box?.cabinet?.name
    ? `${document.file_box.cabinet.name} - ${document.file_box.name}`
    : (document.file_box?.name || unifiedData.file_location || "Unassigned");
  const fileLocation = unifiedData.file_location || computedLocation;

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

  sheet.addRow([]); // Row 9

  // --- 2. TITLE BAR & CLASSIFICATION ---
  sheet.mergeCells("A10:E10");
  const r10 = sheet.getCell("A10");
  r10.value = `MASTERLIST OF RECORDS FOR ${documentType}`;
  r10.font = { bold: true, size: 11, color: { argb: "FFFFFCF7" } };
  r10.fill = maroonFill;
  r10.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(10).height = 24;

  sheet.mergeCells("A11:C11");
  const r11Left = sheet.getCell("A11");
  r11Left.value = `Classification: ${category} | Document Type: ${document.document_type || "Record"}`;
  r11Left.font = { size: 9, color: { argb: "FF1D1A1B" } };
  r11Left.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF4E7EA" } };
  r11Left.alignment = { horizontal: "left", vertical: "middle" };

  sheet.mergeCells("D11:E11");
  const r11Right = sheet.getCell("D11");
  r11Right.value = `Archival Series: ${new Date().getFullYear()} • Certified University Copy`;
  r11Right.font = { size: 8.5, color: { argb: "FF555555" }, italic: true };
  r11Right.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF4E7EA" } };
  r11Right.alignment = { horizontal: "right", vertical: "middle" };
  sheet.getRow(11).height = 18;

  sheet.addRow([]); // Row 12

  // --- 3. SECTION I: ARCHIVAL DOCUMENT REGISTRATION ---
  sheet.mergeCells("A13:E13");
  const r13 = sheet.getCell("A13");
  r13.value = "SECTION I: ARCHIVAL DOCUMENT REGISTRATION & CLASSIFICATION (STATUS: ACTIVE)";
  r13.font = { bold: true, size: 9, color: { argb: "FFFFFCF7" } };
  r13.fill = darkFill;
  r13.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
  sheet.getRow(13).height = 20;

  // Row 14: Accession & Date
  sheet.addRow(["Document Accession No.", documentIdentifier, "Registration Date", formattedDate, ""]);
  sheet.mergeCells("D14:E14");
  sheet.getCell("A14").font = { bold: true, size: 9 };
  sheet.getCell("A14").fill = grayFill;
  sheet.getCell("B14").font = { bold: true, size: 9, color: { argb: "FF6B1D2A" } };
  sheet.getCell("C14").font = { bold: true, size: 9 };
  sheet.getCell("C14").fill = grayFill;
  sheet.getCell("D14").font = { size: 9 };
  sheet.getRow(14).height = 20;
  ["A14", "B14", "C14", "D14", "E14"].forEach((c) => {
    sheet.getCell(c).border = thinBorder;
    sheet.getCell(c).alignment = { vertical: "middle", indent: 1 };
  });

  // Row 15: Subject
  sheet.addRow(["Official Subject / Title", subject, "", "", ""]);
  sheet.mergeCells("B15:E15");
  sheet.getCell("A15").font = { bold: true, size: 9 };
  sheet.getCell("A15").fill = grayFill;
  sheet.getCell("B15").font = { bold: true, size: 9 };
  sheet.getRow(15).height = 20;
  ["A15", "B15", "C15", "D15", "E15"].forEach((c) => {
    sheet.getCell(c).border = thinBorder;
    sheet.getCell(c).alignment = { vertical: "middle", indent: 1 };
  });

  // Row 16: Category & Classification
  sheet.addRow(["Primary Category", category, "Document Classification", document.document_type || "Standard", ""]);
  sheet.mergeCells("D16:E16");
  sheet.getCell("A16").font = { bold: true, size: 9 };
  sheet.getCell("A16").fill = grayFill;
  sheet.getCell("B16").font = { size: 9 };
  sheet.getCell("C16").font = { bold: true, size: 9 };
  sheet.getCell("C16").fill = grayFill;
  sheet.getCell("D16").font = { size: 9 };
  sheet.getRow(16).height = 20;
  ["A16", "B16", "C16", "D16", "E16"].forEach((c) => {
    sheet.getCell(c).border = thinBorder;
    sheet.getCell(c).alignment = { vertical: "middle", indent: 1 };
  });

  sheet.addRow([]); // Row 17

  // --- 4. SECTION II: PHYSICAL STORAGE CHAIN OF CUSTODY ---
  sheet.mergeCells("A18:E18");
  const r18 = sheet.getCell("A18");
  r18.value = "SECTION II: PHYSICAL STORAGE CHAIN OF CUSTODY & REPOSITORY LOCATION";
  r18.font = { bold: true, size: 9, color: { argb: "FFFFFCF7" } };
  r18.fill = darkFill;
  r18.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
  sheet.getRow(18).height = 20;

  // Row 19: Storage Unit & Box
  sheet.addRow(["Primary Storage Unit", cabinetName, "File Box Container", boxName, ""]);
  sheet.mergeCells("D19:E19");
  sheet.getCell("A19").font = { bold: true, size: 9 };
  sheet.getCell("A19").fill = grayFill;
  sheet.getCell("B19").font = { bold: true, size: 9 };
  sheet.getCell("C19").font = { bold: true, size: 9 };
  sheet.getCell("C19").fill = grayFill;
  sheet.getCell("D19").font = { bold: true, size: 9 };
  sheet.getRow(19).height = 20;
  ["A19", "B19", "C19", "D19", "E19"].forEach((c) => {
    sheet.getCell(c).border = thinBorder;
    sheet.getCell(c).alignment = { vertical: "middle", indent: 1 };
  });

  // Row 20: Archfile Binder
  sheet.addRow(["Archfile Binder", archfileInfo, "", "", ""]);
  sheet.mergeCells("B20:E20");
  sheet.getCell("A20").font = { bold: true, size: 9 };
  sheet.getCell("A20").fill = grayFill;
  sheet.getCell("B20").font = { italic: true, size: 8.5, color: { argb: "FF555555" } };
  sheet.getRow(20).height = 20;
  ["A20", "B20", "C20", "D20", "E20"].forEach((c) => {
    sheet.getCell(c).border = thinBorder;
    sheet.getCell(c).alignment = { vertical: "middle", indent: 1 };
  });

  sheet.addRow([]); // Row 21

  // --- 5. SECTION III: CORE RECORD CONTENT ---
  sheet.mergeCells("A22:E22");
  const r22 = sheet.getCell("A22");
  r22.value = "SECTION III: OFFICIAL ARCHIVAL DOCUMENT CONTENT & TRANSCRIPT";
  r22.font = { bold: true, size: 9, color: { argb: "FFFFFCF7" } };
  r22.fill = darkFill;
  r22.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
  sheet.getRow(22).height = 20;

  // Row 23: Table Sub-banner
  sheet.mergeCells("A23:E23");
  const r23 = sheet.getCell("A23");
  r23.value = `ZPPSU MASTERLIST OF RECORDS - ${documentType}`;
  r23.font = { bold: true, size: 10.5, color: { argb: "FF1D1A1B" } };
  r23.fill = goldFill;
  r23.alignment = { horizontal: "center", vertical: "middle" };
  r23.border = thinBorder;
  sheet.getRow(23).height = 22;

  // Row 24: Table Column Headers
  const r24 = sheet.addRow(["DATE", "ACCESS CODE", "SUBJECT", statusOrActionHeader, "FILE LOCATION"]);
  r24.height = 22;
  r24.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFCF7" }, size: 9.5 };
    cell.fill = maroonFill;
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = thinBorder;
  });

  // Row 25: Data Record (Centered Horizontally & Vertically)
  const r25 = sheet.addRow([recordDate, accessCode, subject, statusOrActionValue, fileLocation]);
  r25.height = 24;
  r25.eachCell((cell) => {
    cell.font = { size: 9.5, color: { argb: "FF1D1A1B" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = thinBorder;
  });

  sheet.addRow([]); // Row 26
  sheet.addRow([]); // Row 27

  // --- 6. EXECUTIVE SIGNATORIES FOOTER ---
  // Row 28: Headers
  sheet.mergeCells("A28:B28");
  const r28Left = sheet.getCell("A28");
  r28Left.value = "PREPARED & CATALOGED BY:";
  r28Left.font = { bold: true, size: 9, color: { argb: "FF1D1A1B" } };
  r28Left.alignment = { horizontal: "center", vertical: "middle" };

  sheet.mergeCells("D28:E28");
  const r28Right = sheet.getCell("D28");
  r28Right.value = "CERTIFIED OFFICIAL RECORD:";
  r28Right.font = { bold: true, size: 9, color: { argb: "FF1D1A1B" } };
  r28Right.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(28).height = 20;

  // Row 29: Physical Signature Space Clearance
  sheet.addRow([]); // Row 29
  sheet.getRow(29).height = 36;

  // Row 30: Names / Underline
  sheet.mergeCells("A30:B30");
  const r30Left = sheet.getCell("A30");
  r30Left.value = staffName;
  r30Left.font = { bold: true, size: 10.5, color: { argb: "FF1D1A1B" } };
  r30Left.alignment = { horizontal: "center", vertical: "bottom" };
  r30Left.border = { bottom: { style: "medium", color: { argb: "FF000000" } } };

  sheet.mergeCells("D30:E30");
  const r30Right = sheet.getCell("D30");
  r30Right.value = ""; // Blank line for Director's physical signature & rubber seal!
  r30Right.alignment = { horizontal: "center", vertical: "bottom" };
  r30Right.border = { bottom: { style: "medium", color: { argb: "FF000000" } } };
  sheet.getRow(30).height = 20;

  // Row 31: Official Designations
  sheet.mergeCells("A31:B31");
  const r31Left = sheet.getCell("A31");
  r31Left.value = "Guidance Records Custodian / Staff";
  r31Left.font = { size: 9, color: { argb: "FF333333" } };
  r31Left.alignment = { horizontal: "center", vertical: "middle" };

  sheet.mergeCells("D31:E31");
  const r31Right = sheet.getCell("D31");
  r31Right.value = "DIRECTOR, GUIDANCE & COUNSELING";
  r31Right.font = { bold: true, size: 9.5, color: { argb: "FF1D1A1B" } };
  r31Right.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(31).height = 18;

  // Row 32: Dates & Office Head
  sheet.mergeCells("A32:B32");
  const r32Left = sheet.getCell("A32");
  r32Left.value = `Date: ${formattedDate}`;
  r32Left.font = { size: 8, color: { argb: "FF555555" } };
  r32Left.alignment = { horizontal: "center", vertical: "middle" };

  sheet.mergeCells("D32:E32");
  const r32Right = sheet.getCell("D32");
  r32Right.value = "Head, Guidance & Counseling Center • OSAS";
  r32Right.font = { size: 8.5, color: { argb: "FF555555" } };
  r32Right.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(32).height = 18;

  sheet.addRow([]); // Row 33

  // --- 7. LEGAL NOTICE & SECURITY STAMP ---
  sheet.mergeCells("A34:C35");
  const legalNotice = sheet.getCell("A34");
  legalNotice.value =
    "INSTITUTIONAL LEGAL CERTIFICATION NOTICE:\nThis document constitutes an official archival record of Zamboanga Peninsula Polytechnic State University (ZPPSU). Any unauthorized erasure, modification, reproduction, or tampering renders this record null and void under Republic Act No. 9470 (National Archives of the Philippines Act of 2007) and the Revised Penal Code of the Philippines.";
  legalNotice.font = { italic: true, size: 7.5, color: { argb: "FF555555" } };
  legalNotice.alignment = { horizontal: "left", vertical: "middle", wrapText: true };

  sheet.mergeCells("D34:E35");
  const securityStamp = sheet.getCell("D34");
  securityStamp.value = `ARCHIVAL SECURITY STAMP\nZPPSU-${String(documentIdentifier).replace(/[^a-zA-Z0-9-]/g, "")}-VERIFIED\nValid Institutional Electronic Verification`;
  securityStamp.font = { bold: true, size: 8, color: { argb: "FF6B1D2A" } };
  securityStamp.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5F5F5" } };
  securityStamp.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  ["D34", "D35", "E34", "E35"].forEach((c) => {
    sheet.getCell(c).border = thinBorder;
  });

  sheet.getRow(34).height = 18;
  sheet.getRow(35).height = 18;

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
