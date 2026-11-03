import React from "react";

export default function ChedMemoOrderTemplate({ document, data }) {
  const mergedData = data || document?.dynamic_data || document || {};
  const subject = mergedData.subject || document?.subject || document?.title || "—";
  const fileLocation =
    mergedData.file_location ||
    (document?.file_box?.cabinet?.name
      ? `${document.file_box.cabinet.name} - ${document.file_box.name}`
      : document?.file_box?.name || "Unassigned");
  const accessCode = mergedData.access_code || document?.access_code || "N/A";
  const dateValue = mergedData.date || (document?.created_at ? new Date(document.created_at).toLocaleDateString() : "—");

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "950px",
        margin: "0 auto",
        background: "#fff",
        border: "1px solid #000",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <tbody>
          {/* TITLE */}
          <tr>
            <td
              colSpan="5"
              style={{
                border: "1px solid black",
                textAlign: "center",
                verticalAlign: "middle",
                fontWeight: "bold",
                fontSize: "14px",
                padding: "8px 12px",
              }}
            >
              ZPPSU MASTERLIST OF RECORDS- CHED MEMORANDUM ORDERS (CMO)
            </td>
          </tr>

          {/* HEADER */}
          <tr>
            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                verticalAlign: "middle",
                fontWeight: "bold",
                padding: "4px 6px",
                fontSize: "11px",
                width: "14%",
              }}
            >
              Date
            </td>

            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                verticalAlign: "middle",
                fontWeight: "bold",
                padding: "4px 6px",
                fontSize: "11px",
                width: "20%",
              }}
            >
              ACCESS CODE
            </td>

            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                verticalAlign: "middle",
                fontWeight: "bold",
                padding: "4px 6px",
                fontSize: "11px",
                width: "28%",
              }}
            >
              SUBJECT
            </td>

            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                verticalAlign: "middle",
                fontWeight: "bold",
                padding: "4px 6px",
                fontSize: "11px",
                width: "18%",
              }}
            >
              ACTION TAKEN
            </td>

            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                verticalAlign: "middle",
                fontWeight: "bold",
                padding: "4px 6px",
                fontSize: "11px",
                width: "20%",
              }}
            >
              FILE LOCATION
            </td>
          </tr>

          {/* DATA ROW - CENTERED HORIZONTALLY AND VERTICALLY */}
          <tr>
            <td
              style={{
                border: "1px solid black",
                padding: "6px 8px",
                fontSize: "11px",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              {dateValue}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "6px 8px",
                fontSize: "11px",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              {accessCode}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "6px 8px",
                fontSize: "11px",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              {subject}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "6px 8px",
                fontSize: "11px",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              {mergedData.action_taken || "—"}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "6px 8px",
                fontSize: "11px",
                textAlign: "center",
                verticalAlign: "middle",
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
