import { useEffect, useState } from "react";
import axios from "axios";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Archive, Clock, Files, TrendingUp, Users, FolderTree, Activity, Box, ArrowUpRight, Plus, FolderSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  
  const [files, setFiles] = useState([]);
  const [maxCapacity, setMaxCapacity] = useState(500);
  const [storagePercentage, setStoragePercentage] = useState(0);
  const [cabinetUsage, setCabinetUsage] = useState([]);
  const [analytics, setAnalytics] = useState({});

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(response.data || []);
    } catch (error) {
      console.error("FETCH FILES ERROR:", error.response?.data || error.message);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/dashboard/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(response.data || {});
      setMaxCapacity(response.data?.maxCapacity || 500);
      setStoragePercentage(response.data?.storagePercentage || 0);
      setCabinetUsage(response.data?.cabinetUsage || []);
    } catch (error) {
      console.error("ANALYTICS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchAnalytics();
  }, []);

  // System statistics
  const totalDocuments = analytics.totalFiles || 0;
  
  const getStatusCount = (status) => {
    const item = analytics.documentsByStatus?.find((d) => d.status === status);
    return item ? item._count.id : 0;
  };
  const activeDocuments = getStatusCount("Active");
  const archivedDocuments = getStatusCount("Archived");
  const pendingDocuments = getStatusCount("Pending");

  const pieChartData = (analytics.documentsByCategory || []).map((item) => ({
    name: item.category || "Uncategorized",
    value: item._count.id,
  }));

  const mostUsedDocument = analytics.documentsPerType?.length > 0 
    ? [analytics.documentsPerType[0].document_type, analytics.documentsPerType[0]._count.id]
    : null;

  const recentUploads = files.slice(0, 5);

  const statusData = [
    { name: "Active", value: activeDocuments },
    { name: "Archived", value: archivedDocuments },
    { name: "Pending", value: pendingDocuments },
  ];

  const monthlyData = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ].map((month, index) => {
    const count = (analytics.allFilesDates || []).filter((file) => {
      if (!file.created_at) return false;
      return new Date(file.created_at).getMonth() === index;
    }).length;
    return { month, documents: count };
  });

  // Design Tokens Colorway
  const PIE_COLORS = ["#4A0E1C", "#6B1D2A", "#8B3545", "#A87818", "#C99A2E"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* WELCOME BANNER */}
        <div className="bg-[#4A0E1C] text-[#FFFCF7] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-[#FFFCF7]">
              Welcome to your Dashboard
            </h2>
            <p className="text-[#FFFCF7]/90 text-sm leading-relaxed">
              Get an instant overview of your smart records, track storage limits, and analyze recent archiving activities.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => navigate("/files")}
              className="bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] border border-[#E8E3E1]/20 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>File New Record</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/document-center")}
              className="bg-[#FFFCF7] text-[#1D1A1B] border-[#E8E3E1] hover:bg-[#F4E7EA] font-semibold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FolderSearch className="w-4 h-4" />
              <span>Document Center</span>
            </Button>
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { title: "Total Documents", value: totalDocuments, icon: Files, path: "/document-center", sub: "Registered records" },
            { title: "Active Files", value: activeDocuments, icon: FileText, path: "/document-center", sub: "In active guidance" },
            { title: "Archived Files", value: archivedDocuments, icon: Archive, path: "/document-center", sub: "Physical & digital vault" },
            { title: "Pending Filing", value: pendingDocuments, icon: Clock, path: "/files", sub: "Awaiting storage assignment" },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs hover:shadow-sm hover:border-[#C99A2E]/50 transition-all rounded-xl cursor-pointer group"
                onClick={() => navigate(stat.path)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <span className="text-xs font-bold text-[#5F5A5C] uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <div className="p-2 rounded-lg bg-[#F4E7EA] border border-[#E8E3E1] text-[#6B1D2A] group-hover:bg-[#6B1D2A] group-hover:text-[#FFFCF7] transition-colors duration-200">
                    <Icon className="h-4 w-4 stroke-[2]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-[#1D1A1B] tracking-tight">
                    {stat.value}
                  </div>
                  <p className="text-xs text-[#5F5A5C] mt-1 flex items-center justify-between">
                    <span>{stat.sub}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#5F5A5C] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* INSIGHTS & STORAGE CAPACITY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MOST FREQUENT DOC TYPE */}
          <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2.5 text-[#1D1A1B]">
                <div className="p-1.5 rounded-lg bg-[#F4E7EA] text-[#6B1D2A]">
                  <TrendingUp className="w-4 h-4" /> 
                </div>
                <span>Frequent Record Type</span>
              </CardTitle>
              <CardDescription className="text-xs text-[#5F5A5C]">Highest volume category in registry</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center py-6">
              {mostUsedDocument ? (
                <div className="text-center space-y-2">
                  <div className="text-xl font-bold text-[#1D1A1B] tracking-tight px-3">
                    {mostUsedDocument[0]}
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1] text-xs font-bold">
                    {mostUsedDocument[1]} Total Files
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-[#5F5A5C] py-4">
                  <FolderTree className="w-8 h-8 mb-1.5 opacity-30 text-[#5F5A5C]" />
                  <span className="text-xs font-medium">No records analyzed yet</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ACTIVE STAFF ACTIVITY */}
          <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2.5 text-[#1D1A1B]">
                <div className="p-1.5 rounded-lg bg-[#F4E7EA] text-[#6B1D2A]">
                  <Users className="w-4 h-4" />
                </div>
                <span>Top Active Personnel</span>
              </CardTitle>
              <CardDescription className="text-xs text-[#5F5A5C]">Personnel managing record uploads & filings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {analytics.topUsers?.length > 0 ? (
                  analytics.topUsers.slice(0, 3).map((u, index) => (
                    <div key={index} className="flex items-center justify-between bg-[#FFFCF7] p-3 rounded-xl border border-[#E8E3E1]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#6B1D2A] text-[#FFFCF7] font-bold text-xs flex items-center justify-center shadow-xs">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-[#1D1A1B] text-sm">{u.name}</span>
                      </div>
                      <div className="bg-[#FFFCF7] border border-[#E8E3E1] text-[#6B1D2A] px-3 py-1 rounded-full text-xs font-bold">
                        {u.activities} Records Processed
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-[#5F5A5C]">
                    <Activity className="w-8 h-8 mb-1.5 opacity-30" />
                    <span className="text-xs font-medium">No recent user activity recorded.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* STORAGE & CABINET USAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SYSTEM STORAGE CAPACITY */}
          <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2.5 text-[#1D1A1B]">
                <div className="p-1.5 rounded-lg bg-[#F4E7EA] text-[#6B1D2A]">
                  <Archive className="w-4 h-4" />
                </div>
                <span>Physical & Digital Capacity</span>
              </CardTitle>
              <CardDescription className="text-xs text-[#5F5A5C]">Total documents vs configured repository ceiling</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="bg-[#FFFCF7] p-5 rounded-xl border border-[#E8E3E1] space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-2xl font-extrabold text-[#1D1A1B]">{totalDocuments}</span>
                    <span className="text-sm font-medium text-[#5F5A5C]"> / {maxCapacity} Docs</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#6B1D2A] text-[#FFFCF7] text-xs font-bold">
                    {storagePercentage}% Capacity
                  </span>
                </div>
                <Progress value={storagePercentage} className="h-3 bg-[#E8E3E1]" />
              </div>
            </CardContent>
          </Card>

          {/* CABINET BREAKDOWN */}
          <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2.5 text-[#1D1A1B]">
                <div className="p-1.5 rounded-lg bg-[#F4E7EA] text-[#6B1D2A]">
                  <FolderTree className="w-4 h-4" />
                </div>
                <span>Cabinet Storage Breakdown</span>
              </CardTitle>
              <CardDescription className="text-xs text-[#5F5A5C]">Document load distribution by physical cabinet</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                {cabinetUsage.map((cab) => {
                  const totalUsed = cab.file_boxes ? cab.file_boxes.reduce((sum, b) => sum + (b.used_space || 0), 0) : 0;
                  const totalCap = cab.file_boxes ? cab.file_boxes.reduce((sum, b) => sum + (b.capacity || 0), 0) : 0;
                  const pct = totalCap > 0 ? Math.round((totalUsed / totalCap) * 100) : 0;
                  
                  return (
                    <div key={cab.id} className="space-y-1.5 bg-[#FFFCF7] p-3 rounded-lg border border-[#E8E3E1]">
                      <div className="flex justify-between text-xs font-semibold text-[#1D1A1B]">
                        <span className="flex items-center gap-1.5">
                          <Box className="w-3.5 h-3.5 text-[#6B1D2A]" />
                          {cab.name}
                        </span>
                        <span className="text-[#5F5A5C]">{totalUsed} / {totalCap} ({pct}%)</span>
                      </div>
                      <Progress value={pct} className="h-2 bg-[#E8E3E1]" />
                    </div>
                  );
                })}
                {cabinetUsage.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-6 text-[#5F5A5C]">
                    <Box className="w-8 h-8 mb-1.5 opacity-30" />
                    <span className="text-xs font-medium">No physical cabinets configured yet.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CATEGORIES PIE CHART */}
          <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-[#1D1A1B]">Documents by Category</CardTitle>
              <CardDescription className="text-xs text-[#5F5A5C]">Distribution across administrative and academic areas</CardDescription>
            </CardHeader>
            <CardContent className="h-72 flex flex-col justify-center">
              {pieChartData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="80%" minWidth={1} minHeight={1}>
                    <PieChart>
                      <Pie 
                        data={pieChartData} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={60} 
                        outerRadius={85} 
                        paddingAngle={4} 
                        dataKey="value" 
                        nameKey="name"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#FFFCF7', borderRadius: '8px', border: '1px solid #E8E3E1', color: '#1D1A1B', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-4 mt-2">
                    {pieChartData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-1.5 text-xs text-[#5F5A5C]">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                        <span className="text-[#1D1A1B]">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-[#5F5A5C]">
                  <span className="text-xs font-medium">No category distribution data</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* STATUS BAR CHART */}
          <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-[#1D1A1B]">Record Status Distribution</CardTitle>
              <CardDescription className="text-xs text-[#5F5A5C]">Active vs archived vs pending items</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <BarChart data={statusData}>
                  <XAxis dataKey="name" stroke="#5F5A5C" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#5F5A5C" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#F4E7EA' }} contentStyle={{ backgroundColor: '#FFFCF7', borderRadius: '8px', border: '1px solid #E8E3E1', color: '#1D1A1B', fontSize: '12px' }} />
                  <Bar dataKey="value" fill="#6B1D2A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* MONTHLY UPLOAD VOLUME */}
        <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-[#1D1A1B]">Annual Upload Volume</CardTitle>
            <CardDescription className="text-xs text-[#5F5A5C]">Monthly archiving progression for the current year</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#5F5A5C" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#5F5A5C" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#F4E7EA' }} contentStyle={{ backgroundColor: '#FFFCF7', borderRadius: '8px', border: '1px solid #E8E3E1', color: '#1D1A1B', fontSize: '12px' }} />
                <Bar dataKey="documents" fill="#6B1D2A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* RECENT UPLOADS TABLE */}
        <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-[#1D1A1B]">Recent Uploads</CardTitle>
              <CardDescription className="text-xs text-[#5F5A5C]">Latest records processed into the archive</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/document-center")}
              className="text-xs border-[#E8E3E1] text-[#1D1A1B] bg-[#FFFCF7] hover:bg-[#F4E7EA]"
            >
              <span>View All Records</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-[#5F5A5C] uppercase bg-[#F4E7EA] border-y border-[#E8E3E1]">
                  <tr>
                    <th className="px-5 py-3 font-bold">Document ID</th>
                    <th className="px-5 py-3 font-bold">Subject</th>
                    <th className="px-5 py-3 font-bold">Type</th>
                    {user?.role === "Admin" && <th className="px-5 py-3 font-bold">Uploaded By</th>}
                    <th className="px-5 py-3 font-bold">Status</th>
                    <th className="px-5 py-3 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E3E1]">
                  {recentUploads.length > 0 ? (
                    recentUploads.map((file) => (
                      <tr key={file.id} className="hover:bg-[#F4E7EA]/40 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-[#6B1D2A]">{file.document_id}</td>
                        <td className="px-5 py-3.5 font-medium text-[#1D1A1B] max-w-xs truncate">{file.subject}</td>
                        <td className="px-5 py-3.5 text-[#5F5A5C]">{file.document_type}</td>
                        {user?.role === "Admin" && <td className="px-5 py-3.5 text-[#5F5A5C]">{file.user?.email || "Unknown"}</td>}
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block
                            ${file.status === "Active" ? "bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1]" :
                              file.status === "Archived" ? "bg-[#FFFCF7] text-[#5F5A5C] border border-[#E8E3E1]" :
                              file.status === "Pending" ? "bg-[#F2DFB0] text-[#A87818] border border-[#C99A2E]" :
                              "bg-[#E8E3E1] text-[#1D1A1B] border border-[#E8E3E1]"}`}
                          >
                            {file.status || "Active"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-[#5F5A5C]">
                          {file.created_at ? new Date(file.created_at).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-5 py-8 text-center text-[#5F5A5C] italic">
                        No recent document uploads found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;