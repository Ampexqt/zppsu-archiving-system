/**
 * storageTaxonomy.js
 * Physical storage classifications for ZPPSU Archiving System.
 * Supports Cabinet, Steel Cabinet, Shelves, File Box, and Archfile (Blue).
 */

export const STORAGE_UNIT_TYPES = [
  {
    id: "cabinet",
    label: "Cabinet",
    fullTitle: "Filing Cabinet",
    description: "Standard office filing cabinet for categorized records",
    badgeBg: "bg-[#F4E7EA]",
    badgeText: "text-[#6B1D2A]",
  },
  {
    id: "steel_cabinet",
    label: "Steel Cabinet",
    fullTitle: "Steel Archive Cabinet",
    description: "Heavy-duty fireproof institutional steel storage cabinet",
    badgeBg: "bg-[#F2DFB0]",
    badgeText: "text-[#A87818]",
  },
  {
    id: "shelves",
    label: "Shelves",
    fullTitle: "Open Shelving Rack",
    description: "Open storage shelves and archive rack partitions",
    badgeBg: "bg-[#FFFCF7]",
    badgeText: "text-[#5F5A5C]",
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
  },
  {
    id: "archfile",
    label: "Archfile",
    fullTitle: "Lever-Arch Binder / Archfile",
    description: "Classic blue ring binder folder for active record management",
    badgeBg: "bg-[#DBEAFE]",
    badgeText: "text-[#1E40AF]",
    borderColor: "border-[#BFDBFE]",
    iconColor: "text-[#2563EB]",
  },
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
 * Parses a container name into hierarchical levels:
 * e.g. "Box 01 / Archfile HR-2024" -> { isArchfile: true, parentBoxName: "Box 01", archfileName: "Archfile HR-2024" }
 * e.g. "Box 01" -> { isArchfile: false, boxName: "Box 01" }
 */
export function parseBoxHierarchy(rawName = "") {
  if (!rawName) return { isArchfile: false, boxName: "Unnamed" };

  if (rawName.includes(" / ")) {
    const parts = rawName.split(" / ");
    return {
      isArchfile: true,
      parentBoxName: parts[0].trim(),
      archfileName: parts.slice(1).join(" / ").trim(),
    };
  }

  const lower = rawName.toLowerCase();
  if (lower.startsWith("archfile") || lower.startsWith("binder")) {
    return {
      isArchfile: true,
      parentBoxName: null,
      archfileName: rawName,
    };
  }

  return {
    isArchfile: false,
    boxName: rawName,
  };
}

export function formatArchfileName(parentBoxName, archfileName) {
  if (!parentBoxName) return archfileName;
  return `${parentBoxName} / ${archfileName}`;
}
