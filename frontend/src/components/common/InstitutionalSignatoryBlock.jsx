import React from "react";

/**
 * InstitutionalSignatoryBlock
 * Formal academic certification & executive signatory footer.
 * Compliant with RA 9470 (National Archives Act) and Philippine State University governance.
 * 2-Column Executive Architecture: Prepared by Custodian vs Certified by Director.
 */
export default function InstitutionalSignatoryBlock({
  preparedBy = null,
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
    <div className="w-full pt-3 border-t border-black text-black font-sans print-avoid-break mt-auto">
      {/* 2-COLUMN EXECUTIVE SIGNATORY GRID */}
      <div className="grid grid-cols-2 gap-8 sm:gap-14 max-w-2xl mx-auto text-center text-xs">
        {/* COLUMN 1: PREPARED & CATALOGED BY */}
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-800 mb-1">
            PREPARED &amp; CATALOGED BY:
          </p>
          {/* Dedicated physical pen signature signing clearance */}
          <div className="h-11 w-56 flex items-end justify-center" aria-label="Physical Signature Space" />
          <div className="w-56 border-b border-black pb-0.5">
            <span className="font-bold text-[11px] uppercase text-neutral-900 tracking-tight block">
              {staffName}
            </span>
          </div>
          <span className="text-[9.5px] text-neutral-700 mt-1 block">
            Guidance Records Custodian / Staff
          </span>
          <span className="text-[8.5px] font-mono text-neutral-600 block">
            Date: {currentDate}
          </span>
        </div>

        {/* COLUMN 2: CERTIFIED OFFICIAL RECORD (BLANK FOR PHYSICAL PEN SIGNATURE & SEAL) */}
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-800 mb-1">
            CERTIFIED OFFICIAL RECORD:
          </p>
          {/* Dedicated physical pen signature & rubber seal clearance */}
          <div className="h-11 w-56 flex items-end justify-center" aria-label="Director Physical Signature Space" />
          <div className="w-56 border-b border-black pb-0.5">
            {/* Blank line for Director's physical handwritten signature & official dry/wet seal */}
            <span className="block h-4" />
          </div>
          <span className="font-bold text-[10px] uppercase text-neutral-900 mt-1 block tracking-tight">
            DIRECTOR, GUIDANCE & COUNSELING
          </span>
          <span className="text-[9.5px] text-neutral-700 block">
            Head, Guidance & Counseling Center
          </span>
          <span className="text-[8.5px] font-mono text-neutral-600 block">
            Office of Student Affairs & Services
          </span>
        </div>
      </div>

      {/* LEGAL NOTICE & INSTITUTIONAL TAMPER WARNING */}
      <div className="mt-2.5 pt-1.5 border-t border-black/30 flex flex-col sm:flex-row items-center justify-between text-[8px] text-neutral-700 gap-3">
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
        <div className="text-right shrink-0 font-mono text-[7.5px] bg-neutral-100 p-1.5 border border-black/40 min-w-[150px]">
          <div className="font-bold text-neutral-800">ARCHIVAL SECURITY STAMP</div>
          <div className="font-bold text-[#6B1D2A] mt-0.5 text-[8.5px]">
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
