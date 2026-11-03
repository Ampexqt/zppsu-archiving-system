import React, { useState, useMemo } from "react";
import { Box, FolderClosed, FolderArchive, CheckCircle2, RotateCcw, Layers } from "lucide-react";
import ShadcnSelect from "@/components/ui/ShadcnSelect";
import {
  detectUnitType,
  detectMainCategory,
  detectContainerType,
  parseBoxHierarchy,
} from "../inventory/storageTaxonomy";

/**
 * PhysicalStoragePlacementCard
 * Reusable physical storage placement selector aligned with the 2-Main-Category architecture:
 * 1. Cabinet (Main category): Steel Cabinet, File Box, Archfile
 * 2. Shelves (Separate main category): File Box, Archfile
 * Includes customizable toggle to enable/disable Archfile placement when filing directly.
 */
export default function PhysicalStoragePlacementCard({
  selectedCabinetId,
  onCabinetChange,
  selectedBoxId,
  onBoxChange,
  cabinets = [],
  className = "",
}) {
  // Toggle: whether filing utilizes an Archfile binder or direct box/shelf placement
  const [archfileEnabled, setArchfileEnabled] = useState(true);

  // Quick filter toggle: "all" | "box" | "archfile"
  const [containerFilter, setContainerFilter] = useState("all");

  // Selected Cabinet object
  const activeCabinet = useMemo(() => {
    if (!selectedCabinetId) return null;
    return cabinets.find((c) => String(c.id) === String(selectedCabinetId)) || null;
  }, [cabinets, selectedCabinetId]);

  // Selected Box object
  const activeBox = useMemo(() => {
    if (!selectedBoxId || !activeCabinet) return null;
    return (
      (activeCabinet.file_boxes || []).find(
        (b) => String(b.id) === String(selectedBoxId)
      ) || null
    );
  }, [activeCabinet, selectedBoxId]);

  // Cabinet Dropdown Options grouped with Main Category tags
  const cabinetOptions = useMemo(() => {
    return cabinets.map((cab) => {
      const typeInfo = detectUnitType(cab.name);
      const mainCat = detectMainCategory(cab.name);
      const categoryPrefix = mainCat === "shelves" ? "[2. Shelves]" : "[1. Cabinet]";
      const boxCount = cab.file_boxes?.length || 0;
      return {
        value: String(cab.id),
        label: `${categoryPrefix} ${cab.name}`,
        subtitle: `${typeInfo.label} • ${boxCount} containers`,
      };
    });
  }, [cabinets]);

  // Containers filtered by user's toggle and filter preferences
  const rawBoxes = activeCabinet?.file_boxes || [];
  const filteredBoxes = useMemo(() => {
    let list = rawBoxes;

    // If Archfile placement is toggled OFF, strictly exclude archfile binders
    if (!archfileEnabled) {
      list = list.filter((b) => detectContainerType(b.name).id !== "archfile");
    }

    if (containerFilter === "archfile" && archfileEnabled) {
      return list.filter((b) => detectContainerType(b.name).id === "archfile");
    }
    if (containerFilter === "box") {
      return list.filter((b) => detectContainerType(b.name).id === "file_box");
    }
    return list;
  }, [rawBoxes, containerFilter, archfileEnabled]);

  const boxOptions = useMemo(() => {
    return filteredBoxes.map((box) => {
      const parsed = parseBoxHierarchy(box.name);
      const isArch = parsed.isArchfile;
      return {
        value: String(box.id),
        label: isArch ? `${parsed.archfileName} (Archfile)` : box.name,
        subtitle: isArch
          ? parsed.parentBoxName
            ? `Archfile Binder • Inside ${parsed.parentBoxName}`
            : `Direct Archfile Binder • ${activeCabinet?.name}`
          : `File Box • (${box.used_space || 0}/${box.capacity || 0})`,
      };
    });
  }, [filteredBoxes, activeCabinet]);

  // Counts for toggle pills
  const archfileCount = rawBoxes.filter(
    (b) => detectContainerType(b.name).id === "archfile"
  ).length;
  const boxCount = rawBoxes.filter(
    (b) => detectContainerType(b.name).id === "file_box"
  ).length;

  // Format breadcrumb text for active location
  const locationPath = useMemo(() => {
    if (!activeCabinet) return null;
    const catPrefix = detectMainCategory(activeCabinet.name) === "shelves" ? "Shelves" : "Cabinet";
    if (!activeBox) return `${catPrefix}: ${activeCabinet.name} (Direct Unit Filing)`;
    const parsed = parseBoxHierarchy(activeBox.name);
    if (parsed.isArchfile) {
      return parsed.parentBoxName
        ? `${activeCabinet.name} → ${parsed.parentBoxName} → ${parsed.archfileName}`
        : `${activeCabinet.name} → ${parsed.archfileName} (Direct Archfile)`;
    }
    return `${activeCabinet.name} → ${activeBox.name}`;
  }, [activeCabinet, activeBox]);

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border border-[#E8E3E1] bg-[#FCFAF8] space-y-4 ${className}`}>
      {/* HEADER & LOCATION TRACKER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E3E1] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1]">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider">
              Physical Storage Placement (Optional)
            </h4>
            <p className="text-[11px] text-[#5F5A5C]">
              File documents into Cabinet or Shelves, with optional File Box or colored Archfile
            </p>
          </div>
        </div>

        {/* LIVE LOCATION BREADCRUMB BADGE */}
        {activeCabinet && activeBox ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1] self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#6B1D2A]" />
            <span className="truncate max-w-[280px]">
              {locationPath}
            </span>
          </div>
        ) : activeCabinet ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#F2DFB0] text-[#A87818] border border-[#C99A2E]/40 self-start sm:self-auto">
            <span>{activeCabinet.name} (Direct Unit Filing)</span>
          </div>
        ) : (
          <span className="text-[10px] font-semibold text-[#5F5A5C] bg-[#FFFCF7] px-2.5 py-0.5 rounded-full border border-[#E8E3E1] self-start sm:self-auto">
            Digital-Only (Unassigned)
          </span>
        )}
      </div>

      {/* SELECTORS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* 1. STORAGE UNIT (CABINET OR SHELVES) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#5F5A5C] flex items-center justify-between">
            <span className="flex items-center gap-1">
              <FolderArchive className="w-3.5 h-3.5 text-[#6B1D2A]" />
              1. Storage Unit (Cabinet or Shelves)
            </span>
            {activeCabinet && (
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${detectUnitType(activeCabinet.name).badgeBg} ${detectUnitType(activeCabinet.name).badgeText}`}>
                {detectUnitType(activeCabinet.name).label}
              </span>
            )}
          </label>
          <ShadcnSelect
            value={selectedCabinetId}
            onChange={(val) => {
              onCabinetChange(val);
              onBoxChange("");
            }}
            options={cabinetOptions}
            searchable={true}
            searchPlaceholder="Search cabinets, steel units, shelves..."
            placeholder="Select Storage Unit (Optional)"
            allowClear={true}
            clearLabel="No Storage Unit (Unassigned)"
            popoverWidth="w-full sm:w-80"
          />
        </div>

        {/* 2. CONTAINER PLACEMENT (BOX OR ARCHFILE) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#5F5A5C] flex items-center justify-between">
            <span className="flex items-center gap-1">
              <FolderClosed className="w-3.5 h-3.5 text-[#6B1D2A]" />
              2. Container (File Box or Archfile)
            </span>
            {activeBox && (
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${detectContainerType(activeBox.name).badgeBg} ${detectContainerType(activeBox.name).badgeText}`}>
                {detectContainerType(activeBox.name).label}
              </span>
            )}
          </label>
          <ShadcnSelect
            value={selectedBoxId}
            onChange={(val) => onBoxChange(val)}
            disabled={!selectedCabinetId || boxOptions.length === 0}
            options={boxOptions}
            searchable={true}
            searchPlaceholder="Search box or archfile..."
            placeholder={
              !selectedCabinetId
                ? "Select a storage unit first"
                : boxOptions.length === 0
                ? "No containers matching current filter"
                : "Select File Box or Archfile (Optional)"
            }
            allowClear={true}
            clearLabel="No Container (Direct Unit Placement)"
            popoverWidth="w-full sm:w-80"
          />
        </div>
      </div>

      {/* ARCHFILE CUSTOMIZATION TOGGLE & CLEAR BUTTON */}
      {activeCabinet && (
        <div className="pt-2 border-t border-[#E8E3E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={archfileEnabled}
              onChange={(e) => {
                const nextChecked = e.target.checked;
                setArchfileEnabled(nextChecked);
                if (!nextChecked && activeBox && detectContainerType(activeBox.name).id === "archfile") {
                  onBoxChange("");
                }
              }}
              className="w-4 h-4 rounded border-[#E8E3E1] text-[#6B1D2A] focus:ring-[#6B1D2A] accent-[#6B1D2A] cursor-pointer"
            />
            <span className="text-[11px] font-medium text-[#1D1A1B]">
              Allow filing inside an <strong>Archfile Binder</strong>
            </span>
            <span className="text-[10px] text-[#5F5A5C]">
              (Uncheck if filing directly into a File Box or on a Shelf)
            </span>
          </label>

          {(selectedCabinetId || selectedBoxId) && (
            <button
              type="button"
              onClick={() => {
                onCabinetChange("");
                onBoxChange("");
              }}
              className="text-[11px] text-[#5F5A5C] hover:text-[#6B1D2A] flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Placement</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
