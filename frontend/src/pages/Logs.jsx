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
      const response = await axios.get("http://localhost:5000/api/logs");
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
      <div className="mb-8 bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Activity Logs</h1>
          <p className="text-white/80 font-medium max-w-xl">
            System audit trails for accountability and transparency. Monitor all user actions securely.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 to-transparent pointer-events-none"></div>
      </div>

      <Card className="border-none shadow-sm mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Search User / Email</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="e.g. admin@example.com" 
                  className="pl-9 h-11 bg-gray-50 border-gray-200 focus-visible:ring-primary"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 w-full space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Action Type</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select 
                  className="w-full h-11 pl-9 pr-4 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
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
              <label className="text-sm font-semibold text-gray-700">Date Range</label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    type="date"
                    className="pl-9 h-11 bg-gray-50 border-gray-200 focus-visible:ring-primary"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <span className="text-gray-400 font-medium">to</span>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    type="date"
                    className="pl-9 h-11 bg-gray-50 border-gray-200 focus-visible:ring-primary"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={exportCSV}
              className="h-11 px-6 rounded-md bg-accent text-accent-foreground font-bold hover:bg-accent/90 transition flex items-center justify-center gap-2 shadow-sm whitespace-nowrap w-full lg:w-auto"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>

          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-bold text-gray-700 px-6 py-4">User / Email</TableHead>
                <TableHead className="font-bold text-gray-700 px-6 py-4">Action</TableHead>
                <TableHead className="font-bold text-gray-700 px-6 py-4 min-w-[300px]">Description</TableHead>
                <TableHead className="font-bold text-gray-700 px-6 py-4">Date</TableHead>
                <TableHead className="font-bold text-gray-700 px-6 py-4">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLogs.length > 0 ? (
                currentLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="px-6 py-4 font-medium">
                      {log.user?.email || (
                        <span className="text-gray-400 italic">System Auto</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase tracking-wide border border-primary/20">
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-600">
                      {log.description}
                    </TableCell>
                    <TableCell className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="5" className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Activity className="w-12 h-12 mb-3 opacity-20" />
                      <span className="font-medium text-base">No activity logs found for your current filters.</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t border-gray-100 bg-white gap-4">
            <div className="text-sm text-gray-500 text-center sm:text-left">
              Showing <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-medium text-gray-900">{Math.min(indexOfLastItem, filteredLogs.length)}</span> of <span className="font-medium text-gray-900">{filteredLogs.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition font-medium text-gray-700"
              >
                Previous
              </button>
              <div className="text-sm text-gray-600 font-medium px-2">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition font-medium text-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default Logs;