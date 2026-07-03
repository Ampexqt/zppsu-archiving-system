import { useEffect, useState }
from "react";

import axios from "axios";

import {

  ResponsiveContainer,

  BarChart,

  Bar,

  XAxis,

  YAxis,

  Tooltip,

  PieChart,

  Pie,

  Cell,

} from "recharts";

import DashboardLayout from
"../components/layout/DashboardLayout";

import { useNavigate }
from "react-router-dom";

function Dashboard() {

  const navigate =
  useNavigate();

  const user = JSON.parse(
  localStorage.getItem("user")
);

  const [
    files,
    setFiles
  ] = useState([]);

  const [
  categoryChartData,
  setCategoryChartData
] = useState([]);

const [
  maxCapacity,
  setMaxCapacity
] = useState(500);

const [
  storagePercentage,
  setStoragePercentage
] = useState(0);

const [
  cabinetUsage,
  setCabinetUsage
] = useState([]);

const [
  topUsers,
  setTopUsers
] = useState([]);

const [analytics, setAnalytics] =
  useState({});

  // FETCH FILES
  const fetchFiles =
  async () => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await axios.get(
          "http://localhost:5000/api/files",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      console.log(
        "FILES:",
        response.data
      );

      setFiles(
        response.data
      );

    } catch (error) {

      console.error(
        "FETCH FILES ERROR:",
        error.response?.data ||
        error.message
      );

    }

  };
  useEffect(() => {

  fetchFiles();

  fetchAnalytics();

}, []);

  const fetchAnalytics =
  async () => {

    try {

      const token =
  localStorage.getItem("token");

const response =
  await axios.get(
    "http://localhost:5000/api/dashboard/analytics",
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );
  setAnalytics(
  response.data
);
      const chartData =

        response.data.documentsPerCategory.map(
          (item) => ({

            category:
              item.document_type,

            count:
              item._count.id,

          })
        );

      setCategoryChartData(
        chartData
      );

      setMaxCapacity(
  response.data.maxCapacity
);

setStoragePercentage(
  response.data.storagePercentage
);

setCabinetUsage(
  response.data.cabinetUsage || []
);

setTopUsers(
  response.data.topUsers || []
);  

      console.log(
  "CATEGORY CHART:",
  chartData
);

    } catch (error) {

      console.error(error);

    }

  };

  // ANALYTICS
  const totalDocuments =
    files.length;

  const activeDocuments =
    files.filter(
      (file) =>
        file.status ===
        "Active"
    ).length;

  const archivedDocuments =
    files.filter(
      (file) =>
        file.status ===
        "Archived"
    ).length;

  const pendingDocuments =
    files.filter(
      (file) =>
        file.status ===
        "Pending"
    ).length;

    // MOST USED DOCUMENT TYPE
const documentTypeCounts = {};

files.forEach((file) => {

  if (
    file.document_type
  ) {

    documentTypeCounts[
      file.document_type
    ] =

      (
        documentTypeCounts[
          file.document_type
        ] || 0
      ) + 1;

  }

});

