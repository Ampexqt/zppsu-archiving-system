export default function CscCommunications2024Template({ data }) {
  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        border: "1px solid #000"
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed"
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
                fontSize: "20px",
                padding: "15px"
              }}
            >
              ZPPSU MASTERLIST OF RECORDS - CSC COMMUNICATIONS (2024)
            </td>
          </tr>

          {/* HEADER */}
          <tr>
            <td
              style={{
                border: "1px solid black",
                fontWeight: "bold",
                textAlign: "center",
                padding: "10px"
              }}
            >
              Date
            </td>

            <td
              style={{
                border: "1px solid black",
                fontWeight: "bold",
                textAlign: "center",
                padding: "10px"
              }}
            >
              Access Code #
            </td>

            <td
              style={{
                border: "1px solid black",
                fontWeight: "bold",
                textAlign: "center",
                padding: "10px"
              }}
            >
              SUBJECT
            </td>

            <td
              style={{
                border: "1px solid black",
                fontWeight: "bold",
                textAlign: "center",
                padding: "10px"
              }}
            >
              ACTION TAKEN
            </td>

            <td
              style={{
                border: "1px solid black",
                fontWeight: "bold",
                textAlign: "center",
                padding: "10px"
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
                padding: "8px"
              }}
            >
              JANUARY
            </td>
          </tr>

          {/* DATA */}
          <tr>
            <td style={{ border: "1px solid black", padding: "10px" }}>
              {data.date}
            </td>

            <td style={{ border: "1px solid black", padding: "10px" }}>
              {data.access_code || "N/A"}
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