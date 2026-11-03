import React from "react";
import logo from "../../assets/logo.jpg";

/**
 * InstitutionalPrintHeader
 * Official Republic of the Philippines & ZPPSU Academic Letterhead.
 * Formatted strictly for high-credibility institutional records, audits, and official printouts.
 */
export default function InstitutionalPrintHeader({
  title = "OFFICIAL ARCHIVAL RECORD DOSSIER",
  referenceCode = null,
  classification = null,
  documentType = null,
  hideTitleStrip = false,
}) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full pb-2 border-b-2 border-black text-black mb-3 font-sans">
      {/* INSTITUTIONAL LETTERHEAD */}
      <div className="flex items-center justify-between gap-3">
        {/* LEFT SEAL */}
        <div className="shrink-0 flex items-center justify-center">
          <img
            src={logo}
            alt="ZPPSU Official Seal"
            className="w-16 h-16 object-contain rounded-full border border-black/30"
          />
        </div>

        {/* CENTER STATE UNIVERSITY HEADINGS */}
        <div className="flex-1 text-center font-serif leading-tight">
          <p className="text-[10px] uppercase tracking-widest font-semibold text-neutral-800">
            Republic of the Philippines
          </p>
          <h2 className="text-sm sm:text-base font-bold tracking-tight uppercase text-neutral-900 mt-0.5">
            Zamboanga Peninsula Polytechnic State University
          </h2>
          <p className="text-[10px] sm:text-[11px] font-medium text-neutral-700">
            Region IX - Zamboanga Del Sur, Zamboanga City, Philippines
          </p>
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#6B1D2A] mt-0.5 font-sans">
            Office of Guidance and Counseling Services
          </p>
          <p className="text-[9.5px] uppercase tracking-widest text-neutral-700 font-sans font-semibold">
            Archival & Records Management Unit
          </p>
          <p className="text-[8.5px] text-neutral-600 font-sans mt-0.5">
            R.T. Lim Boulevard, Baliwasan, Zamboanga City 7000 &bull; records@zppsu.edu.ph
          </p>
        </div>

        {/* RIGHT CONTROL CODE / ACCREDITATION BADGE */}
        <div className="shrink-0 text-right font-sans min-w-[110px]">
          <div className="border border-black p-1 text-center bg-neutral-50 rounded-xs">
            <span className="block text-[7.5px] font-bold uppercase tracking-wider text-neutral-700">
              Control Standard
            </span>
            <span className="block text-[10px] font-mono font-extrabold text-[#6B1D2A]">
              ISO 9001:2015
            </span>
            <span className="block text-[7.5px] text-neutral-600 font-mono mt-0.5">
              NAP RA 9470 COMPLIANT
            </span>
          </div>
          {referenceCode && (
            <div className="mt-1 text-[8.5px] font-mono text-neutral-800">
              Ref: <strong className="text-black">{referenceCode}</strong>
            </div>
          )}
        </div>
      </div>

      {/* FORMAL REPORT TITLE STRIP (OPTIONAL) */}
      {!hideTitleStrip && (
        <div className="mt-2 pt-1.5 border-t border-black/40 flex items-center justify-between text-[9.5px]">
          <div className="flex items-center gap-2">
            <span className="font-extrabold uppercase tracking-wider text-black text-[11px]">
              {title}
            </span>
            {documentType && (
              <span className="text-neutral-700">
                &bull; Type: <strong className="text-black">{documentType}</strong>
              </span>
            )}
            {classification && (
              <span className="text-neutral-700">
                &bull; Series: <strong className="text-black">{classification}</strong>
              </span>
            )}
          </div>
          <span className="text-neutral-600 font-mono text-[8.5px]">
            Archival Series: {currentYear} &bull; Certified University Copy
          </span>
        </div>
      )}
    </div>
  );
}
