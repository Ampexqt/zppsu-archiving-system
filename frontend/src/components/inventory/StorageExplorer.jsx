import React, { useState, useMemo } from "react";
import {
  Archive,
  Box,
  FolderClosed,
  ChevronRight,
  FolderArchive,
  Layers,
  FileBox,
  Search,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CabinetFolderCard from "./CabinetFolderCard";
import CabinetBoxesView from "./CabinetBoxesView";
import FileBoxContentView from "./FileBoxContentView";
import ArchfileRecordsView from "./ArchfileRecordsView";
import {
  detectUnitType,
  detectMainCategory,
  parseBoxHierarchy,
  STORAGE_UNIT_TYPES,
} from "./storageTaxonomy";

/**
 * StorageExplorer
 * Unified multi-level physical storage explorer (no tabs!).
 * Workflow: Storage Archive -> Cabinet -> File Box -> Archfile (Blue) -> Files
 * With clickable breadcrumb tracking and context-aware "+ Add" actions.
 */
export default function StorageExplorer({
  cabinets = [],
  fileBoxes = [],
  isAdmin = false,
  onOpenCreateUnit,
  onOpenCreateBox,
  onOpenCreateArchfile,
  onEditUnit,
  onDeleteUnit,
  onEditContainer,
  onDeleteContainer,
  onViewFile,
}) {
  // Navigation State
  const [selectedCabinetId, setSelectedCabinetId] = useState(null);
  const [selectedBoxName, setSelectedBoxName] = useState(null);
  const [selectedArchfile, setSelectedArchfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [unitTypeFilter, setUnitTypeFilter] = useState("all");

  // Active Cabinet
  const currentCabinet = useMemo(() => {
    if (!selectedCabinetId) return null;
    return cabinets.find((c) => String(c.id) === String(selectedCabinetId)) || null;
  }, [cabinets, selectedCabinetId]);

  // Containers belonging to current cabinet
  const cabinetContainers = useMemo(() => {
    if (!currentCabinet) return [];
    return fileBoxes.filter((b) => String(b.cabinet_id) === String(currentCabinet.id));
  }, [currentCabinet, fileBoxes]);

  // Distinct Root File Boxes and Direct Archfiles in current cabinet/shelves
  const cabinetStructure = useMemo(() => {
    const boxMap = new Map();
    const directArchfiles = [];

    cabinetContainers.forEach((container) => {
      const parsed = parseBoxHierarchy(container.name);
      if (parsed.isArchfile) {
        if (!parsed.parentBoxName) {
          // Direct Archfile in this cabinet or on shelves!
          directArchfiles.push({
            ...container,
            displayName: parsed.archfileName,
            color: parsed.color,
          });
        } else {
          const parentName = parsed.parentBoxName;
          if (!boxMap.has(parentName)) {
            boxMap.set(parentName, {
              id: `virtual-${parentName}`,
              name: parentName,
              capacity: 100,
              archfiles: [],
              directFiles: [],
            });
          }
          boxMap.get(parentName).archfiles.push({
            ...container,
            displayName: parsed.archfileName,
            color: parsed.color,
          });
        }
      } else {
        const boxName = parsed.boxName;
        if (!boxMap.has(boxName)) {
          boxMap.set(boxName, {
            id: container.id,
            name: boxName,
            capacity: container.capacity || 100,
            archfiles: [],
            directFiles: container.files || [],
            rawBox: container,
          });
        } else {
          const existing = boxMap.get(boxName);
          existing.id = container.id;
          existing.rawBox = container;
          existing.directFiles = container.files || [];
        }
      }
    });

    return {
      boxes: Array.from(boxMap.values()),
      directArchfiles,
    };
  }, [cabinetContainers]);

  // Active Box
  const currentBox = useMemo(() => {
    if (!selectedBoxName) return null;
    return cabinetStructure.boxes.find((b) => b.name === selectedBoxName) || null;
  }, [cabinetStructure, selectedBoxName]);

  // Breadcrumb navigation helpers
  const handleNavRoot = () => {
    setSelectedCabinetId(null);
    setSelectedBoxName(null);
    setSelectedArchfile(null);
    setSearchQuery("");
  };

  const handleNavCabinet = () => {
    setSelectedBoxName(null);
    setSelectedArchfile(null);
    setSearchQuery("");
  };

  const handleNavBox = () => {
    setSelectedArchfile(null);
    setSearchQuery("");
  };

  return (
    <div className="space-y-4">
      {/* ============================================================== */}
      {/* 1. TOP BREADCRUMB EXPLORER PATH TRACKER                        */}
      {/* ============================================================== */}
      <div className="bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* BREADCRUMB PATH */}
        <div
          data-testid="storage-breadcrumb"
          aria-label="Storage Breadcrumb"
          className="flex items-center gap-1.5 text-xs font-semibold overflow-x-auto py-0.5"
        >
          {/* ROOT SEGMENT */}
          <button
            onClick={handleNavRoot}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              !selectedCabinetId
                ? "bg-[#6B1D2A] text-[#FFFCF7] font-bold shadow-xs"
                : "text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA]"
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Storage Archive</span>
          </button>

          {/* CABINET SEGMENT */}
          {currentCabinet && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#5F5A5C] shrink-0" />
              <button
                onClick={handleNavCabinet}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  !selectedBoxName
                    ? "bg-[#6B1D2A] text-[#FFFCF7] font-bold shadow-xs"
                    : "text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA]"
                }`}
              >
                {detectUnitType(currentCabinet.name).id === "steel_cabinet" ? (
                  <FolderArchive className="w-3.5 h-3.5" />
                ) : detectUnitType(currentCabinet.name).id === "shelves" ? (
                  <Layers className="w-3.5 h-3.5" />
                ) : (
                  <FileBox className="w-3.5 h-3.5" />
                )}
                <span className="truncate max-w-[160px]">{currentCabinet.name}</span>
              </button>
            </>
          )}

          {/* FILE BOX SEGMENT */}
          {currentBox && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#5F5A5C] shrink-0" />
              <button
                onClick={handleNavBox}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  !selectedArchfile
                    ? "bg-[#6B1D2A] text-[#FFFCF7] font-bold shadow-xs"
                    : "text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA]"
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span className="truncate max-w-[150px]">{currentBox.name}</span>
              </button>
            </>
          )}

          {/* ARCHFILE SEGMENT (CUSTOM COLOR) */}
          {selectedArchfile && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#5F5A5C] shrink-0" />
              <div
                style={{ backgroundColor: selectedArchfile.color || "#6B1D2A" }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[#FFFCF7] font-bold shadow-xs transition-colors"
              >
                <FolderClosed className="w-3.5 h-3.5" />
                <span className="truncate max-w-[160px]">
                  {selectedArchfile.displayName || selectedArchfile.name}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. DYNAMIC VIEW BASED ON DRILL-DOWN DEPTH                     */}
      {/* ============================================================== */}
      {selectedArchfile ? (
        /* LEVEL 3: INSIDE AN ARCHFILE (RECORDS LIST) */
        <ArchfileRecordsView
          archfile={selectedArchfile}
          cabinetName={currentCabinet?.name}
          boxName={currentBox?.name}
          onBack={handleNavBox}
          onViewFile={onViewFile}
        />
      ) : selectedBoxName ? (
        /* LEVEL 2: INSIDE A FILE BOX (ARCHFILES & DIRECT FILES) */
        <FileBoxContentView
          cabinet={currentCabinet}
          box={currentBox}
          archfiles={currentBox?.archfiles || []}
          directFiles={currentBox?.directFiles || []}
          isAdmin={isAdmin}
          onBack={handleNavCabinet}
          onOpenCreateArchfile={onOpenCreateArchfile}
          onSelectArchfile={(arch) => setSelectedArchfile(arch)}
          onEditContainer={onEditContainer}
          onDeleteContainer={onDeleteContainer}
          onViewFile={onViewFile}
        />
      ) : selectedCabinetId ? (
        /* LEVEL 1: INSIDE A CABINET / SHELVES UNIT */
        <CabinetBoxesView
          cabinet={currentCabinet}
          boxes={cabinetStructure.boxes}
          directArchfiles={cabinetStructure.directArchfiles}
          isAdmin={isAdmin}
          onBack={handleNavRoot}
          onOpenCreateBox={onOpenCreateBox}
          onOpenCreateArchfile={onOpenCreateArchfile}
          onSelectBox={(boxName) => setSelectedBoxName(boxName)}
          onSelectArchfile={(arch) => setSelectedArchfile(arch)}
          onEditContainer={onEditContainer}
          onDeleteContainer={onDeleteContainer}
        />
      ) : (
        /* LEVEL 0: ROOT STORAGE ARCHIVE (CABINETS) */
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* SEARCH & EQUIPMENT FILTER */}
          <div className="bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5F5A5C]" />
              <Input
                placeholder="Search storage unit name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-xs rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] focus-visible:ring-[#6B1D2A]"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider mr-1">
                Category:
              </span>
              <button
                onClick={() => setUnitTypeFilter("all")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  unitTypeFilter === "all"
                    ? "bg-[#6B1D2A] text-[#FFFCF7] shadow-xs"
                    : "text-[#5F5A5C] hover:bg-[#F4E7EA]"
                }`}
              >
                All Units ({cabinets.length})
              </button>
              <button
                onClick={() => setUnitTypeFilter("cabinet")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  unitTypeFilter === "cabinet"
                    ? "bg-[#6B1D2A] text-[#FFFCF7] shadow-xs"
                    : "text-[#5F5A5C] hover:bg-[#F4E7EA]"
                }`}
              >
                1. Cabinets ({cabinets.filter((c) => detectMainCategory(c.name) === "cabinet").length})
              </button>
              <button
                onClick={() => setUnitTypeFilter("shelves")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  unitTypeFilter === "shelves"
                    ? "bg-[#6B1D2A] text-[#FFFCF7] shadow-xs"
                    : "text-[#5F5A5C] hover:bg-[#F4E7EA]"
                }`}
              >
                2. Shelves ({cabinets.filter((c) => detectMainCategory(c.name) === "shelves").length})
              </button>
            </div>
          </div>

          {/* STORAGE UNITS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cabinets
              .filter((cab) => {
                if (unitTypeFilter === "cabinet" && detectMainCategory(cab.name) !== "cabinet") return false;
                if (unitTypeFilter === "shelves" && detectMainCategory(cab.name) !== "shelves") return false;
                if (searchQuery.trim() && !cab.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                return true;
              })
              .map((cab) => {
                const containersInCab = fileBoxes.filter((b) => String(b.cabinet_id) === String(cab.id));
                const distinctBoxes = new Set();
                let archfileCount = 0;
                let totalDocs = 0;

                containersInCab.forEach((c) => {
                  totalDocs += c.files?.length || 0;
                  const parsed = parseBoxHierarchy(c.name);
                  if (parsed.isArchfile) {
                    archfileCount++;
                    if (parsed.parentBoxName) distinctBoxes.add(parsed.parentBoxName);
                  } else {
                    distinctBoxes.add(parsed.boxName);
                  }
                });

                return (
                  <CabinetFolderCard
                    key={cab.id}
                    cab={cab}
                    boxesCount={distinctBoxes.size}
                    archfilesCount={archfileCount}
                    totalDocs={totalDocs}
                    isAdmin={isAdmin}
                    onEnter={(cabId) => setSelectedCabinetId(cabId)}
                    onEdit={onEditUnit}
                    onDelete={onDeleteUnit}
                  />
                );
              })}

            {cabinets.length === 0 && (
              <div className="col-span-full py-16 text-center bg-[#FFFCF7] border border-dashed border-[#E8E3E1] rounded-2xl">
                <Archive className="w-12 h-12 mx-auto mb-2 text-[#5F5A5C]/40" />
                <h4 className="font-bold text-sm text-[#1D1A1B]">
                  No Physical Storage Units Configured
                </h4>
                <p className="text-xs text-[#5F5A5C] mt-1 max-w-sm mx-auto">
                  Add your university's filing cabinets, steel archive cabinets, or open shelving units to begin indexing physical records.
                </p>
                {isAdmin && (
                  <Button
                    onClick={onOpenCreateUnit}
                    className="mt-4 h-9 px-4 rounded-xl bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Create First Cabinet</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
