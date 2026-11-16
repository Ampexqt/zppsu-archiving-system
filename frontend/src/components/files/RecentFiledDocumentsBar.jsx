import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight, Box, Archive } from "lucide-react";
import { parseBoxHierarchy } from "../inventory/storageTaxonomy";

/**
 * RecentFiledDocumentsBar
 * Displays recent records activity strip at the bottom of the Document Filing page.
 * Formats color-coded archfile binders, eliminates raw hex codes, and enforces clear hierarchy.
 */
export default function RecentFiledDocumentsBar({ recentRecords = [] }) {
  if (!recentRecords || recentRecords.length === 0) return null;

  return (
    <div className="border-t border-[#E8E3E1] bg-[#FCFAF8] p-5 sm:p-6 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#6B1D2A]" />
          <h3 className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider">
            Recently Filed Documents
          </h3>
          <span className="text-[10px] font-semibold text-[#5F5A5C] bg-[#FFFCF7] border border-[#E8E3E1] px-2 py-0.5 rounded-md">
            Latest {Math.min(recentRecords.length, 4)} entries
          </span>
        </div>
        <Link
          to="/document-center"
          className="text-xs font-bold text-[#6B1D2A] hover:text-[#8B3545] flex items-center gap-1 transition-colors"
        >
          <span>View all in Document Center</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {recentRecords.slice(0, 4).map((rec) => {
          // Resolve meaningful title (avoid raw "N/A")
          const rawTitle = rec.title?.trim();
          const rawSubject = rec.subject?.trim();
          const isTitleValid = rawTitle && rawTitle !== "N/A" && rawTitle !== "Untitled Document";
          const isSubjectValid = rawSubject && rawSubject !== "N/A";

          const displayTitle = isTitleValid 
            ? rawTitle 
            : isSubjectValid 
              ? rawSubject 
              : (rec.file_name?.replace(/\.[^/.]+$/, "") || "Official Record");

          const displaySubtitle = (isTitleValid && isSubjectValid && rawTitle !== rawSubject)
            ? rawSubject
            : null;

          // Parse storage taxonomy (eliminates raw [color:#HEX])
          const boxParsed = rec.file_box?.name ? parseBoxHierarchy(rec.file_box.name) : null;
          const cabinetName = rec.file_box?.cabinet?.name
            ? rec.file_box.cabinet.name.replace(/\[steel\]/gi, "").trim()
            : null;

          const docId = rec.document_id || `DOC-${rec.id}`;
          const hasAccessCode = rec.access_code && rec.access_code !== "N/A" && rec.access_code.trim() !== "";

          return (
            <div
              key={rec.id}
              className="p-3.5 rounded-2xl bg-[#FFFCF7] border border-[#E8E3E1] shadow-2xs hover:border-[#6B1D2A]/40 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              {/* TOP ROW: Document Type Badge + Doc ID */}
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <span className="text-[10px] font-bold text-[#6B1D2A] bg-[#F4E7EA] px-2 py-0.5 rounded-md uppercase truncate max-w-[65%]">
                    {rec.document_type || "Document"}
                  </span>
                  <span className="text-[10px] font-mono text-[#5F5A5C] shrink-0 font-medium">
                    {docId}
                  </span>
                </div>

                {/* TITLE & SUBTITLE */}
                <h4 
                  className="text-xs font-bold text-[#1D1A1B] line-clamp-2 leading-snug group-hover:text-[#6B1D2A] transition-colors"
                  title={displayTitle}
                >
                  {displayTitle}
                </h4>

                {displaySubtitle && (
                  <p className="text-[11px] text-[#5F5A5C] truncate mt-0.5" title={displaySubtitle}>
                    {displaySubtitle}
                  </p>
                )}

                {hasAccessCode && (
                  <span className="text-[10px] font-mono text-[#5F5A5C] block mt-1 truncate">
                    Code: {rec.access_code}
                  </span>
                )}
              </div>

              {/* BOTTOM ROW: Clean Physical Storage Placement */}
              <div className="mt-3 pt-2.5 border-t border-[#E8E3E1]/80 text-[10px]">
                {boxParsed ? (
                  <div className="flex items-center gap-1.5 text-[#1D1A1B] min-w-0">
                    {boxParsed.isArchfile ? (
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/15 shadow-2xs inline-block"
                        style={{ backgroundColor: boxParsed.color || "#6B1D2A" }}
                        title={boxParsed.colorName ? `${boxParsed.colorName} Binder` : "Archfile"}
                      />
                    ) : (
                      <Box className="w-3 h-3 text-[#6B1D2A] shrink-0" />
                    )}

                    <div className="truncate flex items-center gap-1 min-w-0">
                      {cabinetName && (
                        <span className="text-[#5F5A5C] truncate shrink-0">
                          {cabinetName} ›
                        </span>
                      )}
                      <span className="font-semibold truncate text-[#1D1A1B]">
                        {boxParsed.parentBoxName 
                          ? `${boxParsed.parentBoxName} → ${boxParsed.archfileName}` 
                          : (boxParsed.archfileName || boxParsed.boxName)}
                      </span>
                    </div>

                    {boxParsed.colorName && (
                      <span className="text-[9px] font-bold text-[#6B1D2A] bg-[#F4E7EA] px-1 py-0.2 rounded shrink-0 ml-auto">
                        {boxParsed.colorName}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-[#A87818] font-semibold flex items-center gap-1">
                    <Box className="w-3 h-3 text-[#A87818]" /> Awaiting Box
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
