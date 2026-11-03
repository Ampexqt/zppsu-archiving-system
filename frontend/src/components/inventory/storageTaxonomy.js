/**
 * storageTaxonomy.js
 * Physical storage classifications for ZPPSU Archiving System.
 * Main Categories:
 * 1. Cabinet (Main category): Steel Cabinet, File Box, Archfile
 * 2. Shelves (Separate main category): File Box, Archfile
 */

export const MAIN_STORAGE_CATEGORIES = [
  {
    id: "cabinet",
    label: "Cabinet",
    fullTitle: "Cabinet (Main Category)",
    description: "Enclosed filing units and heavy-duty steel archive cabinets",
    badgeBg: "bg-[#F4E7EA]",
    badgeText: "text-[#6B1D2A]",
    subTypes: [
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
        id: "cabinet",
        label: "Standard Cabinet",
        fullTitle: "Standard Filing Cabinet",
        description: "Standard office drawer filing cabinet for categorized records",
        badgeBg: "bg-[#F4E7EA]",
        badgeText: "text-[#6B1D2A]",
        iconName: "FileBox",
      },
    ],
  },
  {
    id: "shelves",
    label: "Shelves",
    fullTitle: "Shelves (Separate Main Category)",
    description: "Open storage shelving racks and archive bay partitions",
    badgeBg: "bg-[#FFFCF7]",
    badgeText: "text-[#5F5A5C]",
    subTypes: [
      {
        id: "shelves",
        label: "Shelves",
        fullTitle: "Open Shelving Rack / Bay",
        description: "Open archive tiers holding file boxes and direct archfile binders",
        badgeBg: "bg-[#FFFCF7]",
        badgeText: "text-[#5F5A5C]",
        iconName: "Layers",
      },
    ],
  },
];

export const STORAGE_UNIT_TYPES = [
  {
    id: "steel_cabinet",
    categoryId: "cabinet",
    label: "Steel Cabinet",
    fullTitle: "Steel Archive Cabinet",
    description: "Heavy-duty fireproof institutional steel storage cabinet",
    badgeBg: "bg-[#F2DFB0]",
    badgeText: "text-[#A87818]",
    iconName: "FolderArchive",
  },
  {
    id: "cabinet",
    categoryId: "cabinet",
    label: "Standard Cabinet",
    fullTitle: "Standard Filing Cabinet",
    description: "Standard office filing cabinet for categorized records",
    badgeBg: "bg-[#F4E7EA]",
    badgeText: "text-[#6B1D2A]",
    iconName: "FileBox",
  },
  {
    id: "shelves",
    categoryId: "shelves",
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

export function detectMainCategory(name = "") {
  const lower = (name || "").toLowerCase();
  if (lower.includes("shelve") || lower.includes("shelf") || lower.includes("rack")) {
    return "shelves";
  }
  return "cabinet";
}

export function detectUnitType(name = "") {
  const lower = (name || "").toLowerCase();
  if (lower.includes("steel cabinet") || lower.includes("steel") || lower.includes("[steel]")) {
    return STORAGE_UNIT_TYPES[0]; // steel_cabinet
  }
  if (lower.includes("shelve") || lower.includes("shelf") || lower.includes("rack")) {
    return STORAGE_UNIT_TYPES[2]; // shelves
  }
  return STORAGE_UNIT_TYPES[1]; // cabinet
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
 * e.g. "Archfile HR Records [color:#7E22CE]" -> { isArchfile: true, parentBoxName: null, archfileName: "Archfile HR Records", color: "#7E22CE" }
 * e.g. "Box 01" -> { isArchfile: false, boxName: "Box 01", color: null }
 */
export function parseBoxHierarchy(rawName = "") {
  if (!rawName) return { isArchfile: false, boxName: "Unnamed", color: "#6B1D2A" };

  // Check for custom color tag: [color:#HEX] or [color:NAME]
  const colorMatch = rawName.match(/\[color:([^\]]+)\]/i);
  const color = colorMatch ? colorMatch[1].trim() : "#6B1D2A";
  const cleanName = rawName.replace(/\[color:[^\]]+\]/i, "").trim();
  const colorName = getColorNameFromHex(color);

  if (cleanName.includes(" / ")) {
    const parts = cleanName.split(" / ");
    return {
      isArchfile: true,
      parentBoxName: parts[0].trim(),
      archfileName: parts.slice(1).join(" / ").trim(),
      color,
      colorName,
    };
  }

  const lower = cleanName.toLowerCase();
  if (lower.startsWith("archfile") || lower.startsWith("binder")) {
    return {
      isArchfile: true,
      parentBoxName: null,
      archfileName: cleanName,
      color,
      colorName,
    };
  }

  return {
    isArchfile: false,
    boxName: cleanName,
    color: null,
    colorName: null,
  };
}

/**
 * Resolves a hex code or color string to an official human-readable label
 * e.g. "#0F766E" -> "Teal", "#6B1D2A" -> "Maroon"
 */
export function getColorNameFromHex(hexOrName = "") {
  if (!hexOrName) return "";
  const clean = hexOrName.trim().toLowerCase();
  const found = ARCHFILE_COLOR_PRESETS.find(
    (p) => p.hex.toLowerCase() === clean || p.label.toLowerCase() === clean
  );
  if (found) return found.label;
  if (!clean.startsWith("#")) {
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }
  return "";
}

/**
 * Strips [color:...] or transforms [color:#HEX] into clean readable color name:
 * e.g. "Cabinet 01 - Archfile [color:#0F766E]" -> "Cabinet 01 - Archfile (Teal)"
 */
export function formatLocationWithColorName(rawLocation = "") {
  if (!rawLocation) return "";
  return rawLocation
    .replace(/\[color:([^\]]+)\]/gi, (match, colorVal) => {
      const colorName = getColorNameFromHex(colorVal);
      return colorName ? `(${colorName})` : "";
    })
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Strips [color:...] completely from a name:
 */
export function stripColorTag(rawString = "") {
  if (!rawString) return "";
  return rawString.replace(/\[color:[^\]]+\]/gi, "").replace(/\s+/g, " ").trim();
}

export function formatArchfileName(parentBoxName, archfileName, color) {
  const base = parentBoxName ? `${parentBoxName} / ${archfileName}` : archfileName;
  if (color && color.trim() && color.trim() !== "#6B1D2A") {
    return `${base} [color:${color.trim()}]`;
  }
  return base;
}
