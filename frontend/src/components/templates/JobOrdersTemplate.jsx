export default function JobOrdersTemplate({ data }) {
  return (
    <div style={{ padding: "20px", backgroundColor: "white" }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        MASTERLIST OF RECORDS FOR JOB ORDER WORKERS
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={styles.header}>ACCESS CODE</th>
            <th style={styles.header}>NAME</th>
            <th style={styles.header}>PERIOD</th>
            <th style={styles.header}>FILE LOCATION</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={styles.cell}>{data.access_code}</td>
            <td style={styles.cell}>{data.name}</td>
            <td style={styles.cell}>{data.period}</td>
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