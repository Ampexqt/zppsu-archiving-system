export default function ChedCommunicationTemplate({ document, data }) {
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
          <tr>
            <td
              colSpan="5"
              style={{
                border: "1px solid black",
                fontWeight: "bold",
                textAlign: "center",
                padding: "8px 12px",
                fontSize: "14px",
              }}
            >
              ZPPSU MASTERLIST OF RECORDS- CHED COMMUNICATIONS (2024)
            </td>
          </tr>

          <tr>
            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center", padding: "4px 6px", fontSize: "11px" }}>
              Date
            </td>

            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center", padding: "4px 6px", fontSize: "11px" }}>
              ACCESS CODE
            </td>

            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center", padding: "4px 6px", fontSize: "11px" }}>
              SUBJECT
            </td>

            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center", padding: "4px 6px", fontSize: "11px" }}>
              ACTION TAKEN
            </td>

            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center", padding: "4px 6px", fontSize: "11px" }}>
              FILE LOCATION
            </td>
          </tr>

          <tr>
            <td
              colSpan="5"
              style={{
                background: "#F2DFB0",
                color: "#1D1A1B",
                border: "1px solid black",
                fontWeight: "bold",
                padding: "4px 6px",
                fontSize: "11px",
              }}
            >
              {mergedData.month || "JANUARY"}
            </td>
          </tr>

          <tr>
            <td style={{ border: "1px solid black", padding: "6px 8px", textAlign: "center", fontSize: "11px" }}>
              {dateValue}
            </td>

            <td style={{ border: "1px solid black", padding: "6px 8px", textAlign: "center", fontSize: "11px" }}>
              {accessCode}
            </td>

            <td style={{ border: "1px solid black", padding: "6px 8px", textAlign: "center", fontSize: "11px" }}>
              {subject}
            </td>

            <td style={{ border: "1px solid black", padding: "6px 8px", textAlign: "center", fontSize: "11px" }}>
              {mergedData.action_taken || "—"}
            </td>

            <td style={{ border: "1px solid black", padding: "6px 8px", textAlign: "center", fontSize: "11px" }}>
              {fileLocation}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
