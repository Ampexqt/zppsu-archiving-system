import React, { useState } from "react";
import axios from "axios";
import { 
  FilePlus, 
  UploadCloud, 
  Check, 
  ChevronsUpDown, 
  Box, 
  Layers, 
  X, 
  FileText, 
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { documentCategories, getFieldsForDocumentType } from "@/utils/documentConfigs";
import { useToast } from "@/context/ToastContext";

export default function FilingWorkflowSection({
  inventories = [],
  onSuccess,
}) {
  const toast = useToast();
  const [mode, setMode] = useState("upload"); // "upload" | "register"

  // Upload State
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCabinet, setUploadCabinet] = useState("");
  const [uploadFileBox, setUploadFileBox] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  // Register State
  const [category, setCategory] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [formData, setFormData] = useState({});
  const [registerCabinet, setRegisterCabinet] = useState("");
  const [registerFileBox, setRegisterFileBox] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const selectedFields = getFieldsForDocumentType(documentType);

  // Handle Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // Upload Document Handler
  const handleUpload = async (e) => {
    if (e) e.preventDefault();
    if (!file) {
      toast.warning("Please select a document file to upload.", "File Required");
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
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to upload document", "Upload Error");
    } finally {
      setIsUploading(false);
    }
  };

  // Register Document Entry Handler
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!category || !documentType) {
      toast.warning("Please select Category and Document Type.", "Incomplete Fields");
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(
        registerFileBox
          ? "Document record registered and assigned to physical storage!"
          : "Document record registered in central ledger!",
        "Record Filed"
      );
      setFormData({});
      setCategory("");
      setDocumentType("");
      setRegisterCabinet("");
      setRegisterFileBox("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      toast.error(error.response?.data?.message || "Registration failed", "Error");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 bg-[#FFFCF7] border-b border-[#E8E3E1]">
      {/* SECTION HEADER & SEGMENTED WORKFLOW TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <span className="text-[11px] font-bold text-[#6B1D2A] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <FileText className="w-3.5 h-3.5" />
            Direct Document Ingestion
          </span>
          <h2 className="text-base font-bold text-[#1D1A1B]">
            {mode === "upload" ? "Upload & File Document" : "Register Document Metadata Entry"}
          </h2>
          <p className="text-xs text-[#5F5A5C] mt-0.5">
            {mode === "upload" 
              ? "Upload digital documents with auto-OCR and assign physical storage simultaneously."
              : "Generate an official ledger entry and assign physical cabinet & file box in one step."}
          </p>
        </div>

        {/* WORKFLOW SWITCHER: 1-TAP SEGMENTED CONTROL */}
        <div className="inline-flex p-1 bg-[#F4E7EA] rounded-xl border border-[#E8E3E1] self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              mode === "upload"
                ? "bg-[#6B1D2A] text-[#FFFCF7] shadow-xs"
                : "text-[#5F5A5C] hover:text-[#1D1A1B]"
            )}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              mode === "register"
                ? "bg-[#6B1D2A] text-[#FFFCF7] shadow-xs"
                : "text-[#5F5A5C] hover:text-[#1D1A1B]"
            )}
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Register Entry</span>
          </button>
        </div>
      </div>

      {/* MODE 1: STREAMLINED UPLOAD WORKFLOW */}
      {mode === "upload" && (
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* DROPZONE / FILE PICKER */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                "lg:col-span-6 border-2 border-dashed rounded-xl p-4 transition-all flex items-center justify-between gap-4 cursor-pointer",
                isDragOver ? "border-[#6B1D2A] bg-[#F4E7EA]/40" : "border-[#E8E3E1] bg-[#FFFCF7] hover:border-[#6B1D2A]/60"
              )}
              onClick={() => document.getElementById("file-upload-input")?.click()}
            >
              <input
                id="file-upload-input"
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center text-[#6B1D2A] shrink-0">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  {file ? (
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-[#1D1A1B] truncate">{file.name}</p>
                      <span className="text-[10px] text-[#5F5A5C] shrink-0">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-bold text-[#1D1A1B]">
                        Click to select or drag document here
                      </p>
                      <p className="text-[11px] text-[#5F5A5C]">PDF, DOCX, PPTX, JPG up to 10MB</p>
                    </>
                  )}
                </div>
              </div>

              {file ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="p-1 rounded-md text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-[11px] font-bold text-[#6B1D2A] bg-[#F4E7EA] px-2.5 py-1 rounded-lg shrink-0">
                  Browse
                </span>
              )}
            </div>

            {/* PHYSICAL STORAGE ASSIGNMENT INLINE */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-[#5F5A5C] flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#6B1D2A]" />
                  Cabinet
                </label>
                <select
                  value={uploadCabinet}
                  onChange={(e) => {
                    setUploadCabinet(e.target.value);
                    setUploadFileBox("");
                  }}
                  className="h-10 w-full rounded-xl border border-[#E8E3E1] bg-[#FFFCF7] px-3 text-xs font-medium text-[#1D1A1B] focus:ring-2 focus:ring-[#6B1D2A]/20 focus:border-[#6B1D2A]"
                >
                  <option value="">Cabinet (Optional)</option>
                  {inventories.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name || inv.cabinet_name || `Cabinet ${inv.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-[#5F5A5C] flex items-center gap-1">
                  <Box className="w-3 h-3 text-[#6B1D2A]" />
                  File Box
                </label>
                <select
                  value={uploadFileBox}
                  onChange={(e) => setUploadFileBox(e.target.value)}
                  disabled={!uploadCabinet}
                  className="h-10 w-full rounded-xl border border-[#E8E3E1] bg-[#FFFCF7] px-3 text-xs font-medium text-[#1D1A1B] focus:ring-2 focus:ring-[#6B1D2A]/20 focus:border-[#6B1D2A] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">File Box (Optional)</option>
                  {inventories
                    .find((inv) => String(inv.id) === String(uploadCabinet))
                    ?.file_boxes?.map((box) => (
                      <option key={box.id} value={box.id}>
                        {box.name} ({box.used_space || 0}/{box.capacity || 0})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="lg:col-span-2 flex items-end">
              <Button
                type="submit"
                disabled={!file || isUploading}
                className="w-full h-10 bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload & File</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* MODE 2: UNIFIED METADATA ENTRY FORM */}
      {mode === "register" && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* CATEGORY SELECT */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#1D1A1B] uppercase">Category</label>
              <Popover modal={true}>
                <PopoverTrigger
                  className="flex h-10 w-full items-center justify-between rounded-xl border border-[#E8E3E1] bg-[#FFFCF7] px-3 py-2 text-xs font-medium text-[#1D1A1B] focus:ring-2 focus:ring-[#6B1D2A]/20 focus:border-[#6B1D2A]"
                >
                  <span className="truncate">{category || "Select Classification"}</span>
                  <ChevronsUpDown className="h-3.5 w-3.5 opacity-50 shrink-0 text-[#5F5A5C]" />
                </PopoverTrigger>
                <PopoverContent className="p-0 w-64 bg-[#FFFCF7] border border-[#E8E3E1]" align="start">
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
                            className="text-xs cursor-pointer text-[#1D1A1B] hover:bg-[#F4E7EA]"
                          >
                            <Check className={cn("mr-2 h-3.5 w-3.5", category === cat ? "opacity-100 text-[#6B1D2A]" : "opacity-0")} />
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
              <label className="text-[11px] font-bold text-[#1D1A1B] uppercase">Document Type</label>
              <Popover modal={true}>
                <PopoverTrigger
                  disabled={!category}
                  className="flex h-10 w-full items-center justify-between rounded-xl border border-[#E8E3E1] bg-[#FFFCF7] px-3 py-2 text-xs font-medium text-[#1D1A1B] focus:ring-2 focus:ring-[#6B1D2A]/20 focus:border-[#6B1D2A] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="truncate">{documentType || "Select Document Type"}</span>
                  <ChevronsUpDown className="h-3.5 w-3.5 opacity-50 shrink-0 text-[#5F5A5C]" />
                </PopoverTrigger>
                <PopoverContent className="p-0 max-h-60 overflow-y-auto w-72 bg-[#FFFCF7] border border-[#E8E3E1]" align="start">
                  <Command>
                    <CommandInput placeholder="Filter types..." className="text-xs" />
                    <CommandList>
                      <CommandEmpty className="text-xs p-2 text-center text-[#5F5A5C]">No type found.</CommandEmpty>
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
                            className="text-xs cursor-pointer text-[#1D1A1B] hover:bg-[#F4E7EA]"
                          >
                            <Check className={cn("mr-2 h-3.5 w-3.5", documentType === doc ? "opacity-100 text-[#6B1D2A]" : "opacity-0")} />
                            {doc}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* CABINET SELECT */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#1D1A1B] uppercase flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#6B1D2A]" />
                Cabinet
              </label>
              <select
                value={registerCabinet}
                onChange={(e) => {
                  setRegisterCabinet(e.target.value);
                  setRegisterFileBox("");
                }}
                className="h-10 w-full rounded-xl border border-[#E8E3E1] bg-[#FFFCF7] px-3 text-xs font-medium text-[#1D1A1B] focus:ring-2 focus:ring-[#6B1D2A]/20 focus:border-[#6B1D2A]"
              >
                <option value="">Cabinet (Optional)</option>
                {inventories.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name || inv.cabinet_name || `Cabinet ${inv.id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* FILE BOX SELECT */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#1D1A1B] uppercase flex items-center gap-1">
                <Box className="w-3 h-3 text-[#6B1D2A]" />
                File Box
              </label>
              <select
                value={registerFileBox}
                onChange={(e) => setRegisterFileBox(e.target.value)}
                disabled={!registerCabinet}
                className="h-10 w-full rounded-xl border border-[#E8E3E1] bg-[#FFFCF7] px-3 text-xs font-medium text-[#1D1A1B] focus:ring-2 focus:ring-[#6B1D2A]/20 focus:border-[#6B1D2A] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">File Box (Optional)</option>
                {inventories
                  .find((inv) => String(inv.id) === String(registerCabinet))
                  ?.file_boxes?.map((box) => (
                    <option key={box.id} value={box.id}>
                      {box.name} ({box.used_space || 0}/{box.capacity || 0})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* DYNAMIC FIELDS */}
          {selectedFields.length > 0 && (
            <div className="pt-2 border-t border-[#E8E3E1]">
              <p className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider mb-2">
                Document Specific Metadata
              </p>
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

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={!documentType || isRegistering}
              className="w-full sm:w-auto px-6 h-10 bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isRegistering ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Entry...</span>
                </>
              ) : (
                <>
                  <FilePlus className="w-4 h-4" />
                  <span>Register & Assign Entry</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
