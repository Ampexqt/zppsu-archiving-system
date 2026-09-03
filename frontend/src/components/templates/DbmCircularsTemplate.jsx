export default function DbmCircularsTemplate({ data }) {
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
              colSpan="6"
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "20px",
                padding: "15px"
              }}
            >
              ZPPSU MASTERLIST OF RECORDS- DBM CIRCULARS 2024
            </td>
          </tr>

          {/* HEADERS */}
          <tr>
            <td style={headerStyle}>Date</td>
            <td style={headerStyle}>Access Code #</td>
            <td style={headerStyle}>SUBJECT</td>
            <td style={headerStyle}>ACTION TAKEN</td>
            <td style={headerStyle}>ZPPSU MEMO NUMBER</td>
            <td style={headerStyle}>FILE LOCATION</td>
          </tr>

          {/* MONTH */}
          <tr>
            <td
              colSpan="6"
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
            <td style={cellStyle}>{data.date}</td>
            <td style={cellStyle}>{data.access_code || "N/A"}</td>
            <td style={cellStyle}>{data.subject}</td>
            <td style={cellStyle}>{data.action_taken}</td>
            <td style={cellStyle}>{data.memo_number}</td>
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