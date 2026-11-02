import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  UploadCloud, 
  FilePlus, 
  Box, 
  Layers, 
  X, 
  FileText, 
  Loader2,
  ArrowRight,
  Clock,
  CheckCircle2,
  FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShadcnSelect from "@/components/ui/ShadcnSelect";
import PhysicalStoragePlacementCard from "../components/files/PhysicalStoragePlacementCard";
import { documentCategories, getFieldsForDocumentType } from "@/utils/documentConfigs";
import { useToast } from "../context/ToastContext";

function Files() {
  const toast = useToast();
  const [mode, setMode] = useState("upload"); // "upload" | "register"
  const [recentRecords, setRecentRecords] = useState([]);
  const [inventories, setInventories] = useState([]);

  // UPLOAD FORM STATE
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCabinet, setUploadCabinet] = useState("");
  const [uploadFileBox, setUploadFileBox] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  // REGISTER FORM STATE
  const [category, setCategory] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [formData, setFormData] = useState({});
  const [registerCabinet, setRegisterCabinet] = useState("");
  const [registerFileBox, setRegisterFileBox] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const selectedFields = getFieldsForDocumentType(documentType);

  // FETCH RECORDS
  const fetchRecentFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentRecords(response.data || []);
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
    fetchRecentFiles();
    fetchInventories();
  }, []);

  // DRAG & DROP HANDLERS
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // HANDLE UPLOAD
  const handleUpload = async (e) => {
    if (e) e.preventDefault();
    if (!file) {
      toast.warning("Please choose a file to upload.", "File Required");
      return;
    }

    try {
      setIsUploading(true);
      const token = localStorage.getItem("token");
      const uploadData = new FormData();
      uploadData.append("file", file);
      if (uploadFileBox) {
        uploadData.append("file_box_id", uploadFileBox);
      }

      await axios.post("http://localhost:5000/api/files/upload", uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        uploadFileBox 
          ? "Document uploaded and assigned to physical storage!" 
          : "Document uploaded and indexed successfully!", 
        "Filing Complete"
      );
      setFile(null);
      setUploadCabinet("");
      setUploadFileBox("");
      fetchRecentFiles();
      fetchInventories();
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      toast.error(error.response?.data?.message || "Upload failed. Please try again.", "Error");
    } finally {
      setIsUploading(false);
    }
  };

  // HANDLE REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!category || !documentType) {
      toast.warning("Please select Category and Document Type.", "Required Fields");
      return;
    }

    try {
      setIsRegistering(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/files/generate",
        {
          ...formData,
          title: formData.subject || formData.student_name || formData.program || `Generated ${documentType}`,
          category,
          access_code: formData.access_code || "N/A",
          subject: formData.subject || formData.title_of_thesis || formData.program || "",
          document_type: documentType,
          file_box_id: registerFileBox || undefined,
          memo_date: new Date(),
          received_date: new Date(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        registerFileBox
          ? "Document record registered and assigned to storage!"
          : "Document record registered in central ledger!",
        "Record Filed"
      );
      setFormData({});
      setCategory("");
      setDocumentType("");
      setRegisterCabinet("");
      setRegisterFileBox("");
      fetchRecentFiles();
      fetchInventories();
    } catch (error) {
      console.error("REGISTRATION ERROR:", error);
      toast.error(error.response?.data?.message || "Registration failed", "Error");
    } finally {
      setIsRegistering(false);
    }
  };

  // Cabinet & File Box Options
  const cabinetOptions = inventories.map((inv) => ({
    value: String(inv.id),
    label: inv.name || inv.cabinet_name || `Cabinet ${inv.id}`,
  }));

  const uploadBoxOptions = (
    inventories.find((inv) => String(inv.id) === String(uploadCabinet))?.file_boxes || []
  ).map((box) => ({
    value: String(box.id),
    label: box.name,
    subtitle: `(${box.used_space || 0}/${box.capacity || 0})`,
  }));

  const registerBoxOptions = (
    inventories.find((inv) => String(inv.id) === String(registerCabinet))?.file_boxes || []
  ).map((box) => ({
    value: String(box.id),
    label: box.name,
    subtitle: `(${box.used_space || 0}/${box.capacity || 0})`,
  }));

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1D1A1B] tracking-tight">
            Document Filing & Ingestion
          </h1>
          <p className="text-xs text-[#5F5A5C] mt-1">
            Quickly ingest new records into the archive via direct document upload or official metadata registration.
          </p>
        </div>

        {/* QUICK LINK TO DOCUMENT CENTER */}
        <Link
          to="/document-center"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFFCF7] border border-[#E8E3E1] text-xs font-bold text-[#6B1D2A] hover:bg-[#F4E7EA] transition-all shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <FolderOpen className="w-4 h-4 text-[#6B1D2A]" />
          <span>Document Center & Storage ({recentRecords.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* SINGLE UNIFIED WORKFLOW CARD */}
      <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-2xl overflow-hidden p-0 gap-0">
        {/* CARD WORKFLOW HEADER & SWITCHER */}
        <div className="p-6 border-b border-[#E8E3E1] bg-[#FFFCF7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B1D2A] uppercase tracking-wider mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Official Records Intake</span>
            </div>
            <h2 className="text-lg font-bold text-[#1D1A1B]">
              {mode === "upload" ? "Upload Scanned / Digital Document" : "Register Document Metadata Record"}
            </h2>
            <p className="text-xs text-[#5F5A5C] mt-0.5">
              {mode === "upload"
                ? "Automatic OCR extracts text from PDF and images while storing the original file."
                : "Fill out official institutional record details to create an indexed registry entry."}
            </p>
          </div>

          {/* 1-TAP WORKFLOW SELECTOR */}
          <div className="inline-flex p-1 bg-[#F4E7EA] rounded-xl border border-[#E8E3E1] self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
                mode === "upload"
                  ? "bg-[#6B1D2A] text-[#FFFCF7] shadow-xs"
                  : "text-[#5F5A5C] hover:text-[#1D1A1B]"
              )}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
                mode === "register"
                  ? "bg-[#6B1D2A] text-[#FFFCF7] shadow-xs"
                  : "text-[#5F5A5C] hover:text-[#1D1A1B]"
              )}
            >
              <FilePlus className="w-4 h-4" />
              <span>Register Entry</span>
            </button>
          </div>
        </div>

        {/* WORKFLOW BODY */}
        <div className="p-6 sm:p-8">
          {/* ================= MODE 1: UPLOAD ================= */}
          {mode === "upload" && (
            <form onSubmit={handleUpload} className="space-y-6">
              {/* DRAG AND DROP ZONE */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("main-file-upload")?.click()}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-center cursor-pointer space-y-3",
                  isDragOver ? "border-[#6B1D2A] bg-[#F4E7EA]/40" : "border-[#E8E3E1] bg-[#FFFCF7] hover:border-[#6B1D2A]/60"
                )}
              >
                <input
                  id="main-file-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />

                <div className="w-14 h-14 rounded-2xl bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center text-[#6B1D2A] shadow-xs">
                  <UploadCloud className="w-7 h-7 stroke-[2]" />
                </div>

                {file ? (
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1]">
                      <FileText className="w-4 h-4 text-[#6B1D2A]" />
                      <span className="font-bold text-xs text-[#1D1A1B]">{file.name}</span>
                      <span className="text-[11px] text-[#5F5A5C]">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="p-1 rounded-md text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#FFFCF7] ml-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#6B1D2A] font-semibold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#6B1D2A]" /> File ready to be indexed
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#1D1A1B]">
                      Choose a document or drag it here
                    </p>
                    <p className="text-xs text-[#5F5A5C]">
                      PDF, DOCX, PPTX, or JPG format up to 10MB
                    </p>
                    <span className="inline-block mt-2 text-xs font-bold text-[#6B1D2A] bg-[#F4E7EA] px-3 py-1 rounded-lg">
                      Browse Computer
                    </span>
                  </div>
                )}
              </div>

              {/* PHYSICAL STORAGE PLACEMENT (CUSTOMIZABLE CABINET / STEEL / SHELVES / ARCHFILE) */}
              <PhysicalStoragePlacementCard
                selectedCabinetId={uploadCabinet}
                onCabinetChange={setUploadCabinet}
                selectedBoxId={uploadFileBox}
                onBoxChange={setUploadFileBox}
                cabinets={inventories}
              />

              {/* ACTION BUTTON */}
              <Button
                type="submit"
                disabled={!file || isUploading}
                className="w-full bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] py-6 rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Document & OCR Indexing...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5" />
                    <span>Upload & File Document</span>
                  </>
                )}
              </Button>
            </form>
          )}

          {/* ================= MODE 2: REGISTER METADATA ================= */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CATEGORY SELECT (SHADCN SELECT) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1D1A1B] uppercase">Category</label>
                  <ShadcnSelect
                    value={category}
                    onChange={(val) => {
                      setCategory(val);
                      setDocumentType("");
                      setFormData({});
                    }}
                    options={Object.keys(documentCategories).map((cat) => ({
                      value: cat,
                      label: cat,
                    }))}
                    placeholder="Select Classification"
                    className="h-11"
                  />
                </div>

                {/* DOCUMENT TYPE SELECT (SHADCN SELECT WITH FILTER) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1D1A1B] uppercase">Document Type</label>
                  <ShadcnSelect
                    value={documentType}
                    onChange={(val) => {
                      setDocumentType(val);
                      setFormData({});
                    }}
                    disabled={!category}
                    options={(category && documentCategories[category] || []).map((doc) => ({
                      value: doc,
                      label: doc,
                    }))}
                    placeholder="Select Document Type"
                    searchable={true}
                    searchPlaceholder="Filter document types..."
                    popoverWidth="w-72"
                    className="h-11"
                  />
                </div>
              </div>

              {/* PHYSICAL STORAGE PLACEMENT (CUSTOMIZABLE CABINET / STEEL / SHELVES / ARCHFILE) */}
              <PhysicalStoragePlacementCard
                selectedCabinetId={registerCabinet}
                onCabinetChange={setRegisterCabinet}
                selectedBoxId={registerFileBox}
                onBoxChange={setRegisterFileBox}
                cabinets={inventories}
              />

              {/* DYNAMIC FIELDS */}
              {selectedFields.length > 0 && (
                <div className="pt-2 border-t border-[#E8E3E1] space-y-3">
                  <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
                    Document Required Details
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedFields.map((field) => (
                      <div key={field} className="space-y-1">
                        <label className="text-[11px] font-bold text-[#5F5A5C] uppercase">
                          {field.replaceAll("_", " ")}
                        </label>
                        <Input
                          type="text"
                          placeholder={`Enter ${field.replaceAll("_", " ")}`}
                          value={formData[field] || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))}
                          className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
                          required={field === "access_code"}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION BUTTON */}
              <Button
                type="submit"
                disabled={!documentType || isRegistering}
                className="w-full bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] py-6 rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering Record in Ledger...</span>
                  </>
                ) : (
                  <>
                    <FilePlus className="w-5 h-5" />
                    <span>Register Document Entry</span>
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* RECENTLY FILED DOCUMENTS ACTIVITY BAR */}
        {recentRecords.length > 0 && (
          <div className="border-t border-[#E8E3E1] bg-[#FCFAF8] p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#6B1D2A]" />
                <span className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider">
                  Recently Filed Documents
                </span>
              </div>
              <Link
                to="/document-center"
                className="text-xs font-bold text-[#6B1D2A] hover:underline flex items-center gap-1"
              >
                <span>View all in Document Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {recentRecords.slice(0, 4).map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-xl bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-[#6B1D2A] block uppercase truncate">
                      {rec.document_type || "Document"}
                    </span>
                    <p className="text-xs font-bold text-[#1D1A1B] truncate mt-0.5" title={rec.subject || rec.title}>
                      {rec.subject || rec.title || "Untitled Document"}
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-[#E8E3E1]/60 flex items-center justify-between text-[10px]">
                    <span className="font-mono text-[#5F5A5C]">
                      {rec.access_code && rec.access_code !== "N/A" ? rec.access_code : rec.document_id || `ID-${rec.id}`}
                    </span>
                    {rec.file_box?.cabinet?.name ? (
                      <span className="text-[#6B1D2A] font-semibold flex items-center gap-1">
                        <Box className="w-3 h-3 text-[#6B1D2A]" />
                        {rec.file_box.name}
                      </span>
                    ) : (
                      <span className="text-[#A87818] font-semibold">
                        Awaiting Box
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Files;
