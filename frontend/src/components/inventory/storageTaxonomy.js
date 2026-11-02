/**
 * storageTaxonomy.js
 * Physical storage classifications for ZPPSU Archiving System.
 * Supports Cabinet, Steel Cabinet, Shelves, File Box, and Customizable Archfiles.
 */

export const STORAGE_UNIT_TYPES = [
  {
    id: "cabinet",
    label: "Cabinet",
    fullTitle: "Filing Cabinet",
    description: "Standard office filing cabinet for categorized records",
    badgeBg: "bg-[#F4E7EA]",
    badgeText: "text-[#6B1D2A]",
    iconName: "FileBox",
  },
  {
    id: "steel_cabinet",
    label: "Steel Cabinet",
    fullTitle: "Steel Archive Cabinet",
    description: "Heavy-duty fireproof institutional steel storage cabinet",
    badgeBg: "bg-[#F2DFB0]",
    badgeText: "text-[#A87818]",
    iconName: "FolderArchive",
  },
  {
    id: "shelves",
    label: "Shelves",
    fullTitle: "Open Shelving Rack",
    description: "Open storage shelves and archive rack partitions",
    badgeBg: "bg-[#FFFCF7]",
    badgeText: "text-[#5F5A5C]",
    iconName: "Layers",
  },
];

export const CONTAINER_TYPES = [
  {
    id: "file_box",
    label: "File Box",
    fullTitle: "Archive Storage Box",
    description: "Heavy-duty archival box for bulk document dossiers",
    badgeBg: "bg-[#F4E7EA]",
    badgeText: "text-[#6B1D2A]",
    iconName: "Box",
  },
  {
    id: "archfile",
    label: "Archfile",
    fullTitle: "Lever-Arch Binder / Archfile",
    description: "Ring binder folder with customizable color code",
    badgeBg: "bg-[#F4E7EA]",
    badgeText: "text-[#6B1D2A]",
    iconName: "FolderClosed",
  },
];

// Curated office binder color swatches for quick selection
export const ARCHFILE_COLOR_PRESETS = [
  { label: "Maroon", hex: "#6B1D2A" },
  { label: "Gold", hex: "#C99A2E" },
  { label: "Navy", hex: "#1E293B" },
  { label: "Royal", hex: "#2563EB" },
  { label: "Crimson", hex: "#B91C1C" },
  { label: "Teal", hex: "#0F766E" },
  { label: "Purple", hex: "#7E22CE" },
  { label: "Slate", hex: "#475569" },
  { label: "Orange", hex: "#C2410C" },
];

export function detectUnitType(name = "") {
  const lower = (name || "").toLowerCase();
  if (lower.includes("steel cabinet") || lower.includes("steel") || lower.includes("[steel]")) {
    return STORAGE_UNIT_TYPES[1]; // steel_cabinet
  }
  if (lower.includes("shelve") || lower.includes("shelf") || lower.includes("rack")) {
    return STORAGE_UNIT_TYPES[2]; // shelves
  }
  return STORAGE_UNIT_TYPES[0]; // cabinet
}

export function detectContainerType(name = "") {
  const lower = (name || "").toLowerCase();
  if (
    lower.includes("archfile") ||
    lower.includes("arch file") ||
    lower.includes("binder") ||
    lower.includes("[archfile]") ||
    name.includes(" / ")
  ) {
    return CONTAINER_TYPES[1]; // archfile
  }
  return CONTAINER_TYPES[0]; // file_box
}

/**
 * Parses a container name into hierarchical levels and extracts color metadata:
 * e.g. "Box 01 / HR Records [color:#7E22CE]" -> { isArchfile: true, parentBoxName: "Box 01", archfileName: "HR Records", color: "#7E22CE" }
 * e.g. "Box 01" -> { isArchfile: false, boxName: "Box 01", color: null }
 */
export function parseBoxHierarchy(rawName = "") {
  if (!rawName) return { isArchfile: false, boxName: "Unnamed", color: "#6B1D2A" };

  // Check for custom color tag: [color:#HEX] or [color:NAME]
  const colorMatch = rawName.match(/\[color:([^\]]+)\]/i);
  const color = colorMatch ? colorMatch[1].trim() : "#6B1D2A";
  const cleanName = rawName.replace(/\[color:[^\]]+\]/i, "").trim();

  if (cleanName.includes(" / ")) {
    const parts = cleanName.split(" / ");
    return {
      isArchfile: true,
      parentBoxName: parts[0].trim(),
      archfileName: parts.slice(1).join(" / ").trim(),
      color,
    };
  }

  const lower = cleanName.toLowerCase();
  if (lower.startsWith("archfile") || lower.startsWith("binder")) {
    return {
      isArchfile: true,
      parentBoxName: null,
      archfileName: cleanName,
      color,
    };
  }

  return {
    isArchfile: false,
    boxName: cleanName,
    color: null,
  };
}

export function formatArchfileName(parentBoxName, archfileName, color) {
  const base = parentBoxName ? `${parentBoxName} / ${archfileName}` : archfileName;
  if (color && color.trim() && color.trim() !== "#6B1D2A") {
    return `${base} [color:${color.trim()}]`;
  }
  return base;
}
