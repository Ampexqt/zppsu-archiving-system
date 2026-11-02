import React from "react";
import { 
  Users as UsersIcon, 
  ShieldCheck, 
  User, 
  Key, 
  ArrowUpToLine, 
  ArrowDownToLine, 
  Trash2, 
  Mail, 
  Calendar 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * UsersTable
 * Table displaying staff accounts with initials, chips, role pills, and action icon buttons.
 */
export default function UsersTable({
  users = [],
  onResetPassword,
  onPromote,
  onDemote,
  onDelete,
  search = "",
  roleFilter = "",
  onClearFilters,
}) {
  return (
    <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl overflow-hidden">
      <CardHeader className="border-b border-[#E8E3E1] py-3.5 px-6 flex flex-row items-center justify-between bg-[#FFFCF7]">
        <div>
          <CardTitle className="text-sm font-bold text-[#1D1A1B]">
            Staff & Administrator Accounts
          </CardTitle>
          <CardDescription className="text-xs text-[#5F5A5C]">
            {users.length} staff records listed (excluding current active session)
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-[#5F5A5C] uppercase bg-[#FCFAF8] border-b border-[#E8E3E1]">
              <tr>
                <th className="px-5 py-3.5 font-bold tracking-wider">Staff Member</th>
                <th className="px-5 py-3.5 font-bold tracking-wider">Email Address</th>
                <th className="px-5 py-3.5 font-bold tracking-wider">Assigned Role</th>
                <th className="px-5 py-3.5 font-bold tracking-wider">Created At</th>
                <th className="px-5 py-3.5 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E8E3E1]">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F4E7EA]/30 transition-colors">
                    {/* USER NAME & INITIALS */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-[#1D1A1B] block">
                            {user.name}
                          </span>
                          <span className="font-mono text-[10px] text-[#5F5A5C]">
                            UID-{user.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 text-xs text-[#1D1A1B]">
                        <Mail className="w-3.5 h-3.5 text-[#5F5A5C]/70" />
                        <span className="font-medium">{user.email}</span>
                      </div>
                    </td>

                    {/* ROLE PILL */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {user.role === "Admin" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F2DFB0] text-[#A87818] border border-[#C99A2E]">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Administrator</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1]">
                          <User className="w-3 h-3" />
                          <span>Staff</span>
                        </span>
                      )}
                    </td>

                    {/* CREATED DATE */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-[#5F5A5C]">
                      <div className="inline-flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-[#5F5A5C]/70" />
                        <span>
                          {user.created_at 
                            ? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) 
                            : "—"}
                        </span>
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 justify-end">
                        {/* RESET PASSWORD */}
                        <button
                          type="button"
                          onClick={() => onResetPassword(user)}
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-[#5F5A5C] hover:text-[#A87818] hover:bg-[#F2DFB0]/50 transition-colors cursor-pointer"
                          title="Reset Password"
                          aria-label={`Reset password for ${user.name}`}
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>

                        {/* PROMOTE / DEMOTE */}
                        {user.role === "Admin" ? (
                          <button
                            type="button"
                            onClick={() => onDemote(user)}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
                            title="Demote to Staff"
                            aria-label={`Demote ${user.name}`}
                          >
                            <ArrowDownToLine className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onPromote(user)}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
                            title="Promote to Admin"
                            aria-label={`Promote ${user.name}`}
                          >
                            <ArrowUpToLine className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* DELETE USER (ADMINS ARE PROTECTED) */}
                        {user.role !== "Admin" ? (
                          <button
                            type="button"
                            onClick={() => onDelete(user)}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-[#5F5A5C] hover:text-[#4A0E1C] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
                            title="Delete Account"
                            aria-label={`Delete account for ${user.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span 
                            className="h-8 w-8 flex items-center justify-center text-[#5F5A5C]/40 cursor-not-allowed"
                            title="Admin accounts cannot be deleted"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-[#5F5A5C]">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center text-[#6B1D2A]">
                        <UsersIcon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold text-[#1D1A1B]">No staff members found</span>
                      <p className="text-xs text-[#5F5A5C] max-w-sm">
                        {search || roleFilter 
                          ? "No user accounts match your filter criteria. Try resetting your search." 
                          : "No staff accounts registered in the database."}
                      </p>
                      {(search || roleFilter) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onClearFilters}
                          className="mt-2 h-8 px-3 rounded-xl text-xs font-semibold text-[#1D1A1B] bg-[#FFFCF7] border-[#E8E3E1] hover:bg-[#F4E7EA] cursor-pointer"
                        >
                          Clear Search & Filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER */}
        <div className="p-4 border-t border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7] text-xs text-[#5F5A5C]">
          <span>
            Total accounts: <strong className="text-[#1D1A1B]">{users.length}</strong> listed
          </span>
          <span className="text-[11px] text-[#5F5A5C]">
            ZPPSU User Access Control & Staff Directory
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
