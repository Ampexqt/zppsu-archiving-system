import ExcelJS from "exceljs";
import { formatLocationWithColorName } from "../components/inventory/storageTaxonomy";
import { getInstitutionalLogoBuffer } from "./excelLogoLoader";

/**
 * Institutional Masterlist Excel Exporter
 * Generates an official state university records masterlist (.xlsx)
 * matching the exact institutional letterhead from Image 4:
 * - Official Guidance & Counseling seal on the left
 * - Center university headings
 * - Boxed Control Standard stamp (ISO 9001:2015 / NAP RA 9470) on the right
 * - Intelligent Month Banners: rendered when records span <= 2 months;
 *   automatically omitted when spanning > 2 months to ensure clean, continuous flow.
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
  const midColEndLetter = String.fromCharCode(65 + numCols - 2); // Column before the right-side stamp

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
    if (hUpper.includes("LOCATION")) width = 45;
    else if (hUpper.includes("SUBJECT") || hUpper.includes("DESCRIPTION") || hUpper.includes("TITLE")) width = 65;
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

  // --- 1. EMBED OFFICIAL ZPPSU SEAL (LEFT: COLUMN A) ---
  sheet.addRow([]); // Row 1: Top spacing

  try {
    const logoBuffer = await getInstitutionalLogoBuffer();
    if (logoBuffer) {
      const imageId = workbook.addImage({
        buffer: logoBuffer,
        extension: "jpeg",
      });
      sheet.addImage(imageId, {
        tl: { col: 0.15, row: 1.15 },
        ext: { width: 72, height: 72 },
      });
    }
  } catch (imgErr) {
    console.warn("Could not embed institutional logo into masterlist Excel:", imgErr);
  }

  // --- 2. CENTER UNIVERSITY HEADINGS (COLS B TO LASTCOL - 1) ---
  // Row 2: Republic of the Philippines
  sheet.mergeCells(`B2:${midColEndLetter}2`);
  const r2 = sheet.getCell("B2");
  r2.value = "REPUBLIC OF THE PHILIPPINES";
  r2.font = { bold: true, size: 10, color: { argb: "FF333333" } };
  r2.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(2).height = 18;

  // Row 3: University Name
  sheet.mergeCells(`B3:${midColEndLetter}3`);
  const r3 = sheet.getCell("B3");
  r3.value = "ZAMBOANGA PENINSULA POLYTECHNIC STATE UNIVERSITY";
  r3.font = { bold: true, size: 13, color: { argb: "FF1D1A1B" } };
  r3.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(3).height = 22;

  // Row 4: Regional Address
  sheet.mergeCells(`B4:${midColEndLetter}4`);
  const r4 = sheet.getCell("B4");
  r4.value = "Region IX - Zamboanga Del Sur, Zamboanga City, Philippines";
  r4.font = { italic: true, size: 9.5, color: { argb: "FF555555" } };
  r4.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(4).height = 17;

  // Row 5: Office Name
  sheet.mergeCells(`B5:${midColEndLetter}5`);
  const r5 = sheet.getCell("B5");
  r5.value = "OFFICE OF GUIDANCE AND COUNSELING SERVICES";
  r5.font = { bold: true, size: 10.5, color: { argb: "FF6B1D2A" } };
  r5.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(5).height = 18;

  // Row 6: Archival Unit Name
  sheet.mergeCells(`B6:${midColEndLetter}6`);
  const r6 = sheet.getCell("B6");
  r6.value = "ARCHIVAL & RECORDS MANAGEMENT UNIT";
  r6.font = { bold: true, size: 9.5, color: { argb: "FF1D1A1B" } };
  r6.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(6).height = 16;

  // Row 7: Physical Address
  sheet.mergeCells(`B7:${midColEndLetter}7`);
  const r7 = sheet.getCell("B7");
  r7.value = "R.T. Lim Boulevard, Baliwasan, Zamboanga City 7000 • records@zppsu.edu.ph";
  r7.font = { size: 8.5, color: { argb: "FF666666" } };
  r7.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(7).height = 16;

  // --- 3. FRAMED CONTROL STANDARD STAMP (RIGHT: LAST COLUMN) ---
  const docTypePrefix = selectedDocType.replace(/[^A-Za-z0-9]/g, "").substring(0, 4).toUpperCase();
  const accessionRef = `ML-${new Date().getFullYear()}-${docTypePrefix}`;

  // Top Stamp Cell
  const boxTop = sheet.getCell(`${lastColLetter}3`);
  boxTop.value = "CONTROL STANDARD";
  boxTop.font = { bold: true, size: 7.5, color: { argb: "FF444444" } };
  boxTop.alignment = { horizontal: "center", vertical: "middle" };
  boxTop.border = {
    top: { style: "thin", color: { argb: "FF000000" } },
    left: { style: "thin", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } },
  };

  // Middle ISO Code Cell
  const boxMid = sheet.getCell(`${lastColLetter}4`);
  boxMid.value = "ISO 9001:2015";
  boxMid.font = { bold: true, size: 10, color: { argb: "FF6B1D2A" } };
  boxMid.alignment = { horizontal: "center", vertical: "middle" };
  boxMid.border = {
    left: { style: "thin", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } },
  };

  // Bottom Compliance Cell
  const boxBot = sheet.getCell(`${lastColLetter}5`);
  boxBot.value = "NAP RA 9470 COMPLIANT";
  boxBot.font = { size: 7.5, color: { argb: "FF666666" } };
  boxBot.alignment = { horizontal: "center", vertical: "middle" };
  boxBot.border = {
    bottom: { style: "thin", color: { argb: "FF000000" } },
    left: { style: "thin", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } },
  };

  // Accession Ref under Stamp
  const refCell = sheet.getCell(`${lastColLetter}6`);
  refCell.value = `Ref: ${accessionRef}`;
  refCell.font = { bold: true, size: 8.5, color: { argb: "FF1D1A1B" } };
  refCell.alignment = { horizontal: "center", vertical: "middle" };

  // --- 4. LETTERHEAD DIVIDER LINE (ROW 8) ---
  for (let c = 0; c < numCols; c++) {
    const colChar = String.fromCharCode(65 + c);
    sheet.getCell(`${colChar}8`).border = {
      bottom: { style: "medium", color: { argb: "FF000000" } },
    };
  }
  sheet.getRow(8).height = 8;

  sheet.addRow([]); // Row 9: Spacing

  // --- 5. MASTERLIST TABLE HEADER ---
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

  // --- 6. INTELLIGENT MONTH BANNER LOGIC ---
  // Check how many unique months are present in this dataset
  const uniqueMonths = new Set();
  records.forEach((file) => {
    const row = getRowData ? getRowData(file, headers) : [];
    uniqueMonths.add(extractMonth(file, row));
  });

  // Only render month banners if there are <= 2 unique months (e.g. single month or narrow range).
  // If > 2 unique months, remove repetitive banners so records flow continuously without clutter!
  const shouldRenderMonthBanners = uniqueMonths.size <= 2;

  let currentMonthGroup = null;

  records.forEach((file) => {
    const rawRow = getRowData ? getRowData(file, headers) : [];
    const cleanRowData = headers.map((_, idx) => {
      const v = rawRow[idx];
      return v === undefined || v === null ? "" : v;
    });

    const fileMonth = extractMonth(file, cleanRowData);

    // Insert Gold Month Banner if <= 2 months and month changed
    if (shouldRenderMonthBanners && fileMonth !== currentMonthGroup) {
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
