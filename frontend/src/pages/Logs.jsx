import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Download, Calendar, Filter, Activity, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

function Logs() {
  const [logs, setLogs] = useState([]);
  
  // Filter States
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Export Modal States
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportUserFilter, setExportUserFilter] = useState("all");
  const [exportActionType, setExportActionType] = useState("all");
  const [exportDateRange, setExportDateRange] = useState("all");
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/logs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter Logic for Table (Removed redundant page filters)
  const filteredLogs = logs;

  // Unique Actions for Dropdown
  const uniqueActions = [...new Set(logs.map(log => log.action))].sort();
  
  // Unique Users for Export Dropdown
  const uniqueUsersMap = new Map();
  logs.forEach(log => {
    const email = log.user?.email || "System";
    if (!uniqueUsersMap.has(email)) {
      uniqueUsersMap.set(email, log.user?.name ? `${log.user.name} (${email})` : email);
    }
  });
  const uniqueUsers = Array.from(uniqueUsersMap.entries()).map(([email, label]) => ({ email, label })).sort((a, b) => a.label.localeCompare(b.label));

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  // Handle Export CSV
  const handleExportCSV = () => {
    let exportData = logs.filter((log) => {
      const logDate = new Date(log.created_at);
      
      // Email Match
      const emailMatch = exportUserFilter === "all" || 
        (log.user?.email || "System") === exportUserFilter;
        
      // Action Match
      const actionMatch = exportActionType === "all" || log.action === exportActionType;
      
      // Date Match
      let dateMatch = true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (exportDateRange === "today") {
        if (logDate < today) dateMatch = false;
      } else if (exportDateRange === "7_days") {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        if (logDate < sevenDaysAgo) dateMatch = false;
      } else if (exportDateRange === "1_month") {
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
        if (logDate < oneMonthAgo) dateMatch = false;
      } else if (exportDateRange === "custom") {
        if (exportStartDate) {
          const start = new Date(exportStartDate);
          start.setHours(0, 0, 0, 0);
          if (logDate < start) dateMatch = false;
        }
        if (exportEndDate) {
          const end = new Date(exportEndDate);
          end.setHours(23, 59, 59, 999);
          if (logDate > end) dateMatch = false;
        }
      }

      return emailMatch && actionMatch && dateMatch;
    });

    if (exportData.length === 0) {
      alert("No logs match the selected export criteria.");
      return;
    }

    const headers = ["Date", "Time", "Email", "Action", "Description"];
    const rows = exportData.map(log => [
      new Date(log.created_at).toLocaleDateString(),
      new Date(log.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      log.user?.email || "System",
      log.action,
      `"${log.description.replace(/"/g, '""')}"` // escape quotes
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `audit_trails_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExportModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans">
        {/* BANNER */}
        <div className="bg-[#4A0E1C] rounded-2xl p-6 sm:p-8 text-[#FFFCF7] shadow-sm relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-widest text-[#C99A2E] font-bold block mb-1">
              ZPPSU Security & Compliance
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-[#FFFCF7]">Activity & Audit Logs</h1>
            <p className="text-white/80 text-sm max-w-xl">
              System audit trails for accountability and transparency. Monitor all user actions securely.
            </p>
          </div>
          
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="h-10 px-5 rounded-xl bg-[#C99A2E] text-[#1D1A1B] font-bold text-xs hover:bg-[#A87818] transition flex items-center justify-center gap-2 shadow-xs whitespace-nowrap z-10 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* LOGS TABLE */}
        <Card className="border border-[#E8E3E1] shadow-xs overflow-hidden rounded-xl bg-[#FFFCF7]">
          <div className="overflow-x-auto">
            <Table className="w-full text-xs">
              <TableHeader className="bg-[#F4E7EA] border-b border-[#E8E3E1]">
                <TableRow className="border-b border-[#E8E3E1]">
                  <TableHead className="font-bold text-[#5F5A5C] px-5 py-3.5 text-xs uppercase">User / Email</TableHead>
                  <TableHead className="font-bold text-[#5F5A5C] px-5 py-3.5 text-xs uppercase">Action</TableHead>
                  <TableHead className="font-bold text-[#5F5A5C] px-5 py-3.5 text-xs uppercase min-w-[300px]">Description</TableHead>
                  <TableHead className="font-bold text-[#5F5A5C] px-5 py-3.5 text-xs uppercase">Date</TableHead>
                  <TableHead className="font-bold text-[#5F5A5C] px-5 py-3.5 text-xs uppercase">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-[#E8E3E1]">
                {currentLogs.length > 0 ? (
                  currentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F4E7EA]/40 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-[#1D1A1B]">
                        {log.user?.email || (
                          <span className="text-[#5F5A5C] italic">System Auto</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4E7EA] text-[#6B1D2A] uppercase tracking-wide border border-[#E8E3E1]">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#5F5A5C]">
                        {log.description}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-[#1D1A1B] whitespace-nowrap">
                        {new Date(log.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-[#5F5A5C] whitespace-nowrap">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="h-48 text-center text-[#5F5A5C] italic">
                      <div className="flex flex-col items-center justify-center text-[#5F5A5C]">
                        <Activity className="w-10 h-10 mb-2 opacity-30 text-[#5F5A5C]" />
                        <span className="font-medium text-xs">No activity logs found for your current filters.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </TableBody>
            </Table>
          </div>
          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3.5 border-t border-[#E8E3E1] bg-[#FFFCF7] gap-4 text-xs text-[#5F5A5C]">
              <div>
                Showing <span className="font-bold text-[#1D1A1B]">{indexOfFirstItem + 1}</span> to <span className="font-bold text-[#1D1A1B]">{Math.min(indexOfLastItem, filteredLogs.length)}</span> of <span className="font-bold text-[#1D1A1B]">{filteredLogs.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs border border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] rounded-lg disabled:opacity-50 hover:bg-[#F4E7EA] transition font-semibold cursor-pointer"
                >
                  Previous
                </button>
                <div className="text-xs text-[#1D1A1B] font-bold px-2">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs border border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] rounded-lg disabled:opacity-50 hover:bg-[#F4E7EA] transition font-semibold cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* EXPORT CSV MODAL */}
      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#FFFCF7] border-[#E8E3E1] shadow-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#1D1A1B] font-bold text-lg">Export Audit Logs</DialogTitle>
            <DialogDescription className="text-[#5F5A5C] text-xs">
              Select criteria for the logs you want to download.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1A1B] uppercase">Search User / Email</label>
              <select 
                className="w-full h-10 px-3 rounded-xl border border-[#E8E3E1] bg-white text-xs font-medium text-[#1D1A1B] focus:outline-none focus:ring-2 focus:ring-[#6B1D2A]/20"
                value={exportUserFilter}
                onChange={(e) => setExportUserFilter(e.target.value)}
              >
                <option value="all">All Users</option>
                {uniqueUsers.map(user => (
                  <option key={user.email} value={user.email}>{user.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1A1B] uppercase">Action Type</label>
              <select 
                className="w-full h-10 px-3 rounded-xl border border-[#E8E3E1] bg-white text-xs font-medium text-[#1D1A1B] focus:outline-none focus:ring-2 focus:ring-[#6B1D2A]/20"
                value={exportActionType}
                onChange={(e) => setExportActionType(e.target.value)}
              >
                <option value="all">All Actions</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1A1B] uppercase">Date Range</label>
              <select 
                className="w-full h-10 px-3 rounded-xl border border-[#E8E3E1] bg-white text-xs font-medium text-[#1D1A1B] focus:outline-none focus:ring-2 focus:ring-[#6B1D2A]/20"
                value={exportDateRange}
                onChange={(e) => setExportDateRange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7_days">Last 7 Days</option>
                <option value="1_month">Last 1 Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {exportDateRange === "custom" && (
              <div className="flex items-center gap-2">
                <div className="space-y-1.5 flex-1">
                  <label className="text-[10px] font-bold text-[#5F5A5C] uppercase">Start Date</label>
                  <Input 
                    type="date"
                    className="h-10 bg-white border-[#E8E3E1] text-[#1D1A1B] text-xs rounded-xl focus-visible:ring-[#6B1D2A]"
                    value={exportStartDate}
                    onChange={(e) => setExportStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 flex-1">
                  <label className="text-[10px] font-bold text-[#5F5A5C] uppercase">End Date</label>
                  <Input 
                    type="date"
                    className="h-10 bg-white border-[#E8E3E1] text-[#1D1A1B] text-xs rounded-xl focus-visible:ring-[#6B1D2A]"
                    value={exportEndDate}
                    onChange={(e) => setExportEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-end gap-2">
            <button
              onClick={() => setIsExportModalOpen(false)}
              className="h-10 px-4 rounded-xl border border-[#E8E3E1] bg-transparent text-[#1D1A1B] font-bold text-xs hover:bg-[#F4E7EA] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleExportCSV}
              className="h-10 px-6 rounded-xl bg-[#6B1D2A] text-[#FFFCF7] font-bold text-xs hover:bg-[#8B3545] transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

export default Logs;