import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import axios from "axios";
import { Plus, Trash2, FolderOpen, Box, Archive } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";

function Inventory() {
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
  
  const [itemsPerPage] = useState(10);

  // View Files Modal
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
  const [selectedViewTitle, setSelectedViewTitle] = useState("");

  // Fetch Data
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const cabinetsRes = await axios.get("http://localhost:5000/api/inventory/cabinets", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCabinets(cabinetsRes.data);

      const fileBoxesRes = await axios.get("http://localhost:5000/api/inventory/file-boxes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFileBoxes(fileBoxesRes.data);
      
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CRUD Cabinets
  const handleCreateCabinet = async () => {
    if (!cabinetName || !cabinetCapacity) return alert("All fields are required");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/inventory/cabinets",
        { name: cabinetName, capacity: parseInt(cabinetCapacity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Cabinet created successfully");
      setCabinetName("");
      setCabinetCapacity("");
      setIsCabinetModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create cabinet");
    }
  };

  const handleDeleteCabinet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this cabinet?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/inventory/cabinets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Cabinet deleted successfully");
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  // CRUD File Boxes
  const handleCreateFileBox = async () => {
    if (!fileBoxName || !selectedCabinetId || !fileBoxCapacity) return alert("All fields are required");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/inventory/file-boxes",
        { name: fileBoxName, cabinet_id: selectedCabinetId, capacity: parseInt(fileBoxCapacity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("File Box created successfully");
      setFileBoxName("");
      setSelectedCabinetId("");
      setFileBoxCapacity("");
      setIsFileBoxModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create file box");
    }
  };

  const handleDeleteFileBox = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file box?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/inventory/file-boxes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("File box deleted successfully");
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const handleViewFiles = (title, filesArray) => {
    setSelectedViewTitle(title);
    setSelectedFiles(filesArray || []);
    setIsFilesModalOpen(true);
  };

  const indexOfLastCabinet = cabinetPage * itemsPerPage;
  const indexOfFirstCabinet = indexOfLastCabinet - itemsPerPage;
  const currentCabinets = cabinets.slice(indexOfFirstCabinet, indexOfLastCabinet);
  const totalCabinetPages = Math.ceil(cabinets.length / itemsPerPage);

  const indexOfLastBox = fileBoxPage * itemsPerPage;
  const indexOfFirstBox = indexOfLastBox - itemsPerPage;
  const currentFileBoxes = fileBoxes.slice(indexOfFirstBox, indexOfLastBox);
  const totalFileBoxPages = Math.ceil(fileBoxes.length / itemsPerPage);

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Inventory Management</h1>
          <p className="text-gray-500 mt-2">Manage cabinets, file boxes, and physical storage</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("cabinets")}
          className={`pb-4 px-2 font-medium text-lg transition ${activeTab === "cabinets" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"}`}
        >
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5" /> Cabinets
          </div>
        </button>
        <button
          onClick={() => setActiveTab("fileBoxes")}
          className={`pb-4 px-2 font-medium text-lg transition ${activeTab === "fileBoxes" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"}`}
        >
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5" /> File Boxes
          </div>
        </button>
      </div>

      {/* CABINETS SECTION */}
      {activeTab === "cabinets" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isCabinetModalOpen} onOpenChange={setIsCabinetModalOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 h-11 rounded-lg font-medium transition shadow-sm">
                  <Plus className="w-4 h-4" /> Create Cabinet
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] p-6 bg-white border border-gray-100 rounded-2xl shadow-xl">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-xl font-bold text-gray-900">Create New Cabinet</DialogTitle>
                  <DialogDescription className="text-gray-500 text-sm mt-1">Add a new physical storage cabinet.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Cabinet Name</label>
                    <Input
                      type="text"
                      placeholder="e.g. Main Cabinet A"
                      value={cabinetName}
                      onChange={(e) => setCabinetName(e.target.value)}
                      className="bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 h-11 px-4 rounded-xl text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Capacity (Number of File Boxes)</label>
                    <Input
                      type="number"
                      placeholder="e.g. 20"
                      value={cabinetCapacity}
                      onChange={(e) => setCabinetCapacity(e.target.value)}
                      className="bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 h-11 px-4 rounded-xl text-base"
                    />
                  </div>
                  <button
                    onClick={handleCreateCabinet}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-xl font-semibold transition shadow-sm mt-2"
                  >
                    <Plus className="w-4 h-4" /> Create Cabinet
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left p-5">Cabinet Name</TableHead>
                    <TableHead className="text-left p-5">File Boxes Capacity</TableHead>
                    <TableHead className="text-left p-5">Used Space</TableHead>
                    <TableHead className="text-left p-5">Storage Usage</TableHead>
                    <TableHead className="text-left p-5">Status</TableHead>
                    <TableHead className="p-5">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCabinets.map((cabinet) => (
                    <TableRow key={cabinet.id} className="border-b">
                      <TableCell className="p-5 font-bold">{cabinet.name}</TableCell>
                      <TableCell className="p-5">{cabinet.capacity}</TableCell>
                      <TableCell className="p-5">{cabinet.file_boxes?.length || 0}</TableCell>
                      <TableCell className="p-5">
                        <div className="w-40 bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div
                            className={`h-4 rounded-full bg-primary`}
                            style={{
                              width: `${cabinet.capacity > 0 ? ((cabinet.file_boxes?.length || 0) / cabinet.capacity) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <p className="text-sm mt-1">{cabinet.file_boxes?.length || 0} / {cabinet.capacity}</p>
                      </TableCell>
                      <TableCell className="p-5">
                        <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">{cabinet.status}</span>
                      </TableCell>
                      <TableCell className="p-5">
                        <button
                          onClick={() => handleDeleteCabinet(cabinet.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition"
                          title="Delete Cabinet"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {cabinets.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center p-8 text-gray-500">No cabinets found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {/* CABINETS PAGINATION CONTROLS */}
              {totalCabinetPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t border-gray-100 bg-white gap-4">
                  <div className="text-sm text-gray-500 text-center sm:text-left">
                    Showing <span className="font-medium text-gray-900">{indexOfFirstCabinet + 1}</span> to <span className="font-medium text-gray-900">{Math.min(indexOfLastCabinet, cabinets.length)}</span> of <span className="font-medium text-gray-900">{cabinets.length}</span> results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCabinetPage(prev => Math.max(prev - 1, 1))}
                      disabled={cabinetPage === 1}
                      className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition font-medium text-gray-700"
                    >
                      Previous
                    </button>
                    <div className="text-sm text-gray-600 font-medium px-2">
                      Page {cabinetPage} of {totalCabinetPages}
                    </div>
                    <button
                      onClick={() => setCabinetPage(prev => Math.min(prev + 1, totalCabinetPages))}
                      disabled={cabinetPage === totalCabinetPages}
                      className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition font-medium text-gray-700"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* FILE BOXES SECTION */}
      {activeTab === "fileBoxes" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isFileBoxModalOpen} onOpenChange={setIsFileBoxModalOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 h-11 rounded-lg font-medium transition shadow-sm">
                  <Plus className="w-4 h-4" /> Create File Box
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] p-6 bg-white border border-gray-100 rounded-2xl shadow-xl">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-xl font-bold text-gray-900">Create New File Box</DialogTitle>
                  <DialogDescription className="text-gray-500 text-sm mt-1">Add a new file box inside a cabinet.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">File Box Name</label>
                    <Input
                      type="text"
                      placeholder="e.g. Box 101"
                      value={fileBoxName}
                      onChange={(e) => setFileBoxName(e.target.value)}
                      className="bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 h-11 px-4 rounded-xl text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Assign to Cabinet</label>
                    <select
                      value={selectedCabinetId}
                      onChange={(e) => setSelectedCabinetId(e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-200 focus-visible:ring-primary/20 h-11 px-4 rounded-xl text-base outline-none"
                    >
                      <option value="">Select a Cabinet</option>
                      {cabinets.map(cab => (
                        <option key={cab.id} value={cab.id}>{cab.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Capacity (Number of Files)</label>
                    <Input
                      type="number"
                      placeholder="e.g. 100"
                      value={fileBoxCapacity}
                      onChange={(e) => setFileBoxCapacity(e.target.value)}
                      className="bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 h-11 px-4 rounded-xl text-base"
                    />
                  </div>
                  <button
                    onClick={handleCreateFileBox}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-xl font-semibold transition shadow-sm mt-2"
                  >
                    <Plus className="w-4 h-4" /> Create File Box
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left p-5">File Box Name</TableHead>
                    <TableHead className="text-left p-5">Cabinet Location</TableHead>
                    <TableHead className="text-left p-5">Files Capacity</TableHead>
                    <TableHead className="text-left p-5">Used Space</TableHead>
                    <TableHead className="text-left p-5">Storage Usage</TableHead>
                    <TableHead className="text-left p-5">Status</TableHead>
                    <TableHead className="p-5">Files</TableHead>
                    <TableHead className="p-5">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentFileBoxes.map((box) => (
                    <TableRow key={box.id} className="border-b">
                      <TableCell className="p-5 font-bold">{box.name}</TableCell>
                      <TableCell className="p-5 text-gray-500">{box.cabinet?.name || "Unassigned"}</TableCell>
                      <TableCell className="p-5">{box.capacity}</TableCell>
                      <TableCell className="p-5">{box.used_space}</TableCell>
                      <TableCell className="p-5">
                        <div className="w-40 bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div
                            className={`h-4 rounded-full bg-primary`}
                            style={{
                              width: `${box.capacity > 0 ? (box.used_space / box.capacity) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <p className="text-sm mt-1">{box.used_space} / {box.capacity}</p>
                      </TableCell>
                      <TableCell className="p-5">
                        <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">{box.status}</span>
                      </TableCell>
                      <TableCell className="p-5">
                        <button
                          onClick={() => handleViewFiles(box.name, box.files)}
                          className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg transition"
                          title="View Files"
                        >
                          <FolderOpen className="w-4 h-4" /> View
                        </button>
                      </TableCell>
                      <TableCell className="p-5">
                        <button
                          onClick={() => handleDeleteFileBox(box.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition"
                          title="Delete File Box"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {fileBoxes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center p-8 text-gray-500">No file boxes found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {/* FILE BOXES PAGINATION CONTROLS */}
              {totalFileBoxPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t border-gray-100 bg-white gap-4">
                  <div className="text-sm text-gray-500 text-center sm:text-left">
                    Showing <span className="font-medium text-gray-900">{indexOfFirstBox + 1}</span> to <span className="font-medium text-gray-900">{Math.min(indexOfLastBox, fileBoxes.length)}</span> of <span className="font-medium text-gray-900">{fileBoxes.length}</span> results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFileBoxPage(prev => Math.max(prev - 1, 1))}
                      disabled={fileBoxPage === 1}
                      className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition font-medium text-gray-700"
                    >
                      Previous
                    </button>
                    <div className="text-sm text-gray-600 font-medium px-2">
                      Page {fileBoxPage} of {totalFileBoxPages}
                    </div>
                    <button
                      onClick={() => setFileBoxPage(prev => Math.min(prev + 1, totalFileBoxPages))}
                      disabled={fileBoxPage === totalFileBoxPages}
                      className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition font-medium text-gray-700"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* VIEW FILES MODAL */}
      {isFilesModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-4 sm:p-6 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{selectedViewTitle} Files</h2>
              <button
                onClick={() => {
                  setSelectedFiles([]);
                  setSelectedViewTitle("");
                  setIsFilesModalOpen(false);
                }}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              {selectedFiles.map((file) => (
                <div key={file.id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900">{file.subject || file.title}</h3>
                    <p className="text-gray-500 text-sm">{file.file_name || file.document_id}</p>
                  </div>
                  <Badge variant="outline">{file.document_type}</Badge>
                </div>
              ))}
              {selectedFiles.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <FolderOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>No files found in this container.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

export default Inventory;