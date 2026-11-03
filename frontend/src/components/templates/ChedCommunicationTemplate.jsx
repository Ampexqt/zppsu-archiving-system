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
                padding: "15px",
                fontSize: "18px",
              }}
            >
              ZPPSU MASTERLIST OF RECORDS- CHED COMMUNICATIONS (2024)
            </td>
          </tr>

          <tr>
            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center" }}>
              Date
            </td>

            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center" }}>
              ACCESS CODE
            </td>

            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center" }}>
              SUBJECT
            </td>

            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center" }}>
              ACTION TAKEN
            </td>

            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center" }}>
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
                padding: "6px",
              }}
            >
              {mergedData.month || "JANUARY"}
            </td>
          </tr>

          <tr>
            <td style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
              {dateValue}
            </td>

            <td style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
              {accessCode}
            </td>

            <td style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
              {subject}
            </td>

            <td style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
              {mergedData.action_taken || "—"}
            </td>

            <td style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
              {fileLocation}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
