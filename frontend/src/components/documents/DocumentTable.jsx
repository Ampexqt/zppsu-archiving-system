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
import { formatLocationWithColorName } from "../inventory/storageTaxonomy";

/**
 * DocumentTable
 * Core documents data table with monospace ID chips, refined storage pills, and action controls.
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
      <CardHeader className="border-b border-[#E8E3E1] py-3.5 px-6 flex flex-row items-center justify-between bg-[#FFFCF7]">
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
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-[#5F5A5C] uppercase bg-[#FCFAF8] border-b border-[#E8E3E1]">
              <tr>
                <th className="px-5 py-3.5 font-bold tracking-wider">Document ID</th>
                <th className="px-5 py-3.5 font-bold tracking-wider">Subject / Title</th>
                <th className="px-5 py-3.5 font-bold tracking-wider">Type & Category</th>
                <th className="px-5 py-3.5 font-bold tracking-wider">Physical Storage</th>
                <th className="px-5 py-3.5 font-bold tracking-wider">Status</th>
                <th className="px-5 py-3.5 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E8E3E1]">
              {files.length > 0 ? (
                files.map((file) => (
                  <tr key={file.id} className="hover:bg-[#F4E7EA]/30 transition-colors">
                    {/* DOCUMENT ID MONOSPACE CHIP */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-xs font-bold text-[#6B1D2A] bg-[#FFFCF7] border border-[#E8E3E1] shadow-2xs">
                        <FileText className="w-3 h-3 text-[#6B1D2A]/70" />
                        <span>{file.document_id || file.access_code || `DOC-${file.id}`}</span>
                      </div>
                    </td>

                    {/* SUBJECT / TITLE */}
                    <td className="px-5 py-3.5">
                      <div className="max-w-xs md:max-w-sm">
                        <span 
                          className="font-semibold text-xs text-[#1D1A1B] truncate block" 
                          title={file.subject || file.title}
                        >
                          {file.subject || file.title || "Untitled Document"}
                        </span>
                        <span className="text-[11px] text-[#5F5A5C] block mt-0.5">
                          {file.created_at 
                            ? new Date(file.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) 
                            : "Date unavailable"}
                        </span>
                      </div>
                    </td>

                    {/* TYPE & CATEGORY */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-[#1D1A1B]">
                          {file.document_type || "General Document"}
                        </span>
                        {file.ocr_text && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#F2DFB0] text-[#A87818] border border-[#C99A2E]/50 inline-flex items-center gap-0.5">
                            <ScanText className="w-2.5 h-2.5" />
                            OCR
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#5F5A5C] uppercase tracking-wider block mt-0.5">
                        {file.category || "Uncategorized"}
                      </span>
                    </td>
                    
                    {/* PHYSICAL STORAGE COLUMN WITH REFINED PILL / DASHED BUTTON */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {file.file_box?.cabinet?.name ? (
                        <button
                          type="button"
                          onClick={() => onEditFile(file)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FFFCF7] text-[#1D1A1B] border border-[#E8E3E1] hover:border-[#6B1D2A] hover:bg-[#F4E7EA]/40 transition-all cursor-pointer group shadow-2xs"
                          title="Click to edit physical storage location"
                        >
                          <Box className="w-3.5 h-3.5 text-[#6B1D2A] shrink-0" />
                          <span className="truncate max-w-[150px]">
                            {file.file_box.cabinet.name}
                            <span className="text-[#5F5A5C] mx-1 font-normal">&rarr;</span>
                            {formatLocationWithColorName(file.file_box.name)}
                          </span>
                          <Edit className="w-3 h-3 text-[#6B1D2A] opacity-0 group-hover:opacity-100 transition-opacity ml-0.5 shrink-0" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onEditFile(file)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[#5F5A5C] hover:text-[#6B1D2A] bg-transparent hover:bg-[#F4E7EA]/40 border border-dashed border-[#E8E3E1] hover:border-[#6B1D2A]/50 transition-all cursor-pointer group"
                          title="Click to assign cabinet and file box"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C99A2E] shrink-0 group-hover:scale-125 transition-transform" />
                          <span>+ Assign to Box</span>
                        </button>
                      )}
                    </td>

                    {/* STATUS BADGE */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block border ${
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

                    {/* ACTIONS COLUMN */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onViewFile(file)}
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
                          title="View Document"
                          aria-label="View Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {!showTrash ? (
                          <>
                            {(isAdmin || file.uploaded_by === currentUserId) && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => onEditFile(file)}
                                  className="h-8 w-8 rounded-lg flex items-center justify-center text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
                                  title="Edit Record & Placement"
                                  aria-label="Edit Record"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDeleteFile(file.id)}
                                  className="h-8 w-8 rounded-lg flex items-center justify-center text-[#5F5A5C] hover:text-[#4A0E1C] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
                                  title="Move to Trash"
                                  aria-label="Move to Trash"
                                >
                                  <Trash2 className="w-4 h-4" />
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
                                  onClick={() => onRestoreFile(file.id)}
                                  className="h-8 w-8 rounded-lg flex items-center justify-center text-[#6B1D2A] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
                                  title="Restore Document"
                                  aria-label="Restore Document"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onPermanentDeleteFile(file.id)}
                                  className="h-8 w-8 rounded-lg flex items-center justify-center text-[#4A0E1C] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
                                  title="Permanently Delete"
                                  aria-label="Permanently Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
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
