import React from "react";

/**
 * InstitutionalSignatoryBlock
 * Formal academic certification & signatory block ensuring institutional authenticity,
 * chain of custody verification, and legal compliance under RA 9470 (National Archives Act).
 */
export default function InstitutionalSignatoryBlock({
  preparedBy = null,
  verifiedBy = "University Records Officer",
  approvedBy = "Director, Guidance & Counseling",
  documentIdentifier = "DOC-ZPPSU",
  printDate = null,
}) {
  const currentDate = printDate || new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const staffName = preparedBy || currentUser?.name || "Guidance Records Custodian";

  return (
    <div className="w-full mt-8 pt-4 border-t border-black text-black font-sans print-avoid-break">
      {/* 3-COLUMN SIGNATORY GRID */}
      <div className="grid grid-cols-3 gap-6 text-center text-xs">
        {/* COLUMN 1: PREPARED BY */}
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-8">
            Prepared & Cataloged by:
          </p>
          <div className="w-44 border-b border-black pb-0.5">
            <span className="font-bold text-xs uppercase text-neutral-900 tracking-tight">
              {staffName}
            </span>
          </div>
          <span className="text-[10px] text-neutral-700 mt-1">
            Guidance Records Custodian / Staff
          </span>
          <span className="text-[9px] font-mono text-neutral-600 mt-0.5">
            Date: {currentDate}
          </span>
        </div>

        {/* COLUMN 2: VERIFIED BY */}
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-8">
            Verified & Archived by:
          </p>
          <div className="w-44 border-b border-black pb-0.5">
            <span className="font-bold text-xs uppercase text-neutral-900 tracking-tight">
              {verifiedBy}
            </span>
          </div>
          <span className="text-[10px] text-neutral-700 mt-1">
            University Records Officer / Admin
          </span>
          <span className="text-[9px] font-mono text-neutral-600 mt-0.5">
            Date: {currentDate}
          </span>
        </div>

        {/* COLUMN 3: CERTIFIED BY */}
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-8">
            Certified Official Record:
          </p>
          <div className="w-44 border-b border-black pb-0.5">
            <span className="font-bold text-xs uppercase text-neutral-900 tracking-tight">
              {approvedBy}
            </span>
          </div>
          <span className="text-[10px] text-neutral-700 mt-1">
            Head, Guidance & Counseling Center
          </span>
          <span className="text-[9px] font-mono text-neutral-600 mt-0.5">
            Office of Student Affairs & Services
          </span>
        </div>
      </div>

      {/* LEGAL NOTICE & INSTITUTIONAL TAMPER WARNING */}
      <div className="mt-6 pt-3 border-t border-black/30 flex flex-col sm:flex-row items-center justify-between text-[9px] text-neutral-700 gap-4">
        <div className="text-left flex-1">
          <p className="font-bold uppercase tracking-wider text-neutral-900">
            Institutional Legal Certification Notice
          </p>
          <p className="leading-tight text-neutral-700 mt-0.5">
            This document constitutes an official archival record of Zamboanga Peninsula Polytechnic State University (ZPPSU).
            Any unauthorized erasure, modification, reproduction, or tampering renders this record null and void under
            Republic Act No. 9470 (National Archives of the Philippines Act of 2007) and the Revised Penal Code of the Philippines.
          </p>
        </div>
        <div className="text-right shrink-0 font-mono text-[8px] bg-neutral-100 p-2 border border-black/40 min-w-[170px]">
          <div className="font-bold text-neutral-800">ARCHIVAL SECURITY STAMP</div>
          <div className="font-bold text-[#6B1D2A] mt-0.5 text-[9px]">
            ZPPSU-{String(documentIdentifier).replace(/[^a-zA-Z0-9-]/g, "")}-{Date.now().toString(36).toUpperCase()}
          </div>
          <div className="text-[7px] text-neutral-600 mt-0.5">
            Valid Institutional Electronic Verification
          </div>
        </div>
      </div>
    </div>
  );
}
