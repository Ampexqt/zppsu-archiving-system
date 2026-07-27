import { useEffect, useState } from "react";
import axios from "axios";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Archive, Clock, Files, TrendingUp, Users, FolderTree, Activity, Box } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [files, setFiles] = useState([]);
  const [categoryChartData, setCategoryChartData] = useState([]);
  const [maxCapacity, setMaxCapacity] = useState(500);
  const [storagePercentage, setStoragePercentage] = useState(0);
  const [cabinetUsage, setCabinetUsage] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(response.data);
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
      setAnalytics(response.data);
      const chartData = response.data.documentsPerCategory.map((item) => ({
        category: item.document_type,
        count: item._count.id,
      }));
      setCategoryChartData(chartData);
      setMaxCapacity(response.data.maxCapacity);
      setStoragePercentage(response.data.storagePercentage);
      setCabinetUsage(response.data.cabinetUsage || []);
      setTopUsers(response.data.topUsers || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchAnalytics();
  }, []);

  const totalDocuments = files.length;
  const activeDocuments = files.filter((file) => file.status === "Active").length;
  const archivedDocuments = files.filter((file) => file.status === "Archived").length;
  const pendingDocuments = files.filter((file) => file.status === "Pending").length;

  const categoryCounts = {};
  files.forEach((file) => {
    if (file.category) {
      categoryCounts[file.category] = (categoryCounts[file.category] || 0) + 1;
    }
  });
  const pieChartData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  const documentTypeCounts = {};
  files.forEach((file) => {
    if (file.document_type) {
      documentTypeCounts[file.document_type] = (documentTypeCounts[file.document_type] || 0) + 1;
    }
  });

  const mostUsedDocument = Object.entries(documentTypeCounts).sort((a, b) => b[1] - a[1])[0];
  const recentUploads = files.slice(0, 5);
  const recentAccomplishments = files.filter(f => f.document_type === "ACCOMPLISHMENT REPORTS").slice(0, 3);

  const statusData = [
    { name: "Active", value: activeDocuments },
    { name: "Archived", value: archivedDocuments },
    { name: "Pending", value: pendingDocuments },
  ];

  const monthlyData = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ].map((month, index) => {
    const count = files.filter((file) => {
      if (!file.created_at) return false;
      return new Date(file.created_at).getMonth() === index;
    }).length;
    return { month, documents: count };
  });

  const COLORS = ["#8B0000", "#F59E0B", "#B22222"]; // Primary, Accent, Secondary

  return (
    <DashboardLayout>
      <div className="mb-8 bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome to your Dashboard</h1>
          <p className="text-white/80 font-medium max-w-xl">
            Get an instant overview of your smart records, track storage limits, and analyze recent archiving activities.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 to-transparent pointer-events-none"></div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Documents", value: totalDocuments, icon: Files },
          { title: "Active", value: activeDocuments, icon: FileText },
          { title: "Archived", value: archivedDocuments, icon: Archive },
          { title: "Pending", value: pendingDocuments, icon: Clock }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="cursor-pointer bg-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-gray-100 shadow-sm relative overflow-hidden group" onClick={() => navigate("/document-center")}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</CardTitle>
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold text-gray-900 tracking-tight">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* MOST USED DOC TYPE */}
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                <TrendingUp className="w-5 h-5 text-primary" /> 
              </div>
              Most Used Type
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center h-32">
            {mostUsedDocument ? (
              <>
                <div className="text-3xl font-extrabold text-gray-900 text-center tracking-tight mb-2">
                  {mostUsedDocument[0]}
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                  {mostUsedDocument[1]} Documents
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <FolderTree className="w-10 h-10 mb-2 opacity-20" />
                <span className="font-medium text-sm">No documents found</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* TOP USERS */}
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                <Users className="w-5 h-5 text-primary" />
              </div>
              Top Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {analytics.topUsers?.length > 0 ? (
                analytics.topUsers.slice(0, 3).map((user, index) => (
                  <div key={index} className="flex items-center justify-between bg-white hover:bg-gray-50 p-4 rounded-xl border border-gray-100 transition-colors shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-md">
                        {index + 1}
                      </div>
                      <span className="font-bold text-foreground text-lg">{user.name}</span>
                    </div>
                    <div className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
                      {user.activities} Actions
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                  <Activity className="w-10 h-10 mb-2 opacity-20" />
                  <span className="font-medium text-sm">No user activity recorded yet.</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* STORAGE CAPACITY */}
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                <Archive className="w-5 h-5 text-primary" />
              </div>
              Storage Capacity
            </CardTitle>
            <CardDescription className="font-medium ml-11">System wide document limits</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-end mb-4">
                <div className="text-4xl font-extrabold text-gray-900 tracking-tight">{totalDocuments} <span className="text-xl font-medium text-gray-400">/ {maxCapacity}</span></div>
                <div className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-sm">{storagePercentage}% Used</div>
              </div>
              <Progress value={storagePercentage} className="h-4 bg-muted shadow-inner" />
            </div>
          </CardContent>
        </Card>

        {/* CABINET USAGE */}
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                <FolderTree className="w-5 h-5 text-primary" />
              </div>
              Cabinet Usage Monitoring
            </CardTitle>
            <CardDescription className="font-medium ml-11">Physical and digital space utilization</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-5 max-h-[180px] overflow-y-auto pr-4 custom-scrollbar">
              {cabinetUsage.map((cabinet) => {
                const totalUsed = cabinet.file_boxes ? cabinet.file_boxes.length : 0;
                const capacity = cabinet.capacity || 1;
                const percentage = Math.round((totalUsed / capacity) * 100);
                
                return (
                  <div key={cabinet.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-gray-700 flex items-center gap-2">
                        <Box className="w-4 h-4 text-gray-400" />
                        {cabinet.name}
                      </span>
                      <span className="text-muted-foreground font-bold">{totalUsed} <span className="font-medium text-muted-foreground">/ {cabinet.capacity} boxes</span> <span className="text-primary ml-1">({percentage}%)</span></span>
                    </div>
                    <Progress value={percentage} className="h-2.5 bg-muted" />
                  </div>
                );
              })}
              {cabinetUsage.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-gray-400 h-full">
                  <Box className="w-10 h-10 mb-2 opacity-20" />
                  <span className="font-medium text-sm">No cabinets configured.</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Documents by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" nameKey="name">
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {pieChartData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm font-medium text-gray-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Document Status Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#B22222" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* UPLOAD ACTIVITY */}
      <Card className="border-none shadow-sm mb-10">
        <CardHeader>
          <CardTitle>Upload Activity (Monthly)</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="documents" fill="#8B0000" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* RECENT UPLOADS */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-semibold">Document ID</th>
                  <th className="px-6 py-3 font-semibold">Subject</th>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  {user?.role === "Admin" && <th className="px-6 py-3 font-semibold">Uploaded By</th>}
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentUploads.length > 0 ? (
                  recentUploads.map((file) => (
                    <tr key={file.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-primary">{file.document_id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{file.subject}</td>
                      <td className="px-6 py-4 text-gray-500">{file.document_type}</td>
                      {user?.role === "Admin" && <td className="px-6 py-4 text-gray-500">{file.user?.email || "Unknown"}</td>}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                          ${file.status === "Active" ? "bg-emerald-100 text-emerald-700" :
                            file.status === "Archived" ? "bg-gray-100 text-gray-700" :
                            file.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                            "bg-blue-100 text-blue-700"}`}
                        >
                          {file.status || "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {file.created_at ? new Date(file.created_at).toLocaleDateString() : "No Date"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 italic">No uploads yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* RECENT ACCOMPLISHMENT REPORTS */}
      <Card className="border-none shadow-sm mt-10">
        <CardHeader>
          <CardTitle>Recent Accomplishment Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentAccomplishments.length > 0 ? (
              recentAccomplishments.map(file => (
                <div key={file.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-bold text-gray-800 line-clamp-1">{file.subject || "Untitled Report"}</span>
                  </div>
                  <div className="text-sm text-gray-500">ID: {file.document_id}</div>
                  <div className="text-xs font-semibold text-primary/80 mt-2">
                    {new Date(file.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-gray-500 italic">
                No accomplishment reports uploaded yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export default Dashboard;