import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import axios from "axios";
import { ArrowUpToLine, ArrowDownToLine, Trash2 } from "lucide-react";

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
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

        <Table className="w-full">

          {/* TABLE HEADER */}
          <TableHeader>

            <TableRow>

              <TableHead className="text-left p-6">
                Full Name
              </TableHead>

              <TableHead className="text-left p-6">
                Email
              </TableHead>

              <TableHead className="text-left p-6">
                Role
              </TableHead>

              <TableHead className="text-left p-6">
                Created At
              </TableHead>

              <TableHead className="text-left p-6">
                Actions
              </TableHead>

            </TableRow>

          </TableHeader>

          {/* TABLE BODY */}
          <TableBody>

            {users.map((user) => (

              <TableRow
                key={user.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >

                {/* NAME */}
                <TableCell className="p-6 font-medium">

                  {user.name}

                </TableCell>

                {/* EMAIL */}
                <TableCell className="p-6">

                  {user.email}

                </TableCell>

                {/* ROLE */}
                <TableCell className="p-6">

                  <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">

                    {user.role} 

                  </span>

                </TableCell>

                {/* CREATED AT */}
                <TableCell className="p-6">

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

                        className="p-2 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition"
                        title="Promote User"

                      >

                        <ArrowUpToLine className="w-5 h-5" />

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

                        className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-full transition"
                        title="Demote User"

                      >

                        <ArrowDownToLine className="w-5 h-5" />

                      </button>

                    )}

                    <button

                      onClick={() =>
                        handleDelete(
                          user.id
                        )
                      }

                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition"
                        title="Delete User"

                    >

                      <Trash2 className="w-5 h-5" />

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