const mostUsedDocument =

  Object.entries(
    documentTypeCounts
  ).sort(

    (a, b) =>
      b[1] - a[1]

  )[0];

  const recentUploads =
    files.slice(0, 5);

  // STATUS CHART DATA
  const statusData = [

    {
      name: "Active",
      value: activeDocuments,
    },

    {
      name: "Archived",
      value: archivedDocuments,
    },

    {
      name: "Pending",
      value: pendingDocuments,
    },

  ];

  // MONTHLY DOCUMENTS
  const monthlyData = [

    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",

  ].map((month, index) => {

    const count =
      files.filter((file) => {

        if (!file.created_at)
          return false;

        return (
          new Date(
            file.created_at
          ).getMonth() ===
          index
        );

      }).length;

    return {
      month,
      documents: count,
    };

  });

  const COLORS = [
    "#22c55e",
    "#6b7280",
    "#eab308",
  ];

  return (

    <DashboardLayout>

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="
          text-4xl
          font-bold
        ">

          Dashboard

        </h1>

        <p className="
          text-gray-500
          mt-2
        ">

          Smart Records and
          Archiving Analytics

        </p>

      </div>

      {/* STATS */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-5
        gap-6
        mb-10
      ">

        {/* TOTAL */}
       <div
        onClick={() =>
          navigate("/document-center")
        }
        className="
          bg-white
          rounded-2xl
          shadow-md
          p-6
          cursor-pointer
          hover:shadow-xl
          hover:-translate-y-1
          transition
        "
>

          <p className="
            text-gray-500
            text-sm
          ">

            Total Documents

          </p>

          <h2 className="
            text-4xl
            font-bold
            mt-3
            text-[#8B0000]
          ">

            {
              totalDocuments
            }

          </h2>

        </div>

        {/* ACTIVE */}
        <div
            onClick={() =>
              navigate("/document-center")
            }
            className="
              bg-white
              rounded-2xl
              shadow-md
              p-6
              cursor-pointer
              hover:shadow-xl
              hover:-translate-y-1
              transition
            "
          >

          <p className="
            text-gray-500
            text-sm
          ">

            Active Documents

          </p>

          <h2 className="
            text-4xl
            font-bold
            mt-3
            text-green-500
          ">

            {
              activeDocuments
            }

          </h2>

        </div>

        {/* ARCHIVED */}
        <div
          onClick={() =>
            navigate("/document-center")
          }
          className="
            bg-white
            rounded-2xl
            shadow-md
            p-6
            cursor-pointer
            hover:shadow-xl
            hover:-translate-y-1
            transition
          "
        >
          <p className="
            text-gray-500
            text-sm
          ">

            Archived Documents

          </p>

          <h2 className="
            text-4xl
            font-bold
            mt-3
            text-gray-500
          ">

            {
              archivedDocuments
            }

          </h2>

        </div>

        {/* MOST USED */}
        <div
            onClick={() =>
              navigate("/document-center")
            }
            className="
              bg-white
              rounded-2xl
              shadow-md
              p-6
              cursor-pointer
              hover:shadow-xl
              hover:-translate-y-1
              transition
            "
          >

          <p className="
            text-gray-500
            text-sm
          ">

            Most Used Document Type

          </p>

          <h2 className="
            text-2xl
            font-bold
            mt-3
            text-red-500
          ">

            {

              mostUsedDocument

              ?

              mostUsedDocument[0]

              :

              "No Data"

            }

          </h2>

          <p className="
            text-gray-500
            mt-2
          ">

            {

              mostUsedDocument

              ?

              `${mostUsedDocument[1]} Documents`

              :

              ""

            }

          </p>

        </div>
{/* TOP ACTIVE USERS */}
<div
  className="
    bg-white
    rounded-2xl
    shadow-md
    p-6
  "
>

  <p className="
    text-gray-500
    text-sm
    mb-3
  ">
    Top Active Users
  </p>

  {

    analytics.topUsers?.length > 0

    ?

    analytics.topUsers
      .slice(0, 2)
      .map((user, index) => (

        <div
          key={index}
          className="
            flex
            justify-between
            mb-2
          "
        >

       <span
  className="
    font-medium
    text-sm
    truncate
    max-w-[120px]
  "
>

  #{index + 1} {user.name}

</span>

         <div className="
          bg-[#8B0000]
          text-white
          px-2
          py-1
          rounded-lg
          text-sm
          font-bold
        ">
          {user.activities}
        </div>

        </div>

      ))

    :

    <p>No Data</p>

  }

</div>

      </div>

      

      <div className="
  bg-white
  rounded-2xl
  shadow-md
  p-6
  mb-10
">

  <h2 className="
    text-2xl
    font-bold
    mb-4
  ">
    Storage Capacity
  </h2>

  <p className="
    text-lg
    mb-3
  ">
    {totalDocuments}
    {" / "}
    {maxCapacity}
    Documents
  </p>

  <div className="
    w-full
    h-6
    bg-gray-200
    rounded-full
    overflow-hidden
  ">

    <div

      className="
        h-full
        bg-[#8B0000]
      "

      style={{
        width:
          `${storagePercentage}%`
      }}

    />

  </div>

  <p className="
    mt-3
    font-bold
    text-[#8B0000]
  ">
    {storagePercentage}%
  </p>

</div>

<div className="
  bg-white
  rounded-2xl
  shadow-md
  p-6
  mb-10
">

  <h2 className="
    text-2xl
    font-bold
    mb-6
  ">
    Cabinet Usage Monitoring
  </h2>

  {

    cabinetUsage.map(
      (cabinet) => {

        const percentage =

          Math.round(

            (
              cabinet.files.length /

              cabinet.folder_count

            ) * 100

          );

        return (

          <div
            key={cabinet.id}
            className="mb-6"
          >

            <div className="
              flex
              justify-between
              mb-2
            ">

              <span className="font-semibold">

                {
                  cabinet.cabinet_name
                }

              </span>

              <span>

                {
                  cabinet.files.length
                }

                /

                {
                  cabinet.folder_count
                }

              </span>

            </div>

            <div className="
              w-full
              h-5
              bg-gray-200
              rounded-full
              overflow-hidden
            ">

              <div

                className="
                  h-full
                  bg-green-600
                "

                style={{
                  width:
                    `${percentage}%`
                }}

              />

            </div>

            <p className="
              mt-2
              text-sm
              text-gray-500
            ">

              {percentage}% Used

            </p>

          </div>

        );

      }
    )

  }

</div>

      {/* CHARTS */}
      <div className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
        mb-10
      ">

        {/* BAR CHART */}
        <div className="
          bg-white
          rounded-2xl
          shadow-md
          p-6
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-6
          ">

            Documents Per Month

          </h2>

          <div className="
            w-full
            h-[350px]
          ">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={monthlyData}
              >

                <XAxis
                  dataKey="month"
                />

                <YAxis />

                <Tooltip />

                <Bar
                dataKey="documents"
                fill="#8B0000"
                radius={[10,10,0,0]}
                barSize={35}
              />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* PIE CHART */}
        <div className="
          bg-white
          rounded-2xl
          shadow-md
          p-6
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-6
          ">

            Status Distribution

          </h2>

          <div className="
            w-full
            h-[350px]
          ">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie

                  data={statusData}

                  cx="50%"

                  cy="50%"

                  outerRadius={120}

                  dataKey="value"

                  label

                >

                  {
                    statusData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={`cell-${index}`}
                          fill={
                            COLORS[
                              index %
                              COLORS.length
                            ]
                          }
                        />

                      )
                    )
                  }

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      <div className="
  bg-white
  rounded-2xl
  shadow-md
  p-6
  mb-10
">

  <h2 className="
    text-2xl
    font-bold
    mb-6
  ">
    Documents Per Category
  </h2>

  <div
  style={{
    width: "100%",
    height: "500px"
  }}
>

    <ResponsiveContainer
      width="100%"
      height="100%"
    >

      <BarChart
        layout="vertical"
        data={categoryChartData}
      >

        <XAxis
          type="number"
        />

        <YAxis
          dataKey="category"
          type="category"
          width={250}
        />

        <Tooltip />

        <Bar
          dataKey="count"
          fill="#8B0000"
          radius={[0,10,10,0]}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>

</div>

      {/* RECENT UPLOADS */}
      <div className="
        bg-white
        rounded-2xl
        shadow-md
        p-6
      ">

        <div className="
          flex
          items-center
          justify-between
          mb-6
        ">

          <h2 className="
            text-2xl
            font-bold
          ">

            Recent Uploads

          </h2>

        </div>

        <div className="
          overflow-x-auto
        ">

          <table className="
            w-full
            border-collapse
          ">

            <thead>

              <tr className="
                bg-[#8B0000]
                text-white
              ">

                <th className="
                  p-4
                  text-left
                ">
                  Document ID
                </th>

                <th className="
                  p-4
                  text-left
                ">
                  Subject
                </th>

                <th className="p-4 text-left">
                    Document Type
                  </th>

                  {
                    user?.role === "Admin" && (
                      <th className="p-4 text-left">
                        Uploaded By
                      </th>
                    )
                  }

                  <th className="p-4 text-left">
                    Status
                  </th>

                <th className="
                  p-4
                  text-left
                ">
                  Date Uploaded
                </th>

              </tr>

            </thead>

            <tbody>

              {
                recentUploads.length > 0

                ?

                recentUploads.map(
                  (file) => (

                    <tr
                      key={file.id}
                      className="
                        border-b
                        hover:bg-gray-50
                      "
                    >

                      {/* DOC ID */}
                      <td className="
                        p-4
                        font-semibold
                        text-[#8B0000]
                      ">

                        {
                          file.document_id
                        }

                      </td>

                        {/* SUBJECT */}
                        <td className="
                          p-4
                        ">

                          {
                            file.subject
                          }

                        </td>

                        {/* TYPE */}
                        <td className="p-4">
                          {file.document_type}
                        </td>

                        {
                          user?.role === "Admin" && (
                            <td className="p-4">
                              {file.user?.email || "Unknown"}
                            </td>
                          )
                        }
                        {/* STATUS */}
                        <td className="
                          p-4
                        ">

                        <span
                          className={`
                            px-4
                            py-2
                            rounded-full
                            text-white
                            text-sm

                            ${

                              file.status ===
                              "Active"

                              ?

                              "bg-green-500"

                              :

                              file.status ===
                              "Archived"

                              ?

                              "bg-gray-500"

                              :

                              file.status ===
                              "Pending"

                              ?

                              "bg-yellow-500"

                              :

                              "bg-blue-500"

                            }
                          `}
                        >

                          {
                            file.status ||
                            "Active"
                          }

                        </span>

                      </td>

                      {/* DATE */}
                      <td className="
                        p-4
                      ">

                        {
                          file.created_at

                          ?

                          new Date(
                            file.created_at
                          ).toLocaleDateString()

                          :

                          "No Date"
                        }

                      </td>

                    </tr>

                  )
                )

                :

                <tr>

                  <td
                    colSpan="5"
                    className="
                      text-center
                      py-10
                      text-gray-500
                    "
                  >

                    No uploads yet

                  </td>

                </tr>

              }

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Dashboard;