import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Plus, FilterX } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ShadcnSelect from "@/components/ui/ShadcnSelect";
import UserSummaryCards from "../components/users/UserSummaryCards";
import UsersTable from "../components/users/UsersTable";
import CreateUserModal from "../components/users/CreateUserModal";
import ResetPasswordModal from "../components/users/ResetPasswordModal";
import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";

export default function Users() {
  const toast = useToast();
  const modal = useModal();

  const [currentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [userToReset, setUserToReset] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data || []);
    } catch (error) {
      console.error("FETCH USERS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async ({ name, email, password }) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/auth/register", 
        { name, email, password }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User account registered successfully!", "Account Created");
      setIsCreateModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create user", "Error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPassword = async (newPassword) => {
    if (!userToReset) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/users/reset-password/${userToReset.id}`, 
        { password: newPassword }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Password reset successfully for ${userToReset.name}!`, "Password Updated");
      setIsResetModalOpen(false);
      setUserToReset(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to reset password", "Error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePromote = async (user) => {
    const confirmed = await modal.confirm({
      title: "Promote to Administrator",
      message: `Are you sure you want to promote "${user.name}" to System Administrator? They will be granted full administrative authority.`,
      confirmText: "Promote to Admin",
      cancelText: "Cancel",
      variant: "warning",
    });
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/users/promote/${user.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`${user.name} promoted to Administrator.`, "Role Updated");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Promotion failed", "Error");
    }
  };

  const handleDemote = async (user) => {
    const confirmed = await modal.confirm({
      title: "Demote to Staff",
      message: `Are you sure you want to demote "${user.name}" to Staff? They will lose access to system administration and audit logs.`,
      confirmText: "Demote to Staff",
      cancelText: "Cancel",
      variant: "warning",
    });
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/users/demote/${user.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`${user.name} demoted to Staff.`, "Role Updated");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Demotion failed", "Error");
    }
  };

  const handleDelete = async (user) => {
    const confirmed = await modal.confirm({
      title: "Delete User Account",
      message: `Are you sure you want to permanently delete the account for "${user.name}" (${user.email})? This action cannot be undone.`,
      confirmText: "Delete Account",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User account deleted successfully.", "Deleted");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete user", "Error");
    }
  };

  // Filtered users (excluding current active user from management row)
  const displayableUsers = users.filter((u) => u.id !== currentUser.id);
  const filteredUsers = displayableUsers.filter((u) => {
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      String(u.id).includes(term);

    const matchesRole =
      !roleFilter ||
      (roleFilter === "Admin" && u.role === "Admin") ||
      (roleFilter === "Staff" && u.role !== "Admin");

    return matchesSearch && matchesRole;
  });

  const totalAdmins = users.filter((u) => u.role === "Admin").length;
  const totalStaff = users.filter((u) => u.role !== "Admin").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* SUMMARY METRIC CARDS */}
        <UserSummaryCards
          totalUsers={users.length}
          totalAdmins={totalAdmins}
          totalStaff={totalStaff}
        />

        {/* SEARCH & FILTERS BAR */}
        <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl">
          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5A5C]" />
              <Input
                type="text"
                placeholder="Search staff accounts by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-10 h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] placeholder-[#5F5A5C]/60 focus:border-[#6B1D2A]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F5A5C] hover:text-[#1D1A1B] p-1 rounded-md cursor-pointer"
                  aria-label="Clear search"
                >
                  <FilterX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <div className="w-36">
                <ShadcnSelect
                  value={roleFilter}
                  onChange={setRoleFilter}
                  options={[
                    { value: "", label: "All Roles" },
                    { value: "Admin", label: "Administrators" },
                    { value: "Staff", label: "Staff Members" },
                  ]}
                  placeholder="All Roles"
                  popoverWidth="w-40"
                  className="h-10"
                />
              </div>

              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="h-10 px-4 rounded-xl text-xs font-bold text-[#FFFCF7] bg-[#6B1D2A] hover:bg-[#8B3545] cursor-pointer shadow-xs inline-flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create User</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* USERS DATA TABLE */}
        <UsersTable
          users={filteredUsers}
          onResetPassword={(u) => {
            setUserToReset(u);
            setIsResetModalOpen(true);
          }}
          onPromote={handlePromote}
          onDemote={handleDemote}
          onDelete={handleDelete}
          search={search}
          roleFilter={roleFilter}
          onClearFilters={() => {
            setSearch("");
            setRoleFilter("");
          }}
        />

        {/* CREATE USER MODAL */}
        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateUser={handleCreateUser}
          isSaving={isSaving}
        />

        {/* RESET PASSWORD MODAL */}
        <ResetPasswordModal
          isOpen={isResetModalOpen}
          user={userToReset}
          onClose={() => {
            setIsResetModalOpen(false);
            setUserToReset(null);
          }}
          onResetPassword={handleResetPassword}
          isSaving={isSaving}
        />
      </div>
    </DashboardLayout>
  );
}
