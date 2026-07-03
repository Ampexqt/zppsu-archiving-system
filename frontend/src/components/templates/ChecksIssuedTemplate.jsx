export default function ChecksIssuedTemplate({ data }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "750px",
        margin: "0 auto",
        border: "1px solid black",
        background: "#fff",
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
              colSpan="4"
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "18px",
                padding: "20px",
              }}
            >
              MASTERLIST OF RECORDS FOR CHECKS ISSUED
            </td>
          </tr>

          <tr>
            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                padding: "12px",
              }}
            >
              ACCESS CODE
            </td>

            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                padding: "12px",
              }}
            >
              PAYEE
            </td>

            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                padding: "12px",
              }}
            >
              AMOUNT
            </td>

            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                padding: "12px",
              }}
            >
              FILE LOCATION
            </td>
          </tr>

          <tr>
            <td
              style={{
                border: "1px solid black",
                padding: "12px",
              }}
            >
              {data.access_code || ""}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "12px",
              }}
            >
              {data.payee || ""}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "12px",
              }}
            >
              {data.amount || ""}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "12px",
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