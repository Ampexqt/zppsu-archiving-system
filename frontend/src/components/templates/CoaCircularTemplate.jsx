export default function CoaCircularTemplate({ data }) {
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
              ZPPSU MASTERLIST OF RECORDS- COA CIRCULARS
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
                width: "30%",
              }}
            >
              Access Code #
            </td>

            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                padding: "10px",
                width: "35%",
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
                width: "23%",
              }}
            >
              FILE LOCATION
            </td>
          </tr>

          {/* MONTH */}
          <tr>
            <td
              colSpan="4"
              style={{
                border: "1px solid black",
                background: "yellow",
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
              {data.access_code || ""}
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
              {data.file_location || ""}
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  );
}