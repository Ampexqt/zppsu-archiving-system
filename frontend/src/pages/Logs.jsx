import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Download, Calendar, Filter, Activity } from "lucide-react";

function Logs() {
  const [logs, setLogs] = useState([]);
  
  // Filter States
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchEmail, selectedAction, startDate, endDate]);

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

  // Filter Logic
  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.created_at);
    
    // Email Match
    const emailMatch = !searchEmail || 
      (log.user?.email || "System").toLowerCase().includes(searchEmail.toLowerCase());
      
    // Action Match
    const actionMatch = !selectedAction || log.action === selectedAction;
    
    // Date Match
    let dateMatch = true;
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (logDate < start) dateMatch = false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (logDate > end) dateMatch = false;
    }

    return emailMatch && actionMatch && dateMatch;
  });

  // Unique Actions for Dropdown
  const uniqueActions = [...new Set(logs.map(log => log.action))].sort();

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  // Export CSV
  const exportCSV = () => {
    if (filteredLogs.length === 0) return alert("No logs to export.");

    const headers = ["Date", "Time", "Email", "Action", "Description"];
    const rows = filteredLogs.map(log => [
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
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans">
        {/* BANNER */}
        <div className="bg-[#4A0E1C] rounded-2xl p-6 sm:p-8 text-[#FFFCF7] shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-widest text-[#C99A2E] font-bold block mb-1">
              ZPPSU Security & Compliance
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-[#FFFCF7]">Activity & Audit Logs</h1>
            <p className="text-white/80 text-sm max-w-xl">
              System audit trails for accountability and transparency. Monitor all user actions securely.
            </p>
          </div>
        </div>

        {/* FILTERS */}
        <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              
              <div className="flex-1 w-full space-y-1.5">
                <label className="text-xs font-bold text-[#1D1A1B] uppercase">Search User / Email</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5A5C]" />
                  <Input 
                    placeholder="e.g. admin@zppsu.edu.ph" 
                    className="pl-9 h-10 bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] text-xs rounded-xl focus-visible:ring-[#6B1D2A]"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 w-full space-y-1.5">
                <label className="text-xs font-bold text-[#1D1A1B] uppercase">Action Type</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5A5C]" />
                  <select 
                    className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#E8E3E1] bg-[#FFFCF7] text-xs font-medium text-[#1D1A1B] focus:outline-none focus:ring-2 focus:ring-[#6B1D2A]/20 appearance-none"
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                  >
                    <option value="">All Actions</option>
                    {uniqueActions.map(action => (
                      <option key={action} value={action}>{action}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="w-full lg:w-auto space-y-1.5">
                <label className="text-xs font-bold text-[#1D1A1B] uppercase">Date Range</label>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5A5C]" />
                    <Input 
                      type="date"
                      className="pl-9 h-10 bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] text-xs rounded-xl focus-visible:ring-[#6B1D2A]"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <span className="text-[#5F5A5C] text-xs font-medium">to</span>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5A5C]" />
                    <Input 
                      type="date"
                      className="pl-9 h-10 bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] text-xs rounded-xl focus-visible:ring-[#6B1D2A]"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={exportCSV}
                className="h-10 px-5 rounded-xl bg-[#6B1D2A] text-[#FFFCF7] font-bold text-xs hover:bg-[#8B3545] transition flex items-center justify-center gap-2 shadow-xs whitespace-nowrap w-full lg:w-auto cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>

            </div>
          </CardContent>
        </Card>

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
    </DashboardLayout>
  );
}

export default Logs;