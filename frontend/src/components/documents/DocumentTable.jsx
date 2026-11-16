import React from "react";
import { 
  Eye, 
  Edit, 
  Trash2, 
  ScanText, 
  FileText, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Box 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { parseBoxHierarchy, formatLocationWithColorName } from "../inventory/storageTaxonomy";

/**
 * DocumentTable
 * Modern, responsive documents data table following /ui-ux-pro-max standards.
 * - Sticky right-pinned action column: Actions are ALWAYS in the user's viewport without horizontal scroll.
 * - Responsive column sizing: Fits desktop viewports cleanly with zero overflow.
 * - Interactive row clicking: Tap anywhere on a row to preview the document dossier.
 * - Clean storage taxonomy parsing: Eliminates raw color tags and renders visual swatches.
 */
export default function DocumentTable({
  files = [],
  totalCount = 0,
  showTrash = false,
  isAdmin = false,
  currentUserId,
  onViewFile,
  onEditFile,
  onDeleteFile,
  onRestoreFile,
  onPermanentDeleteFile,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  itemsPerPage = 10,
  hasActiveFilters = false,
  onClearFilters,
}) {
  return (
    <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl overflow-hidden">
      <CardHeader className="border-b border-[#E8E3E1] py-3.5 px-5 sm:px-6 flex flex-row items-center justify-between bg-[#FFFCF7]">
        <div>
          <CardTitle className="text-sm font-bold text-[#1D1A1B]">
            {showTrash ? "Deleted Records Archive" : "Official University Documents"}
          </CardTitle>
          <CardDescription className="text-xs text-[#5F5A5C]">
            {totalCount} records matching current criteria
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto relative scrollbar-thin">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="text-[11px] text-[#5F5A5C] uppercase bg-[#FCFAF8] border-b border-[#E8E3E1]">
              <tr>
                <th className="px-3.5 py-3 font-bold tracking-wider w-[125px] shrink-0">Document ID</th>
                <th className="px-3.5 py-3 font-bold tracking-wider min-w-[170px] max-w-[260px]">Subject / Title</th>
                <th className="px-3.5 py-3 font-bold tracking-wider min-w-[150px] max-w-[210px]">Type &amp; Category</th>
                <th className="px-3.5 py-3 font-bold tracking-wider min-w-[150px] max-w-[190px]">Physical Storage</th>
                <th className="px-3 py-3 font-bold tracking-wider text-center w-[80px] shrink-0">Status</th>
                {/* STICKY ACTIONS HEADER: Permanently visible in user's direct POV */}
                <th className="px-3.5 py-3 font-bold tracking-wider text-right sticky right-0 bg-[#FCFAF8] z-20 shadow-[-6px_0_12px_-4px_rgba(0,0,0,0.06)] border-l border-[#E8E3E1] w-[105px] shrink-0">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E8E3E1]">
              {files.length > 0 ? (
                files.map((file) => {
                  const boxParsed = file.file_box?.name ? parseBoxHierarchy(file.file_box.name) : null;
                  const cabCleanName = file.file_box?.cabinet?.name
                    ? file.file_box.cabinet.name.replace(/\[steel\]/gi, "").trim()
                    : null;
                  const boxDisplayName = boxParsed?.parentBoxName
                    ? `${boxParsed.parentBoxName} → ${boxParsed.archfileName}`
                    : (boxParsed?.archfileName || boxParsed?.boxName || file.file_box?.name);

                  const displayTitle = (file.title && file.title !== "N/A" && file.title !== "Untitled Document")
                    ? file.title
                    : (file.subject && file.subject !== "N/A" ? file.subject : file.file_name?.replace(/\.[^/.]+$/, "") || "Official Document");

                  return (
                    <tr 
                      key={file.id} 
                      onClick={() => onViewFile(file)}
                      className="hover:bg-[#F4E7EA]/30 transition-colors cursor-pointer group select-none"
                    >
                      {/* 1. DOCUMENT ID MONOSPACE CHIP */}
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md font-mono text-[11px] font-bold text-[#6B1D2A] bg-[#FFFCF7] border border-[#E8E3E1] shadow-2xs group-hover:border-[#6B1D2A]/30 transition-colors">
                          <FileText className="w-3 h-3 text-[#6B1D2A]/70 shrink-0" />
                          <span>{file.document_id || file.access_code || `DOC-${file.id}`}</span>
                        </div>
                      </td>

                      {/* 2. SUBJECT / TITLE */}
                      <td className="px-3.5 py-2.5">
                        <div className="max-w-[240px] xl:max-w-[300px]">
                          <span 
                            className="font-bold text-xs text-[#1D1A1B] truncate block group-hover:text-[#6B1D2A] transition-colors" 
                            title={displayTitle}
                          >
                            {displayTitle}
                          </span>
                          <span className="text-[11px] text-[#5F5A5C] block mt-0.5 truncate">
                            {file.created_at 
                              ? new Date(file.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) 
                              : "Date unavailable"}
                          </span>
                        </div>
                      </td>

                      {/* 3. TYPE & CATEGORY */}
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <div className="max-w-[190px]">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs text-[#1D1A1B] truncate" title={file.document_type || "General Document"}>
                              {file.document_type || "General Document"}
                            </span>
                            {file.ocr_text && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#F2DFB0] text-[#A87818] border border-[#C99A2E]/50 inline-flex items-center gap-0.5 shrink-0" title="In-situ OCR indexed">
                                <ScanText className="w-2.5 h-2.5" />
                                OCR
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#5F5A5C] uppercase tracking-wider block mt-0.5 font-medium truncate">
                            {file.category || "Uncategorized"}
                          </span>
                        </div>
                      </td>
                      
                      {/* 4. PHYSICAL STORAGE COLUMN WITH CLEAN TAXONOMY PARSING */}
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        {file.file_box?.cabinet?.name ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditFile(file);
                            }}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold bg-[#FFFCF7] text-[#1D1A1B] border border-[#E8E3E1] hover:border-[#6B1D2A] hover:bg-[#F4E7EA]/40 transition-all cursor-pointer group/box shadow-2xs max-w-[180px]"
                            title={`Cabinet: ${cabCleanName} | Container: ${boxDisplayName} (Click to re-assign)`}
                          >
                            {boxParsed?.isArchfile ? (
                              <span
                                className="w-2 h-2 rounded-full shrink-0 border border-black/15 shadow-2xs"
                                style={{ backgroundColor: boxParsed.color || "#6B1D2A" }}
                              />
                            ) : (
                              <Box className="w-3 h-3 text-[#6B1D2A] shrink-0" />
                            )}
                            <span className="truncate">
                              {cabCleanName} › {boxDisplayName}
                            </span>
                            <Edit className="w-2.5 h-2.5 text-[#6B1D2A] opacity-0 group-hover/box:opacity-100 transition-opacity shrink-0 ml-0.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditFile(file);
                            }}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-[#5F5A5C] hover:text-[#6B1D2A] bg-transparent hover:bg-[#F4E7EA]/40 border border-dashed border-[#E8E3E1] hover:border-[#6B1D2A]/50 transition-all cursor-pointer group/btn"
                            title="Click to assign cabinet and file box"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C99A2E] shrink-0 group-hover/btn:scale-125 transition-transform" />
                            <span>+ Assign Box</span>
                          </button>
                        )}
                      </td>

                      {/* 5. STATUS BADGE */}
                      <td className="px-3 py-2.5 whitespace-nowrap text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block border ${
                            file.status === "Active"
                              ? "bg-[#F4E7EA] text-[#6B1D2A] border-[#E8E3E1]"
                              : file.status === "Archived"
                              ? "bg-[#FFFCF7] text-[#5F5A5C] border-[#E8E3E1]"
                              : file.status === "Deleted"
                              ? "bg-[#F4E7EA] text-[#4A0E1C] border-[#E8E3E1]"
                              : "bg-[#F2DFB0] text-[#A87818] border-[#C99A2E]"
                          }`}
                        >
                          {file.status || "Active"}
                        </span>
                      </td>

                      {/* 6. ACTIONS COLUMN - STICKY RIGHT (Always in user's direct POV) */}
                      <td className="px-3.5 py-2.5 text-right whitespace-nowrap sticky right-0 bg-[#FFFCF7] group-hover:bg-[#F4E7EA]/40 z-10 shadow-[-6px_0_12px_-4px_rgba(0,0,0,0.06)] border-l border-[#E8E3E1]/70 transition-colors">
                        <div className="inline-flex items-center gap-1 justify-end">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewFile(file);
                            }}
                            className="h-7 w-7 rounded-lg flex items-center justify-center text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
                            title="View Document Dossier"
                            aria-label="View Document"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {!showTrash ? (
                            <>
                              {(isAdmin || file.uploaded_by === currentUserId) && (
                                <>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEditFile(file);
                                    }}
                                    className="h-7 w-7 rounded-lg flex items-center justify-center text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
                                    title="Edit Record & Placement"
                                    aria-label="Edit Record"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteFile(file.id);
                                    }}
                                    className="h-7 w-7 rounded-lg flex items-center justify-center text-[#5F5A5C] hover:text-[#4A0E1C] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
                                    title="Move to Trash"
                                    aria-label="Move to Trash"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {isAdmin && (
                                <>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onRestoreFile(file.id);
                                    }}
                                    className="h-7 w-7 rounded-lg flex items-center justify-center text-[#6B1D2A] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
                                    title="Restore Document"
                                    aria-label="Restore Document"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onPermanentDeleteFile(file.id);
                                    }}
                                    className="h-7 w-7 rounded-lg flex items-center justify-center text-[#4A0E1C] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
                                    title="Permanently Delete"
                                    aria-label="Permanently Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-[#5F5A5C]">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center text-[#6B1D2A]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold text-[#1D1A1B]">No matching documents</span>
                      <p className="text-xs text-[#5F5A5C] max-w-sm">
                        No records match your selected search or filter parameters. Try clearing filters or updating your query.
                      </p>
                      {hasActiveFilters && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onClearFilters}
                          className="mt-2 h-8 px-3 rounded-xl text-xs font-semibold text-[#1D1A1B] bg-[#FFFCF7] border-[#E8E3E1] hover:bg-[#F4E7EA] cursor-pointer"
                        >
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION BAR */}
        <div className="p-4 border-t border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7] text-xs text-[#5F5A5C]">
          <span>
            Showing {totalCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} entries
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 px-3 text-xs bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer disabled:opacity-40"
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
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="h-8 px-3 text-xs bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
