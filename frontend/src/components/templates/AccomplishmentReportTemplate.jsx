import React from "react";
import { formatLocationWithColorName } from "../inventory/storageTaxonomy";

export default function AccomplishmentReportTemplate({ document, data }) {
  const mergedData = data || document?.dynamic_data || document || {};
  const subject = mergedData.subject || document?.subject || document?.title || "—";
  
  const rawLoc =
    mergedData.file_location ||
    (document?.file_box?.cabinet?.name
      ? `${document.file_box.cabinet.name} - ${document.file_box.name}`
      : document?.file_box?.name || "Unassigned");
  const fileLocation = formatLocationWithColorName(rawLoc);

  const accessCode = mergedData.access_code || document?.access_code || "N/A";
  const dateValue =
    mergedData.date ||
    (document?.created_at ? new Date(document.created_at).toLocaleDateString() : "—");
  const status = document?.status || mergedData.status || "Active";
  
  const monthName = (
    mergedData.month ||
    (document?.created_at
      ? new Date(document.created_at).toLocaleDateString("en-US", { month: "long" }).toUpperCase()
      : "JANUARY")
  );

  return (
    <div className="w-full max-w-[950px] mx-auto bg-white border border-black font-sans">
      <table className="w-full border-collapse border border-black text-xs">
        <tbody>
          <tr>
            <td
              colSpan="5"
              className="border border-black font-bold text-center p-3 text-sm uppercase bg-white text-black"
            >
              ZPPSU MASTERLIST OF RECORDS- ACCOMPLISHMENT REPORTS
            </td>
          </tr>
          <tr className="font-bold text-center text-xs bg-neutral-50/50">
            <td className="border border-black p-2.5 text-center w-[15%]">Date</td>
            <td className="border border-black p-2.5 text-center w-[18%]">ACCESS CODE</td>
            <td className="border border-black p-2.5 text-center w-[32%]">SUBJECT</td>
            <td className="border border-black p-2.5 text-center w-[15%]">STATUS</td>
            <td className="border border-black p-2.5 text-center w-[20%]">FILE LOCATION</td>
          </tr>
          <tr>
            <td
              colSpan="5"
              className="border border-black font-bold px-3 py-2 text-xs text-black"
              style={{ backgroundColor: "#F2DFB0" }}
            >
              {monthName}
            </td>
          </tr>
          <tr className="text-center text-xs">
            <td className="border border-black p-3.5 text-center align-middle whitespace-normal">
              {dateValue}
            </td>
            <td className="border border-black p-3.5 text-center align-middle font-mono font-bold whitespace-normal">
              {accessCode}
            </td>
            <td className="border border-black p-3.5 text-center align-middle font-medium break-words leading-relaxed max-w-[280px]">
              {subject}
            </td>
            <td className="border border-black p-3.5 text-center align-middle whitespace-normal">
              {status}
            </td>
            <td className="border border-black p-3.5 text-center align-middle break-words leading-relaxed max-w-[240px]">
              {fileLocation}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
