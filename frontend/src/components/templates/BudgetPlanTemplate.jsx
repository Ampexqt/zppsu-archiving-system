export default function BudgetPlanTemplate({
  document,
}) {
  const data =
    document.dynamic_data || {};

  return (
    <div className="w-full">

      <div
        style={{
          border: "1px solid black",
          padding: "12px",
          fontWeight: "bold",
          fontSize: "22px",
          textAlign: "center",
        }}
      >
        MASTERLIST OF RECORDS FOR
        BUDGET PLAN
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >

        <thead>

          {/* HEADER */}
          <tr
           
          >
            <th
              style={{
                border:
                  "1px solid black",
                padding: "10px",
              }}
            >
              ACCESS CODE
            </th>

            <th
              style={{
                border:
                  "1px solid black",
                padding: "10px",
              }}
            >
              YEAR AND PROPOSED
              BUDGET
            </th>

            <th
              style={{
                border:
                  "1px solid black",
                padding: "10px",
              }}
            >
              FILE LOCATION
            </th>
          </tr>

          {/* YELLOW BLANK ROW */}
          <tr
            style={{
              backgroundColor:
                "#ffff00",
              height: "30px",
            }}
          >
            <td
              style={{
                border:
                  "1px solid black",
              }}
            />

            <td
              style={{
                border:
                  "1px solid black",
              }}
            />

            <td
              style={{
                border:
                  "1px solid black",
              }}
            />
          </tr>

        </thead>

        <tbody>

          <tr>

            <td
              style={{
                border:
                  "1px solid black",
                padding: "10px",
              }}
            >
              {document.access_code}
            </td>

            <td
              style={{
                border:
                  "1px solid black",
                padding: "10px",
              }}
            >
              {
                data.year_and_proposed_budget
              }
            </td>

            <td
              style={{
                border:
                  "1px solid black",
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