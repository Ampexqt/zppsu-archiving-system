import React, { useState, useMemo } from "react";
import { X, FolderOpen, Eye, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/**
 * ContainerFilesModal
 * Displays all records assigned to a specific file box or archfile container.
 */
export default function ContainerFilesModal({
  isOpen,
  onClose,
  containerTitle = "",
  files = [],
  onViewFile,
}) {
  const [search, setSearch] = useState("");

  const filteredFiles = useMemo(() => {
    if (!search.trim()) return files;
    const q = search.toLowerCase().trim();
    return files.filter((f) => {
      const subject = (f.subject || f.title || "").toLowerCase();
      const code = (f.access_code || f.document_id || "").toLowerCase();
      const type = (f.document_type || "").toLowerCase();
      return subject.includes(q) || code.includes(q) || type.includes(q);
    });
  }, [files, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFCF7] w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-xl border border-[#E8E3E1] flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="p-5 border-b border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#6B1D2A] uppercase tracking-wider bg-[#F4E7EA] px-2 py-0.5 rounded-md border border-[#E8E3E1]">
                Physical Container
              </span>
              <span className="text-xs text-[#5F5A5C]">
                {files.length} records filed inside
              </span>
            </div>
            <h3 className="font-bold text-[#1D1A1B] text-base mt-1">
              {containerTitle} — Stored Records
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SEARCH BAR */}
        {files.length > 3 && (
          <div className="px-5 py-3 border-b border-[#E8E3E1] bg-[#FCFAF8]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5F5A5C]" />
              <Input
                placeholder="Search records in this container..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs rounded-lg bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] focus-visible:ring-[#6B1D2A]"
              />
            </div>
          </div>
        )}

        {/* FILES LIST */}
        <div className="p-5 space-y-2.5 overflow-y-auto flex-1">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="border border-[#E8E3E1] rounded-xl p-3.5 flex justify-between items-center bg-[#FFFCF7] hover:border-[#6B1D2A]/30 hover:bg-[#FCFAF8] transition-all"
            >
              <div className="min-w-0 flex-1 pr-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#6B1D2A] shrink-0" />
                  <h4 className="font-bold text-xs text-[#1D1A1B] truncate">
                    {file.subject || file.title || "Untitled Document"}
                  </h4>
                </div>
                <div className="flex items-center gap-2 mt-1 pl-6">
                  <span className="text-[11px] text-[#6B1D2A] font-mono font-bold">
                    {file.access_code || file.document_id || "NO-CODE"}
                  </span>
                  <span className="text-[10px] text-[#5F5A5C]">
                    • {new Date(file.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant="outline"
                  className="text-[10px] font-semibold border-[#E8E3E1] text-[#6B1D2A] bg-[#F4E7EA]"
                >
                  {file.document_type || "General"}
                </Badge>
                {onViewFile && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewFile(file)}
                    className="h-7 px-2.5 text-[11px] font-semibold bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1 text-[#6B1D2A]" /> View
                  </Button>
                )}
              </div>
            </div>
          ))}

          {filteredFiles.length === 0 && (
            <div className="text-center py-12 text-[#5F5A5C]">
              <FolderOpen className="w-9 h-9 mx-auto mb-2 text-[#5F5A5C]/40" />
              <p className="text-xs font-semibold">
                {search ? "No matching records found." : "No records currently filed in this container."}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-[#E8E3E1] bg-[#FFFCF7] flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-9 px-4 rounded-xl text-xs font-semibold bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
