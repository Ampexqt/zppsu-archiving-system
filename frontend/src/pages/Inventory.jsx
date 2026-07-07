import { useEffect, useState }
from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          Inventory Management

        </h1>

        <p className="text-gray-500 mt-2">

          Manage cabinets and storage

        </p>

      </div>

      {/* CREATE INVENTORY */}
      <Card className="mb-8 shadow-sm">
        <CardHeader className="bg-primary/5 border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Plus className="w-5 h-5" />
            Create Cabinet
          </CardTitle>
          <CardDescription>Add a new physical or virtual storage cabinet.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* CABINET */}
            <Input
              type="text"
              placeholder="Cabinet Name"
              value={cabinetName}
              onChange={(e) => setCabinetName(e.target.value)}
              className="flex-1 bg-white"
            />
            {/* SHELF */}
            <Input
              type="text"
              placeholder="Shelf"
              value={shelf}
              onChange={(e) => setShelf(e.target.value)}
              className="flex-1 bg-white"
            />
            {/* FOLDER COUNT */}
            <Input
              type="number"
              placeholder="Folder Capacity"
              value={folderCount}
              onChange={(e) => setFolderCount(e.target.value)}
              className="flex-1 bg-white"
            />
            {/* BUTTON */}
            <button
              onClick={handleCreateInventory}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 h-10 rounded-md font-medium transition"
            >
              <Plus className="w-4 h-4" />
              Create Cabinet
            </button>
          </div>
        </CardContent>
      </Card>

      {/* INVENTORY TABLE */}
      <Card className="overflow-hidden">
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
      </Card>

      {/* FILES MODAL */}
  {
  selectedFiles.length > 0 && (

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

        <div className="bg-white w-full max-w-3xl rounded-2xl p-6 max-h-[80vh] overflow-y-auto">

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