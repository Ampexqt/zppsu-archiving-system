export default function MemoOtherMattersTemplate({ data }) {
  return (
    <div style={{ padding: "20px", backgroundColor: "white" }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        ZPPSU MASTERLIST OF RECORDS - PRESIDENT'S MEMORANDA (OTHER MATTERS) - 2024
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
            <th style={styles.header}>SUBJECT</th>
            <th style={styles.header}>PERSONNEL</th>
            <th style={styles.header}>ZPPSU MEMO NUMBER</th>
            <th style={styles.header}>FILE LOCATION</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={styles.cell}>{data.date}</td>
            <td style={styles.cell}>{data.access_code}</td>
            <td style={styles.cell}>{data.subject}</td>
            <td style={styles.cell}>{data.personnel}</td>
            <td style={styles.cell}>{data.memo_number}</td>
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