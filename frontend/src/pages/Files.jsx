import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  UploadCloud, 
  FilePlus, 
  X, 
  FileText, 
  Loader2,
  ArrowRight,
  CheckCircle2,
  FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShadcnSelect from "@/components/ui/ShadcnSelect";
import ShadcnDatePicker from "../components/ui/ShadcnDatePicker";
import PhysicalStoragePlacementCard from "../components/files/PhysicalStoragePlacementCard";
import RecentFiledDocumentsBar from "../components/files/RecentFiledDocumentsBar";
import UploadDocumentSection from "../components/files/UploadDocumentSection";
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

  // REGISTER FORM STATE
  const [category, setCategory] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [formData, setFormData] = useState({});
  const [registerCabinet, setRegisterCabinet] = useState("");
  const [registerFileBox, setRegisterFileBox] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Derive all available document types with their parent category
  const allDocumentTypeOptions = useMemo(() => {
    const list = [];
    Object.entries(documentCategories).forEach(([catName, docTypes]) => {
      docTypes.forEach((docType) => {
        list.push({
          value: docType,
          label: docType,
          subtitle: catName,
          category: catName,
          searchKey: `${docType} ${catName}`,
        });
      });
    });
    return list;
  }, []);

  // Document types list: when a category is selected, prioritize that category's items first, while keeping all available
  const documentTypeOptions = useMemo(() => {
    if (!category) {
      return allDocumentTypeOptions;
    }
    const matching = allDocumentTypeOptions.filter((opt) => opt.category === category);
    const others = allDocumentTypeOptions.filter((opt) => opt.category !== category);
    return [...matching, ...others];
  }, [category, allDocumentTypeOptions]);

  const handleDocumentTypeChange = (val) => {
    setDocumentType(val);
    setFormData({});
    // Auto-detect and populate category if not set or mismatched
    if (val) {
      for (const [catName, docTypes] of Object.entries(documentCategories)) {
        if (docTypes.includes(val)) {
          setCategory(catName);
          break;
        }
      }
    }
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    // If the currently selected document type is not in the newly selected category, reset it
    if (val && documentType) {
      const allowed = documentCategories[val] || [];
      if (!allowed.includes(documentType)) {
        setDocumentType("");
        setFormData({});
      }
    }
  };

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
            <UploadDocumentSection
              file={file}
              setFile={setFile}
              uploadCabinet={uploadCabinet}
              setUploadCabinet={setUploadCabinet}
              uploadFileBox={uploadFileBox}
              setUploadFileBox={setUploadFileBox}
              inventories={inventories}
              isUploading={isUploading}
              onUpload={handleUpload}
            />
          )}

          {/* ================= MODE 2: REGISTER METADATA ================= */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CATEGORY SELECT (OPTIONAL QUICK FILTER) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#1D1A1B] uppercase">Classification / Category</label>
                    {category && (
                      <span className="text-[10px] font-semibold text-[#6B1D2A] bg-[#F4E7EA] px-2 py-0.5 rounded-md">
                        Filtered
                      </span>
                    )}
                  </div>
                  <ShadcnSelect
                    value={category}
                    onChange={handleCategoryChange}
                    allowClear={true}
                    clearLabel="All Classifications"
                    options={Object.keys(documentCategories).map((cat) => ({
                      value: cat,
                      label: cat,
                    }))}
                    placeholder="All Classifications (Optional filter)"
                    className="h-11"
                  />
                </div>

                {/* DOCUMENT TYPE SELECT (ALWAYS SCROLLABLE & SEARCHABLE ACROSS ALL 60+ TYPES) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#1D1A1B] uppercase">Document Type</label>
                    <span className="text-[10px] text-[#5F5A5C]">
                      {category ? `${documentCategories[category]?.length || 0} in ${category} • 63 total` : `All ${documentTypeOptions.length} available`}
                    </span>
                  </div>
                  <ShadcnSelect
                    value={documentType}
                    onChange={handleDocumentTypeChange}
                    options={documentTypeOptions}
                    placeholder={category ? `Select Document Type (${category})...` : "Select or search Document Type (all 63 types)..."}
                    searchable={true}
                    searchPlaceholder="Search document type or classification..."
                    popoverWidth="w-80 sm:w-96"
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
                    {selectedFields.map((field) => {
                      const isDateField = field.toLowerCase().includes("date");
                      return (
                        <div key={field} className="space-y-1">
                          <label className="text-[11px] font-bold text-[#5F5A5C] uppercase">
                            {field.replaceAll("_", " ")}
                          </label>
                          {isDateField ? (
                            <ShadcnDatePicker
                              value={formData[field] || ""}
                              onChange={(formattedVal) =>
                                setFormData((prev) => ({ ...prev, [field]: formattedVal }))
                              }
                              placeholder={`Select ${field.replaceAll("_", " ")}...`}
                            />
                          ) : (
                            <Input
                              type="text"
                              placeholder={`Enter ${field.replaceAll("_", " ")}`}
                              value={formData[field] || ""}
                              onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))}
                              className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
                              required={field === "access_code"}
                            />
                          )}
                        </div>
                      );
                    })}
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
        <RecentFiledDocumentsBar recentRecords={recentRecords} />
      </Card>
    </div>
  );
}

export default Files;
