import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DashboardLayout from "../components/layout/DashboardLayout";
import DocumentViewModal from "../components/modals/DocumentViewModal";

// Modular Dashboard Components
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardKpiCards from "../components/dashboard/DashboardKpiCards";
import CategoryDistributionCard from "../components/dashboard/CategoryDistributionCard";
import StorageCustodyCard from "../components/dashboard/StorageCustodyCard";
import RecentActivityStream from "../components/dashboard/RecentActivityStream";

function Dashboard() {
  const [currentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  const [files, setFiles] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [viewingFile, setViewingFile] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const [filesRes, analyticsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/files", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/dashboard/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setFiles(filesRes.data || []);
      setAnalytics(analyticsRes.data || {});
    } catch (error) {
      console.error("DASHBOARD DATA ERROR:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Metrics calculations
  const totalDocuments = files.length || analytics.totalFiles || 0;
  const activeDocuments = files.filter((f) => f.status === "Active" && !f.is_deleted).length;
  const assignedCount = files.filter((f) => Boolean(f.file_box_id || f.file_box)).length;

  const categoriesCount = analytics.documentsByCategory?.length || 0;
  const docTypesCount = analytics.documentsPerType?.length || 0;
  const totalLogs = analytics.totalLogs || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        {/* INSTITUTIONAL HEADER & QUICK ACTIONS */}
        <DashboardHeader user={currentUser} />

        {/* 4 EXECUTIVE KPI CARDS */}
        <DashboardKpiCards
          totalDocuments={totalDocuments}
          activeDocuments={activeDocuments}
          assignedCount={assignedCount}
          categoriesCount={categoriesCount}
          docTypesCount={docTypesCount}
          totalLogs={totalLogs}
        />

        {/* ANALYTICS GRID (CATEGORIES & PHYSICAL STORAGE) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <CategoryDistributionCard
            documentsByCategory={analytics.documentsByCategory || []}
            documentsPerType={analytics.documentsPerType || []}
            totalDocuments={totalDocuments}
          />

          <StorageCustodyCard
            cabinetUsage={analytics.cabinetUsage || []}
            topUsers={analytics.topUsers || []}
          />
        </div>

        {/* REAL-TIME ARCHIVAL STREAM (LATEST DOCUMENTS & AUDIT TRAIL) */}
        <RecentActivityStream
          recentFiles={files}
          recentActivities={analytics.recentActivities || []}
          onViewDocument={(file) => setViewingFile(file)}
        />

        {/* MODAL: QUICK INSPECTION PREVIEW */}
        <DocumentViewModal
          isOpen={Boolean(viewingFile)}
          file={viewingFile}
          onClose={() => setViewingFile(null)}
        />
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
