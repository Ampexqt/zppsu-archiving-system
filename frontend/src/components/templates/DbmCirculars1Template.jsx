export default function DbmCirculars1Template({ data }) {
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
              ZPPSU MASTERLIST OF RECORDS- DBM CIRCULARS
            </td>
          </tr>

          {/* HEADER */}
          <tr>
            <td style={headerStyle}>Date</td>
            <td style={headerStyle}>ACCESS CODE</td>
            <td style={headerStyle}>SUBJECT</td>
            <td style={headerStyle}>FILE LOCATION</td>
          </tr>

          {/* JANUARY */}
          <tr>
            <td
              colSpan="4"
              style={{
                border: "1px solid black",
                background: "yellow",
                fontWeight: "bold",
                padding: "8px"
              }}
            >
              JANUARY
            </td>
          </tr>

          <tr>
            <td style={cellStyle}>{data.date}</td>
            <td style={cellStyle}>{data.access_code}</td>
            <td style={cellStyle}>{data.subject}</td>
            <td style={cellStyle}>{data.file_location}</td>
          </tr>

        </tbody>
      </table>
    </div>
  );
}

const headerStyle = {
  border: "1px solid black",
  textAlign: "center",
  fontWeight: "bold",
  padding: "10px"
};

const cellStyle = {
  border: "1px solid black",
  padding: "10px"
};