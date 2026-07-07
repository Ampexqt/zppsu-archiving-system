import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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

        <Table className="w-full">

          {/* HEADER */}
          <TableHeader>

              <TableRow>

                <TableHead className="p-5 text-left">
                  Email
                </TableHead>

                <TableHead className="p-5 text-left">
                  Action
                </TableHead>

                <TableHead className="p-5 text-left">
                  Description
                </TableHead>

                <TableHead className="p-5 text-left">
                  Date
                </TableHead>

                <TableHead className="p-5 text-left">
                  Time
                </TableHead>

              </TableRow>

            </TableHeader>

          {/* BODY */}
<TableBody>

  {logs.map((log) => (

    <TableRow
      key={log.id}
      className="border-b"
    >

      {/* EMAIL */}
      <TableCell className="p-5">
        {log.user?.email || "System"}
      </TableCell>

      {/* ACTION */}
      <TableCell className="p-5">

        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          {log.action}
        </span>

      </TableCell>

      {/* DESCRIPTION */}
      <TableCell className="p-5">
        {log.description}
      </TableCell>

      {/* DATE */}
      <TableCell className="p-5">

        {new Date(
          log.created_at
        ).toLocaleDateString()}

      </TableCell>

      {/* TIME */}
      <TableCell className="p-5">

        {new Date(
          log.created_at
        ).toLocaleTimeString([], {

          hour: "numeric",

          minute: "2-digit",

        })}

      </TableCell>

    </TableRow>

  ))}

</TableBody>

        </Table>

      </div>

    </DashboardLayout>
  );
}

export default Logs;