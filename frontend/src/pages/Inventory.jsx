import { useEffect, useState }
from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import axios from "axios";
import { Plus, Trash2, FolderOpen } from "lucide-react";

import DashboardLayout
from "../components/layout/DashboardLayout";

function Inventory() {

  const [
    cabinetName,
    setCabinetName
  ] = useState("");

  const [
    shelf,
    setShelf
  ] = useState("");

  const [
    folderCount,
    setFolderCount
  ] = useState("");

  // VIEW FILES
const [
  selectedFiles,
  setSelectedFiles
] = useState([]);

const [
  selectedCabinet,
  setSelectedCabinet
] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [
    inventories,
    setInventories
  ] = useState([]);

  const handleDeleteInventory =
  async (inventoryId) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this cabinet?"
      );

    if (!confirmDelete)
      return;

    try {

      await axios.delete(

        `http://localhost:5000/api/inventory/${inventoryId}`

      );

      alert(
        "Cabinet deleted successfully"
      );

      fetchInventories();

    } catch (error) {

      console.error(error);

      alert(

        error.response?.data?.message ||

        "Delete failed"

      );

    }

  };

  // FETCH INVENTORY
  const fetchInventories =
    async () => {

    try {

      const response =
        await axios.get(
          "http://localhost:5000/api/inventory"
        );

      setInventories(
        response.data
      );

    } catch (error) {

      console.error(error);
    }
  };

  // LOAD DATA
  useEffect(() => {

    fetchInventories();

  }, []);

  
  // VIEW CABINET FILES
const handleViewFiles =
  (inventory) => {

    setSelectedCabinet(
      inventory.cabinet_name
    );

    setSelectedFiles(
      inventory.files || []
    );
  };

  // CREATE INVENTORY
  const handleCreateInventory =
    async () => {

    if (
      !cabinetName ||
      !shelf ||
      !folderCount
    ) {

      return alert(
        "All fields are required"
      );
    }

    try {

      await axios.post(
        "http://localhost:5000/api/inventory/create",
        {
          cabinet_name:
            cabinetName,

          shelf,

          folder_count:
            parseInt(folderCount),
        }
      );

      alert(
        "Inventory created successfully!"
      );

      // RESET
      setCabinetName("");
      setShelf("");
      setFolderCount("");

      // REFRESH
      fetchInventories();
      setIsModalOpen(false);

    } catch (error) {

      console.error(error);

      alert(
        "Failed to create inventory"
      );
    }
  };

  return (

    <DashboardLayout>

      {/* HEADER */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Inventory Management</h1>
          <p className="text-gray-500 mt-2">Manage cabinets and storage</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 h-11 rounded-lg font-medium transition shadow-sm">
              <Plus className="w-4 h-4" />
              Create Cabinet
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] p-6 bg-white border border-gray-100 rounded-2xl shadow-xl">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold text-gray-900">Create New Cabinet</DialogTitle>
              <DialogDescription className="text-gray-500 text-sm mt-1">
                Add a new physical or virtual storage cabinet.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Cabinet Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Cabinet A"
                  value={cabinetName}
                  onChange={(e) => setCabinetName(e.target.value)}
                  className="bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 h-11 px-4 rounded-xl text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Shelf</label>
                <Input
                  type="text"
                  placeholder="e.g. Top Shelf"
                  value={shelf}
                  onChange={(e) => setShelf(e.target.value)}
                  className="bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 h-11 px-4 rounded-xl text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Folder Capacity</label>
                <Input
                  type="number"
                  placeholder="e.g. 50"
                  value={folderCount}
                  onChange={(e) => setFolderCount(e.target.value)}
                  className="bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 h-11 px-4 rounded-xl text-base"
                />
              </div>
              <button
                onClick={handleCreateInventory}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-xl font-semibold transition shadow-sm mt-2"
              >
                <Plus className="w-4 h-4" />
                Create Cabinet
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* INVENTORY TABLE */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
          {/* HEADER */}
          <TableHeader>

            <TableRow>

              <TableHead className="text-left p-5">
                Cabinet
              </TableHead>

              <TableHead className="text-left p-5">
                Shelf
              </TableHead>

              <TableHead className="text-left p-5">
                Folder Capacity
              </TableHead>


            <TableHead className="text-left p-5">
                Used Space
                </TableHead>

            <TableHead className="text-left p-5">
                Storage
                </TableHead>

              <TableHead className="text-left p-5">
                Status
              </TableHead>

            <TableHead className="p-5">
                  Files
                </TableHead>

                <TableHead className="p-5">
                  Action
                </TableHead>
              </TableRow>

          </TableHeader>

          {/* BODY */}
          <TableBody>

            {inventories.map(
              (inventory) => (

                <TableRow
                  key={inventory.id}
                  className="border-b"
                >

                  <TableCell className="p-5">

                    {
                      inventory.cabinet_name
                    }

                  </TableCell>

                  <TableCell className="p-5">

                    {inventory.shelf}

                  </TableCell>

                  <TableCell className="p-5">

                    {
                      inventory.folder_count
                    }

                  </TableCell>

                 <TableCell className="p-5">

                    {
                        inventory.used_space
                    }

                    </TableCell>


                    <TableCell className="p-5">

                    <div className="w-40 bg-gray-200 rounded-full h-4 overflow-hidden">

                        <div
                        className={`h-4 rounded-full bg-primary`}
                        style={{

                            width: `${
                            (
                                inventory.used_space /

                                inventory.folder_count
                            ) * 100
                            }%`,
                        }}
                        />

                    </div>

                    <p className="text-sm mt-1">

                        {
                        inventory.used_space
                        } /

                        {
                        inventory.folder_count
                        }

                    </p>

                    </TableCell>



                  <TableCell className="p-5">

                    <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">

                      {inventory.status}

                    </span>

                  </TableCell>
                
                <TableCell className="p-5">

                    <button
                      onClick={() => handleViewFiles(inventory)}
                      className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg transition"
                      title="View Files"
                    >
                      <FolderOpen className="w-4 h-4" /> View
                    </button>

                  </TableCell>

                  <TableCell className="p-5">

                    <button
                      onClick={() =>
                        handleDeleteInventory(
                          inventory.id
                        )
                      }
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition"
                      title="Delete Cabinet"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                  </TableCell>
                </TableRow>
              )
            )}

          </TableBody>

        </Table>
        </div>
      </Card>

      {/* FILES MODAL */}
  {
  selectedFiles.length > 0 && (

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

        <div className="bg-white w-full max-w-3xl rounded-2xl p-4 sm:p-6 max-h-[80vh] overflow-y-auto">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold">

              {
                selectedCabinet
              } Files

            </h2>

            <button
              onClick={() => {

                setSelectedFiles([]);

                setSelectedCabinet("");

              }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg transition"
            >

              Close

            </button>

          </div>

          <div className="space-y-4">

            {
              selectedFiles.map(
                (file) => (

                  <div
                    key={file.id}
                    className="border border-gray-200 rounded-xl p-4"
                  >

                    <h3 className="font-bold">
                      {file.title}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      {file.file_name}
                    </p>

                  </div>
                )
              )
            }

            {
              selectedFiles.length === 0 && (

                <p>
                  No files found
                </p>
              )
            }

          </div>

        </div>

      </div>
    )
  }

      </DashboardLayout>
    );
  }
  export default Inventory;