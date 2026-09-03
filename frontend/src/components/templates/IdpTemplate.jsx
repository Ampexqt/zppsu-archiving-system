export default function IdpTemplate({ data }) {
  return (
    <div style={{ width: "100%", background: "#fff" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed"
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
                fontSize: "20px",
                padding: "15px"
              }}
            >
              MASTERLIST OF RECORDS FOR INDIVIDUAL DAILY PROGRAM (IDP)
            </td>
          </tr>

          <tr>
            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center", padding: "10px" }}>
              ACCESS CODE
            </td>

            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center", padding: "10px" }}>
              NAME OF FACULTY
            </td>

            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center", padding: "10px" }}>
              SEMESTER/YEAR
            </td>

            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center", padding: "10px" }}>
              FILE LOCATION
            </td>
          </tr>

          <tr>
            <td style={{ border: "1px solid black", padding: "10px" }}>
              {data.access_code || "N/A"}
            </td>

            <td style={{ border: "1px solid black", padding: "10px" }}>
              {data.name_of_faculty}
            </td>

            <td style={{ border: "1px solid black", padding: "10px" }}>
              {data.semester_year}
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