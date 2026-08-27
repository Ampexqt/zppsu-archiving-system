export default function ChedCommunicationTemplate({ data }) {
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
              {data.month || "JANUARY"}
            </td>
          </tr>

          <tr>
            <td style={{ border: "1px solid black", padding: "10px" }}>
              {data.date}
            </td>

            <td style={{ border: "1px solid black", padding: "10px" }}>
              {data.access_code}
            </td>

            <td style={{ border: "1px solid black", padding: "10px" }}>
              {data.subject}
            </td>

            <td style={{ border: "1px solid black", padding: "10px" }}>
              {data.action_taken}
            </td>

            <td style={{ border: "1px solid black", padding: "10px" }}>
              {data.file_location}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}