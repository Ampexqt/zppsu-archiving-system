export default function BudgetaryRequirementsTemplate({ data }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "700px",
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
              colSpan="3"
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "18px",
                padding: "20px",
              }}
            >
              MASTERLIST OF RECORDS FOR BUDGETARY REQUIREMENTS
            </td>
          </tr>

          <tr>
            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                padding: "12px",
                width: "30%",
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
                width: "40%",
              }}
            >
              FISCAL YEAR
            </td>

            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                padding: "12px",
                width: "30%",
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
              {data.access_code || "N/A"}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "12px",
              }}
            >
              {data.fiscal_year || ""}
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