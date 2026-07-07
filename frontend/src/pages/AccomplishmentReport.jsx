import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText, Printer, Download } from "lucide-react";
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
  className="flex items-center justify-center gap-2 h-[58px] bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-xl font-medium transition"
>
  <FileText className="w-5 h-5" /> Generate Report
</button>

<button
  onClick={() => window.print()}
  className="flex items-center justify-center gap-2 h-[58px] bg-primary/10 text-primary hover:bg-primary/20 px-6 rounded-xl font-medium transition"
>
  <Printer className="w-5 h-5" /> Print
</button>

<button
  onClick={exportPDF}
  className="flex items-center justify-center gap-2 h-[58px] bg-primary/10 text-primary hover:bg-primary/20 px-6 rounded-xl font-medium transition"
>
  <Download className="w-5 h-5" /> Export PDF
</button>

  </div>

</div>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-muted-foreground">Uploads</h3>
          <p className="text-4xl font-bold text-primary mt-2">
            {report.uploads}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-muted-foreground">Deletes</h3>
          <p className="text-4xl font-bold text-accent mt-2">
            {report.deletes}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-muted-foreground">Generated</h3>
          <p className="text-4xl font-bold text-primary/80 mt-2">
            {report.generated}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-muted-foreground">Restores</h3>
          <p className="text-4xl font-bold text-accent/80 mt-2">
            {report.restores}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-muted-foreground">Moves</h3>
          <p className="text-4xl font-bold text-primary/60 mt-2">
            {report.moves}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-muted-foreground">Archives</h3>
          <p className="text-4xl font-bold text-muted-foreground mt-2">
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

        <tr>

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