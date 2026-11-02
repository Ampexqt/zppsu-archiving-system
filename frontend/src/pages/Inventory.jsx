import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import DocumentViewModal from "../components/modals/DocumentViewModal";
import { Button } from "@/components/ui/button";
import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";

// Modular Inventory Components
import InventorySummaryCards from "../components/inventory/InventorySummaryCards";
import StorageExplorer from "../components/inventory/StorageExplorer";
import CreateCabinetModal from "../components/inventory/CreateCabinetModal";
import CreateFileBoxModal from "../components/inventory/CreateFileBoxModal";
import CreateArchfileModal from "../components/inventory/CreateArchfileModal";
import EditCabinetModal from "../components/inventory/EditCabinetModal";
import EditFileBoxModal from "../components/inventory/EditFileBoxModal";
import { parseBoxHierarchy } from "../components/inventory/storageTaxonomy";

function Inventory() {
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

  // Data States
  const [cabinets, setCabinets] = useState([]);
  const [fileBoxes, setFileBoxes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals State
  const [isCreateUnitModalOpen, setIsCreateUnitModalOpen] = useState(false);

  // Create Box
  const [isCreateBoxModalOpen, setIsCreateBoxModalOpen] = useState(false);
  const [createBoxCabinetId, setCreateBoxCabinetId] = useState("");

  // Create Archfile
  const [isCreateArchfileModalOpen, setIsCreateArchfileModalOpen] = useState(false);
  const [archfileParentCabinet, setArchfileParentCabinet] = useState(null);
  const [archfileParentBoxName, setArchfileParentBoxName] = useState("");

  // Edit Unit
  const [editingCabinet, setEditingCabinet] = useState(null);
  const [isEditCabinetOpen, setIsEditCabinetOpen] = useState(false);

  // Edit Container (Box / Archfile)
  const [editingFileBox, setEditingFileBox] = useState(null);
  const [isEditFileBoxOpen, setIsEditFileBoxOpen] = useState(false);

  // View File
  const [viewingFile, setViewingFile] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const [cabinetsRes, fileBoxesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/inventory/cabinets", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/inventory/file-boxes", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setCabinets(cabinetsRes.data || []);
      setFileBoxes(fileBoxesRes.data || []);
    } catch (error) {
      console.error("FETCH INVENTORY ERROR:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Summary Metrics calculations
  const totalFiledDocuments = useMemo(() => {
    return fileBoxes.reduce((acc, b) => acc + (b.files?.length || 0), 0);
  }, [fileBoxes]);

  const { totalBoxesCount, totalArchfilesCount } = useMemo(() => {
    let boxes = 0;
    let archfiles = 0;
    fileBoxes.forEach((b) => {
      const parsed = parseBoxHierarchy(b.name);
      if (parsed.isArchfile) {
        archfiles++;
      } else {
        boxes++;
      }
    });
    return { totalBoxesCount: boxes, totalArchfilesCount: archfiles };
  }, [fileBoxes]);

  // Create Storage Unit Handler
  const handleCreateCabinet = async ({ name, capacity }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/inventory/cabinets",
        { name, capacity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Storage cabinet created successfully!", "Cabinet Registered");
      setIsCreateUnitModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create storage cabinet", "Error");
    }
  };

  // Delete Storage Unit Handler
  const handleDeleteCabinet = async (id) => {
    const confirmed = await modal.confirm({
      title: "Delete Storage Cabinet",
      message: "Are you sure you want to delete this storage cabinet? Ensure all file boxes inside are relocated first.",
      confirmText: "Delete Cabinet",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/inventory/cabinets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Storage cabinet deleted successfully.", "Removed");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Delete failed", "Error");
    }
  };

  // Edit Storage Unit Handler
  const handleEditCabinet = async ({ id, name, capacity }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/inventory/cabinets/${id}`,
        { name, capacity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Storage cabinet updated successfully!", "Cabinet Updated");
      setIsEditCabinetOpen(false);
      setEditingCabinet(null);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update cabinet", "Error");
    }
  };

  // Create Container (Box or Archfile) Handler
  const handleCreateContainer = async ({ name, cabinet_id, capacity }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/inventory/file-boxes",
        { name, cabinet_id: Number(cabinet_id), capacity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Container registered and mapped to storage unit!", "Container Created");
      setIsCreateBoxModalOpen(false);
      setIsCreateArchfileModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create container", "Error");
    }
  };

  // Delete Container Handler
  const handleDeleteContainer = async (id) => {
    const confirmed = await modal.confirm({
      title: "Delete Container",
      message: "Are you sure you want to delete this container? Documents filed inside must be reassigned.",
      confirmText: "Delete Container",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/inventory/file-boxes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Container removed from inventory.", "Deleted");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Delete failed", "Error");
    }
  };

  // Edit Container Handler
  const handleEditContainer = async ({ id, name, cabinet_id, capacity }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/inventory/file-boxes/${id}`,
        { name, cabinet_id: Number(cabinet_id), capacity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Container details updated successfully!", "Container Updated");
      setIsEditFileBoxOpen(false);
      setEditingFileBox(null);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update container", "Error");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-[#A87818] uppercase tracking-wider bg-[#F2DFB0]/50 px-2 py-0.5 rounded-md border border-[#C99A2E]/30">
                Physical Archiving Hierarchy
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#1D1A1B] tracking-tight">
              Physical Storage & Inventory
            </h1>
            <p className="text-xs text-[#5F5A5C] mt-0.5">
              Interactive folder explorer: Navigate directly from Cabinet &rarr; File Box &rarr; Archfile (Blue Binders).
            </p>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsCreateUnitModalOpen(true)}
                className="bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] h-9 px-4 rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Storage Unit</span>
              </Button>
            </div>
          )}
        </div>

        {/* SUMMARY METRIC CARDS */}
        <InventorySummaryCards
          totalCabinets={cabinets.length}
          totalContainers={totalBoxesCount}
          totalFiledDocuments={totalFiledDocuments}
          averageOccupancyPct={totalArchfilesCount}
        />

        {/* MAIN HIERARCHICAL FOLDER EXPLORER (NO TABS!) */}
        <StorageExplorer
          cabinets={cabinets}
          fileBoxes={fileBoxes}
          isAdmin={isAdmin}
          onOpenCreateUnit={() => setIsCreateUnitModalOpen(true)}
          onOpenCreateBox={(cabinetId) => {
            setCreateBoxCabinetId(String(cabinetId));
            setIsCreateBoxModalOpen(true);
          }}
          onOpenCreateArchfile={(cabinet, boxName) => {
            setArchfileParentCabinet(cabinet);
            setArchfileParentBoxName(boxName);
            setIsCreateArchfileModalOpen(true);
          }}
          onEditUnit={(cab) => {
            setEditingCabinet(cab);
            setIsEditCabinetOpen(true);
          }}
          onDeleteUnit={handleDeleteCabinet}
          onEditContainer={(box) => {
            setEditingFileBox(box);
            setIsEditFileBoxOpen(true);
          }}
          onDeleteContainer={handleDeleteContainer}
          onViewFile={(file) => setViewingFile(file)}
        />
      </div>

      {/* CREATE STORAGE UNIT MODAL */}
      <CreateCabinetModal
        isOpen={isCreateUnitModalOpen}
        onClose={() => setIsCreateUnitModalOpen(false)}
        onSubmit={handleCreateCabinet}
      />

      {/* CREATE FILE BOX MODAL */}
      <CreateFileBoxModal
        isOpen={isCreateBoxModalOpen}
        onClose={() => setIsCreateBoxModalOpen(false)}
        onSubmit={handleCreateContainer}
        cabinets={cabinets}
        initialCabinetId={createBoxCabinetId}
      />

      {/* CREATE ARCHFILE (BLUE FOLDER) MODAL */}
      <CreateArchfileModal
        isOpen={isCreateArchfileModalOpen}
        onClose={() => setIsCreateArchfileModalOpen(false)}
        onSubmit={handleCreateContainer}
        cabinet={archfileParentCabinet}
        parentBoxName={archfileParentBoxName}
      />

      {/* EDIT CABINET MODAL */}
      <EditCabinetModal
        isOpen={isEditCabinetOpen}
        onClose={() => {
          setIsEditCabinetOpen(false);
          setEditingCabinet(null);
        }}
        onSubmit={handleEditCabinet}
        cabinet={editingCabinet}
      />

      {/* EDIT CONTAINER MODAL */}
      <EditFileBoxModal
        isOpen={isEditFileBoxOpen}
        onClose={() => {
          setIsEditFileBoxOpen(false);
          setEditingFileBox(null);
        }}
        onSubmit={handleEditContainer}
        fileBox={editingFileBox}
        cabinets={cabinets}
      />

      {/* VIEW DOCUMENT MODAL */}
      <DocumentViewModal
        isOpen={Boolean(viewingFile)}
        file={viewingFile}
        onClose={() => setViewingFile(null)}
      />
    </DashboardLayout>
  );
}

export default Inventory;
