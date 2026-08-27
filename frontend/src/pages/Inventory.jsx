import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, FolderOpen, Box, Archive, X, ChevronLeft, ChevronRight, Layers, FileText, Edit2 } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";

function Inventory() {
  const toast = useToast();
  const modal = useModal();
  const [activeTab, setActiveTab] = useState("cabinets");

  // Cabinets State
  const [cabinets, setCabinets] = useState([]);
  const [isCabinetModalOpen, setIsCabinetModalOpen] = useState(false);
  const [cabinetName, setCabinetName] = useState("");
  const [cabinetCapacity, setCabinetCapacity] = useState("");
  const [cabinetPage, setCabinetPage] = useState(1);

  // File Boxes State
  const [fileBoxes, setFileBoxes] = useState([]);
  const [isFileBoxModalOpen, setIsFileBoxModalOpen] = useState(false);
  const [fileBoxName, setFileBoxName] = useState("");
  const [selectedCabinetId, setSelectedCabinetId] = useState("");
  const [fileBoxCapacity, setFileBoxCapacity] = useState("");
  const [fileBoxPage, setFileBoxPage] = useState(1);
  
  // Edit States
  const [isEditCabinetModalOpen, setIsEditCabinetModalOpen] = useState(false);
  const [editingCabinet, setEditingCabinet] = useState(null);
  const [isEditFileBoxModalOpen, setIsEditFileBoxModalOpen] = useState(false);
  const [editingFileBox, setEditingFileBox] = useState(null);
  
  const itemsPerPage = 10;

  // View Files Modal
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
  const [selectedViewTitle, setSelectedViewTitle] = useState("");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [cabinetsRes, fileBoxesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/inventory/cabinets", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/inventory/file-boxes", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setCabinets(cabinetsRes.data || []);
      setFileBoxes(fileBoxesRes.data || []);
    } catch (error) {
      console.error("FETCH INVENTORY ERROR:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCabinet = async () => {
    if (!cabinetName || !cabinetCapacity) {
      toast.warning("Please fill in all cabinet fields.", "Required Fields");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/inventory/cabinets",
        { name: cabinetName, capacity: parseInt(cabinetCapacity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Storage cabinet created successfully!", "Cabinet Registered");
      setCabinetName("");
      setCabinetCapacity("");
      setIsCabinetModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create cabinet", "Error");
    }
  };

  const handleDeleteCabinet = async (id) => {
    const confirmed = await modal.confirm({
      title: "Delete Storage Cabinet",
      message: "Are you sure you want to delete this cabinet? Ensure all file boxes inside are relocated first.",
      confirmText: "Delete Cabinet",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/inventory/cabinets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Cabinet deleted successfully.", "Removed");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Delete failed", "Error");
    }
  };

  const handleCreateFileBox = async () => {
    if (!fileBoxName || !selectedCabinetId || !fileBoxCapacity) {
      toast.warning("Please fill in all file box fields.", "Required Fields");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/inventory/file-boxes",
        { name: fileBoxName, cabinet_id: selectedCabinetId, capacity: parseInt(fileBoxCapacity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("File Box created and assigned successfully!", "Box Created");
      setFileBoxName("");
      setSelectedCabinetId("");
      setFileBoxCapacity("");
      setIsFileBoxModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create file box", "Error");
    }
  };

  const handleDeleteFileBox = async (id) => {
    const confirmed = await modal.confirm({
      title: "Delete File Box Container",
      message: "Are you sure you want to delete this file box from physical inventory?",
      confirmText: "Delete File Box",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/inventory/file-boxes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("File box container removed.", "Deleted");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Delete failed", "Error");
    }
  };

  const openEditCabinet = (cabinet) => {
    setEditingCabinet(cabinet);
    setCabinetName(cabinet.name);
    setCabinetCapacity(cabinet.capacity);
    setIsEditCabinetModalOpen(true);
  };

  const handleEditCabinet = async () => {
    if (!cabinetName || !cabinetCapacity) {
      toast.warning("Please fill in all cabinet fields.", "Required Fields");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/inventory/cabinets/${editingCabinet.id}`,
        { name: cabinetName, capacity: parseInt(cabinetCapacity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Storage cabinet updated successfully!", "Cabinet Updated");
      setCabinetName("");
      setCabinetCapacity("");
      setEditingCabinet(null);
      setIsEditCabinetModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update cabinet", "Error");
    }
  };

  const openEditFileBox = (box) => {
    setEditingFileBox(box);
    setFileBoxName(box.name);
    setSelectedCabinetId(box.cabinet_id);
    setFileBoxCapacity(box.capacity);
    setIsEditFileBoxModalOpen(true);
  };

  const handleEditFileBox = async () => {
    if (!fileBoxName || !selectedCabinetId || !fileBoxCapacity) {
      toast.warning("Please fill in all file box fields.", "Required Fields");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/inventory/file-boxes/${editingFileBox.id}`,
        { name: fileBoxName, cabinet_id: selectedCabinetId, capacity: parseInt(fileBoxCapacity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("File Box updated successfully!", "Box Updated");
      setFileBoxName("");
      setSelectedCabinetId("");
      setFileBoxCapacity("");
      setEditingFileBox(null);
      setIsEditFileBoxModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update file box", "Error");
    }
  };

  const handleViewFiles = (title, filesArray) => {
    setSelectedViewTitle(title);
    setSelectedFiles(filesArray || []);
    setIsFilesModalOpen(true);
  };

  const currentCabinets = cabinets.slice((cabinetPage - 1) * itemsPerPage, cabinetPage * itemsPerPage);
  const totalCabinetPages = Math.ceil(cabinets.length / itemsPerPage) || 1;

  const currentFileBoxes = fileBoxes.slice((fileBoxPage - 1) * itemsPerPage, fileBoxPage * itemsPerPage);
  const totalFileBoxPages = Math.ceil(fileBoxes.length / itemsPerPage) || 1;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1D1A1B] tracking-tight">
              Physical Storage & Inventory
            </h1>
            <p className="text-xs text-[#5F5A5C] mt-0.5">
              Organize and monitor physical storage units, cabinet capacities, and file box distributions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "cabinets" ? (
              <Dialog open={isCabinetModalOpen} onOpenChange={setIsCabinetModalOpen}>
                <DialogTrigger className="bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] h-9 px-4 rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Cabinet</span>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-6">
                  <DialogHeader className="mb-3">
                    <DialogTitle className="text-base font-bold text-[#1D1A1B]">Create Storage Cabinet</DialogTitle>
                    <DialogDescription className="text-xs text-[#5F5A5C]">Add a new physical filing cabinet to the inventory.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-[#1D1A1B] uppercase">Cabinet Name</label>
                      <Input
                        type="text"
                        placeholder="e.g. Cabinet Alpha"
                        value={cabinetName}
                        onChange={(e) => setCabinetName(e.target.value)}
                        className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#1D1A1B] uppercase">Capacity (File Box Limit)</label>
                      <Input
                        type="number"
                        placeholder="e.g. 20"
                        value={cabinetCapacity}
                        onChange={(e) => setCabinetCapacity(e.target.value)}
                        className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
                      />
                    </div>
                    <Button onClick={handleCreateCabinet} className="w-full bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] h-10 rounded-xl font-bold text-xs mt-2 cursor-pointer">
                      Confirm Cabinet Creation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={isFileBoxModalOpen} onOpenChange={setIsFileBoxModalOpen}>
                <DialogTrigger className="bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] h-9 px-4 rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                  <span>New File Box</span>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-6">
                  <DialogHeader className="mb-3">
                    <DialogTitle className="text-base font-bold text-[#1D1A1B]">Create File Box Container</DialogTitle>
                    <DialogDescription className="text-xs text-[#5F5A5C]">Add a file box and assign it to a parent cabinet.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-[#1D1A1B] uppercase">File Box Name / Code</label>
                      <Input
                        type="text"
                        placeholder="e.g. BOX-2024-A"
                        value={fileBoxName}
                        onChange={(e) => setFileBoxName(e.target.value)}
                        className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#1D1A1B] uppercase">Parent Cabinet</label>
                      <select
                        value={selectedCabinetId}
                        onChange={(e) => setSelectedCabinetId(e.target.value)}
                        className="h-10 w-full rounded-xl border border-[#E8E3E1] bg-[#FFFCF7] px-3 text-xs font-medium text-[#1D1A1B] focus:ring-2 focus:ring-[#6B1D2A]/20"
                      >
                        <option value="">Select Target Cabinet</option>
                        {cabinets.map((cab) => (
                          <option key={cab.id} value={cab.id}>{cab.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#1D1A1B] uppercase">Document Capacity</label>
                      <Input
                        type="number"
                        placeholder="e.g. 100"
                        value={fileBoxCapacity}
                        onChange={(e) => setFileBoxCapacity(e.target.value)}
                        className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
                      />
                    </div>
                    <Button onClick={handleCreateFileBox} className="w-full bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] h-10 rounded-xl font-bold text-xs mt-2 cursor-pointer">
                      Confirm File Box Creation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 border-b border-[#E8E3E1] pb-px">
          <button
            onClick={() => setActiveTab("cabinets")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px cursor-pointer ${
              activeTab === "cabinets"
                ? "border-[#6B1D2A] text-[#6B1D2A]"
                : "border-transparent text-[#5F5A5C] hover:text-[#1D1A1B]"
            }`}
          >
            <Archive className="w-4 h-4" />
            <span>Cabinets Registry ({cabinets.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("fileBoxes")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px cursor-pointer ${
              activeTab === "fileBoxes"
                ? "border-[#6B1D2A] text-[#6B1D2A]"
                : "border-transparent text-[#5F5A5C] hover:text-[#1D1A1B]"
            }`}
          >
            <Box className="w-4 h-4" />
            <span>File Boxes Registry ({fileBoxes.length})</span>
          </button>
        </div>

        {/* CABINETS VIEW */}
        {activeTab === "cabinets" && (
          <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl overflow-hidden">
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-[#5F5A5C] uppercase bg-[#F4E7EA] border-b border-[#E8E3E1]">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Cabinet Name</th>
                    <th className="px-5 py-3.5 font-bold">Box Capacity</th>
                    <th className="px-5 py-3.5 font-bold">Active Boxes</th>
                    <th className="px-5 py-3.5 font-bold">Storage Occupancy</th>
                    <th className="px-5 py-3.5 font-bold">Status</th>
                    <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E3E1]">
                  {currentCabinets.length > 0 ? (
                    currentCabinets.map((cab) => {
                      const used = cab.file_boxes?.length || 0;
                      const cap = cab.capacity || 1;
                      const pct = Math.round((used / cap) * 100);

                      return (
                        <tr key={cab.id} className="hover:bg-[#F4E7EA]/40 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-[#1D1A1B]">{cab.name}</td>
                          <td className="px-5 py-3.5 text-[#5F5A5C]">{cab.capacity} Boxes</td>
                          <td className="px-5 py-3.5 text-[#5F5A5C]">{used} Boxes Assigned</td>
                          <td className="px-5 py-3.5">
                            <div className="w-36 space-y-1">
                              <Progress value={pct} className="h-2 bg-[#E8E3E1]" />
                              <span className="text-[10px] text-[#5F5A5C] block">{used} / {cab.capacity} ({pct}%)</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1]">
                              {cab.status || "Active"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditCabinet(cab)}
                              className="h-7 w-7 p-0 text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] cursor-pointer"
                              title="Edit Cabinet"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteCabinet(cab.id)}
                              className="h-7 w-7 p-0 text-[#5F5A5C] hover:text-[#4A0E1C] hover:bg-[#F4E7EA] cursor-pointer"
                              title="Delete Cabinet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-5 py-8 text-center text-[#5F5A5C] italic">No physical cabinets configured yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div className="p-4 border-t border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7] text-xs text-[#5F5A5C]">
                <span>Page {cabinetPage} of {totalCabinetPages}</span>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => setCabinetPage((p) => Math.max(p - 1, 1))} disabled={cabinetPage === 1} className="h-8 px-3 text-xs bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer">
                    <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCabinetPage((p) => Math.min(p + 1, totalCabinetPages))} disabled={cabinetPage >= totalCabinetPages} className="h-8 px-3 text-xs bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer">
                    Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* FILE BOXES VIEW */}
        {activeTab === "fileBoxes" && (
          <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl overflow-hidden">
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-[#5F5A5C] uppercase bg-[#F4E7EA] border-b border-[#E8E3E1]">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">File Box Code</th>
                    <th className="px-5 py-3.5 font-bold">Cabinet Assignment</th>
                    <th className="px-5 py-3.5 font-bold">Document Capacity</th>
                    <th className="px-5 py-3.5 font-bold">Used Space</th>
                    <th className="px-5 py-3.5 font-bold">Occupancy</th>
                    <th className="px-5 py-3.5 font-bold">Status</th>
                    <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E3E1]">
                  {currentFileBoxes.length > 0 ? (
                    currentFileBoxes.map((box) => {
                      const used = box.used_space || 0;
                      const cap = box.capacity || 1;
                      const pct = Math.round((used / cap) * 100);

                      return (
                        <tr key={box.id} className="hover:bg-[#F4E7EA]/40 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-[#1D1A1B]">{box.name}</td>
                          <td className="px-5 py-3.5 text-[#5F5A5C]">{box.cabinet?.name || "Unassigned"}</td>
                          <td className="px-5 py-3.5 text-[#5F5A5C]">{box.capacity} Docs</td>
                          <td className="px-5 py-3.5 text-[#5F5A5C]">{used} Files</td>
                          <td className="px-5 py-3.5">
                            <div className="w-36 space-y-1">
                              <Progress value={pct} className="h-2 bg-[#E8E3E1]" />
                              <span className="text-[10px] text-[#5F5A5C] block">{used} / {box.capacity} ({pct}%)</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1]">
                              {box.status || "Active"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewFiles(box.name, box.files)}
                                className="h-7 px-2.5 rounded-lg text-xs font-semibold bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer"
                              >
                                <FolderOpen className="w-3.5 h-3.5 mr-1 text-[#6B1D2A]" />
                                <span>Inspect ({box.files?.length || 0})</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditFileBox(box)}
                                className="h-7 w-7 p-0 text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] cursor-pointer"
                                title="Edit File Box"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteFileBox(box.id)}
                                className="h-7 w-7 p-0 text-[#5F5A5C] hover:text-[#4A0E1C] hover:bg-[#F4E7EA] cursor-pointer"
                                title="Delete File Box"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-5 py-8 text-center text-[#5F5A5C] italic">No file boxes created yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div className="p-4 border-t border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7] text-xs text-[#5F5A5C]">
                <span>Page {fileBoxPage} of {totalFileBoxPages}</span>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => setFileBoxPage((p) => Math.max(p - 1, 1))} disabled={fileBoxPage === 1} className="h-8 px-3 text-xs bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer">
                    <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setFileBoxPage((p) => Math.min(p + 1, totalFileBoxPages))} disabled={fileBoxPage >= totalFileBoxPages} className="h-8 px-3 text-xs bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer">
                    Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CONTAINER FILES MODAL */}
        {isFilesModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-[#FFFCF7] w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-xl border border-[#E8E3E1] flex flex-col p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E3E1] pb-3">
                <div>
                  <h3 className="font-bold text-[#1D1A1B] text-sm">{selectedViewTitle} — Files List</h3>
                  <p className="text-xs text-[#5F5A5C]">{selectedFiles.length} records filed in this container</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setIsFilesModalOpen(false)} className="h-8 w-8 p-0 text-[#5F5A5C] hover:text-[#1D1A1B] cursor-pointer">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                {selectedFiles.map((file) => (
                  <div key={file.id} className="border border-[#E8E3E1] rounded-xl p-3.5 flex justify-between items-center bg-[#FFFCF7]">
                    <div>
                      <h4 className="font-bold text-xs text-[#1D1A1B]">{file.subject || file.title || "Untitled"}</h4>
                      <p className="text-[11px] text-[#5F5A5C] font-mono mt-0.5">{file.document_id || file.file_name}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold border-[#E8E3E1] text-[#6B1D2A] bg-[#F4E7EA]">{file.document_type || "General"}</Badge>
                  </div>
                ))}
                {selectedFiles.length === 0 && (
                  <div className="text-center py-10 text-[#5F5A5C]">
                    <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-xs">No records currently assigned to this box.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* EDIT CABINET MODAL */}
        <Dialog open={isEditCabinetModalOpen} onOpenChange={setIsEditCabinetModalOpen}>
          <DialogContent className="sm:max-w-md bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-6">
            <DialogHeader className="mb-3">
              <DialogTitle className="text-base font-bold text-[#1D1A1B]">Edit Storage Cabinet</DialogTitle>
              <DialogDescription className="text-xs text-[#5F5A5C]">Update the physical filing cabinet details.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#1D1A1B] uppercase">Cabinet Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Cabinet Alpha"
                  value={cabinetName}
                  onChange={(e) => setCabinetName(e.target.value)}
                  className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#1D1A1B] uppercase">Capacity (File Box Limit)</label>
                <Input
                  type="number"
                  placeholder="e.g. 20"
                  value={cabinetCapacity}
                  onChange={(e) => setCabinetCapacity(e.target.value)}
                  className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => setIsEditCabinetModalOpen(false)} variant="outline" className="flex-1 h-10 rounded-xl font-bold text-xs bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer">Cancel</Button>
                <Button onClick={handleEditCabinet} className="flex-1 bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] h-10 rounded-xl font-bold text-xs cursor-pointer">Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* EDIT FILE BOX MODAL */}
        <Dialog open={isEditFileBoxModalOpen} onOpenChange={setIsEditFileBoxModalOpen}>
          <DialogContent className="sm:max-w-md bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-6">
            <DialogHeader className="mb-3">
              <DialogTitle className="text-base font-bold text-[#1D1A1B]">Edit File Box Container</DialogTitle>
              <DialogDescription className="text-xs text-[#5F5A5C]">Update file box details and assignment.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#1D1A1B] uppercase">File Box Name / Code</label>
                <Input
                  type="text"
                  placeholder="e.g. BOX-2024-A"
                  value={fileBoxName}
                  onChange={(e) => setFileBoxName(e.target.value)}
                  className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#1D1A1B] uppercase">Parent Cabinet</label>
                <select
                  value={selectedCabinetId}
                  onChange={(e) => setSelectedCabinetId(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#E8E3E1] bg-[#FFFCF7] px-3 text-xs font-medium text-[#1D1A1B] focus:ring-2 focus:ring-[#6B1D2A]/20"
                >
                  <option value="">Select Target Cabinet</option>
                  {cabinets.map((cab) => (
                    <option key={cab.id} value={cab.id}>{cab.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#1D1A1B] uppercase">Document Capacity</label>
                <Input
                  type="number"
                  placeholder="e.g. 100"
                  value={fileBoxCapacity}
                  onChange={(e) => setFileBoxCapacity(e.target.value)}
                  className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => setIsEditFileBoxModalOpen(false)} variant="outline" className="flex-1 h-10 rounded-xl font-bold text-xs bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer">Cancel</Button>
                <Button onClick={handleEditFileBox} className="flex-1 bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] h-10 rounded-xl font-bold text-xs cursor-pointer">Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

export default Inventory;