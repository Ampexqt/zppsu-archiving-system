export default function CopcTemplate({ data }) {
  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        border: "1px solid #000",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        <tbody>
          <tr>
            <td
              colSpan="3"
              style={{
                border: "1px solid #000",
                fontWeight: "bold",
                textAlign: "center",
                padding: "12px",
                fontSize: "20px",
              }}
            >
              MASTERLIST OF RECORDS FOR COPC
            </td>
          </tr>

          <tr>
            <td
              style={{
                border: "1px solid #000",
                fontWeight: "bold",
                textAlign: "center",
                padding: "12px",
              }}
            >
              ACCESS CODE
            </td>

            <td
              style={{
                border: "1px solid #000",
                fontWeight: "bold",
                textAlign: "center",
                padding: "12px",
              }}
            >
              PROGRAM
            </td>

            <td
              style={{
                border: "1px solid #000",
                fontWeight: "bold",
                textAlign: "center",
                padding: "12px",
              }}
            >
              FILE LOCATION
            </td>
          </tr>

          <tr>
            <td style={{ border: "1px solid #000", padding: "12px" }}>
              {data.access_code}
            </td>

            <td style={{ border: "1px solid #000", padding: "12px" }}>
              {data.program}
            </td>

            <td style={{ border: "1px solid #000", padding: "12px" }}>
              {data.file_location}
            </td>
          </tr>

          {[...Array(6)].map((_, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #000", height: "70px" }}></td>
              <td style={{ border: "1px solid #000" }}></td>
              <td style={{ border: "1px solid #000" }}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}