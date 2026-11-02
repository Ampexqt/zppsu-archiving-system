import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/layout/DashboardLayout";
import DocumentSummaryCards from "../components/documents/DocumentSummaryCards";
import DocumentFiltersBar from "../components/documents/DocumentFiltersBar";
import DocumentTable from "../components/documents/DocumentTable";
import DocumentEditModal from "../components/modals/DocumentEditModal";
import DocumentViewModal from "../components/modals/DocumentViewModal";
import { exportDocumentCatalog } from "../utils/documentCatalogExporter";
import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";

export default function DocumentCenter() {
  const toast = useToast();
  const modal = useModal();

  const [currentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });
  const isAdmin = currentUser?.role === "Admin";

  const [files, setFiles] = useState([]);
  const [cabinets, setCabinets] = useState([]);
  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState("standard"); // "standard" | "ai"
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [, setIsAISearching] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  
  // Filters & Views
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStorageFilter, setSelectedStorageFilter] = useState("");
  const [showTrash, setShowTrash] = useState(false);
  
  // Active Modals
  const [viewingFile, setViewingFile] = useState(null);
  const [editingFile, setEditingFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounced search for standard keyword matching
  useEffect(() => {
    if (searchMode === "standard") {
      const handler = setTimeout(() => setDebouncedSearch(search), 250);
      return () => clearTimeout(handler);
    } else {
      setDebouncedSearch("");
    }
  }, [search, searchMode]);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(response.data || []);
    } catch (error) {
      console.error("FETCH FILES ERROR:", error);
    }
  };

  const fetchCabinets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/inventory/cabinets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCabinets(response.data || []);
    } catch (error) {
      console.error("FETCH CABINETS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchCabinets();
  }, []);

  const handleAISearch = async () => {
    if (!search.trim()) {
      setAiResults(null);
      return;
    }
    setIsAISearching(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/files/search?query=${encodeURIComponent(search)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiResults(response.data || []);
      toast.info(`Found ${response.data?.length || 0} AI matching records.`, "AI Semantic Search");
    } catch (error) {
      console.error("AI Search failed", error);
      toast.error("Semantic search failed. Falling back to standard filters.", "AI Search");
    } finally {
      setIsAISearching(false);
    }
  };

  useEffect(() => {
    if (search === "") setAiResults(null);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedYear, selectedStatus, selectedType, selectedStorageFilter, showTrash]);

  // Track action in audit trail
  const trackAction = async (action, description) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/logs/track",
        { action, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to track action:", error);
    }
  };

  const handleViewFile = (file) => {
    setViewingFile(file);
    trackAction("VIEW", `Viewed ${file.document_type || "File"} ${file.document_id || file.id}`);
  };

  const handleOpenEdit = (file) => {
    setEditingFile(file);
  };

  const handleDelete = async (id) => {
    const confirmed = await modal.confirm({
      title: "Move to Trash",
      message: "Are you sure you want to move this document to the trash bin? It can be restored later.",
      confirmText: "Move to Trash",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, is_deleted: true, status: "Deleted" } : f)));
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/files/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Document moved to trash successfully.", "Trashed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to move document to trash.", "Delete Error");
    }
  };

  const handlePermanentDelete = async (id) => {
    const confirmed = await modal.confirm({
      title: "Permanently Delete Document",
      message: "This action cannot be undone. The document and its metadata will be permanently eliminated.",
      confirmText: "Permanently Delete",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/files/permanent/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Document permanently deleted.", "Deleted");
      fetchFiles();
    } catch (error) {
      console.error(error);
      toast.error("Permanent delete failed.", "Error");
    }
  };

  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/files/restore/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Document restored from trash.", "Restored");
      fetchFiles();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Restore failed.", "Error");
    }
  };

  const handleSaveEdit = async ({ subject, status, file_box_id }) => {
    if (!editingFile) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      // Update general metadata
      await axios.put(
        `http://localhost:5000/api/files/${editingFile.id}`,
        { subject, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Check if file box changed
      const originalBoxId = editingFile.file_box_id ? String(editingFile.file_box_id) : "";
      const newBoxId = file_box_id ? String(file_box_id) : "";

      if (newBoxId && newBoxId !== originalBoxId) {
        await axios.put(
          `http://localhost:5000/api/files/assign/${editingFile.id}`,
          { file_box_id: newBoxId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      toast.success("Record details and storage assignment updated successfully.", "Saved");
      await fetchFiles();
      await fetchCabinets();
      setEditingFile(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed. Please check inputs.", "Error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportCatalog = async () => {
    if (filteredFiles.length === 0) {
      toast.info("No documents to export matching current filters.", "Export Catalog");
      return;
    }
    try {
      setIsExporting(true);
      const filterSummary = hasActiveFilters ? "Filtered Selection" : "Complete Archive";
      await exportDocumentCatalog(filteredFiles, filterSummary);
      toast.success(`Exported ${filteredFiles.length} document records to Excel (.xlsx).`, "Catalog Exported");
    } catch (error) {
      console.error("Export error:", error);
      toast.error(error.message || "Failed to generate document export.", "Export Failed");
    } finally {
      setIsExporting(false);
    }
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedYear("");
    setSelectedStatus("");
    setSelectedType("");
    setSelectedStorageFilter("");
    setAiResults(null);
  };

  const hasActiveFilters = Boolean(
    search || selectedYear || selectedStatus || selectedType || selectedStorageFilter || aiResults
  );

  // Filtered document list
  const baseFiles = aiResults !== null ? aiResults : files;
  const filteredFiles = baseFiles.filter((file) => {
    const term = debouncedSearch.toLowerCase().trim();
    const matchesSearch =
      !term ||
      file.document_id?.toLowerCase().includes(term) ||
      file.subject?.toLowerCase().includes(term) ||
      file.document_type?.toLowerCase().includes(term) ||
      file.category?.toLowerCase().includes(term);

    const matchesTrash = showTrash ? file.is_deleted : !file.is_deleted;
    const matchesStatus = !selectedStatus || file.status === selectedStatus;
    const matchesType = !selectedType || file.document_type === selectedType;
    const matchesYear = !selectedYear || (file.created_at && new Date(file.created_at).getFullYear().toString() === selectedYear);
    
    const isAssigned = Boolean(file.file_box_id || file.file_box);
    const matchesStorage = 
      !selectedStorageFilter ||
      (selectedStorageFilter === "unassigned" && !isAssigned) ||
      (selectedStorageFilter === "assigned" && isAssigned);

    return matchesSearch && matchesTrash && matchesStatus && matchesType && matchesYear && matchesStorage;
  });

  // Summary Metrics
  const totalDocuments = files.filter((f) => !f.is_deleted).length;
  const activeDocuments = files.filter((f) => f.status === "Active" && !f.is_deleted).length;
  const archivedDocuments = files.filter((f) => f.status === "Archived" && !f.is_deleted).length;
  const unassignedStorageCount = files.filter((f) => !f.is_deleted && !f.file_box_id && !f.file_box).length;
  const trashCount = files.filter((f) => f.is_deleted).length;

  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage) || 1;
  const paginatedFiles = filteredFiles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* SUMMARY METRICS CARDS */}
        <DocumentSummaryCards
          totalDocuments={totalDocuments}
          activeDocuments={activeDocuments}
          archivedDocuments={archivedDocuments}
          unassignedStorageCount={unassignedStorageCount}
          selectedStorageFilter={selectedStorageFilter}
          onToggleUnassignedFilter={() => {
            setSelectedStorageFilter(selectedStorageFilter === "unassigned" ? "" : "unassigned");
          }}
        />

        {/* SEARCH & FILTERS BAR */}
        <DocumentFiltersBar
          search={search}
          setSearch={setSearch}
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          onAISearch={handleAISearch}
          selectedStorageFilter={selectedStorageFilter}
          setSelectedStorageFilter={setSelectedStorageFilter}
          unassignedStorageCount={unassignedStorageCount}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearAllFilters}
          showTrash={showTrash}
          setShowTrash={setShowTrash}
          trashCount={trashCount}
          onExport={handleExportCatalog}
          isExporting={isExporting}
        />

        {/* DOCUMENTS DATA TABLE */}
        <DocumentTable
          files={paginatedFiles}
          totalCount={filteredFiles.length}
          showTrash={showTrash}
          isAdmin={isAdmin}
          currentUserId={currentUser?.id}
          onViewFile={handleViewFile}
          onEditFile={handleOpenEdit}
          onDeleteFile={handleDelete}
          onRestoreFile={handleRestore}
          onPermanentDeleteFile={handlePermanentDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearAllFilters}
        />

        {/* VIEW DOCUMENT MODAL */}
        <DocumentViewModal
          isOpen={Boolean(viewingFile)}
          file={viewingFile}
          onClose={() => setViewingFile(null)}
        />

        {/* EDIT METADATA & PHYSICAL STORAGE MODAL */}
        <DocumentEditModal
          isOpen={Boolean(editingFile)}
          file={editingFile}
          cabinets={cabinets}
          onClose={() => setEditingFile(null)}
          onSave={handleSaveEdit}
          isSaving={isSaving}
        />
      </div>
    </DashboardLayout>
  );
}
