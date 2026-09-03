export default function OutgoingCommunicationsOutsideTemplate({ data }) {
  return (
    <div style={{ padding: "20px", background: "#fff" }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        ZPPSU MASTERLIST OF RECORDS - OUTGOING COMMUNICATIONS OUTSIDE ZC PERIMETER
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={styles.header}>DATE</th>
            <th style={styles.header}>ACCESS CODE</th>
            <th style={styles.header}>CONCERNED AGENCY</th>
            <th style={styles.header}>SUBJECT</th>
            <th style={styles.header}>TRACKING DETAILS</th>
            <th style={styles.header}>FILE LOCATION</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={styles.cell}>{data.date}</td>
            <td style={styles.cell}>{data.access_code || "N/A"}</td>
            <td style={styles.cell}>{data.concerned_agency}</td>
            <td style={styles.cell}>{data.subject}</td>
            <td style={styles.cell}>{data.tracking_details}</td>
            <td style={styles.cell}>{data.file_location}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  header: {
    border: "1px solid black",
    padding: "10px",
    textAlign: "center",
    fontWeight: "bold",
  },

  cell: {
    border: "1px solid black",
    padding: "10px",
    textAlign: "center",
  },
};