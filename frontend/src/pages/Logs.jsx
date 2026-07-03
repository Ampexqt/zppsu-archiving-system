import { useEffect, useState } from "react";

import axios from "axios";

import DashboardLayout from "../components/layout/DashboardLayout";

function Logs() {

  const [logs, setLogs] =
    useState([]);

  // FETCH LOGS
  const fetchLogs = async () => {

    try {

      const response =
        await axios.get(
          "http://localhost:5000/api/logs"
        );

      setLogs(response.data);

    } catch (error) {

      console.error(error);
    }
  };

  // LOAD LOGS
  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <DashboardLayout>

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Activity Logs
        </h1>

        <p className="text-gray-500 mt-2">
          System audit trail
        </p>

      </div>

      {/* LOGS TABLE */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        <table className="w-full">

          {/* HEADER */}
          <thead>

              <tr className="bg-[#8B0000] text-white">

                <th className="p-5 text-left">
                  Email
                </th>

                <th className="p-5 text-left">
                  Action
                </th>

                <th className="p-5 text-left">
                  Description
                </th>

                <th className="p-5 text-left">
                  Date
                </th>

                <th className="p-5 text-left">
                  Time
                </th>

              </tr>

            </thead>

          {/* BODY */}
<tbody>

  {logs.map((log) => (

    <tr
      key={log.id}
      className="border-b"
    >

      {/* EMAIL */}
      <td className="p-5">
        {log.user?.email || "System"}
      </td>

      {/* ACTION */}
      <td className="p-5">

        <span className="bg-[#8B0000] text-white px-3 py-1 rounded-full text-sm">
          {log.action}
        </span>

      </td>

      {/* DESCRIPTION */}
      <td className="p-5">
        {log.description}
      </td>

      {/* DATE */}
      <td className="p-5">

        {new Date(
          log.created_at
        ).toLocaleDateString()}

      </td>

      {/* TIME */}
      <td className="p-5">

        {new Date(
          log.created_at
        ).toLocaleTimeString([], {

          hour: "numeric",

          minute: "2-digit",

        })}

      </td>

    </tr>

  ))}

</tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}

export default Logs;