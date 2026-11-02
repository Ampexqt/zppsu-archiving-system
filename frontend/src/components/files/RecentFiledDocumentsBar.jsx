import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight, Box } from "lucide-react";

/**
 * RecentFiledDocumentsBar
 * Displays recent records activity strip at the bottom of the Document Filing page.
 */
export default function RecentFiledDocumentsBar({ recentRecords = [] }) {
  if (!recentRecords || recentRecords.length === 0) return null;

  return (
    <div className="border-t border-[#E8E3E1] bg-[#FCFAF8] p-5 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#6B1D2A]" />
          <span className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider">
            Recently Filed Documents
          </span>
        </div>
        <Link
          to="/document-center"
          className="text-xs font-bold text-[#6B1D2A] hover:underline flex items-center gap-1"
        >
          <span>View all in Document Center</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {recentRecords.slice(0, 4).map((rec) => (
          <div
            key={rec.id}
            className="p-3 rounded-xl bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-bold text-[#6B1D2A] block uppercase truncate">
                {rec.document_type || "Document"}
              </span>
              <p className="text-xs font-bold text-[#1D1A1B] truncate mt-0.5" title={rec.subject || rec.title}>
                {rec.subject || rec.title || "Untitled Document"}
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-[#E8E3E1]/60 flex items-center justify-between text-[10px]">
              <span className="font-mono text-[#5F5A5C]">
                {rec.access_code && rec.access_code !== "N/A" ? rec.access_code : rec.document_id || `ID-${rec.id}`}
              </span>
              {rec.file_box?.cabinet?.name ? (
                <span className="text-[#6B1D2A] font-semibold flex items-center gap-1">
                  <Box className="w-3 h-3 text-[#6B1D2A]" />
                  {rec.file_box.name}
                </span>
              ) : (
                <span className="text-[#A87818] font-semibold">
                  Awaiting Box
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
