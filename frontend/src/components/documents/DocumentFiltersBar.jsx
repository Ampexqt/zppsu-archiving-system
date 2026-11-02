import React from "react";
import { Search, SearchCheck, FilterX, Trash2, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ShadcnSelect from "@/components/ui/ShadcnSelect";

/**
 * DocumentFiltersBar
 * Search bar with standard/semantic AI toggle, dropdown filters, clear, and trash toggle.
 */
export default function DocumentFiltersBar({
  search,
  setSearch,
  searchMode,
  setSearchMode,
  onAISearch,
  selectedStorageFilter,
  setSelectedStorageFilter,
  unassignedStorageCount = 0,
  selectedStatus,
  setSelectedStatus,
  selectedYear,
  setSelectedYear,
  hasActiveFilters,
  onClearFilters,
  showTrash,
  setShowTrash,
  trashCount = 0,
  onExport,
  isExporting = false,
}) {
  return (
    <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl">
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          {/* SEARCH INPUT WITH SEMANTIC SEARCH TOGGLE */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5A5C]" />
            <Input
              type="text"
              placeholder={
                searchMode === "ai" 
                  ? "Search records semantically (e.g. 'Memorandum on budget')..." 
                  : "Search document ID, title, type, or department..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchMode === "ai" && onAISearch()}
              className="pl-10 pr-28 h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] placeholder-[#5F5A5C]/60 focus:border-[#6B1D2A]"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const newMode = searchMode === "standard" ? "ai" : "standard";
                setSearchMode(newMode);
                if (newMode === "ai" && search.trim()) onAISearch();
              }}
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 h-7 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                searchMode === "ai" ? "bg-[#C99A2E] text-white" : "text-[#5F5A5C] hover:text-[#1D1A1B]"
              }`}
            >
              <SearchCheck className="w-3.5 h-3.5 mr-1" />
              <span>{searchMode === "ai" ? "Semantic AI" : "Standard"}</span>
            </Button>
          </div>

          {/* FILTER CONTROLS */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* PHYSICAL STORAGE FILTER */}
            <div className="w-full sm:w-44">
              <ShadcnSelect
                value={selectedStorageFilter}
                onChange={setSelectedStorageFilter}
                options={[
                  { value: "", label: "All Storage" },
                  { value: "unassigned", label: `Awaiting Box (${unassignedStorageCount})` },
                  { value: "assigned", label: "Assigned to Box" },
                ]}
                placeholder="All Storage"
                popoverWidth="w-48"
              />
            </div>

            {/* STATUS FILTER */}
            <div className="w-full sm:w-36">
              <ShadcnSelect
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={[
                  { value: "", label: "All Statuses" },
                  { value: "Active", label: "Active" },
                  { value: "Archived", label: "Archived" },
                  { value: "Pending", label: "Pending" },
                ]}
                placeholder="All Statuses"
                popoverWidth="w-40"
              />
            </div>

            {/* YEAR FILTER */}
            <div className="w-full sm:w-32">
              <ShadcnSelect
                value={selectedYear}
                onChange={setSelectedYear}
                options={[
                  { value: "", label: "All Years" },
                  { value: "2026", label: "2026" },
                  { value: "2025", label: "2025" },
                  { value: "2024", label: "2024" },
                  { value: "2023", label: "2023" },
                ]}
                placeholder="All Years"
                popoverWidth="w-36"
              />
            </div>

            {/* RESET ACTIVE FILTERS */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-10 px-2.5 rounded-xl text-xs font-semibold text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] cursor-pointer inline-flex items-center gap-1"
                title="Clear all filters"
              >
                <FilterX className="w-3.5 h-3.5" />
                <span>Clear</span>
              </Button>
            )}

            {/* EXPORT EXCEL CATALOG BUTTON */}
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                disabled={isExporting}
                className="h-10 px-3 rounded-xl text-xs font-bold bg-[#FFFCF7] text-[#6B1D2A] border-[#6B1D2A]/30 hover:bg-[#F4E7EA] hover:border-[#6B1D2A] cursor-pointer transition-colors inline-flex items-center gap-1.5"
                title="Export catalog records to Excel (.xlsx)"
              >
                <Download className="w-3.5 h-3.5 text-[#6B1D2A]" />
                <span>{isExporting ? "Exporting..." : "Export Catalog"}</span>
              </Button>
            )}

            {/* TRASH VIEW TOGGLE */}
            <Button
              variant={showTrash ? "destructive" : "outline"}
              onClick={() => setShowTrash(!showTrash)}
              className={`h-10 px-3.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                showTrash 
                  ? "bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545]" 
                  : "bg-[#FFFCF7] text-[#1D1A1B] border-[#E8E3E1] hover:bg-[#F4E7EA]"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              <span>{showTrash ? "Viewing Trash" : `Trash (${trashCount})`}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
