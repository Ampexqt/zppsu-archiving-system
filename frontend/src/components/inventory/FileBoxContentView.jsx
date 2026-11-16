import React from "react";
import { ArrowLeft, FolderClosed, Plus, AlertCircle, Eye, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArchfileFolderCard from "./ArchfileFolderCard";

/**
 * FileBoxContentView
 * Displays Archfiles and direct records inside a File Box (Level 2).
 * Features real-time binder capacity tracking and lockouts when max_archfiles is reached.
 * Supports View, Edit, and Delete for direct records.
 */
export default function FileBoxContentView({
  cabinet,
  box,
  archfiles = [],
  directFiles = [],
  isAdmin = false,
  onBack,
  onOpenCreateArchfile,
  onSelectArchfile,
  onEditContainer,
  onDeleteContainer,
  onViewFile,
  onEditFile,
  onDeleteFile,
}) {
  const maxArchfiles = box?.max_archfiles ?? 5;
  const isBoxFull = archfiles.length >= maxArchfiles;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* BOX HEADER WITH CAPACITY GAUGES */}
      <div className="bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-[#E8E3E1] text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA] transition-colors cursor-pointer shrink-0 mt-0.5 sm:mt-0"
            title="Back to Cabinet"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-[#6B1D2A] uppercase tracking-wider bg-[#F4E7EA] px-2 py-0.5 rounded-md border border-[#E8E3E1]">
                File Box Container
              </span>
              <span className="text-xs text-[#5F5A5C]">
                Inside Cabinet: {cabinet?.name}
              </span>

              {/* REAL-TIME INNER ARCHFILES CAPACITY PILL */}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                isBoxFull
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-[#F4E7EA] text-[#6B1D2A] border-[#E8E3E1]"
              }`}>
                <FolderClosed className="w-3 h-3" />
                <span>Archfile Binders: {archfiles.length}/{maxArchfiles} {isBoxFull && "(FULL)"}</span>
              </span>
            </div>

            <h2 className="text-lg font-bold text-[#1D1A1B] mt-1">
              {box?.name}
            </h2>
          </div>
        </div>

        {isAdmin && (
          <Button
            onClick={() => onOpenCreateArchfile(cabinet, box?.name)}
            disabled={isBoxFull}
            className={`h-9 px-4 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-auto ${
              isBoxFull
                ? "bg-[#E8E3E1] text-[#5F5A5C] cursor-not-allowed opacity-80"
                : "bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] cursor-pointer"
            }`}
            title={isBoxFull ? `Box is at maximum archfile capacity (${archfiles.length}/${maxArchfiles})` : "Create new Archfile inside this box"}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isBoxFull ? `Box Full (${archfiles.length}/${maxArchfiles})` : "New Archfile"}</span>
          </Button>
        )}
      </div>

      {/* WARNING BANNER IF FULL */}
      {isBoxFull && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
          <p className="leading-snug">
            <strong>Capacity Reached: </strong> This file box container is at its maximum limit of <strong>{maxArchfiles}</strong> archfile binders. No additional binders can be added inside this box.
          </p>
        </div>
      )}

      {/* SECTION A: ARCHFILES INSIDE THIS BOX */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderClosed className="w-4 h-4 text-[#6B1D2A]" />
            <h3 className="text-sm font-bold text-[#1D1A1B]">
              Archfile Binders in this Box ({archfiles.length} / {maxArchfiles})
            </h3>
          </div>
          <span className="text-xs text-[#5F5A5C]">
            Click an archfile to inspect its filed documents
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {archfiles.map((arch) => (
            <ArchfileFolderCard
              key={arch.id}
              archfile={arch}
              displayName={arch.displayName}
              filesCount={arch.files?.length || 0}
              isAdmin={isAdmin}
              onEnter={onSelectArchfile}
              onEdit={onEditContainer}
              onDelete={onDeleteContainer}
            />
          ))}

          {archfiles.length === 0 && (
            <div className="col-span-full py-12 text-center bg-[#FFFCF7] border border-dashed border-[#E8E3E1] rounded-2xl">
              <FolderClosed className="w-10 h-10 mx-auto mb-2 text-[#6B1D2A]/30" />
              <h4 className="font-bold text-sm text-[#1D1A1B]">
                No Archfiles In This Box
              </h4>
              <p className="text-xs text-[#5F5A5C] mt-1 max-w-sm mx-auto">
                Organize this file box into customizable archfile ring binders (e.g. Guidance Reports, Personnel, Counseling).
              </p>
              {isAdmin && !isBoxFull && (
                <Button
                  onClick={() => onOpenCreateArchfile(cabinet, box?.name)}
                  className="mt-4 h-9 px-4 rounded-xl bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Create First Archfile</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SECTION B: DIRECT RECORDS IN THIS BOX (IF ANY) */}
      {directFiles.length > 0 && (
        <div className="bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-5 shadow-xs space-y-3 mt-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E3E1]">
            <h4 className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider">
              Direct Records Filed in Box (Loose Copies)
            </h4>
            <span className="text-xs text-[#5F5A5C]">
              {directFiles.length} files
            </span>
          </div>
          <div className="space-y-2">
            {directFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => onViewFile?.(file)}
                className="border border-[#E8E3E1] rounded-xl p-3 flex justify-between items-center bg-[#FFFCF7] hover:border-[#6B1D2A]/40 hover:bg-[#FCFAF8] transition-all cursor-pointer group shadow-2xs"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <span className="font-bold text-xs text-[#1D1A1B] group-hover:text-[#6B1D2A] transition-colors truncate block">
                    {file.subject || file.title || "Untitled Record"}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-[#6B1D2A] font-mono font-bold">{file.access_code || file.document_id || "NO-CODE"}</span>
                    <span className="text-[10px] text-[#5F5A5C]">• {file.created_at ? new Date(file.created_at).toLocaleDateString() : "—"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
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
          </div>
        </div>
      )}
    </div>
  );
}
