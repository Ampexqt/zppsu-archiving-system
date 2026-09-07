import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import axios from "axios";
import { ArrowUpToLine, ArrowDownToLine, Trash2, Plus, Eye, EyeOff, Wand2, Copy, Check, Key } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import { useModal } from "../context/ModalContext";

function Users() {

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const modal = useModal();

  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [userToReset, setUserToReset] = useState(null);
  const [resetPasswordValue, setResetPasswordValue] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isResetCopied, setIsResetCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePassword = () => {
    const colors = ["Red", "Blue", "Green", "Gold", "Pink", "Dark", "Nova", "Star", "Neon", "Cyber"];
    const nouns = ["Lion", "Bear", "Wolf", "Hawk", "Fox", "Bird", "Fish", "Cat", "Moon", "Sun"];
    const syms = "!@#$%^&*";
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 90) + 10; // 10-99
    const randomSym = syms[Math.floor(Math.random() * syms.length)];
    
    const newPass = `${randomColor}${randomNoun}${randomSym}${randomNumber}`;
    
    setFormData((prev) => ({ ...prev, password: newPass }));
    setShowPassword(true);
  };

  const copyPassword = () => {
    if (formData.password) {
      navigator.clipboard.writeText(formData.password);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/auth/register", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await modal.alert({ title: "Success", message: "User created successfully!", variant: "success" });
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (error) {
      console.error(error);
      await modal.alert({ title: "Error", message: error.response?.data?.message || "Failed to create user", variant: "danger" });
    }
  };

  const generateResetPassword = () => {
    const colors = ["Red", "Blue", "Green", "Gold", "Pink", "Dark", "Nova", "Star", "Neon", "Cyber"];
    const nouns = ["Lion", "Bear", "Wolf", "Hawk", "Fox", "Bird", "Fish", "Cat", "Moon", "Sun"];
    const syms = "!@#$%^&*";
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 90) + 10;
    const randomSym = syms[Math.floor(Math.random() * syms.length)];
    
    const newPass = `${randomColor}${randomNoun}${randomSym}${randomNumber}`;
    
    setResetPasswordValue(newPass);
    setShowResetPassword(true);
  };

  const copyResetPassword = () => {
    if (resetPasswordValue) {
      navigator.clipboard.writeText(resetPasswordValue);
      setIsResetCopied(true);
      setTimeout(() => setIsResetCopied(false), 2000);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/users/reset-password/${userToReset.id}`, 
        { password: resetPasswordValue }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await modal.alert({ title: "Success", message: "Password reset successfully!", variant: "success" });
      setResetModalOpen(false);
      setUserToReset(null);
      setResetPasswordValue("");
    } catch (error) {
      console.error(error);
      await modal.alert({ title: "Error", message: error.response?.data?.message || "Failed to reset password", variant: "danger" });
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
  const handleDelete = async (id) => {
    const confirmDelete = await modal.confirm({
      title: "Delete User",
      message: "Are you sure you want to delete this user? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger"
    });

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

    await modal.alert({ title: "Success", message: "User deleted successfully!", variant: "success" });

    fetchUsers();

  } catch (error) {

    console.error(error);

    await modal.alert({ title: "Error", message: error.response?.data?.message || "Failed to delete user", variant: "danger" });
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

      await modal.alert({ title: "Success", message: "User promoted successfully!", variant: "success" });

      fetchUsers();

    } catch (error) {

      console.error(error);

      await modal.alert({ title: "Error", message: "Promotion failed", variant: "danger" });

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

      await modal.alert({ title: "Success", message: "User demoted successfully!", variant: "success" });

      fetchUsers();

    } catch (error) {

      console.error(error);

      await modal.alert({ title: "Error", message: "Demotion failed", variant: "danger" });

    }

  };



  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1D1A1B] tracking-tight">User Management</h1>
            <p className="text-xs text-[#5F5A5C] mt-0.5">Manage system staff and administrator accounts</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger className="flex items-center justify-center gap-2 bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] px-4 h-9 rounded-xl font-bold text-xs transition shadow-xs cursor-pointer">
              <Plus className="w-4 h-4" />
              Create User
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-6 bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl shadow-xl">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-base font-bold text-[#1D1A1B]">Create New User</DialogTitle>
                <DialogDescription className="text-[#5F5A5C] text-xs mt-1">
                  Add a new staff account to the system.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1D1A1B] uppercase">Full Name</label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="e.g. Jane Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] h-10 px-3 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1D1A1B] uppercase">Email Address</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="e.g. staff@zppsu.edu.ph"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] h-10 px-3 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#1D1A1B] uppercase">Password</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={copyPassword}
                        className={`text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                          isCopied ? "text-green-600" : "text-[#5F5A5C] hover:text-[#1D1A1B]"
                        }`}
                        disabled={!formData.password}
                      >
                        {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {isCopied ? "Copied" : "Copy"}
                      </button>
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="text-[10px] text-[#6B1D2A] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Wand2 className="w-3 h-3" />
                        Generate
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] h-10 px-3 pr-10 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5F5A5C] hover:text-[#1D1A1B] transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] h-10 rounded-xl font-bold text-xs transition shadow-xs mt-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Create User
                </button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={resetModalOpen} onOpenChange={setResetModalOpen}>
            <DialogContent className="sm:max-w-[425px] p-6 bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl shadow-xl">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-base font-bold text-[#1D1A1B]">Reset Password</DialogTitle>
                <DialogDescription className="text-[#5F5A5C] text-xs mt-1">
                  Generate or set a new password for {userToReset?.name}.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleResetPasswordSubmit} className="flex flex-col gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#1D1A1B] uppercase">New Password</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={copyResetPassword}
                        className={`text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                          isResetCopied ? "text-green-600" : "text-[#5F5A5C] hover:text-[#1D1A1B]"
                        }`}
                        disabled={!resetPasswordValue}
                      >
                        {isResetCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {isResetCopied ? "Copied" : "Copy"}
                      </button>
                      <button
                        type="button"
                        onClick={generateResetPassword}
                        className="text-[10px] text-[#6B1D2A] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Wand2 className="w-3 h-3" />
                        Generate
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <Input
                      type={showResetPassword ? "text" : "password"}
                      name="resetPassword"
                      placeholder="••••••••"
                      value={resetPasswordValue}
                      onChange={(e) => setResetPasswordValue(e.target.value)}
                      required
                      className="border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] h-10 px-3 pr-10 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5F5A5C] hover:text-[#1D1A1B] transition-colors"
                      aria-label={showResetPassword ? "Hide password" : "Show password"}
                    >
                      {showResetPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] h-10 rounded-xl font-bold text-xs transition shadow-xs mt-2 cursor-pointer"
                >
                  <Key className="w-4 h-4" />
                  Reset Password
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* USERS TABLE */}
        <Card className="border border-[#E8E3E1] shadow-xs overflow-hidden rounded-xl bg-[#FFFCF7]">
          <div className="overflow-x-auto">
            <Table className="w-full text-xs">
              <TableHeader className="bg-[#F4E7EA] border-b border-[#E8E3E1]">
                <TableRow className="border-b border-[#E8E3E1]">
                  <TableHead className="text-left font-bold text-[#5F5A5C] p-4 text-xs uppercase">Full Name</TableHead>
                  <TableHead className="text-left font-bold text-[#5F5A5C] p-4 text-xs uppercase">Email</TableHead>
                  <TableHead className="text-left font-bold text-[#5F5A5C] p-4 text-xs uppercase">Role</TableHead>
                  <TableHead className="text-left font-bold text-[#5F5A5C] p-4 text-xs uppercase">Created At</TableHead>
                  <TableHead className="text-right font-bold text-[#5F5A5C] p-4 text-xs uppercase">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-[#E8E3E1]">
                {users.filter(u => u.id !== currentUser.id).map((user) => (
                  <TableRow key={user.id} className="border-b border-[#E8E3E1] hover:bg-[#F4E7EA]/40 transition-colors">
                    {/* NAME */}
                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F4E7EA] text-[#6B1D2A] flex items-center justify-center font-bold text-xs shadow-xs">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span className="font-semibold text-[#1D1A1B] text-xs">{user.name}</span>
                      </div>
                    </TableCell>

                    {/* EMAIL */}
                    <TableCell className="p-4 text-[#5F5A5C] text-xs">
                      {user.email}
                    </TableCell>

                    {/* ROLE */}
                    <TableCell className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
                        user.role === "Admin" ? "bg-[#F2DFB0] text-[#A87818] border border-[#C99A2E]" : "bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1]"
                      }`}>
                        {user.role === "Admin" ? "Admin" : "Staff"} 
                      </span>
                    </TableCell>

                    {/* CREATED AT */}
                    <TableCell className="p-4 text-[#5F5A5C] text-xs">
                      {new Date(user.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        {user.role !== "Admin" && (
                          <button
                            onClick={() => {
                              setUserToReset(user);
                              setResetPasswordValue("");
                              setResetModalOpen(true);
                            }}
                            className="p-1.5 text-[#5F5A5C] hover:text-[#A87818] hover:bg-[#F2DFB0] rounded-lg transition-all cursor-pointer"
                            title="Reset Password"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                        )}

                        {user.role !== "Admin" && (
                          <button
                            onClick={() => handlePromote(user.id)}
                            className="p-1.5 text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] rounded-lg transition-all cursor-pointer"
                            title="Promote to Admin"
                          >
                            <ArrowUpToLine className="w-4 h-4" />
                          </button>
                        )}

                        {user.role !== "Admin" && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 text-[#5F5A5C] hover:text-[#4A0E1C] hover:bg-[#F4E7EA] rounded-lg transition-all cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default Users;