import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import axios from "axios";
import { ArrowUpToLine, ArrowDownToLine, Trash2, Plus, Eye, EyeOff } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";

function Users() {

  const currentUser =
  JSON.parse(
    localStorage.getItem("user")
  );

  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/auth/register", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("User created successfully!");
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create user");
    }
  };

  // FETCH USERS
  const fetchUsers = async () => {

    try {
      const token = localStorage.getItem("token");
      const response =
        await axios.get(
          "http://localhost:5000/api/users",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
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
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-black dark:text-white">User Management</h1>
          <p className="text-gray-500 dark:text-gray-300 mt-2 text-lg">Manage system users</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 h-11 rounded-lg font-medium transition shadow-sm">
              <Plus className="w-4 h-4" />
              Create User
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] p-6 bg-white border border-gray-100 rounded-2xl shadow-xl">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold text-gray-900">Create New User</DialogTitle>
              <DialogDescription className="text-gray-500 text-sm mt-1">
                Add a new staff account to the system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                <Input
                  type="text"
                  name="name"
                  placeholder="e.g. Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 h-11 px-4 rounded-xl text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="e.g. staff@zppsu.edu.ph"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 h-11 px-4 rounded-xl text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 h-11 px-4 pr-12 rounded-xl text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-xl font-semibold transition shadow-sm mt-2"
              >
                <Plus className="w-4 h-4" />
                Create User
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* USERS TABLE */}
      <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-b border-gray-100">
                <TableHead className="text-left font-semibold text-gray-600 p-5">Full Name</TableHead>
                <TableHead className="text-left font-semibold text-gray-600 p-5">Email</TableHead>
                <TableHead className="text-left font-semibold text-gray-600 p-5">Role</TableHead>
                <TableHead className="text-left font-semibold text-gray-600 p-5">Created At</TableHead>
                <TableHead className="text-left font-semibold text-gray-600 p-5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                  {/* NAME */}
                  <TableCell className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shadow-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <span className="font-semibold text-gray-900">{user.name}</span>
                    </div>
                  </TableCell>

                  {/* EMAIL */}
                  <TableCell className="p-5 text-gray-600">
                    {user.email}
                  </TableCell>

                  {/* ROLE */}
                  <TableCell className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm ${
                      user.role === "Admin" ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}>
                      {user.role} 
                    </span>
                  </TableCell>

                  {/* CREATED AT */}
                  <TableCell className="p-5 text-gray-500 font-medium">
                    {new Date(user.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="p-5">
                    <div className="flex gap-2">
                      {user.role === "User" && (
                        <button
                          onClick={() => handlePromote(user.id)}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Promote to Admin"
                        >
                          <ArrowUpToLine className="w-4 h-4" />
                        </button>
                      )}

                      {user.role === "Admin" && currentUser?.id !== user.id && (
                        <button
                          onClick={() => handleDemote(user.id)}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="Demote to User"
                        >
                          <ArrowDownToLine className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-gray-400 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </DashboardLayout>
  );
}

export default Users;