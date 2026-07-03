export default function MasterListOfRecordsForCollectionTemplate({ data }) {
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
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "18px",
                padding: "12px",
              }}
            >
              MASTERLIST OF RECORDS FOR COLLECTIONS
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
              }}
            >
              RECEIVABLES FROM
            </td>

            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                padding: "10px",
              }}
            >
              AMOUNT
            </td>

            <td
              style={{
                border: "1px solid black",
                textAlign: "center",
                fontWeight: "bold",
                padding: "10px",
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
                wordBreak: "break-word",
              }}
            >
              {data.access_code || ""}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "10px",
                wordBreak: "break-word",
              }}
            >
              {data.receivables_from || ""}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "10px",
                wordBreak: "break-word",
              }}
            >
              {data.amount || ""}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "10px",
                wordBreak: "break-word",
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