import ExcelJS from "exceljs";
import api from "../services/api";
import { parseBoxHierarchy } from "../components/inventory/storageTaxonomy";

/**
 * Exports physical storage inventory manifest to an institutional Excel workbook (.xlsx)
 * Adheres to ZPPSU institutional color scheme (#6B1D2A maroon headers).
 */
export async function exportStorageManifest(cabinets, fileBoxes) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Storage Manifest", {
    views: [{ showGridLines: true }],
  });

  // Header Banner
  sheet.mergeCells("A1:G1");
  const titleCell = sheet.getCell("A1");
  titleCell.value = "ZAMBOANGA PENINSULA POLYTECHNIC STATE UNIVERSITY";
  titleCell.font = { bold: true, size: 14, color: { argb: "FFFFFCF7" } };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF6B1D2A" }, // Maroon
  };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(1).height = 30;

  sheet.mergeCells("A2:G2");
  const subCell = sheet.getCell("A2");
  subCell.value = "OFFICE OF RECORDS MANAGEMENT — PHYSICAL STORAGE INVENTORY MANIFEST";
  subCell.font = { bold: true, size: 10, color: { argb: "FF1D1A1B" } };
  subCell.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(2).height = 20;

  sheet.mergeCells("A3:G3");
  const metaCell = sheet.getCell("A3");
  metaCell.value = `Export Date: ${new Date().toLocaleString()} | Storage Units: ${cabinets.length} | Total Containers: ${fileBoxes.length}`;
  metaCell.font = { italic: true, size: 9, color: { argb: "FF5F5A5C" } };
  metaCell.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(3).height = 18;

  sheet.addRow([]);

  const headers = [
    "Storage Unit (Cabinet/Rack)",
    "Storage Type",
    "Container Type",
    "Container Name",
    "Archfile Color",
    "Documents Filed",
    "Document IDs Stored"
  ];

  const headerRow = sheet.addRow(headers);
  headerRow.height = 24;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFCF7" }, size: 10 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF8B3545" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin", color: { argb: "FFE8E3E1" } },
      bottom: { style: "medium", color: { argb: "FF6B1D2A" } },
      left: { style: "thin", color: { argb: "FFE8E3E1" } },
      right: { style: "thin", color: { argb: "FFE8E3E1" } }
    };
  });

  let rowIdx = 0;
  cabinets.forEach((cab) => {
    const cabBoxes = fileBoxes.filter(b => Number(b.cabinet_id) === Number(cab.id));
    if (cabBoxes.length === 0) {
      const row = sheet.addRow([
        cab.name,
        "Storage Unit",
        "None",
        "No containers registered",
        "N/A",
        0,
        "—"
      ]);
      row.height = 20;
      rowIdx++;
    } else {
      cabBoxes.forEach((b) => {
        const parsed = parseBoxHierarchy(b.name);
        const containerType = parsed.isArchfile ? "Archfile Binder" : "File Box";
        const displayName = parsed.isArchfile ? `${parsed.parentBox} > ${parsed.archfileName}` : b.name;
        const colorName = parsed.customColor ? parsed.customColor : "Standard";
        const docCount = b.files ? b.files.length : 0;
        const docIds = b.files && b.files.length > 0 
          ? b.files.map(f => f.document_id || `DOC-${f.id}`).join(", ") 
          : "None";

        const row = sheet.addRow([
          cab.name,
          "Storage Unit",
          containerType,
          displayName,
          colorName,
          docCount,
          docIds
        ]);
        row.height = 20;
        const isAlt = rowIdx % 2 === 1;
        row.eachCell((cell, colNumber) => {
          cell.font = { size: 9, color: { argb: "FF1D1A1B" } };
          cell.alignment = {
            horizontal: colNumber === 4 || colNumber === 7 ? "left" : "center",
            vertical: "middle",
            wrapText: colNumber === 7
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
        rowIdx++;
      });
    }
  });

  sheet.columns = [
    { width: 26 }, // Cabinet
    { width: 16 }, // Unit Type
    { width: 18 }, // Container Type
    { width: 32 }, // Container Name
    { width: 16 }, // Color
    { width: 16 }, // Doc Count
    { width: 45 }, // Doc IDs
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const dateStamp = new Date().toISOString().split("T")[0];
  link.download = `ZPPSU_Storage_Manifest_${dateStamp}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  try {
    await api.post("/api/logs/track", {
      action: "EXPORT INVENTORY",
      description: `Exported Storage Manifest (${fileBoxes.length} containers across ${cabinets.length} units)`,
      module: "inventory"
    });
  } catch (err) {
    console.error("Failed to log inventory export:", err);
  }
}
