import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import axios from "axios";

import DashboardLayout from "../components/layout/DashboardLayout";

function Users() {

  const currentUser =
  JSON.parse(
    localStorage.getItem("user")
  );

  const [users, setUsers] =
    useState([]);

  // FETCH USERS
  const fetchUsers = async () => {

    try {

      const response =
        await axios.get(
          "http://localhost:5000/api/users"
        );

      setUsers(response.data);

    } catch (error) {

      console.error(error);
    }
  };

  // LOAD USERS
  useEffect(() => {

    fetchUsers();

  }, []);

  // DELETE USER
  const handleDelete =
  async (id) => {

  const confirmDelete =
    window.confirm(
      "Delete this user?"
    );

  if (!confirmDelete) return;

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    await axios.delete(

      `http://localhost:5000/api/users/${id}`,

      {

        headers: {

          Authorization:
            `Bearer ${token}`,

        },

      }

    );

    alert(
      "User deleted successfully!"
    );

    fetchUsers();

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to delete user"
    );
  }
};

  // PROMOTE USER
const handlePromote =
  async (id) => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      await axios.put(

        `http://localhost:5000/api/users/promote/${id}`,

        {},

        {

          headers: {

            Authorization:
              `Bearer ${token}`,

          },

        }

      );

      alert(
        "User promoted successfully!"
      );

      fetchUsers();

    } catch (error) {

      console.error(error);

      alert(
        "Promotion failed"
      );

    }

  };

// DEMOTE USER
const handleDemote =
  async (id) => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      await axios.put(

        `http://localhost:5000/api/users/demote/${id}`,

        {},

        {

          headers: {

            Authorization:
              `Bearer ${token}`,

          },

        }

      );

      alert(
        "User demoted successfully!"
      );

      fetchUsers();

    } catch (error) {

      console.error(error);

      alert(
        "Demotion failed"
      );

    }

  };



  return (

    <DashboardLayout>

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-5xl font-bold text-black dark:text-white">

          User Management

        </h1>

        <p className="text-gray-500 dark:text-gray-300 mt-3 text-lg">

          Manage system users

        </p>

      </div>

      {/* USERS TABLE */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-xl overflow-hidden">

        <Table className="w-full">

          {/* TABLE HEADER */}
          <TableHeader className="bg-[#8B0000] text-white">

            <TableRow>

              <TableHead className="text-left p-6 text-lg">
                Full Name
              </TableHead>

              <TableHead className="text-left p-6 text-lg">
                Email
              </TableHead>

              <TableHead className="text-left p-6 text-lg">
                Role
              </TableHead>

              <TableHead className="text-left p-6 text-lg">
                Created At
              </TableHead>

              <TableHead className="text-left p-6 text-lg">
                Actions
              </TableHead>

            </TableRow>

          </TableHeader>

          {/* TABLE BODY */}
          <TableBody>

            {users.map((user) => (

              <TableRow
                key={user.id}
                className="border-b border-gray-200 dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >

                {/* NAME */}
                <TableCell className="p-6 text-lg font-medium">

                  {user.name}

                </TableCell>

                {/* EMAIL */}
                <TableCell className="p-6 text-lg">

                  {user.email}

                </TableCell>

                {/* ROLE */}
                <TableCell className="p-6">

                  <span className="bg-[#8B0000] text-white px-4 py-2 rounded-full text-sm font-bold">

                    {user.role} 

                  </span>

                </TableCell>

                {/* CREATED AT */}
                <TableCell className="p-6 text-lg">

                  {new Date(
                    user.created_at
                  ).toLocaleDateString()}

                </TableCell>

                {/* ACTIONS */}
                <TableCell className="p-6">

                  <div className="flex gap-2">

                    {user.role === "User" && (

                      <button

                        onClick={() =>
                          handlePromote(
                            user.id
                          )
                        }

                        className="
                          bg-green-500
                          hover:bg-green-600
                          text-white
                          px-4
                          py-2
                          rounded-xl
                          font-semibold
                        "

                      >

                        Promote

                      </button>

                    )}

                    {user.role === "Admin" &&

                      currentUser?.id !==
                      user.id && (

                      <button

                        onClick={() =>
                          handleDemote(
                            user.id
                          )
                        }

                        className="
                          bg-yellow-500
                          hover:bg-yellow-600
                          text-white
                          px-4
                          py-2
                          rounded-xl
                          font-semibold
                        "

                      >

                        Demote

                      </button>

                    )}

                    <button

                      onClick={() =>
                        handleDelete(
                          user.id
                        )
                      }

                      className="
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        px-4
                        py-2
                        rounded-xl
                        font-semibold
                      "

                    >

                      Delete

                    </button>

                  </div>

                </TableCell>
              </TableRow>
            ))}

          </TableBody>

        </Table>

      </div>

    </DashboardLayout>
  );
}

export default Users;