import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  FileSpreadsheet, 
  History, 
  Calendar, 
  Clock, 
  User, 
  FilterX, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Shield,
  Layers
} from "lucide-react";
import ShadcnSelect from "@/components/ui/ShadcnSelect";
import LogSummaryCards from "../components/audit/LogSummaryCards";
import ExportLogsModal from "../components/audit/ExportLogsModal";
import { api } from "../services/api";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  
  // Filter States
  const [search, setSearch] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchLogs = async () => {
    try {
      const response = await api.get("/api/logs");
      setLogs(response.data || []);
    } catch (error) {
      console.error("FETCH LOGS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter Logic for Table
  const filteredLogs = logs.filter((log) => {
    const term = search.toLowerCase().trim();
    const matchesTerm =
      !term ||
      (log.user?.email && log.user.email.toLowerCase().includes(term)) ||
      (log.user?.name && log.user.name.toLowerCase().includes(term)) ||
      (log.description && log.description.toLowerCase().includes(term)) ||
      (log.action && log.action.toLowerCase().includes(term));

    const matchesAction = !selectedAction || log.action === selectedAction;
    return matchesTerm && matchesAction;
  });

  // Unique Actions for Filter Dropdown
  const uniqueActions = [...new Set(logs.map((log) => log.action).filter(Boolean))].sort();

  // Unique Users for Export
  const uniqueUsersMap = new Map();
  logs.forEach((log) => {
    const email = log.user?.email || "System Service";
    if (!uniqueUsersMap.has(email)) {
      uniqueUsersMap.set(email, log.user?.name ? `${log.user.name} (${email})` : email);
    }
  });
  const uniqueUsers = Array.from(uniqueUsersMap.entries())
    .map(([email, label]) => ({ email, label }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // Pagination Logic
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedAction]);

  // Metric counts
  const securityCount = logs.filter((l) =>
    ["LOGIN", "LOGOUT", "PROMOTE USER", "DEMOTE USER", "RESET PASSWORD", "DELETE USER"].includes(l.action)
  ).length;

  const filingCount = logs.filter((l) =>
    ["VIEW", "UPLOAD", "EDIT", "FILE BOX ASSIGNMENT", "MOVE", "RESTORE"].includes(l.action)
  ).length;

  const deleteCount = logs.filter((l) =>
    ["DELETE", "PERMANENT DELETE", "DELETE USER"].includes(l.action)
  ).length;

  // Helper to format descriptions and highlight document identifiers
  const renderFormattedDescription = (desc) => {
    if (!desc) return "No event description available.";
    
    // Highlight codes like (MEMO-2026-0005) or ACC-2026-0015
    const parts = desc.split(/(\([A-Z0-9_-]+\)|to box [A-Za-z0-9_-]+)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("(") && part.endsWith(")")) {
        return (
          <span 
            key={idx} 
            className="font-mono text-[10px] font-bold text-[#6B1D2A] bg-[#F4E7EA]/70 border border-[#E8E3E1] px-1.5 py-0.5 rounded mx-1 inline-block"
          >
            {part.slice(1, -1)}
          </span>
        );
      }
      if (part.startsWith("to box ")) {
        return (
          <span key={idx} className="font-semibold text-[#1D1A1B] underline decoration-[#C99A2E]">
            {part}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  // Helper to render semantic action badges matching 11-color palette
  const renderActionBadge = (action) => {
    if (!action) return null;
    const act = action.toUpperCase();

    // Destructive
    if (act.includes("DELETE")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4E7EA] text-[#4A0E1C] border border-[#E8E3E1] whitespace-nowrap">
          {action}
        </span>
      );
    }
    // Security & Privilege changes
    if (act.includes("PROMOTE") || act.includes("DEMOTE") || act.includes("PASSWORD")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F2DFB0] text-[#A87818] border border-[#C99A2E] whitespace-nowrap">
          {action}
        </span>
      );
    }
    // Filing & Assignment
    if (act.includes("ASSIGNMENT") || act.includes("MOVE") || act.includes("UPLOAD")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1] whitespace-nowrap">
          {action}
        </span>
      );
    }
    // Routine Read / Auth
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFFCF7] text-[#5F5A5C] border border-[#E8E3E1] whitespace-nowrap">
        {action}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-[#A87818] uppercase tracking-wider bg-[#F2DFB0]/50 px-2.5 py-0.5 rounded-md border border-[#C99A2E]/30 font-mono">
                Security &amp; Compliance Audit Ledger
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1D1A1B]">
              Activity &amp; Audit Logs
            </h1>
            <p className="text-xs sm:text-sm text-[#5F5A5C] mt-1 max-w-2xl font-normal">
              System-wide immutable audit ledger for institutional transparency, records provenance, and access control.
            </p>
          </div>
          
          <Button 
            onClick={() => setIsExportModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#521322] font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#F2DFB0]" />
            <span>Export Logs</span>
          </Button>
        </div>

        {/* SUMMARY STAT CARDS (PALETTE STRICT - NO GREEN) */}
        <LogSummaryCards
          totalLogs={logs.length}
          securityCount={securityCount}
          filingCount={filingCount}
          deleteCount={deleteCount}
        />

        {/* SEARCH & FILTERS BAR */}
        <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl">
          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5A5C]" />
              <Input
                type="text"
                placeholder="Search audit trail by user email, action, or description..."
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
              <div className="w-full sm:w-56">
                <ShadcnSelect
                  value={selectedAction}
                  onChange={setSelectedAction}
                  options={[
                    { value: "", label: "All Action Types" },
                    ...uniqueActions.map((act) => ({ value: act, label: act })),
                  ]}
                  placeholder="All Action Types"
                  popoverWidth="w-60"
                  searchable={true}
                  searchPlaceholder="Search actions..."
                  className="h-10"
                />
              </div>

              {(search || selectedAction) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setSelectedAction("");
                  }}
                  className="h-10 px-2.5 rounded-xl text-xs font-semibold text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] cursor-pointer inline-flex items-center gap-1 shrink-0"
                  title="Clear filters"
                >
                  <FilterX className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* LOGS TABLE */}
        <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl overflow-hidden">
          <CardHeader className="border-b border-[#E8E3E1] py-3.5 px-6 flex flex-row items-center justify-between bg-[#FFFCF7]">
            <div>
              <CardTitle className="text-sm font-bold text-[#1D1A1B]">
                Audit Trail Entries
              </CardTitle>
              <CardDescription className="text-xs text-[#5F5A5C]">
                {filteredLogs.length} events logged in this verification cycle
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-[#5F5A5C] uppercase bg-[#FCFAF8] border-b border-[#E8E3E1]">
                  <tr>
                    <th className="px-5 py-3.5 font-bold tracking-wider">Timestamp</th>
                    <th className="px-5 py-3.5 font-bold tracking-wider">Operator / User</th>
                    <th className="px-5 py-3.5 font-bold tracking-wider">Action Type</th>
                    <th className="px-5 py-3.5 font-bold tracking-wider">Activity Description</th>
                    <th className="px-5 py-3.5 font-bold tracking-wider text-right">Source</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E8E3E1]">
                  {paginatedLogs.length > 0 ? (
                    paginatedLogs.map((log) => {
                      const logDate = new Date(log.created_at);
                      const userInitial = log.user?.name ? log.user.name.charAt(0).toUpperCase() : (log.user?.email ? log.user.email.charAt(0).toUpperCase() : "S");
                      return (
                        <tr key={log.id} className="hover:bg-[#F4E7EA]/30 transition-colors">
                          {/* TIMESTAMP */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="font-semibold text-xs text-[#1D1A1B]">
                                {logDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                              </span>
                              <span className="text-[10px] text-[#5F5A5C] font-mono mt-0.5">
                                {logDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                              </span>
                            </div>
                          </td>

                          {/* OPERATOR / USER */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                {userInitial}
                              </div>
                              <div className="min-w-0 max-w-[200px]">
                                <span className="font-bold text-xs text-[#1D1A1B] truncate block">
                                  {log.user?.name || log.user?.email || "System Service"}
                                </span>
                                {log.user?.email && log.user?.name && (
                                  <span className="text-[10px] text-[#5F5A5C] truncate block">
                                    {log.user.email}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* ACTION BADGE */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            {renderActionBadge(log.action)}
                          </td>

                          {/* DESCRIPTION */}
                          <td className="px-5 py-3.5 text-xs text-[#1D1A1B] leading-relaxed max-w-md">
                            {renderFormattedDescription(log.description)}
                          </td>

                          {/* SOURCE / MODULE */}
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <span className="font-mono text-[10px] text-[#5F5A5C] bg-[#FFFCF7] border border-[#E8E3E1] px-2 py-0.5 rounded shadow-2xs">
                              {log.module || "Security"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-5 py-12 text-center text-[#5F5A5C]">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center text-[#6B1D2A]">
                            <History className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-semibold text-[#1D1A1B]">No audit records found</span>
                          <p className="text-xs text-[#5F5A5C] max-w-sm">
                            {search || selectedAction 
                              ? "No logged events match your filter criteria. Try clearing your filters." 
                              : "No events recorded in the audit trail ledger."}
                          </p>
                          {(search || selectedAction) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSearch("");
                                setSelectedAction("");
                              }}
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

            {/* PAGINATION BAR */}
            <div className="p-4 border-t border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7] text-xs text-[#5F5A5C]">
              <span>
                Showing {filteredLogs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-3 text-xs bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  <span>Prev</span>
                </Button>
                <span className="px-2 font-bold text-[#1D1A1B]">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                  className="h-8 px-3 text-xs bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer disabled:opacity-40"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EXPORT LOGS MODAL */}
        <ExportLogsModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          logs={logs}
          uniqueUsers={uniqueUsers}
          uniqueActions={uniqueActions}
        />
      </div>
    </DashboardLayout>
  );
}
