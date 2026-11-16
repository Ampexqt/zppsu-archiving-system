import React from "react";
import { ArrowLeft, FileText, Eye, Edit3, Trash2, FolderClosed, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { parseBoxHierarchy } from "./storageTaxonomy";

/**
 * ArchfileRecordsView
 * Displays the filed documents inside an Archfile (Level 3).
 * Adheres strictly to the custom archfile color and institutional palette.
 * Supports View, Edit, and Delete actions for records management.
 */
export default function ArchfileRecordsView({
  archfile,
  cabinetName = "",
  boxName = "",
  isAdmin = false,
  onBack,
  onViewFile,
  onEditFile,
  onDeleteFile,
}) {
  const files = archfile?.files || [];
  const parsed = parseBoxHierarchy(archfile?.name || "");
  const color = archfile?.color || parsed.color || "#6B1D2A";
  const label = archfile?.displayName || parsed.archfileName || archfile?.name;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* HEADER WITH CUSTOM COLOR ACCENT */}
      <div className="bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div
          style={{ backgroundColor: color }}
          className="absolute left-0 top-0 bottom-0 w-1.5"
        />

        <div className="flex items-center gap-3.5 pl-1">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-[#E8E3E1] text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
            title="Back to File Box"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span
                style={{ backgroundColor: `${color}18`, color: color, borderColor: `${color}35` }}
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border"
              >
                Archfile Binder
              </span>
              <span className="text-xs text-[#5F5A5C]">
                Inside: {cabinetName} &rarr; {boxName}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#1D1A1B] mt-0.5">
              {label}
            </h2>
          </div>
        </div>

        <div className="text-right pl-1 sm:pl-0">
          <span
            style={{ backgroundColor: `${color}15`, color: color, borderColor: `${color}30` }}
            className="text-xs font-bold px-3 py-1 rounded-full border inline-block"
          >
            {files.length} Records Stored
          </span>
        </div>
      </div>

      {/* DOCUMENTS LIST */}
      <div className="bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E3E1]">
          <h3 className="text-sm font-bold text-[#1D1A1B] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#6B1D2A]" />
            <span>Filed Documents</span>
          </h3>
          <span className="text-xs text-[#5F5A5C]">
            Official physical copies held in this archfile
          </span>
        </div>

        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => onViewFile?.(file)}
              className="border border-[#E8E3E1] rounded-xl p-3.5 flex justify-between items-center bg-[#FFFCF7] hover:border-[#6B1D2A]/40 hover:bg-[#FCFAF8] transition-all cursor-pointer group shadow-2xs"
            >
              <div className="min-w-0 flex-1 pr-3">
                <h4 className="font-bold text-xs text-[#1D1A1B] group-hover:text-[#6B1D2A] transition-colors truncate" title={file.subject || file.title}>
                  {file.subject || file.title || "Untitled Record"}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-[#6B1D2A] font-mono font-bold">
                    {file.access_code || file.document_id || "NO-CODE"}
                  </span>
                  <span className="text-[10px] text-[#5F5A5C]">
                    • {file.created_at ? new Date(file.created_at).toLocaleDateString() : "—"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                <Badge variant="outline" className="text-[10px] font-semibold border-[#E8E3E1] text-[#6B1D2A] bg-[#F4E7EA] mr-1 hidden sm:inline-flex">
                  {file.document_type || "General"}
                </Badge>

                {/* 1. VIEW ACTION */}
                {onViewFile && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewFile(file)}
                    className="h-7 px-2.5 text-[11px] font-semibold bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer shadow-2xs"
                    title="View Document Details & Preview"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1 text-[#6B1D2A]" />
                    <span>View</span>
                  </Button>
                )}

                {/* 2. EDIT ACTION */}
                {onEditFile && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditFile(file)}
                    className="h-7 px-2.5 text-[11px] font-semibold bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:text-[#A87818] hover:bg-[#F2DFB0]/50 hover:border-[#C99A2E]/40 cursor-pointer transition-colors shadow-2xs"
                    title="Edit Metadata & Storage Location"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1 text-[#A87818]" />
                    <span>Edit</span>
                  </Button>
                )}

                {/* 3. DELETE ACTION */}
                {onDeleteFile && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeleteFile(file)}
                    className="h-7 px-2 text-[11px] font-semibold bg-[#FFFCF7] border-[#E8E3E1] text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] hover:border-[#6B1D2A]/30 cursor-pointer transition-colors shadow-2xs"
                    title="Move Document to Trash"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[#6B1D2A]" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {files.length === 0 && (
            <div className="py-12 text-center text-[#5F5A5C]">
              <FolderOpen className="w-10 h-10 mx-auto mb-2 text-[#5F5A5C]/30" />
              <p className="text-xs font-semibold">
                No documents currently filed in this archfile binder.
              </p>
              <p className="text-[11px] text-[#5F5A5C] mt-0.5">
                Assign documents to this archfile from the Document Center or File Upload page.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
