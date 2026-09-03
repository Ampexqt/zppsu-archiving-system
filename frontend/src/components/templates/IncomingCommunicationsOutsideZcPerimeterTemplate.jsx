export default function IncomingCommunicationsOutsideZcPerimeterTemplate({ data }) {
  return (
    <div style={{ width: "100%", background: "#fff" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >
        <tbody>
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
              ZPPSU MASTERLIST OF RECORDS - INCOMING COMMUNICATIONS OUTSIDE ZC PERIMETER 2024
            </td>
          </tr>

          <tr>
            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center" }}>DATE</td>
            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center" }}>ACCESS CODE</td>
            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center" }}>AGENCY</td>
            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center" }}>SUBJECT</td>
            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center" }}>ACTION TAKEN</td>
            <td style={{ border: "1px solid black", fontWeight: "bold", textAlign: "center" }}>FILE LOCATION</td>
          </tr>

          <tr>
            <td style={{ border: "1px solid black", padding: "10px" }}>{data.date}</td>
            <td style={{ border: "1px solid black", padding: "10px" }}>{data.access_code || "N/A"}</td>
            <td style={{ border: "1px solid black", padding: "10px" }}>{data.agency}</td>
            <td style={{ border: "1px solid black", padding: "10px" }}>{data.subject}</td>
            <td style={{ border: "1px solid black", padding: "10px" }}>{data.action_taken}</td>
            <td style={{ border: "1px solid black", padding: "10px" }}>{data.file_location}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}