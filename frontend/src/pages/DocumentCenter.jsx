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
            { label: "Total Active Documents", count: totalDocuments, icon: FileText, color: "text-[#6B1D2A]" },
            { label: "Active Guidance Files", count: activeDocuments, icon: CheckCircle2, color: "text-[#6B1D2A]" },
            { label: "Archived in Vault", count: archivedDocuments, icon: Archive, color: "text-[#5F5A5C]" },
            { label: "Pending Categorization", count: pendingDocuments, icon: Clock, color: "text-[#A87818]" },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
                      {item.label}
                    </span>
                    <span className="text-2xl font-extrabold text-[#1D1A1B] mt-1 block">
                      {item.count}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] text-[#6B1D2A]">
                    <Icon className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* SEARCH & FILTERS BAR */}
        <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl">
          <CardContent className="p-4 space-y-3">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* SEARCH INPUT */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5A5C]" />
                <Input
                  type="text"
                  placeholder={searchMode === "ai" ? "Ask AI about records (e.g. 'Show 2024 Memorandum')..." : "Search document ID, subject, or type..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchMode === "ai" && handleAISearch()}
                  className="pl-10 pr-24 h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] placeholder-[#5F5A5C]/60 focus:border-[#6B1D2A]"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const newMode = searchMode === "standard" ? "ai" : "standard";
                    setSearchMode(newMode);
                    if (newMode === "ai" && search.trim()) handleAISearch();
                  }}
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 h-7 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    searchMode === "ai" ? "bg-[#C99A2E] text-[#1D1A1B]" : "text-[#5F5A5C] hover:text-[#1D1A1B]"
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
                  className="h-10 rounded-xl border border-[#E8E3E1] bg-[#FFFCF7] px-3 text-xs font-medium text-[#1D1A1B] focus:ring-2 focus:ring-[#6B1D2A]/20 focus:border-[#6B1D2A]"
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                  <option value="Pending">Pending</option>
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="h-10 rounded-xl border border-[#E8E3E1] bg-[#FFFCF7] px-3 text-xs font-medium text-[#1D1A1B] focus:ring-2 focus:ring-[#6B1D2A]/20 focus:border-[#6B1D2A]"
                >
                  <option value="">All Years</option>
                  {[2026, 2025, 2024, 2023].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>

                <Button
                  variant={showTrash ? "destructive" : "outline"}
                  onClick={() => setShowTrash(!showTrash)}
                  className={`h-10 px-3.5 rounded-xl text-xs font-bold cursor-pointer ${
                    showTrash 
                      ? "bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545]" 
                      : "bg-[#FFFCF7] text-[#1D1A1B] border-[#E8E3E1] hover:bg-[#F4E7EA]"
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  <span>{showTrash ? "Viewing Trash" : "Trash"}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DOCUMENTS TABLE */}
        <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl overflow-hidden">
          <CardHeader className="border-b border-[#E8E3E1] py-3.5 px-6 flex flex-row items-center justify-between bg-[#FFFCF7]">
            <div>
              <CardTitle className="text-sm font-bold text-[#1D1A1B]">
                {showTrash ? "Deleted Records Archive" : "Official Documents Archive"}
              </CardTitle>
              <CardDescription className="text-xs text-[#5F5A5C]">
                {filteredFiles.length} records matching current filter criteria
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-[#5F5A5C] uppercase bg-[#F4E7EA] border-b border-[#E8E3E1]">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Document ID</th>
                    <th className="px-5 py-3.5 font-bold">Subject / Description</th>
                    <th className="px-5 py-3.5 font-bold">Category & Type</th>
                    <th className="px-5 py-3.5 font-bold">Physical Storage</th>
                    <th className="px-5 py-3.5 font-bold">Status</th>
                    <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E3E1]">
                  {paginatedFiles.length > 0 ? (
                    paginatedFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-[#F4E7EA]/40 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-[#6B1D2A] whitespace-nowrap">
                          {file.document_id || file.access_code || `DOC-${file.id}`}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-[#1D1A1B] max-w-sm truncate">
                          {file.subject || file.title || "—"}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="font-semibold text-[#1D1A1B] block">{file.document_type || "General"}</span>
                          <span className="text-[10px] text-[#5F5A5C]">{file.category || "Uncategorized"}</span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-[#5F5A5C]">
                          {file.file_box?.cabinet?.name ? (
                            <span className="inline-flex items-center gap-1 font-medium text-[#1D1A1B]">
                              <Box className="w-3 h-3 text-[#6B1D2A]" />
                              {file.file_box.cabinet.name} / {file.file_box.name}
                            </span>
                          ) : (
                            <span className="text-[#5F5A5C]/60 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block
                            ${file.status === "Active" ? "bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1]" :
                              file.status === "Archived" ? "bg-[#FFFCF7] text-[#5F5A5C] border border-[#E8E3E1]" :
                              file.status === "Deleted" ? "bg-[#F4E7EA] text-[#4A0E1C] border border-[#E8E3E1]" :
                              "bg-[#F2DFB0] text-[#A87818] border border-[#C99A2E]"}`}
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
                              className="h-7 w-7 p-0 text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] cursor-pointer"
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
                                  className="h-7 w-7 p-0 text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] cursor-pointer"
                                  title="Edit Record"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(file.id)}
                                  className="h-7 w-7 p-0 text-[#5F5A5C] hover:text-[#4A0E1C] hover:bg-[#F4E7EA] cursor-pointer"
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
                                  className="h-7 w-7 p-0 text-[#6B1D2A] hover:bg-[#F4E7EA] cursor-pointer"
                                  title="Restore Document"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handlePermanentDelete(file.id)}
                                  className="h-7 w-7 p-0 text-[#4A0E1C] hover:bg-[#F4E7EA] cursor-pointer"
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
                      <td colSpan="6" className="px-5 py-8 text-center text-[#5F5A5C] italic">
                        No documents found matching the search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION BAR */}
            <div className="p-4 border-t border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7] text-xs text-[#5F5A5C]">
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
                  className="h-8 px-3 text-xs bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer"
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
                  className="h-8 px-3 text-xs bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer"
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
            <div className="bg-[#FFFCF7] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-xl border border-[#E8E3E1] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 px-6 border-b border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7]">
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-5 h-5 text-[#6B1D2A]" />
                  <h3 className="font-bold text-[#1D1A1B] text-sm">
                    Document Viewer — {viewingFile.document_id || viewingFile.access_code}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.print()}
                    className="h-8 text-xs font-semibold bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 mr-1.5" />
                    <span>Print</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setViewingFile(null)}
                    className="h-8 w-8 p-0 text-[#5F5A5C] hover:text-[#1D1A1B] cursor-pointer"
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
            <div className="bg-[#FFFCF7] w-full max-w-md rounded-2xl shadow-xl border border-[#E8E3E1] p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#E8E3E1] pb-3">
                <h3 className="font-bold text-[#1D1A1B] text-sm">Edit Record Information</h3>
                <button onClick={() => setEditingFile(null)} className="text-[#5F5A5C] hover:text-[#1D1A1B] cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#1D1A1B] uppercase">Subject / Description</label>
                  <Input
                    type="text"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="h-9 text-xs border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1D1A1B] uppercase">Document Type</label>
                  <Input
                    type="text"
                    value={editDocumentType}
                    disabled
                    className="h-9 text-xs bg-[#E8E3E1]/40 border-[#E8E3E1] text-[#5F5A5C] cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1D1A1B] uppercase">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="h-9 w-full rounded-xl border border-[#E8E3E1] bg-[#FFFCF7] px-3 text-xs font-medium text-[#1D1A1B] focus:ring-2 focus:ring-[#6B1D2A]/20"
                  >
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E3E1]">
                <Button size="sm" variant="outline" onClick={() => setEditingFile(null)} className="h-8 text-xs font-semibold bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleUpdate} className="h-8 text-xs font-bold bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] cursor-pointer">
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