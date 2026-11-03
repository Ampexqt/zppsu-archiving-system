import React from "react";
import { ArrowLeft, FolderClosed, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArchfileFolderCard from "./ArchfileFolderCard";

/**
 * FileBoxContentView
 * Displays Archfiles and direct records inside a File Box (Level 2).
 * Styled in institutional palette with accurate folder icons and custom color support.
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
}) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* BOX HEADER */}
      <div className="bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-[#E8E3E1] text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
            title="Back to Cabinet"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#6B1D2A] uppercase tracking-wider bg-[#F4E7EA] px-2 py-0.5 rounded-md border border-[#E8E3E1]">
                File Box Container
              </span>
              <span className="text-xs text-[#5F5A5C]">
                Inside Cabinet: {cabinet?.name}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#1D1A1B] mt-0.5">
              {box?.name}
            </h2>
          </div>
        </div>

        {isAdmin && (
          <Button
            onClick={() => onOpenCreateArchfile(cabinet, box?.name)}
            className="h-9 px-4 rounded-xl bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Archfile</span>
          </Button>
        )}
      </div>

      {/* SECTION A: ARCHFILES INSIDE THIS BOX */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderClosed className="w-4 h-4 text-[#6B1D2A]" />
            <h3 className="text-sm font-bold text-[#1D1A1B]">
              Archfile Binders in this Box ({archfiles.length})
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
              {isAdmin && (
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
                className="border border-[#E8E3E1] rounded-xl p-3 flex justify-between items-center bg-[#FFFCF7]"
              >
                <div>
                  <span className="font-bold text-xs text-[#1D1A1B]">{file.subject || file.title}</span>
                  <span className="text-[11px] text-[#6B1D2A] font-mono ml-2 font-bold">{file.access_code}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewFile(file)}
                  className="h-7 px-2 text-xs text-[#6B1D2A] hover:bg-[#F4E7EA] cursor-pointer"
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
