import React, { useMemo } from "react";
import { 
  Archive, 
  Box, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  FolderClosed,
  FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import ShadcnSelect from "@/components/ui/ShadcnSelect";
import { 
  parseBoxHierarchy, 
  getColorNameFromHex, 
  stripColorTag 
} from "../inventory/storageTaxonomy";

/**
 * StorageDropdownSelect
 * User-friendly cascading dropdown selector for physical Cabinet, File Box, and Archfile placement.
 * Parses nested archfile hierarchies, renders visual color indicators (no raw hex codes),
 * and provides clear physical location assurances.
 */
export default function StorageDropdownSelect({
  selectedCabinetId,
  onCabinetChange,
  selectedBoxId,
  onBoxChange,
  cabinets = [],
  className = "",
  error = null,
}) {
  // Find active cabinet object
  const activeCabinet = useMemo(() => {
    if (!selectedCabinetId) return null;
    return cabinets.find((c) => String(c.id) === String(selectedCabinetId)) || null;
  }, [cabinets, selectedCabinetId]);

  // Find active file box object
  const activeBox = useMemo(() => {
    if (!selectedBoxId || !activeCabinet) return null;
    return (
      (activeCabinet.file_boxes || []).find(
        (b) => String(b.id) === String(selectedBoxId)
      ) || null
    );
  }, [activeCabinet, selectedBoxId]);

  // Parsed hierarchy of active selected container
  const activeParsed = useMemo(() => {
    if (!activeBox) return null;
    return parseBoxHierarchy(activeBox.name);
  }, [activeBox]);

  // Cabinet Options for Dropdown
  const cabinetOptions = useMemo(() => {
    return cabinets.map((cab) => {
      const boxCount = cab.file_boxes?.length || 0;
      const cleanName = cab.name.replace(/\[steel\]/gi, "").trim();
      const isSteel = cab.name.toLowerCase().includes("steel");
      const isShelf = cab.name.toLowerCase().includes("shelv") || cab.name.toLowerCase().includes("rack");
      const badgeType = isSteel ? "Steel Cabinet" : isShelf ? "Shelves" : "Cabinet";

      return {
        value: String(cab.id),
        label: cleanName,
        subtitle: `${boxCount}/${cab.capacity || "N/A"} containers • ${cab.status || "Available"}`,
        badge: badgeType,
        searchKey: `${cleanName} ${badgeType} ${cab.status || ""}`,
      };
    });
  }, [cabinets]);

  // File Box & Archfile Options for Dropdown (Filtered by active cabinet)
  const fileBoxOptions = useMemo(() => {
    if (!activeCabinet) return [];

    return (activeCabinet.file_boxes || []).map((box) => {
      const isFull = (box.used_space || 0) >= (box.capacity || 1);
      const occupancyLabel = `${box.used_space || 0}/${box.capacity || 0} files`;
      const parsed = parseBoxHierarchy(box.name);

      if (parsed.isArchfile) {
        const colorTitle = parsed.colorName ? `${parsed.colorName} Binder` : "Archfile Binder";
        const locationContext = parsed.parentBoxName 
          ? `Inside ${parsed.parentBoxName}` 
          : "Direct Shelf Binder";

        return {
          value: String(box.id),
          label: parsed.parentBoxName 
            ? `${parsed.parentBoxName} → ${parsed.archfileName}` 
            : parsed.archfileName,
          subtitle: `${locationContext} • ${colorTitle} (${occupancyLabel})`,
          color: parsed.color,
          badge: "Archfile Binder",
          disabled: isFull,
          searchKey: `${parsed.parentBoxName || ""} ${parsed.archfileName} ${parsed.colorName || ""}`,
        };
      } else {
        return {
          value: String(box.id),
          label: parsed.boxName,
          subtitle: `Direct File Box (${occupancyLabel})`,
          badge: "File Box",
          disabled: isFull,
          searchKey: parsed.boxName,
        };
      }
    });
  }, [activeCabinet]);

  const handleCabinetSelect = (cabId) => {
    onCabinetChange(cabId);
    // Reset file box when cabinet changes
    onBoxChange("");
  };

  const isBoxFull = activeBox && (activeBox.used_space || 0) >= (activeBox.capacity || 1);

  return (
    <div className={cn("p-4 rounded-2xl bg-[#FFFCF7] border border-[#E8E3E1] space-y-4 shadow-2xs", className)}>
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center text-[#6B1D2A]">
            <Archive className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wide">
              Physical Storage Placement <span className="text-[#6B1D2A]">*</span>
            </h4>
            <p className="text-[10px] text-[#5F5A5C]">
              Specify physical placement: Direct File Box or Color-Coded Archfile Binder.
            </p>
          </div>
        </div>

        {activeCabinet && activeBox && !isBoxFull && (
          <span className="text-[10px] font-bold text-[#6B1D2A] bg-[#F4E7EA] px-2 py-0.5 rounded-md inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#6B1D2A]" /> Space Confirmed
          </span>
        )}
      </div>

      {/* CASCADING DROPDOWNS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 1. CABINET SELECT */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#5F5A5C] uppercase flex items-center gap-1">
            <Archive className="w-3 h-3 text-[#6B1D2A]" /> 1. Select Cabinet / Storage Unit
          </label>
          <ShadcnSelect
            value={selectedCabinetId ? String(selectedCabinetId) : ""}
            onChange={handleCabinetSelect}
            options={cabinetOptions}
            placeholder="Choose Cabinet..."
            className="h-10 text-xs"
            popoverWidth="w-72 sm:w-80"
            searchable={true}
            searchPlaceholder="Search cabinet or storage unit..."
          />
        </div>

        {/* 2. FILE BOX & ARCHFILE SELECT */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#5F5A5C] uppercase flex items-center gap-1">
            <Box className="w-3 h-3 text-[#6B1D2A]" /> 2. Select Container / Archfile Binder
          </label>
          <ShadcnSelect
            value={selectedBoxId ? String(selectedBoxId) : ""}
            onChange={onBoxChange}
            options={fileBoxOptions}
            placeholder={!selectedCabinetId ? "Select cabinet first..." : "Choose Box or Archfile..."}
            disabled={!selectedCabinetId || fileBoxOptions.length === 0}
            className="h-10 text-xs"
            popoverWidth="w-80 sm:w-96"
            searchable={true}
            searchPlaceholder="Search box, archfile name, or color..."
          />
        </div>
      </div>

      {/* DETAILED USER-FRIENDLY LOCATION CONFIRMATION & ASSURANCE */}
      {activeCabinet && activeBox && activeParsed && (
        <div className={cn(
          "p-3 rounded-xl border text-xs space-y-2 transition-all",
          isBoxFull 
            ? "bg-red-50 border-red-200 text-red-800" 
            : "bg-[#F4E7EA]/40 border-[#E8E3E1] text-[#1D1A1B]"
        )}>
          {/* HIERARCHICAL BREADCRUMB */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E3E1]/80 pb-2">
            <div className="flex flex-wrap items-center gap-1.5 font-bold">
              <span className="text-[11px] text-[#5F5A5C] font-semibold uppercase mr-1">
                Target Location:
              </span>

              {/* 1. Cabinet Level */}
              <span className="inline-flex items-center gap-1 text-[#1D1A1B] bg-[#FFFCF7] px-2 py-0.5 rounded-md border border-[#E8E3E1]">
                <Archive className="w-3 h-3 text-[#6B1D2A]" />
                <span>{activeCabinet.name}</span>
              </span>

              {/* 2. Parent Box Level (if archfile is inside a box) */}
              {activeParsed.isArchfile && activeParsed.parentBoxName && (
                <>
                  <ChevronRight className="w-3 h-3 text-[#5F5A5C]" />
                  <span className="inline-flex items-center gap-1 text-[#1D1A1B] bg-[#FFFCF7] px-2 py-0.5 rounded-md border border-[#E8E3E1]">
                    <Box className="w-3 h-3 text-[#6B1D2A]" />
                    <span>{activeParsed.parentBoxName}</span>
                  </span>
                </>
              )}

              {/* 3. Final Container Level */}
              <ChevronRight className="w-3 h-3 text-[#5F5A5C]" />
              {activeParsed.isArchfile ? (
                <span className="inline-flex items-center gap-1.5 bg-[#FFFCF7] px-2.5 py-0.5 rounded-md border border-[#E8E3E1] text-[#6B1D2A]">
                  <span 
                    className="w-2.5 h-2.5 rounded-full border border-black/15 shadow-2xs inline-block shrink-0" 
                    style={{ backgroundColor: activeParsed.color }} 
                  />
                  <span>{activeParsed.archfileName}</span>
                  <span className="text-[10px] text-[#5F5A5C] font-normal">
                    ({activeParsed.colorName || "Archfile Binder"})
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[#6B1D2A] bg-[#FFFCF7] px-2 py-0.5 rounded-md border border-[#E8E3E1]">
                  <Box className="w-3 h-3 text-[#6B1D2A]" />
                  <span>{activeParsed.boxName}</span>
                </span>
              )}
            </div>

            {/* OCCUPANCY COUNTER */}
            <div className="text-[11px] font-bold shrink-0">
              {isBoxFull ? (
                <span className="text-red-700 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Box Full ({activeBox.used_space}/{activeBox.capacity})
                </span>
              ) : (
                <span className="text-[#5F5A5C]">
                  {activeBox.used_space || 0} / {activeBox.capacity || 0} files filed
                </span>
              )}
            </div>
          </div>

          {/* EXPLICIT PHYSICAL PLACEMENT ASSURANCE NOTE */}
          <div className="flex items-start gap-2 pt-0.5 text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-[#6B1D2A] shrink-0 mt-0.5" />
            <p className="text-[#5F5A5C] leading-relaxed">
              <strong className="text-[#1D1A1B]">Physical Location Assured: </strong>
              {activeParsed.isArchfile ? (
                activeParsed.parentBoxName ? (
                  <>
                    This document will be filed inside the color-coded binder <strong className="text-[#6B1D2A]">{activeParsed.archfileName}</strong> ({activeParsed.colorName || "Archfile"}), which is housed within <strong className="text-[#1D1A1B]">{activeParsed.parentBoxName}</strong> of <strong className="text-[#1D1A1B]">{activeCabinet.name}</strong>.
                  </>
                ) : (
                  <>
                    This document will be placed directly into the <strong className="text-[#6B1D2A]">{activeParsed.archfileName}</strong> ({activeParsed.colorName || "Archfile"}) binder inside <strong className="text-[#1D1A1B]">{activeCabinet.name}</strong>.
                  </>
                )
              ) : (
                <>
                  This document will be placed directly into storage box <strong className="text-[#1D1A1B]">{activeParsed.boxName}</strong> inside <strong className="text-[#1D1A1B]">{activeCabinet.name}</strong>.
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* ERROR MESSAGE IF ATTEMPTED WITHOUT PLACEMENT */}
      {error && (
        <p className="text-[11px] font-semibold text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
