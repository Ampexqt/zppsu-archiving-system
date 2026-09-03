export default function DisbursementsTemplate({ data }) {
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
              colSpan="4"
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "20px",
                padding: "15px"
              }}
            >
              MASTERLIST OF RECORDS FOR DISBURSEMENTS
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
              ACCESS CODE
            </td>

            <td
              style={{
                border: "1px solid black",
                fontWeight: "bold",
                textAlign: "center",
                padding: "10px"
              }}
            >
              PARTICULARS
            </td>

            <td
              style={{
                border: "1px solid black",
                fontWeight: "bold",
                textAlign: "center",
                padding: "10px"
              }}
            >
              AMOUNT
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

          {/* DATA */}
          <tr>
            <td style={{ border: "1px solid black", padding: "10px" }}>
              {data.access_code || "N/A"}
            </td>

            <td style={{ border: "1px solid black", padding: "10px" }}>
              {data.particulars}
            </td>

            <td style={{ border: "1px solid black", padding: "10px" }}>
              {data.amount}
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