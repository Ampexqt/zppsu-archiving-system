import React, { useState, useMemo } from "react";
import { 
  Box, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Layers,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StorageAssignmentsSection({
  records = [],
  inventories = [],
  onAssign,
  isAssigningId = null,
}) {
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // "all" | "unassigned" | "assigned"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Local user selection overrides
  const [selectedCabinets, setSelectedCabinets] = useState({});
  const [selectedBoxes, setSelectedBoxes] = useState({});

  // Filter records based on search and assignment status
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const isAssigned = Boolean(rec.file_box_id || rec.file_box);
      if (filterMode === "unassigned" && isAssigned) return false;
      if (filterMode === "assigned" && !isAssigned) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const docType = (rec.document_type || "").toLowerCase();
      const code = (rec.access_code || "").toLowerCase();
      const title = (rec.title || rec.subject || "").toLowerCase();
      return docType.includes(q) || code.includes(q) || title.includes(q);
    });
  }, [records, search, filterMode]);

  // Counts for quick filter pills
  const totalCount = records.length;
  const unassignedCount = useMemo(() => {
    return records.filter((r) => !r.file_box_id && !r.file_box).length;
  }, [records]);
  const assignedCount = totalCount - unassignedCount;

  // Pagination calculation
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage, itemsPerPage]);

  const handleCabinetChange = (recordId, cabId) => {
    setSelectedCabinets((prev) => ({ ...prev, [recordId]: cabId }));
    setSelectedBoxes((prev) => ({ ...prev, [recordId]: "" }));
  };

  const handleBoxChange = (recordId, boxId) => {
    setSelectedBoxes((prev) => ({ ...prev, [recordId]: boxId }));
  };

  const handleAssignClick = async (recordId, targetBoxId) => {
    if (targetBoxId && onAssign) {
      await onAssign(recordId, targetBoxId);
      setSelectedBoxes((prev) => {
        const next = { ...prev };
        delete next[recordId];
        return next;
      });
      setSelectedCabinets((prev) => {
        const next = { ...prev };
        delete next[recordId];
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col bg-[#FFFCF7]">
      {/* SECTION SUBHEADER & TABLE TOOLBAR */}
      <div className="p-5 sm:p-6 border-b border-[#E8E3E1] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#F4E7EA] text-[#6B1D2A]">
              <Box className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[#1D1A1B]">
              Physical Storage Assignments
            </h2>
            {unassignedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1]">
                {unassignedCount} Unassigned
              </span>
            )}
          </div>
          <p className="text-xs text-[#5F5A5C] mt-1">
            Assign or update physical cabinet and file box containers for all filed documents.
          </p>
        </div>

        {/* SEARCH & QUICK FILTERS */}
        <div className="flex flex-wrap items-center gap-2">
          {/* SEARCH BAR */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5F5A5C]" />
            <Input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 h-9 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
            />
          </div>

          {/* STATUS FILTER PILLS */}
          <div className="inline-flex p-1 bg-[#F4E7EA] rounded-xl border border-[#E8E3E1]">
            <button
              type="button"
              onClick={() => { setFilterMode("all"); setCurrentPage(1); }}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                filterMode === "all"
                  ? "bg-[#6B1D2A] text-[#FFFCF7] shadow-xs"
                  : "text-[#5F5A5C] hover:text-[#1D1A1B]"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => { setFilterMode("unassigned"); setCurrentPage(1); }}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                filterMode === "unassigned"
                  ? "bg-[#6B1D2A] text-[#FFFCF7] shadow-xs"
                  : "text-[#5F5A5C] hover:text-[#1D1A1B]"
              }`}
            >
              <span>Awaiting Box</span>
              {unassignedCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                  filterMode === "unassigned" ? "bg-[#FFFCF7] text-[#6B1D2A]" : "bg-[#6B1D2A] text-[#FFFCF7]"
                }`}>
                  {unassignedCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => { setFilterMode("assigned"); setCurrentPage(1); }}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                filterMode === "assigned"
                  ? "bg-[#6B1D2A] text-[#FFFCF7] shadow-xs"
                  : "text-[#5F5A5C] hover:text-[#1D1A1B]"
              }`}
            >
              Assigned ({assignedCount})
            </button>
          </div>
        </div>
      </div>

      {/* TABLE WORKSPACE */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-[11px] text-[#5F5A5C] uppercase bg-[#F4E7EA]/60 border-b border-[#E8E3E1]">
            <tr>
              <th className="px-5 py-3 font-bold">Document Type</th>
              <th className="px-5 py-3 font-bold">Access Code</th>
              <th className="px-5 py-3 font-bold">Subject / Title</th>
              <th className="px-5 py-3 font-bold">Status</th>
              <th className="px-5 py-3 font-bold min-w-[300px]">Physical Storage Location</th>
              <th className="px-5 py-3 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E3E1]">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record) => {
                const isCurrentlyAssigned = Boolean(record.file_box_id || record.file_box);
                const currentCabId = record.file_box?.cabinet?.id ? String(record.file_box.cabinet.id) : "";
                const currentBoxId = record.file_box_id ? String(record.file_box_id) : "";

                const activeCabId = selectedCabinets[record.id] !== undefined
                  ? selectedCabinets[record.id]
                  : currentCabId;

                const activeBoxId = selectedBoxes[record.id] !== undefined
                  ? selectedBoxes[record.id]
                  : currentBoxId;

                const isPendingThis = isAssigningId === record.id;
                
                // Can submit if:
                // 1) Not currently assigned and user selected a box
                // 2) Currently assigned and user picked a different box
                const isChanged = activeBoxId !== "" && activeBoxId !== currentBoxId;
                const canSubmit = isCurrentlyAssigned ? isChanged : Boolean(activeBoxId);

                return (
                  <tr key={record.id} className="hover:bg-[#F4E7EA]/30 transition-colors">
                    {/* DOCUMENT TYPE */}
                    <td className="px-5 py-3.5 font-bold text-[#6B1D2A] whitespace-nowrap">
                      {record.document_type || "Document"}
                    </td>

                    {/* ACCESS CODE */}
                    <td className="px-5 py-3.5 font-mono text-[#1D1A1B] whitespace-nowrap">
                      {record.access_code && record.access_code !== "N/A" ? (
                        <span className="px-2 py-0.5 rounded bg-[#F4E7EA]/60 border border-[#E8E3E1] text-[11px]">
                          {record.access_code}
                        </span>
                      ) : (
                        <span className="text-[#5F5A5C] italic">—</span>
                      )}
                    </td>

                    {/* SUBJECT / TITLE */}
                    <td className="px-5 py-3.5 font-medium text-[#1D1A1B] max-w-xs truncate" title={record.subject || record.title}>
                      {record.subject || record.title || "Untitled Document"}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block
                        ${record.status === "Active" ? "bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1]" :
                          record.status === "Archived" ? "bg-[#FFFCF7] text-[#5F5A5C] border border-[#E8E3E1]" :
                          "bg-[#F2DFB0] text-[#A87818] border border-[#C99A2E]"}`}
                      >
                        {record.status || "Active"}
                      </span>
                    </td>

                    {/* PHYSICAL STORAGE SELECTION */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-1.5 max-w-sm">
                        {isCurrentlyAssigned && record.file_box ? (
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#6B1D2A]">
                            <CheckCircle2 className="w-3 h-3 text-[#6B1D2A] shrink-0" />
                            <span className="truncate">
                              {record.file_box.cabinet?.name || "Cabinet"} &rarr; {record.file_box.name}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#A87818]">
                            <AlertCircle className="w-3 h-3 text-[#A87818] shrink-0" />
                            <span>Awaiting physical filing</span>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {/* CABINET DROPDOWN */}
                          <select
                            value={activeCabId}
                            onChange={(e) => handleCabinetChange(record.id, e.target.value)}
                            className="h-8 w-1/2 rounded-lg border border-[#E8E3E1] bg-[#FFFCF7] px-2 text-xs font-medium text-[#1D1A1B] focus:ring-1 focus:ring-[#6B1D2A] focus:border-[#6B1D2A]"
                          >
                            <option value="">Select Cabinet</option>
                            {inventories.map((inv) => (
                              <option key={inv.id} value={String(inv.id)}>
                                {inv.name || inv.cabinet_name || `Cabinet ${inv.id}`}
                              </option>
                            ))}
                          </select>

                          {/* FILE BOX DROPDOWN */}
                          <select
                            value={activeBoxId}
                            onChange={(e) => handleBoxChange(record.id, e.target.value)}
                            disabled={!activeCabId}
                            className="h-8 w-1/2 rounded-lg border border-[#E8E3E1] bg-[#FFFCF7] px-2 text-xs font-medium text-[#1D1A1B] focus:ring-1 focus:ring-[#6B1D2A] focus:border-[#6B1D2A] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="">Select Box</option>
                            {inventories
                              .find((inv) => String(inv.id) === String(activeCabId))
                              ?.file_boxes?.map((box) => (
                                <option key={box.id} value={String(box.id)}>
                                  {box.name} ({box.used_space || 0}/{box.capacity || 0})
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </td>

                    {/* ACTION BUTTON */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        onClick={() => handleAssignClick(record.id, activeBoxId)}
                        disabled={!canSubmit || isPendingThis}
                        className={`h-8 px-3 rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-all ${
                          isCurrentlyAssigned
                            ? "bg-[#FFFCF7] text-[#6B1D2A] border border-[#6B1D2A]/30 hover:bg-[#F4E7EA]"
                            : "bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545]"
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        {isPendingThis ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : isCurrentlyAssigned ? (
                          "Reassign"
                        ) : (
                          "Assign"
                        )}
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-5 py-12 text-center text-[#5F5A5C]">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Box className="w-8 h-8 text-[#5F5A5C]/40 stroke-[1.5]" />
                    <p className="font-semibold text-xs text-[#1D1A1B]">No records match your criteria</p>
                    <p className="text-[11px] text-[#5F5A5C]">
                      {search ? "Try adjusting your search terms." : "All registered documents are up to date."}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION BAR */}
      <div className="p-4 border-t border-[#E8E3E1] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFFCF7] text-xs text-[#5F5A5C]">
        <span>
          Showing {filteredRecords.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
          {search && ` (filtered from ${totalCount})`}
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="h-8 px-3 text-xs bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" />
            <span>Prev</span>
          </Button>
          <span className="px-2 font-bold text-[#1D1A1B]">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="h-8 px-3 text-xs bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
