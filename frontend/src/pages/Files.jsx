import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FilePlus, 
  UploadCloud, 
  CalendarIcon, 
  Check, 
  ChevronsUpDown, 
  Archive, 
  Box, 
  FolderTree, 
  Loader2,
  FileText,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { documentCategories, getFieldsForDocumentType } from "@/utils/documentConfigs";

import { useToast } from "../context/ToastContext";

function Files() {
  const toast = useToast();
  const [category, setCategory] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [formData, setFormData] = useState({});
  const [generatedRecords, setGeneratedRecords] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState({});
  const [selectedFileBox, setSelectedFileBox] = useState({});
  
  // File upload state
  const [legacyFile, setLegacyFile] = useState(null);
  const [uploadingLegacy, setUploadingLegacy] = useState(false);
  const [selectedUploadCabinet, setSelectedUploadCabinet] = useState("");
  const [selectedUploadFileBox, setSelectedUploadFileBox] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const selectedFields = getFieldsForDocumentType(documentType);

  // FETCH RECORDS
  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGeneratedRecords(response.data || []);
    } catch (error) {
      console.error("FETCH FILES ERROR:", error);
    }
  };

  // FETCH CABINETS & FILE BOXES
  const fetchInventories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/inventory/cabinets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventories(response.data || []);
    } catch (error) {
      console.error("FETCH INVENTORY ERROR:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchInventories();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // GENERATE RECORD ENTRY
  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/files/generate",
        {
          ...formData,
          title: formData.subject || formData.student_name || formData.program || "Untitled Record",
          category,
          access_code: formData.access_code,
          subject: formData.subject || formData.title_of_thesis || formData.program || "",
          document_type: documentType,
          memo_date: new Date(),
          received_date: new Date(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Document entry registered successfully!", "Record Filed");
      setFormData({});
      fetchFiles();
    } catch (error) {
      console.error("GENERATION ERROR:", error);
      toast.error(error.response?.data?.message || "Generation failed", "Error");
    }
  };

  // UPLOAD FILE & ATTACH STORAGE
  const handleLegacyUpload = async () => {
    if (!legacyFile) {
      toast.warning("Please select a valid document file.", "File Required");
      return;
    }
    try {
      setUploadingLegacy(true);
      const token = localStorage.getItem("token");
      const uploadData = new FormData();
      uploadData.append("file", legacyFile);
      if (selectedUploadFileBox) {
        uploadData.append("file_box_id", selectedUploadFileBox);
      }
      await axios.post("http://localhost:5000/api/files/upload", uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setLegacyFile(null);
      setSelectedUploadCabinet("");
      setSelectedUploadFileBox("");
      fetchFiles();
      fetchInventories();
      toast.success("Document uploaded and indexed successfully!", "Document Uploaded");
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      toast.error("Upload failed. Please check file format and try again.", "Upload Error");
    } finally {
      setUploadingLegacy(false);
    }
  };

  // ASSIGN PHYSICAL STORAGE LOCATION
  const assignFileBox = async (fileId, fileBoxId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/files/assign/${fileId}`,
        { file_box_id: fileBoxId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Physical storage container assigned successfully!", "Location Assigned");
      fetchFiles();
      fetchInventories();
    } catch (error) {
      console.error("ASSIGN ERROR:", error);
      toast.error(error.response?.data?.message || "Storage assignment failed", "Assignment Error");
    }
  };

  const totalPages = Math.ceil(generatedRecords.length / itemsPerPage) || 1;
  const paginatedRecords = generatedRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Document Filing & Registration
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Register automated metadata records or upload scanned files directly into physical cabinets.
          </p>
        </div>
      </div>

      {/* TOP SECTION: 2-COLUMN GRID (CREATE ENTRY + UPLOAD FILE) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* CARD 1: DOCUMENT METADATA GENERATOR */}
        <Card className="border border-gray-200 shadow-xs bg-white rounded-xl flex flex-col">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#800000]/10 text-[#800000]">
                <FilePlus className="w-4 h-4" />
              </div>
              <span>Register Document Entry</span>
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Categorize and record official document metadata in the central registry.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 flex-1 flex flex-col justify-between">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* CATEGORY SELECT */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Category</label>
                  <Popover modal={true}>
                    <PopoverTrigger
                      className="flex h-10 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000]"
                    >
                      <span className="truncate">{category || "Select Classification"}</span>
                      <ChevronsUpDown className="h-3.5 w-3.5 opacity-50 shrink-0" />
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-56" align="start">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {Object.keys(documentCategories).map((cat) => (
                              <CommandItem
                                key={cat}
                                value={cat}
                                onSelect={() => {
                                  setCategory(cat);
                                  setDocumentType("");
                                  setFormData({});
                                  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
                                }}
                                className="text-xs cursor-pointer"
                              >
                                <Check className={cn("mr-2 h-3.5 w-3.5", category === cat ? "opacity-100 text-[#800000]" : "opacity-0")} />
                                {cat}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* DOCUMENT TYPE SELECT */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Document Type</label>
                  <Popover modal={true}>
                    <PopoverTrigger
                      disabled={!category}
                      className="flex h-10 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="truncate">{documentType || "Select Document Type"}</span>
                      <ChevronsUpDown className="h-3.5 w-3.5 opacity-50 shrink-0" />
                    </PopoverTrigger>
                    <PopoverContent className="p-0 max-h-60 overflow-y-auto w-64" align="start">
                      <Command>
                        <CommandInput placeholder="Filter types..." className="text-xs" />
                        <CommandList>
                          <CommandEmpty className="text-xs p-2 text-center text-gray-500">No type found.</CommandEmpty>
                          <CommandGroup>
                            {category && documentCategories[category]?.map((doc) => (
                              <CommandItem
                                key={doc}
                                value={doc}
                                onSelect={() => {
                                  setDocumentType(doc);
                                  setFormData({});
                                  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
                                }}
                                className="text-xs cursor-pointer"
                              >
                                <Check className={cn("mr-2 h-3.5 w-3.5", documentType === doc ? "opacity-100 text-[#800000]" : "opacity-0")} />
                                {doc}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* DYNAMIC FORM FIELDS */}
              {selectedFields.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {selectedFields.map((field) => (
                    <div key={field} className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600 uppercase">
                        {field.replaceAll("_", " ")}
                      </label>
                      <Input
                        type="text"
                        placeholder={`Enter ${field.replaceAll("_", " ")}`}
                        value={formData[field] || ""}
                        onChange={(e) => handleChange(field, e.target.value)}
                        className="h-10 text-xs rounded-xl border-gray-200 bg-white"
                        required={field === "access_code"}
                      />
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="submit"
                disabled={!documentType}
                className="w-full bg-[#800000] text-white hover:bg-[#660000] py-5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 mt-4"
              >
                <FilePlus className="w-4 h-4" />
                <span>Register Document Entry</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* CARD 2: DIRECT SMART DOCUMENT UPLOAD */}
        <Card className="border border-gray-200 shadow-xs bg-white rounded-xl flex flex-col">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#800000]/10 text-[#800000]">
                <UploadCloud className="w-4 h-4" />
              </div>
              <span>Upload Document & Assign Storage</span>
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Upload PDF, DOCX, or PPTX. Automatic OCR extracts text from scanned records.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 flex-1 flex flex-col justify-center">
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 bg-[#FDFBF7] flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#800000] shadow-xs">
                <UploadCloud className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Choose document to upload</p>
                <p className="text-xs text-gray-500 mt-0.5">PDF, DOCX, PPTX, JPG up to 10MB</p>
              </div>

              {/* CABINET & FILE BOX DROPDOWNS */}
              <div className="w-full max-w-sm grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                <select
                  value={selectedUploadCabinet}
                  onChange={(e) => {
                    setSelectedUploadCabinet(e.target.value);
                    setSelectedUploadFileBox("");
                  }}
                  className="h-9 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs font-medium focus:ring-2 focus:ring-[#800000]/20"
                >
                  <option value="">Cabinet (Optional)</option>
                  {inventories.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name || inv.cabinet_name || `Cabinet ${inv.id}`}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedUploadFileBox}
                  onChange={(e) => setSelectedUploadFileBox(e.target.value)}
                  disabled={!selectedUploadCabinet}
                  className="h-9 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs font-medium focus:ring-2 focus:ring-[#800000]/20 disabled:opacity-50"
                >
                  <option value="">File Box (Optional)</option>
                  {inventories.find((inv) => String(inv.id) === String(selectedUploadCabinet))?.file_boxes?.map((box) => (
                    <option key={box.id} value={box.id}>{box.name}</option>
                  ))}
                </select>
              </div>

              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                onChange={(e) => setLegacyFile(e.target.files[0] || null)}
                className="w-full max-w-sm text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#800000] file:text-white hover:file:bg-[#660000] cursor-pointer"
              />

              <Button
                onClick={handleLegacyUpload}
                disabled={!legacyFile || uploadingLegacy}
                className="w-full max-w-sm bg-[#800000] text-white hover:bg-[#660000] py-5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
              >
                {uploadingLegacy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing & Indexing...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload & File Document</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PHYSICAL STORAGE ASSIGNMENT TABLE */}
      <Card className="border border-gray-200 shadow-xs bg-white rounded-xl overflow-hidden">
        <CardHeader className="border-b border-gray-100 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Box className="w-4 h-4 text-[#800000]" />
              <span>Physical Storage Assignments</span>
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Assign or update physical cabinet and file box locations for registered records.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] text-gray-500 uppercase bg-[#FDFBF7] border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 font-bold">Document Type</th>
                  <th className="px-5 py-3 font-bold">Access Code</th>
                  <th className="px-5 py-3 font-bold">Subject / Title</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Physical Storage Location</th>
                  <th className="px-5 py-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedRecords.length > 0 ? (
                  paginatedRecords.map((record) => {
                    const currentCabId = selectedInventory[record.id] || record.file_box?.cabinet?.id || "";
                    const currentBoxId = selectedFileBox[record.id] || record.file_box_id || "";

                    return (
                      <tr key={record.id} className="hover:bg-[#FDFBF7] transition-colors">
                        <td className="px-5 py-3.5 font-bold text-[#800000]">{record.document_type}</td>
                        <td className="px-5 py-3.5 font-mono text-gray-700">{record.access_code || "—"}</td>
                        <td className="px-5 py-3.5 font-medium text-gray-900 max-w-xs truncate">
                          {record.subject || record.title || "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block
                            ${record.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                              record.status === "Archived" ? "bg-gray-100 text-gray-700 border border-gray-200" :
                              "bg-amber-50 text-amber-700 border border-amber-200"}`}
                          >
                            {record.status || "Active"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-2 max-w-xs">
                            <select
                              value={currentCabId}
                              onChange={(e) => {
                                setSelectedInventory({
                                  ...selectedInventory,
                                  [record.id]: e.target.value,
                                });
                                setSelectedFileBox({
                                  ...selectedFileBox,
                                  [record.id]: "",
                                });
                              }}
                              className="h-8 w-full rounded-lg border border-gray-200 bg-white px-2 text-xs font-medium focus:ring-1 focus:ring-[#800000]"
                            >
                              <option value="">Select Cabinet</option>
                              {inventories.map((inv) => (
                                <option key={inv.id} value={inv.id}>
                                  {inv.name || inv.cabinet_name || `Cabinet ${inv.id}`}
                                </option>
                              ))}
                            </select>

                            <select
                              value={currentBoxId}
                              onChange={(e) =>
                                setSelectedFileBox({
                                  ...selectedFileBox,
                                  [record.id]: e.target.value,
                                })
                              }
                              disabled={!currentCabId}
                              className="h-8 w-full rounded-lg border border-gray-200 bg-white px-2 text-xs font-medium focus:ring-1 focus:ring-[#800000] disabled:opacity-50"
                            >
                              <option value="">Select Box</option>
                              {inventories.find((inv) => String(inv.id) === String(currentCabId))?.file_boxes?.map((box) => (
                                <option key={box.id} value={box.id}>{box.name}</option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Button
                            size="sm"
                            onClick={() => assignFileBox(record.id, currentBoxId)}
                            disabled={!currentBoxId}
                            className="bg-[#800000] text-white hover:bg-[#660000] h-8 px-3 rounded-lg text-xs font-bold shadow-xs disabled:opacity-40"
                          >
                            {record.file_box_id ? "Reassign" : "Assign"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-5 py-8 text-center text-gray-400 italic">
                      No records awaiting physical filing
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION BAR */}
          <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-[#FDFBF7] text-xs text-gray-600">
            <span>
              Showing {generatedRecords.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, generatedRecords.length)} of {generatedRecords.length} records
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
    </div>
  );
}

export default Files;