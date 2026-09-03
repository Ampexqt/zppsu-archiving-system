export default function StudentAdmissionRecordsTemplate({ data }) {
  return (
    <div style={{ padding: "20px", background: "#fff" }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        MASTERLIST OF RECORDS FOR STUDENT ADMISSION RECORDS
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
            <th style={styles.header}>SEMESTER/YEAR</th>
            <th style={styles.header}>FILE LOCATION</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={styles.cell}>{data.access_code || "N/A"}</td>
            <td style={styles.cell}>{data.name}</td>
            <td style={styles.cell}>{data.semester_year}</td>
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