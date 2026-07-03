export default function ContractOfServiceVisitingLecturersTemplate({ data }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
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
          {/* TITLE */}
          <tr>
            <td
              colSpan="4"
              style={{
                border: "1px solid #000",
                fontWeight: "bold",
                textAlign: "center",
                padding: "12px",
                fontSize: "20px",
              }}
            >
              MASTERLIST OF RECORDS FOR CONTRACT OF SERVICES
              (VISITING LECTURERS)
            </td>
          </tr>

          {/* HEADERS */}
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
              NAME
            </td>

            <td
              style={{
                border: "1px solid #000",
                fontWeight: "bold",
                textAlign: "center",
                padding: "12px",
              }}
            >
              SEMESTER/YEAR
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

          {/* DATA */}
          <tr>
            <td
              style={{
                border: "1px solid #000",
                padding: "12px",
              }}
            >
              {data.access_code}
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "12px",
              }}
            >
              {data.name}
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "12px",
              }}
            >
              {data.semester_year}
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "12px",
              }}
            >
              {data.file_location}
            </td>
          </tr>

          {/* BLANK ROWS */}
          {[...Array(6)].map((_, index) => (
            <tr key={index}>
              <td
                style={{
                  border: "1px solid #000",
                  height: "70px",
                }}
              ></td>

              <td
                style={{
                  border: "1px solid #000",
                }}
              ></td>

              <td
                style={{
                  border: "1px solid #000",
                }}
              ></td>

              <td
                style={{
                  border: "1px solid #000",
                }}
              ></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}