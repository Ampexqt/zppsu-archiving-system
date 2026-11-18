import React from "react";
import { formatLocationWithColorName } from "../inventory/storageTaxonomy";

export default function StudentAccountTemplate({
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
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "22px",
          padding: "12px",
        }}
      >
        MASTERLIST OF RECORDS FOR
        STUDENT ACCOUNT
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              ACCESS CODE
            </th>

            <th
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              NAME OF STUDENT
            </th>

            <th
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              FILE LOCATION
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              {document?.access_code || mergedData?.access_code || "N/A"}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              {mergedData.student_name || document?.student_name || document?.title || "—"}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              {fileLocation}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
