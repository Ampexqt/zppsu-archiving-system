import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  UploadCloud, 
  FilePlus, 
  Loader2,
  ArrowRight,
  FolderOpen,
  Tag,
  Calendar,
  Lock,
  Layers,
  FileCheck,
  Sparkles,
  Paperclip
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShadcnSelect from "@/components/ui/ShadcnSelect";
import ShadcnDatePicker from "../components/ui/ShadcnDatePicker";
import DocumentPreviewScroll from "../components/files/DocumentPreviewScroll";
import StorageDropdownSelect from "../components/files/StorageDropdownSelect";
import RecentFiledDocumentsBar from "../components/files/RecentFiledDocumentsBar";
import { documentCategories, getFieldsForDocumentType } from "@/utils/documentConfigs";
import { useToast } from "../context/ToastContext";

/**
 * Files Page
 * Single-column, user-centric document ingestion and direct tagging workspace.
 * Prioritizes Direct Tagging & Template Specification first, followed by Physical Storage Placement,
 * and makes digital document attachment with in-situ OCR an optional downstream section.
 */
function Files() {
  const toast = useToast();

  // INGESTION FORM STATE
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [subject, setSubject] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [memoDate, setMemoDate] = useState("");
  const [formData, setFormData] = useState({});
  const [selectedCabinet, setSelectedCabinet] = useState("");
  const [selectedFileBox, setSelectedFileBox] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [storageError, setStorageError] = useState(null);

  // DATA STATES
  const [recentRecords, setRecentRecords] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);

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

  // FETCH DYNAMIC CATEGORIES FROM DATABASE
  const fetchDbCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDbCategories(response.data || []);
    } catch (error) {
      console.error("FETCH CATEGORIES ERROR:", error);
    }
  };

  useEffect(() => {
    fetchRecentFiles();
    fetchInventories();
    fetchDbCategories();
  }, []);

  // Handle file selection: update file state and prefill title once if currently empty
  const handleFileChange = (newFile) => {
    setFile(newFile);
    if (newFile && !title.trim()) {
      const cleanName = newFile.name.replace(/\.[^/.]+$/, "");
      setTitle(cleanName);
    }
  };

  // Combined Category options (dynamic DB categories + documentCategories static keys)
  const categoryOptions = useMemo(() => {
    const namesSet = new Set();
    const list = [];

    dbCategories.forEach((cat) => {
      if (!namesSet.has(cat.name)) {
        namesSet.add(cat.name);
        list.push({ value: cat.name, label: cat.name });
      }
    });

    Object.keys(documentCategories).forEach((catName) => {
      if (!namesSet.has(catName)) {
        namesSet.add(catName);
        list.push({ value: catName, label: catName });
      }
    });

    return list;
  }, [dbCategories]);

  // Derive all available document types with their parent category
  const allDocumentTypeOptions = useMemo(() => {
    const list = [];
    Object.entries(documentCategories).forEach(([catName, docTypes]) => {
      docTypes.forEach((docType) => {
        list.push({
          value: docType,
          label: docType,
          subtitle: `Category: ${catName}`,
          category: catName,
          searchKey: `${docType} ${catName}`,
        });
      });
    });
    return list;
  }, []);

  // Document types list: always all 60+ types available, searchable directly
  const documentTypeOptions = allDocumentTypeOptions;

  // Dynamic template fields for the chosen Document Type (excluding file_location since we have dedicated StorageDropdownSelect)
  const templateFields = useMemo(() => {
    if (!documentType) return [];
    return getFieldsForDocumentType(documentType).filter((f) => f !== "file_location");
  }, [documentType]);

  const handleDocumentTypeChange = (val) => {
    setDocumentType(val);
    setFormData({});
    // Automatically auto-detect and pre-fill the classification category!
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
    // Allows user to manually override category if desired without clearing documentType
    setCategory(val);
  };

  // Validation: Ready to submit
  const canSubmit = useMemo(() => {
    if (isUploading) return false;
    // Mandatory physical placement
    if (!selectedCabinet || !selectedFileBox) return false;
    // Must have either a file, a documentType, or a title
    if (!file && !documentType && !title.trim()) return false;
    return true;
  }, [isUploading, selectedCabinet, selectedFileBox, file, documentType, title]);

  // HANDLE UNIFIED SUBMIT (WITH OR WITHOUT ATTACHED FILE)
  const handleSubmitDocument = async (e) => {
    e.preventDefault();

    // 1. Validate Target Content
    if (!file && !documentType && !title.trim()) {
      toast.warning("Please provide a Document Type or attach a file.", "Details Required");
      return;
    }

    // 2. Validate Mandatory Physical Storage Placement
    if (!selectedCabinet || !selectedFileBox) {
      setStorageError("Physical placement is mandatory. Please select both a Cabinet and File Box.");
      toast.warning("Please assign a Cabinet and File Box for physical archiving.", "Physical Location Required");
      return;
    }
    setStorageError(null);

    const token = localStorage.getItem("token");

    try {
      setIsUploading(true);

      // Branch A: A file is attached -> POST /api/files/upload (multipart)
      if (file) {
        const uploadData = new FormData();
        uploadData.append("file", file);

        const computedTitle = title.trim() || formData.subject || formData.student_name || formData.personnel_name || file.name;
        const computedCategory = category || "Uncategorized";
        const computedDocType = documentType || "Document";
        const computedSubject = subject.trim() || formData.subject || computedTitle || "N/A";
        const computedAccessCode = accessCode.trim() || formData.access_code || "N/A";

        uploadData.append("title", computedTitle);
        uploadData.append("category", computedCategory);
        uploadData.append("document_type", computedDocType);
        uploadData.append("subject", computedSubject);
        uploadData.append("access_code", computedAccessCode);
        uploadData.append("file_box_id", selectedFileBox);
        if (memoDate) {
          uploadData.append("memo_date", memoDate);
        }

        // Append only dynamic template fields that aren't already part of the core parameters
        const coreKeys = new Set([
          "title", "category", "document_type", "subject", 
          "access_code", "memo_date", "file_box_id"
        ]);
        Object.entries(formData).forEach(([k, v]) => {
          if (!coreKeys.has(k) && v !== undefined && v !== null && v !== "") {
            uploadData.append(k, v);
          }
        });

        const response = await axios.post("http://localhost:5000/api/files/upload", uploadData, {
          headers: {
            Authorization: `Bearer ${token}`,
            // Do not manually set "Content-Type" so Axios/browser sets boundary automatically
          },
        });

        const assignedId = response.data?.file?.document_id || "Document";
        toast.success(
          `Document uploaded, OCR indexed, and filed as ${assignedId}!`, 
          "Filing Complete"
        );
      } 
      // Branch B: No physical file attached -> POST /api/files/generate (Metadata / Template record)
      else {
        const computedTitle = title.trim() || formData.subject || formData.student_name || formData.personnel_name || formData.title_of_thesis || `${documentType || "Official"} Record`;
        const computedSubject = subject.trim() || formData.subject || formData.title_of_thesis || formData.program || computedTitle;
        const computedAccessCode = accessCode.trim() || formData.access_code || "N/A";

        // Clean payload without duplicating top-level keys
        const payloadData = { ...formData };
        delete payloadData.title;
        delete payloadData.category;
        delete payloadData.document_type;
        delete payloadData.subject;
        delete payloadData.access_code;
        delete payloadData.memo_date;
        delete payloadData.file_box_id;

        const payload = {
          ...payloadData,
          title: computedTitle,
          category: category || "Uncategorized",
          document_type: documentType || "Document",
          access_code: computedAccessCode,
          subject: computedSubject,
          file_box_id: selectedFileBox,
          memo_date: memoDate ? new Date(memoDate) : new Date(),
          received_date: new Date(),
        };

        const response = await axios.post("http://localhost:5000/api/files/generate", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const assignedId = response.data?.file?.document_id || "Document";
        toast.success(
          `Record registered as ${assignedId} in official archive ledger!`, 
          "Registration Complete"
        );
      }

      // Reset form state
      setFile(null);
      setTitle("");
      setSubject("");
      setAccessCode("");
      setMemoDate("");
      setFormData({});
      setCategory("");
      setDocumentType("");
      setSelectedCabinet("");
      setSelectedFileBox("");

      fetchRecentFiles();
      fetchInventories();
    } catch (error) {
      console.error("INGESTION ERROR:", error);
      const errMsg = error.response?.data?.message || "Failed to process and archive document.";
      toast.error(errMsg, "Filing Error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto pb-16">
      {/* 1. PAGE HEADER & QUICK LINKS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6B1D2A] animate-pulse" />
            <span className="text-[11px] font-bold text-[#6B1D2A] uppercase tracking-wider">
              Single-Stage Intake &amp; In-Situ Direct Tagging
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1D1A1B] tracking-tight mt-0.5">
            Document Ingestion &amp; Registration
          </h1>
          <p className="text-xs text-[#5F5A5C] mt-1">
            Specify record metadata, apply institutional template formats, and map directly to physical storage.
          </p>
        </div>

        {/* QUICK LINK TO DOCUMENT CENTER */}
        <Link
          to="/document-center"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFFCF7] border border-[#E8E3E1] text-xs font-bold text-[#6B1D2A] hover:bg-[#F4E7EA] transition-all shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <FolderOpen className="w-4 h-4 text-[#6B1D2A]" />
          <span>Document Center ({recentRecords.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. MAIN SINGLE-COLUMN UNIFIED INTAKE CARD */}
      <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-2xl overflow-hidden p-0 gap-0">
        <form onSubmit={handleSubmitDocument} className="divide-y divide-[#E8E3E1]">

          {/* ================= SECTION 1: DIRECT TAGGING & TEMPLATE SPECIFICATION (PRIMARY) ================= */}
          <div className="p-6 sm:p-8 space-y-6 bg-[#FFFCF7]">
            {/* SECTION BANNER */}
            <div className="flex items-center justify-between border-b border-[#E8E3E1] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center text-[#6B1D2A]">
                  <Tag className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1D1A1B]">
                    Direct Tagging &amp; Template Specification
                  </h3>
                  <p className="text-[11px] text-[#5F5A5C]">
                    Select classification, document type, and fill in required template details.
                  </p>
                </div>
              </div>

              {file ? (
                <span className="text-[10px] font-bold text-[#6B1D2A] bg-[#F4E7EA] px-2.5 py-1 rounded-lg inline-flex items-center gap-1 border border-[#E8E3E1]">
                  <Sparkles className="w-3 h-3 text-[#6B1D2A]" /> File Attached
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-[#5F5A5C] bg-[#FFFCF7] border border-[#E8E3E1] px-2.5 py-1 rounded-lg">
                  Metadata Filing Mode
                </span>
              )}
            </div>

            {/* A. PRIMARY: DOCUMENT TYPE & AUTO-DETECTED CATEGORY (2-COL) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. DOCUMENT TYPE (PRIMARY) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#1D1A1B] uppercase flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-[#6B1D2A]" /> 1. Document Type <span className="text-[#6B1D2A]">*</span>
                  </label>
                  <span className="text-[10px] text-[#6B1D2A] font-semibold bg-[#F4E7EA] px-2 py-0.5 rounded-md">
                    Template Driver
                  </span>
                </div>
                <ShadcnSelect
                  value={documentType}
                  onChange={handleDocumentTypeChange}
                  options={documentTypeOptions}
                  placeholder="Select or search document format (60+ types)..."
                  searchable={true}
                  searchPlaceholder="Search type e.g. NOSA, Memo, Special Order, Thesis..."
                  className="h-10 text-xs font-semibold"
                  popoverWidth="w-80 sm:w-96"
                />
              </div>

              {/* 2. CLASSIFICATION CATEGORY (AUTO-DETECTED / OPTIONAL) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#5F5A5C] uppercase flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#6B1D2A]" /> 2. Classification Category
                  </label>
                  {category ? (
                    <span className="text-[10px] text-[#6B1D2A] font-semibold bg-[#F4E7EA] px-2 py-0.5 rounded-md">
                      Auto-Filled
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#5F5A5C]">Optional</span>
                  )}
                </div>
                <ShadcnSelect
                  value={category}
                  onChange={handleCategoryChange}
                  options={categoryOptions}
                  placeholder={documentType ? "Auto-detected category..." : "Optional category..."}
                  allowClear={true}
                  clearLabel="Clear Category (Optional)"
                  className="h-10 text-xs"
                  popoverWidth="w-72 sm:w-80"
                  searchable={true}
                  searchPlaceholder="Search classification category..."
                />
              </div>
            </div>

            {/* B. DOCUMENT TITLE / DESIGNATION */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#5F5A5C] uppercase">
                Document Title / Designation {!file && !documentType && <span className="text-[#6B1D2A]">*</span>}
              </label>
              <Input
                type="text"
                placeholder={file ? "Enter title or leave blank to use file name..." : "Enter official document record title..."}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
              />
            </div>

            {/* C. DYNAMIC TEMPLATE DETAILS (ADAPTS ACCURATELY TO SELECTED DOCUMENT TYPE) */}
            {templateFields.length > 0 ? (
              <div className="p-4 rounded-2xl bg-[#F4E7EA]/20 border border-[#E8E3E1] space-y-3">
                <div className="flex items-center justify-between border-b border-[#E8E3E1] pb-2">
                  <span className="text-[11px] font-bold text-[#6B1D2A] uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-[#6B1D2A]" />
                    <span>{documentType} Template Details</span>
                  </span>
                  <span className="text-[10px] text-[#5F5A5C] font-semibold bg-[#FFFCF7] px-2 py-0.5 rounded border border-[#E8E3E1]">
                    {templateFields.length} field{templateFields.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {templateFields.map((field) => {
                    const isDateField = field.toLowerCase().includes("date");
                    const labelText = field.replaceAll("_", " ");
                    return (
                      <div key={field} className="space-y-1">
                        <label className="text-[11px] font-bold text-[#5F5A5C] uppercase">
                          {labelText}
                          {field === "access_code" && <span className="text-[#6B1D2A] ml-0.5">*</span>}
                        </label>
                        {isDateField ? (
                          <ShadcnDatePicker
                            value={formData[field] || ""}
                            onChange={(formattedVal) =>
                              setFormData((prev) => ({ ...prev, [field]: formattedVal }))
                            }
                            placeholder={`Select ${labelText}...`}
                          />
                        ) : (
                          <Input
                            type="text"
                            placeholder={`Enter ${labelText}...`}
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
            ) : (
              /* D. FALLBACK GENERIC FIELDS WHEN NO SPECIALIZED TEMPLATE IS DEFINED */
              <div className="p-4 rounded-2xl bg-[#FFFCF7] border border-[#E8E3E1] space-y-3">
                <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
                  General Record Attributes
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#5F5A5C] uppercase">
                      Subject / Topic
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Budget Realignment 2024"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#5F5A5C] uppercase flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#6B1D2A]" /> Access Code / Control No.
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. ZPPSU-ADM-2024"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#5F5A5C] uppercase flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#6B1D2A]" /> Memo / Document Date
                    </label>
                    <ShadcnDatePicker
                      value={memoDate}
                      onChange={(val) => setMemoDate(val)}
                      placeholder="Select effective date..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* E. PHYSICAL STORAGE PLACEMENT (MANDATORY CASCADING DROPDOWNS) */}
            <StorageDropdownSelect
              selectedCabinetId={selectedCabinet}
              onCabinetChange={(id) => {
                setSelectedCabinet(id);
                setStorageError(null);
              }}
              selectedBoxId={selectedFileBox}
              onBoxChange={(id) => {
                setSelectedFileBox(id);
                setStorageError(null);
              }}
              cabinets={inventories}
              error={storageError}
            />
          </div>

          {/* ================= SECTION 2: DIGITAL DOCUMENT ATTACHMENT & IN-SITU OCR (OPTIONAL) ================= */}
          <div className="p-6 sm:p-8 space-y-4 bg-[#FFFCF7]">
            <div className="flex items-center justify-between border-b border-[#E8E3E1] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center text-[#6B1D2A]">
                  <Paperclip className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wide flex items-center gap-2">
                    <span>Digital Document Attachment &amp; OCR</span>
                    <span className="text-[10px] font-semibold text-[#5F5A5C] normal-case bg-[#F4E7EA] px-2 py-0.5 rounded-md">
                      Optional
                    </span>
                  </h4>
                  <p className="text-[11px] text-[#5F5A5C]">
                    Attach a physical scan or digital file (PDF, Word, PPTX, Excel, Images) for automatic in-situ OCR text extraction.
                  </p>
                </div>
              </div>

              {file && (
                <button
                  type="button"
                  onClick={() => handleFileChange(null)}
                  className="text-[11px] font-semibold text-[#6B1D2A] hover:text-[#8B3545] cursor-pointer"
                >
                  Clear Attachment
                </button>
              )}
            </div>

            <DocumentPreviewScroll
              file={file}
              setFile={handleFileChange}
              showInternalHeader={false}
            />
          </div>

          {/* ================= SECTION 3: SUBMIT ACTION BUTTON ================= */}
          <div className="p-6 sm:p-8 bg-[#F4E7EA]/30 space-y-2">
            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] py-6 rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing &amp; Filing into Archive...</span>
                </>
              ) : file ? (
                <>
                  <UploadCloud className="w-5 h-5" />
                  <span>Upload &amp; File Document (With Digital Attachment)</span>
                </>
              ) : (
                <>
                  <FilePlus className="w-5 h-5" />
                  <span>Save &amp; Register Record (Official Metadata Entry)</span>
                </>
              )}
            </Button>
            <p className="text-[10px] text-center text-[#5F5A5C]">
              {file 
                ? "In-situ OCR will extract machine text, generate dense vector embeddings, and link to physical storage." 
                : "Official metadata record will be registered in the central ledger and mapped to physical storage."}
            </p>
          </div>

        </form>

        {/* ================= SECTION 4: RECENTLY FILED DOCUMENTS ACTIVITY BAR ================= */}
        <RecentFiledDocumentsBar recentRecords={recentRecords} />
      </Card>
    </div>
  );
}

export default Files;
