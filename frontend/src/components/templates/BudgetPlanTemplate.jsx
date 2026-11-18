import React from "react";
import { formatLocationWithColorName } from "../inventory/storageTaxonomy";

export default function BudgetPlanTemplate({
  document,
  data,
}) {
  const mergedData = data || document?.dynamic_data || document || {};
  const rawLoc =
    mergedData.file_location ||
    (document?.file_box?.cabinet?.name
      ? `${document.file_box.cabinet.name} - ${document.file_box.name}`
      : document?.file_box?.name || "Unassigned");
  const fileLocation = formatLocationWithColorName(rawLoc);

  return (
    <div className="w-full">
      <div
        style={{
          border: "1px solid black",
          padding: "12px",
          fontWeight: "bold",
          fontSize: "22px",
          textAlign: "center",
        }}
      >
        MASTERLIST OF RECORDS FOR
        BUDGET PLAN
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          {/* HEADER */}
          <tr>
            <th style={{ border: "1px solid black", padding: "10px" }}>ACCESS CODE</th>
            <th style={{ border: "1px solid black", padding: "10px" }}>YEAR AND PROPOSED BUDGET</th>
            <th style={{ border: "1px solid black", padding: "10px" }}>FILE LOCATION</th>
          </tr>

          {/* YELLOW BLANK ROW */}
          <tr style={{ backgroundColor: "#ffff00", height: "30px" }}>
            <td style={{ border: "1px solid black" }} />
            <td style={{ border: "1px solid black" }} />
            <td style={{ border: "1px solid black" }} />
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={{ border: "1px solid black", padding: "10px" }}>
              {document?.access_code || mergedData?.access_code || "N/A"}
            </td>
            <td style={{ border: "1px solid black", padding: "10px" }}>
              {mergedData.year_and_proposed_budget || "—"}
            </td>
            <td style={{ border: "1px solid black", padding: "10px" }}>
              {fileLocation}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
