import React, { useState } from "react";
import { UploadCloud, FileText, X, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import PhysicalStoragePlacementCard from "./PhysicalStoragePlacementCard";

/**
 * UploadDocumentSection
 * Handles drag-and-drop file upload, file selection, physical placement, and submission.
 */
export default function UploadDocumentSection({
  file,
  setFile,
  uploadCabinet,
  setUploadCabinet,
  uploadFileBox,
  setUploadFileBox,
  inventories,
  isUploading,
  onUpload,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <form onSubmit={onUpload} className="space-y-6">
      {/* DRAG AND DROP ZONE */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("main-file-upload")?.click()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-center cursor-pointer space-y-3",
          isDragOver
            ? "border-[#6B1D2A] bg-[#F4E7EA]/40"
            : "border-[#E8E3E1] bg-[#FFFCF7] hover:border-[#6B1D2A]/60"
        )}
      >
        <input
          id="main-file-upload"
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center text-[#6B1D2A] shadow-xs">
          <UploadCloud className="w-7 h-7 stroke-[2]" />
        </div>

        {file ? (
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1]">
              <FileText className="w-4 h-4 text-[#6B1D2A]" />
              <span className="font-bold text-xs text-[#1D1A1B]">{file.name}</span>
              <span className="text-[11px] text-[#5F5A5C]">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="p-1 rounded-md text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#FFFCF7] ml-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-[#6B1D2A] font-semibold flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6B1D2A]" /> File ready to be indexed
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#1D1A1B]">
              Choose a document or drag it here
            </p>
            <p className="text-xs text-[#5F5A5C]">
              PDF, DOCX, PPTX, or JPG format up to 10MB
            </p>
            <span className="inline-block mt-2 text-xs font-bold text-[#6B1D2A] bg-[#F4E7EA] px-3 py-1 rounded-lg">
              Browse Computer
            </span>
          </div>
        )}
      </div>

      {/* PHYSICAL STORAGE PLACEMENT */}
      <PhysicalStoragePlacementCard
        selectedCabinetId={uploadCabinet}
        onCabinetChange={setUploadCabinet}
        selectedBoxId={uploadFileBox}
        onBoxChange={setUploadFileBox}
        cabinets={inventories}
      />

      {/* ACTION BUTTON */}
      <Button
        type="submit"
        disabled={!file || isUploading}
        className="w-full bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] py-6 rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing Document & OCR Indexing...</span>
          </>
        ) : (
          <>
            <UploadCloud className="w-5 h-5" />
            <span>Upload & File Document</span>
          </>
        )}
      </Button>
    </form>
  );
}
