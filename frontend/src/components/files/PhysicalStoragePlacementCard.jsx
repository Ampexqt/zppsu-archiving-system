import React, { useState, useMemo } from "react";
import { Box, Layers, BookOpen, Archive, CheckCircle2, RotateCcw } from "lucide-react";
import ShadcnSelect from "@/components/ui/ShadcnSelect";
import { detectUnitType, detectContainerType, parseBoxHierarchy } from "../inventory/storageTaxonomy";

/**
 * PhysicalStoragePlacementCard
 * Reusable, customizable physical storage placement selector.
 * Supports Cabinet, Steel Cabinet, Shelves, Archfiles (Blue), and File Boxes
 * with container type toggles and live breadcrumb location tracking.
 */
export default function PhysicalStoragePlacementCard({
  selectedCabinetId,
  onCabinetChange,
  selectedBoxId,
  onBoxChange,
  cabinets = [],
  className = "",
}) {
  // Placement type filter toggle: "all" | "box" | "archfile"
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

  // Cabinet Dropdown Options
  const cabinetOptions = useMemo(() => {
    return cabinets.map((cab) => {
      const typeInfo = detectUnitType(cab.name);
      const boxCount = cab.file_boxes?.length || 0;
      return {
        value: String(cab.id),
        label: cab.name,
        subtitle: `${typeInfo.label} • ${boxCount} containers`,
      };
    });
  }, [cabinets]);

  // Containers filtered by user's toggle preference
  const rawBoxes = activeCabinet?.file_boxes || [];
  const filteredBoxes = useMemo(() => {
    if (containerFilter === "all") return rawBoxes;
    if (containerFilter === "archfile") {
      return rawBoxes.filter((b) => detectContainerType(b.name).id === "archfile");
    }
    if (containerFilter === "box") {
      return rawBoxes.filter((b) => detectContainerType(b.name).id === "file_box");
    }
    return rawBoxes;
  }, [rawBoxes, containerFilter]);

  const boxOptions = useMemo(() => {
    return filteredBoxes.map((box) => {
      const parsed = parseBoxHierarchy(box.name);
      const isArch = parsed.isArchfile;
      return {
        value: String(box.id),
        label: isArch ? `${parsed.archfileName} (Archfile)` : box.name,
        subtitle: isArch
          ? `Blue Archfile • Inside ${parsed.parentBoxName || "Box"}`
          : `File Box • (${box.used_space || 0}/${box.capacity || 0})`,
      };
    });
  }, [filteredBoxes]);

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
    if (!activeBox) return `${activeCabinet.name} (Select Container)`;
    const parsed = parseBoxHierarchy(activeBox.name);
    if (parsed.isArchfile) {
      return `${activeCabinet.name} → ${parsed.parentBoxName || "Box"} → ${parsed.archfileName}`;
    }
    return `${activeCabinet.name} → ${activeBox.name}`;
  }, [activeCabinet, activeBox]);

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border border-[#E8E3E1] bg-[#FCFAF8] space-y-3.5 ${className}`}>
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
              Specify cabinet, file box, or blue archfile binder for physical paper copy tracking
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
            <span>{activeCabinet.name} (Select Container)</span>
          </div>
        ) : (
          <span className="text-[10px] font-semibold text-[#5F5A5C] bg-[#FFFCF7] px-2.5 py-0.5 rounded-full border border-[#E8E3E1] self-start sm:self-auto">
            Digital-Only (Unassigned)
          </span>
        )}
      </div>

      {/* CONTAINER TYPE TOGGLE (IF CABINET HAS MULTIPLE TYPES) */}
      {activeCabinet && rawBoxes.length > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#5F5A5C] uppercase tracking-wider">
              Placement Filter:
            </span>
            <div className="inline-flex p-0.5 bg-[#FFFCF7] rounded-lg border border-[#E8E3E1]">
              <button
                type="button"
                onClick={() => setContainerFilter("all")}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  containerFilter === "all"
                    ? "bg-[#6B1D2A] text-[#FFFCF7]"
                    : "text-[#5F5A5C] hover:text-[#1D1A1B]"
                }`}
              >
                All ({rawBoxes.length})
              </button>
              <button
                type="button"
                onClick={() => setContainerFilter("box")}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  containerFilter === "box"
                    ? "bg-[#6B1D2A] text-[#FFFCF7]"
                    : "text-[#5F5A5C] hover:text-[#1D1A1B]"
                }`}
              >
                File Boxes ({boxCount})
              </button>
              <button
                type="button"
                onClick={() => setContainerFilter("archfile")}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  containerFilter === "archfile"
                    ? "bg-[#1E40AF] text-[#FFFCF7]"
                    : "text-[#1E40AF] hover:bg-[#DBEAFE]"
                }`}
              >
                Archfiles (Blue) ({archfileCount})
              </button>
            </div>
          </div>

          {(selectedCabinetId || selectedBoxId) && (
            <button
              type="button"
              onClick={() => {
                onCabinetChange("");
                onBoxChange("");
              }}
              className="text-[11px] text-[#5F5A5C] hover:text-[#6B1D2A] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Placement</span>
            </button>
          )}
        </div>
      )}

      {/* SELECTORS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* 1. CABINET / STEEL UNIT / SHELVES */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#5F5A5C] flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Archive className="w-3.5 h-3.5 text-[#6B1D2A]" />
              Cabinet / Storage Unit
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
            searchPlaceholder="Search cabinets, shelves, steel units..."
            placeholder="Select Storage Unit (Optional)"
            allowClear={true}
            clearLabel="No Storage Unit (Unassigned)"
            popoverWidth="w-full sm:w-72"
          />
        </div>

        {/* 2. FILE BOX / ARCHFILE */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#5F5A5C] flex items-center justify-between">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#1E40AF]" />
              File Box / Archfile Binder
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
            searchPlaceholder="Search box code or archfile..."
            placeholder={
              !selectedCabinetId
                ? "Select a cabinet first"
                : boxOptions.length === 0
                ? "No matching containers in this unit"
                : "Select File Box or Archfile (Optional)"
            }
            allowClear={true}
            clearLabel="No Container (Unassigned)"
            popoverWidth="w-full sm:w-72"
          />
        </div>
      </div>
    </div>
  );
}
