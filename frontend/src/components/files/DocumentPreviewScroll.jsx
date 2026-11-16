import React, { useState, useEffect } from "react";
import { 
  UploadCloud, 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  Image as ImageIcon, 
  X, 
  CheckCircle2, 
  Eye, 
  FileCode,
  FileCheck2
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * DocumentPreviewScroll
 * Refined single-column document preview and drop-zone container.
 * Supports live PDF iframe viewing, image rendering, and office document badge representations.
 */
export default function DocumentPreviewScroll({
  file,
  setFile,
  className = "",
  showInternalHeader = false,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Generate and manage object URL for file preview
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const getFileExtension = (name) => {
    if (!name) return "";
    return name.slice(name.lastIndexOf(".")).toLowerCase();
  };

  const ext = file ? getFileExtension(file.name) : "";
  const isPdf = ext === ".pdf";
  const isImage = [".jpg", ".jpeg", ".png", ".webp", ".bmp"].includes(ext);
  const isWord = [".doc", ".docx"].includes(ext);
  const isExcel = [".xls", ".xlsx", ".csv"].includes(ext);
  const isPpt = [".ppt", ".pptx"].includes(ext);

  return (
    <div className={cn("space-y-3", className)}>
      {/* OPTIONAL HEADER LABEL */}
      {showInternalHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1D1A1B] uppercase tracking-wide">
            <Eye className="w-3.5 h-3.5 text-[#6B1D2A]" />
            <span>Document Preview &amp; Attachment</span>
            <span className="text-[10px] font-normal text-[#5F5A5C] normal-case bg-[#F4E7EA] px-2 py-0.5 rounded-md">
              (Optional)
            </span>
          </div>
          {file && (
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-[11px] font-semibold text-[#6B1D2A] hover:text-[#8B3545] inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Remove / Replace</span>
            </button>
          )}
        </div>
      )}

      {/* DROP ZONE OR PREVIEW DISPLAY */}
      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("direct-file-input")?.click()}
          className={cn(
            "border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[160px] space-y-3",
            isDragOver
              ? "border-[#6B1D2A] bg-[#F4E7EA]/50 scale-[0.99]"
              : "border-[#E8E3E1] bg-[#FFFCF7] hover:border-[#6B1D2A]/60 hover:bg-[#F4E7EA]/20"
          )}
        >
          <input
            id="direct-file-input"
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center text-[#6B1D2A] shadow-xs">
            <UploadCloud className="w-6 h-6 stroke-[2]" />
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-bold text-[#1D1A1B]">
              Drop digital document here to attach &amp; extract OCR text (Optional)
            </p>
            <p className="text-[11px] text-[#5F5A5C]">
              Supports PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx), or Scanned Images up to 25MB
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4E7EA] text-[#6B1D2A]">
              PDF (Digital/Scanned)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4E7EA] text-[#6B1D2A]">
              Word &amp; Excel
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4E7EA] text-[#6B1D2A]">
              PowerPoint
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4E7EA] text-[#6B1D2A]">
              PNG / JPG
            </span>
            <span className="text-xs font-bold text-[#FFFCF7] bg-[#6B1D2A] hover:bg-[#8B3545] px-3 py-1 rounded-lg transition-all shadow-xs ml-2 cursor-pointer">
              Browse Computer
            </span>
          </div>
        </div>
      ) : (
        <div className="border border-[#E8E3E1] rounded-2xl bg-[#FFFCF7] p-3.5 space-y-3">
          {/* FILE SUMMARY BADGE BAR */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4E7EA]/60 border border-[#E8E3E1]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#FFFCF7] border border-[#E8E3E1] flex items-center justify-center shrink-0 text-[#6B1D2A]">
                {isPdf && <FileText className="w-4 h-4" />}
                {isImage && <ImageIcon className="w-4 h-4" />}
                {isWord && <FileText className="w-4 h-4" />}
                {isExcel && <FileSpreadsheet className="w-4 h-4" />}
                {isPpt && <Presentation className="w-4 h-4" />}
                {!isPdf && !isImage && !isWord && !isExcel && !isPpt && (
                  <FileCode className="w-4 h-4" />
                )}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-[#1D1A1B] truncate">
                  {file.name}
                </p>
                <p className="text-[10px] text-[#5F5A5C]">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {ext.toUpperCase().replace(".", "")} Document
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-semibold text-[#6B1D2A] bg-[#FFFCF7] border border-[#E8E3E1] px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#6B1D2A]" /> File Attached
              </span>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-xs font-semibold text-[#6B1D2A] hover:bg-[#FFFCF7] p-1.5 rounded-lg border border-transparent hover:border-[#E8E3E1] transition-all cursor-pointer"
                title="Remove Attached File"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SCROLLABLE PREVIEW CONTAINER */}
          <div className="max-h-[52vh] overflow-y-auto rounded-xl border border-[#E8E3E1] bg-[#1D1A1B]/5 p-2 scrollbar-thin">
            {isPdf && previewUrl && (
              <iframe
                src={previewUrl}
                title="Document PDF Preview"
                className="w-full h-[48vh] rounded-lg border border-[#E8E3E1] bg-white"
              />
            )}

            {isImage && previewUrl && (
              <div className="flex items-center justify-center min-h-[250px] p-2 bg-white rounded-lg border border-[#E8E3E1]">
                <img
                  src={previewUrl}
                  alt="Scanned Document Preview"
                  className="max-h-[46vh] object-contain rounded-md"
                />
              </div>
            )}

            {(isWord || isExcel || isPpt) && (
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-[#E8E3E1] text-center space-y-2 min-h-[200px]">
                <div className="w-12 h-12 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center text-[#6B1D2A]">
                  {isWord && <FileText className="w-6 h-6" />}
                  {isExcel && <FileSpreadsheet className="w-6 h-6" />}
                  {isPpt && <Presentation className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1D1A1B]">
                    {isWord ? "Microsoft Word Document" : isExcel ? "Microsoft Excel Spreadsheet" : "PowerPoint Presentation"}
                  </h4>
                  <p className="text-[11px] text-[#5F5A5C] max-w-sm mt-0.5">
                    Machine-readable text and structural data will be extracted directly from this file stream upon archive ingestion.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#6B1D2A] bg-[#F4E7EA] px-2.5 py-0.5 rounded-md">
                  <FileCheck2 className="w-3 h-3" /> In-Situ Text Extraction Supported
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
