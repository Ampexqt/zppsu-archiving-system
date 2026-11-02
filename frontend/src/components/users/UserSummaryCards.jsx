import React from "react";
import { Users as UsersIcon, ShieldCheck, UserCheck, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * UserSummaryCards
 * Displays summary cards for total accounts, system administrators, records staff, and access control.
 */
export default function UserSummaryCards({
  totalUsers = 0,
  totalAdmins = 0,
  totalStaff = 0,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* TOTAL USERS */}
      <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
              Total System Accounts
            </span>
            <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
              {totalUsers}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              Registered credentials
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] text-[#6B1D2A]">
            <UsersIcon className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>

      {/* ADMINISTRATORS */}
      <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
              Administrators
            </span>
            <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
              {totalAdmins}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              Full administrative authority
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F2DFB0]/50 border border-[#C99A2E]/40 text-[#A87818]">
            <ShieldCheck className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>

      {/* STAFF MEMBERS */}
      <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
              Records Staff
            </span>
            <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
              {totalStaff}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              Operational records staff
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] text-[#6B1D2A]">
            <UserCheck className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>

      {/* SECURITY STATUS */}
      <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
              Access Control
            </span>
            <span className="text-lg font-black text-[#1D1A1B] mt-1 block">
              RBAC Enforced
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              Two-tier permission matrix
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#E8E3E1]/50 border border-[#E8E3E1] text-[#5F5A5C]">
            <ShieldAlert className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
