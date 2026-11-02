import ExcelJS from "exceljs";
import api from "../services/api";
import { parseBoxHierarchy } from "../components/inventory/storageTaxonomy";

/**
 * Exports document records to an institutional Excel workbook (.xlsx)
 * Follows ZPPSU institutional color palette (#6B1D2A maroon headers).
 */
export async function exportDocumentCatalog(documents, filterSummary = "All Records") {
  if (!documents || documents.length === 0) {
    throw new Error("No documents available to export.");
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Document Catalog", {
    views: [{ showGridLines: true }],
  });

  // Institution Title Header
  sheet.mergeCells("A1:H1");
  const titleCell = sheet.getCell("A1");
  titleCell.value = "ZAMBOANGA PENINSULA POLYTECHNIC STATE UNIVERSITY";
  titleCell.font = { bold: true, size: 14, color: { argb: "FFFFFCF7" } };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF6B1D2A" }, // Institutional Maroon
  };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(1).height = 30;

  // Subtitle
  sheet.mergeCells("A2:H2");
  const subCell = sheet.getCell("A2");
  subCell.value = `OFFICE OF RECORDS MANAGEMENT — DOCUMENT CATALOG (${filterSummary})`;
  subCell.font = { bold: true, size: 10, color: { argb: "FF1D1A1B" } };
  subCell.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(2).height = 20;

  // Metadata Timestamp Row
  sheet.mergeCells("A3:H3");
  const metaCell = sheet.getCell("A3");
  metaCell.value = `Generated: ${new Date().toLocaleString()} | Total Records: ${documents.length}`;
  metaCell.font = { italic: true, size: 9, color: { argb: "FF5F5A5C" } };
  metaCell.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(3).height = 18;

  // Empty row
  sheet.addRow([]);

  // Table Column Headers
  const headers = [
    "Document ID",
    "Subject / Title",
    "Document Type",
    "Category",
    "Status",
    "Storage Cabinet",
    "File Box / Archfile",
    "Date Created"
  ];

  const headerRow = sheet.addRow(headers);
  headerRow.height = 24;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFCF7" }, size: 10 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF8B3545" }, // Subtle lighter maroon
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin", color: { argb: "FFE8E3E1" } },
      bottom: { style: "medium", color: { argb: "FF6B1D2A" } },
      left: { style: "thin", color: { argb: "FFE8E3E1" } },
      right: { style: "thin", color: { argb: "FFE8E3E1" } }
    };
  });

  // Table Data Rows
  documents.forEach((doc, idx) => {
    const cabinetName = doc.file_box?.cabinet?.name || doc.cabinet?.name || (doc.file_box_id ? "Assigned" : "Unassigned");
    let containerName = "Unassigned";
    if (doc.file_box?.name) {
      const parsed = parseBoxHierarchy(doc.file_box.name);
      containerName = parsed.isArchfile ? `${parsed.parentBox} > ${parsed.archfileName}` : doc.file_box.name;
    }

    const dateStr = doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "N/A";

    const row = sheet.addRow([
      doc.document_id || `DOC-${doc.id}`,
      doc.subject || "Untitled Record",
      doc.document_type || "General",
      doc.category || "General",
      doc.status || "Active",
      cabinetName,
      containerName,
      dateStr
    ]);

    row.height = 20;
    const isAlt = idx % 2 === 1;
    row.eachCell((cell, colNumber) => {
      cell.font = { size: 9, color: { argb: "FF1D1A1B" } };
      cell.alignment = {
        horizontal: colNumber === 2 ? "left" : "center",
        vertical: "middle",
        wrapText: colNumber === 2
      };
      if (isAlt) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF9F6F0" }
        };
      }
      cell.border = {
        top: { style: "thin", color: { argb: "FFE8E3E1" } },
        bottom: { style: "thin", color: { argb: "FFE8E3E1" } },
        left: { style: "thin", color: { argb: "FFE8E3E1" } },
        right: { style: "thin", color: { argb: "FFE8E3E1" } }
      };
    });
  });

  // Column Widths
  sheet.columns = [
    { width: 18 }, // Doc ID
    { width: 40 }, // Subject
    { width: 22 }, // Type
    { width: 20 }, // Category
    { width: 14 }, // Status
    { width: 22 }, // Storage Unit
    { width: 28 }, // Container
    { width: 16 }, // Date
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const dateStamp = new Date().toISOString().split("T")[0];
  link.download = `ZPPSU_Document_Catalog_${dateStamp}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  // Track in Audit Trail
  try {
    await api.post("/api/logs/track", {
      action: "EXPORT DOCUMENTS",
      description: `Exported Excel document catalog (${documents.length} records)`,
      module: "documents"
    });
  } catch (err) {
    console.error("Failed to log export event:", err);
  }
}
