export default function StudentAccountTemplate({
  document,
}) {
  const data = document.dynamic_data || {};

  return (
    <div className="w-full">
      <div
        style={{
          border: "1px solid black",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "22px",
          padding: "12px",
        }}
      >
        MASTERLIST OF RECORDS FOR
        STUDENT ACCOUNT
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              ACCESS CODE
            </th>

            <th
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              NAME OF STUDENT
            </th>

            <th
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              FILE LOCATION
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              {document.access_code || "N/A"}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              {data.student_name}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              {data.file_location}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}