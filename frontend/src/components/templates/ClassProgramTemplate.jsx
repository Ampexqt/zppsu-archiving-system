export default function ClassProgramTemplate({ data }) {
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

          {/* TITLE */}
          <tr>
            <td
              colSpan="4"
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "18px",
                padding: "12px",
              }}
            >
              MASTERLIST OF RECORDS FOR CLASS PROGRAM
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
                width: "22%",
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
                width: "28%",
              }}
            >
              NAME OF FACULTY
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
              ACADEMIC YEAR
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

          {/* DATA */}
          <tr>

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
              {data.name_of_faculty || ""}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              {data.academic_year || ""}
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