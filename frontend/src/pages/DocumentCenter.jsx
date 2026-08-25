import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { 
  Eye, 
  Download, 
  Edit, 
  Trash2, 
  Search, 
  Sparkles, 
  Filter, 
  FileText, 
  Archive, 
  Clock, 
  RotateCcw,
  Printer,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Box,
  FileCheck
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import DocumentTemplateRenderer from "../components/templates/DocumentTemplateRenderer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";

function DocumentCenter() {
  const toast = useToast();
  const modal = useModal();
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState("standard"); // "standard" or "ai"
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isAISearching, setIsAISearching] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  
  // Filters & State
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showTrash, setShowTrash] = useState(false);
  
  // Modals
  const [viewingFile, setViewingFile] = useState(null);
  const [editingFile, setEditingFile] = useState(null);
  const [editSubject, setEditSubject] = useState("");
  const [editDocumentType, setEditDocumentType] = useState("");
  const [editStatus, setEditStatus] = useState("Active");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const printRef = useRef();

  useEffect(() => {
    if (searchMode === "standard") {
      const handler = setTimeout(() => setDebouncedSearch(search), 300);
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

  useEffect(() => {
    fetchFiles();
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
  }, [search, selectedYear, selectedStatus, selectedType, showTrash]);

  // LOG ACTION
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
    trackAction("VIEW", `Viewed ${file.document_type || "File"} ${file.document_id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = await modal.confirm({
      title: "Move to Trash",
      message: "Are you sure you want to move this document to the trash bin? You can restore it later if needed.",
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
      message: "This action cannot be undone. This document and its index metadata will be permanently deleted from the database and physical inventory record.",
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
      toast.success("Document permanently eliminated.", "Deleted");
      fetchFiles();
    } catch (error) {
      console.error(error);
      toast.error("Permanent delete failed.", "Error");
    }
  };

  const handleQuickStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/files/${id}`,
        { status, is_deleted: status === "Deleted" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Document status updated to ${status}.`, "Status Changed");
      fetchFiles();
    } catch (error) {
      console.error(error);
      toast.error("Status update failed.", "Update Error");
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/files/${editingFile.id}`,
        { subject: editSubject, document_type: editDocumentType, status: editStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Record details updated successfully.", "Saved");
      fetchFiles();
      setEditingFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Update failed. Please check form inputs.", "Error");
    }
  };

  // FILTERED LIST
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

    return matchesSearch && matchesTrash && matchesStatus && matchesType && matchesYear;
  });

  const totalDocuments = files.filter((f) => !f.is_deleted).length;
  const activeDocuments = files.filter((f) => f.status === "Active" && !f.is_deleted).length;
  const archivedDocuments = files.filter((f) => f.status === "Archived" && !f.is_deleted).length;
  const pendingDocuments = files.filter((f) => f.status === "Pending" && !f.is_deleted).length;

  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage) || 1;
  const paginatedFiles = filteredFiles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER & SUMMARY METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Active Documents", count: totalDocuments, icon: FileText, color: "text-[#800000]" },
            { label: "Active Guidance Files", count: activeDocuments, icon: CheckCircle2, color: "text-emerald-700" },
            { label: "Archived in Vault", count: archivedDocuments, icon: Archive, color: "text-gray-700" },
            { label: "Pending Categorization", count: pendingDocuments, icon: Clock, color: "text-amber-700" },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="bg-white border border-gray-200 shadow-xs rounded-xl">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      {item.label}
                    </span>
                    <span className="text-2xl font-extrabold text-gray-900 mt-1 block">
                      {item.count}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FDFBF7] border border-gray-100 text-[#800000]">
                    <Icon className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* SEARCH & FILTERS BAR */}
        <Card className="border border-gray-200 shadow-xs bg-white rounded-xl">
          <CardContent className="p-4 space-y-3">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* SEARCH INPUT */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={searchMode === "ai" ? "Ask AI about records (e.g. 'Show 2024 Memorandum')..." : "Search document ID, subject, or type..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchMode === "ai" && handleAISearch()}
                  className="pl-10 pr-24 h-10 text-xs rounded-xl border-gray-200 bg-[#FDFBF7]"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const newMode = searchMode === "standard" ? "ai" : "standard";
                    setSearchMode(newMode);
                    if (newMode === "ai" && search.trim()) handleAISearch();
                  }}
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 h-7 px-2.5 rounded-lg text-[11px] font-bold transition-all ${
                    searchMode === "ai" ? "bg-[#FFD700] text-[#800000]" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  <span>{searchMode === "ai" ? "AI Search" : "Standard"}</span>
                </Button>
              </div>

              {/* FILTER CONTROLS */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs font-medium focus:ring-2 focus:ring-[#800000]/20"
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                  <option value="Pending">Pending</option>
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs font-medium focus:ring-2 focus:ring-[#800000]/20"
                >
                  <option value="">All Years</option>
                  {[2026, 2025, 2024, 2023].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>

                <Button
                  variant={showTrash ? "destructive" : "outline"}
                  onClick={() => setShowTrash(!showTrash)}
                  className="h-10 px-3.5 rounded-xl text-xs font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  <span>{showTrash ? "Viewing Trash" : "Trash"}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DOCUMENTS TABLE */}
        <Card className="border border-gray-200 shadow-xs bg-white rounded-xl overflow-hidden">
          <CardHeader className="border-b border-gray-100 py-3.5 px-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-gray-900">
                {showTrash ? "Deleted Records Archive" : "Official Documents Archive"}
              </CardTitle>
              <CardDescription className="text-xs text-gray-500">
                {filteredFiles.length} records matching current filter criteria
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-gray-500 uppercase bg-[#FDFBF7] border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Document ID</th>
                    <th className="px-5 py-3.5 font-bold">Subject / Description</th>
                    <th className="px-5 py-3.5 font-bold">Category & Type</th>
                    <th className="px-5 py-3.5 font-bold">Physical Storage</th>
                    <th className="px-5 py-3.5 font-bold">Status</th>
                    <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedFiles.length > 0 ? (
                    paginatedFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-[#FDFBF7] transition-colors">
                        <td className="px-5 py-3.5 font-bold text-[#800000] whitespace-nowrap">
                          {file.document_id || file.access_code || `DOC-${file.id}`}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-gray-900 max-w-sm truncate">
                          {file.subject || file.title || "—"}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="font-semibold text-gray-800 block">{file.document_type || "General"}</span>
                          <span className="text-[10px] text-gray-500">{file.category || "Uncategorized"}</span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">
                          {file.file_box?.cabinet?.name ? (
                            <span className="inline-flex items-center gap-1 font-medium">
                              <Box className="w-3 h-3 text-[#800000]" />
                              {file.file_box.cabinet.name} / {file.file_box.name}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block
                            ${file.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                              file.status === "Archived" ? "bg-gray-100 text-gray-700 border border-gray-200" :
                              file.status === "Deleted" ? "bg-red-50 text-red-700 border border-red-200" :
                              "bg-amber-50 text-amber-700 border border-amber-200"}`}
                          >
                            {file.status || "Active"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewFile(file)}
                              className="h-7 w-7 p-0 text-gray-600 hover:text-[#800000] hover:bg-[#800000]/10"
                              title="View Document"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>

                            {!showTrash ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingFile(file);
                                    setEditSubject(file.subject || file.title || "");
                                    setEditDocumentType(file.document_type || "");
                                    setEditStatus(file.status || "Active");
                                  }}
                                  className="h-7 w-7 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                  title="Edit Record"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(file.id)}
                                  className="h-7 w-7 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
                                  title="Move to Trash"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleQuickStatus(file.id, "Active")}
                                  className="h-7 w-7 p-0 text-emerald-600 hover:bg-emerald-50"
                                  title="Restore Document"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handlePermanentDelete(file.id)}
                                  className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                                  title="Permanently Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-5 py-8 text-center text-gray-400 italic">
                        No documents found matching the search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION BAR */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-[#FDFBF7] text-xs text-gray-600">
              <span>
                Showing {filteredFiles.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredFiles.length)} of {filteredFiles.length} entries
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-3 text-xs bg-white"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  <span>Prev</span>
                </Button>
                <span className="px-2 font-bold text-gray-900">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                  className="h-8 px-3 text-xs bg-white"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* VIEW / PREVIEW MODAL */}
        {viewingFile && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 px-6 border-b border-gray-200 flex items-center justify-between bg-[#FDFBF7]">
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-5 h-5 text-[#800000]" />
                  <h3 className="font-bold text-gray-900 text-sm">
                    Document Viewer — {viewingFile.document_id || viewingFile.access_code}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.print()}
                    className="h-8 text-xs font-semibold bg-white"
                  >
                    <Printer className="w-3.5 h-3.5 mr-1.5" />
                    <span>Print</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setViewingFile(null)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <DocumentTemplateRenderer document={viewingFile} />
              </div>
            </div>
          </div>
        )}

        {/* EDIT METADATA MODAL */}
        {editingFile && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-bold text-gray-900 text-sm">Edit Record Information</h3>
                <button onClick={() => setEditingFile(null)} className="text-gray-400 hover:text-gray-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase">Subject / Description</label>
                  <Input
                    type="text"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase">Document Type</label>
                  <Input
                    type="text"
                    value={editDocumentType}
                    disabled
                    className="h-9 text-xs bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="h-9 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs font-medium focus:ring-2 focus:ring-[#800000]/20"
                  >
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <Button size="sm" variant="outline" onClick={() => setEditingFile(null)} className="h-8 text-xs font-semibold">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleUpdate} className="h-8 text-xs font-bold bg-[#800000] text-white hover:bg-[#660000]">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default DocumentCenter;