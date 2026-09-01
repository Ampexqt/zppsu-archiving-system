export default function CoaAuditObservationTemplate({ data }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1000px",
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
                fontWeight: "bold",
                fontSize: "18px",
                padding: "12px",
              }}
            >
              ZPPSU MASTERLIST OF RECORDS- COA AUDIT OBSERVATIONS MEMORANDUM (2024)
            </td>
          </tr>

          {/* HEADER */}
          <tr>
            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                padding: "10px",
                width: "12%",
              }}
            >
              Date
            </td>

            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                padding: "10px",
                width: "28%",
              }}
            >
              ACCESS CODE
            </td>

            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                padding: "10px",
                width: "25%",
              }}
            >
              SUBJECT
            </td>

            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                padding: "10px",
                width: "20%",
              }}
            >
              ACTION TAKEN
            </td>

            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                padding: "10px",
                width: "25%",
              }}
            >
              FILE LOCATION
            </td>
          </tr>

          {/* MONTH */}
          <tr>
            <td
              colSpan="5"
              style={{
                border: "1px solid black",
                background: "#F2DFB0",
                color: "#1D1A1B",
                fontWeight: "bold",
                padding: "8px",
              }}
            >
              JANUARY
            </td>
          </tr>

          {/* DATA */}
          <tr>
            <td
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              {data.date || ""}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              {data.access_code || "N/A"}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              {data.subject || ""}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              {data.action_taken || ""}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              {data.file_location || ""}
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  );
}