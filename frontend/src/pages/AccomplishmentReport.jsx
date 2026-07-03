import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DashboardLayout from "../components/layout/DashboardLayout";

function AccomplishmentReport() {

  const [report, setReport] = useState({
    uploads: 0,
    deletes: 0,
    archives: 0,
    restores: 0,
    moves: 0,
    generated: 0,
  });

  const [activities, setActivities] = useState([]);

  const [startDate,
  setStartDate] =
  useState("");

const [endDate,
  setEndDate] =
  useState("");

  const fetchReport = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res =
  await axios.get(

  `http://localhost:5000/api/accomplishment?startDate=${startDate}&endDate=${endDate}`,

    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

setReport(res.data);

setActivities(
  res.data.recentActivities || []
);
    } catch (error) {

      console.error(error);

    }

  };

  const exportPDF = () => {

  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text(
    "ZPPSU Guidance Office",
    14,
    20
  );

  doc.setFontSize(16);

  doc.text(
    "Accomplishment Report",
    14,
    30
  );

  doc.setFontSize(11);

  doc.text(
    `Start Date: ${
      startDate || "All"
    }`,
    14,
    40
  );

  doc.text(
    `End Date: ${
      endDate || "All"
    }`,
    14,
    48
  );

  autoTable(doc, {

    startY: 60,

    head: [[
      "Metric",
      "Count"
    ]],

    body: [

      [
        "Uploads",
        report.uploads
      ],

      [
        "Deletes",
        report.deletes
      ],

      [
        "Archives",
        report.archives
      ],

      [
        "Restores",
        report.restores
      ],

      [
        "Moves",
        report.moves
      ],

      [
        "Generated",
        report.generated
      ],

    ],

  });

  autoTable(doc, {

    startY:
      doc.lastAutoTable.finalY + 15,

    head: [[
      "Action",
      "Description",
      "Date"
    ]],

    body:
      activities.map(
        (activity) => [

          activity.action,

          activity.description,

          new Date(
            activity.created_at
          ).toLocaleString(),

        ]
      ),

  });

  doc.save(
    "Accomplishment_Report.pdf"
  );

};

  useEffect(() => {

    fetchReport();

  }, []);

  return (

    <DashboardLayout>

      <h1 className="text-4xl font-bold mb-2">

        Accomplishment Report

      </h1>

      <p className="text-gray-500 mb-8">

        Records and activity summary

      </p>

      <div className="
  bg-white
  p-6
  rounded-2xl
  shadow-md
  mb-8
">

  <div className="
  flex
  items-end
  gap-4
  flex-wrap
">

   <div>
  <p className="text-sm font-medium mb-2">
    Start Date
  </p>

  <input
    type="date"
    value={startDate}
    onChange={(e) =>
      setStartDate(e.target.value)
    }
    className="
      border
      p-3
      rounded-xl
      h-[58px]
    "
  />
</div>

<div>
  <p className="text-sm font-medium mb-2">
    End Date
  </p>

  <input
    type="date"
    value={endDate}
    onChange={(e) =>
      setEndDate(e.target.value)
    }
    className="
      border
      p-3
      rounded-xl
      h-[58px]
    "
  />
</div>

   <button
  onClick={fetchReport}
  className="
    h-[58px]
    bg-[#8B0000]
    text-white
    px-6
    rounded-xl
  "
>
  Generate Report
</button>

<button
  onClick={() => window.print()}
  className="
    h-[58px]
    bg-blue-600
    text-white
    px-6
    rounded-xl
  "
>
  Print
</button>

<button
  onClick={exportPDF}
  className="
    h-[58px]
    bg-green-600
    text-white
    px-6
    rounded-xl
  "
>
  Export PDF
</button>

  </div>

</div>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3>Uploads</h3>
          <p className="text-4xl font-bold text-green-600">
            {report.uploads}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3>Deletes</h3>
          <p className="text-4xl font-bold text-red-600">
            {report.deletes}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3>Generated</h3>
          <p className="text-4xl font-bold text-blue-600">
            {report.generated}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3>Restores</h3>
          <p className="text-4xl font-bold text-yellow-600">
            {report.restores}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3>Moves</h3>
          <p className="text-4xl font-bold text-purple-600">
            {report.moves}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3>Archives</h3>
          <p className="text-4xl font-bold text-gray-600">
            {report.archives}
          </p>
        </div>
      </div>

      <div className="
  bg-white
  rounded-2xl
  shadow-md
  p-6
  mt-8
">

  <h2 className="
    text-2xl
    font-bold
    mb-4
  ">
    Recent Activities
  </h2>

  <div className="overflow-x-auto">

    <table className="w-full">

      <thead>

        <tr className="
          bg-[#8B0000]
          text-white
        ">

          <th className="p-3 text-left">
            Action
          </th>

          <th className="p-3 text-left">
            Description
          </th>

          <th className="p-3 text-left">
            Date
          </th>

        </tr>

      </thead>

      <tbody>

        {activities.map(
          (activity) => (

          <tr
            key={activity.id}
            className="border-b"
          >

            <td className="p-3">
              {activity.action}
            </td>

            <td className="p-3">
              {activity.description}
            </td>

            <td className="p-3">

              {
                new Date(
                  activity.created_at
                )
                .toLocaleString()
              }

            </td>

          </tr>

        ))}
      </tbody>

    </table>

  </div>

</div>




    </DashboardLayout>

  );
}

export default AccomplishmentReport;