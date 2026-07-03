import { useEffect, useState }
from "react";

import axios from "axios";

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
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">

        <h2 className="text-2xl font-bold mb-6">

          Create Cabinet

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* CABINET */}
          <input
            type="text"
            placeholder="Cabinet Name"
            value={cabinetName}
            onChange={(e) =>
              setCabinetName(
                e.target.value
              )
            }
            className="border border-gray-300 rounded-xl p-4 outline-none focus:border-[#8B0000]"
          />

          {/* SHELF */}
          <input
            type="text"
            placeholder="Shelf"
            value={shelf}
            onChange={(e) =>
              setShelf(
                e.target.value
              )
            }
            className="border border-gray-300 rounded-xl p-4 outline-none focus:border-[#8B0000]"
          />

          {/* FOLDER COUNT */}
          <input
            type="number"
            placeholder="Folder Capacity"
            value={folderCount}
            onChange={(e) =>
              setFolderCount(
                e.target.value
              )
            }
            className="border border-gray-300 rounded-xl p-4 outline-none focus:border-[#8B0000]"
          />

        </div>

        {/* BUTTON */}
        <button
          onClick={
            handleCreateInventory
          }
          className="bg-[#8B0000] hover:bg-[#6d0000] text-white px-8 py-4 rounded-xl transition mt-6"
        >

          Create Cabinet

        </button>

      </div>

      {/* INVENTORY TABLE */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        <table className="w-full">

          {/* HEADER */}
          <thead className="bg-[#8B0000] text-white">

            <tr>

              <th className="text-left p-5">
                Cabinet
              </th>

              <th className="text-left p-5">
                Shelf
              </th>

              <th className="text-left p-5">
                Folder Capacity
              </th>


            <th className="text-left p-5">
                Used Space
                </th>

            <th className="text-left p-5">
                Storage
                </th>

              <th className="text-left p-5">
                Status
              </th>

            <th className="p-5">
                  Files
                </th>

                <th className="p-5">
                  Action
                </th>
              </tr>

          </thead>

          {/* BODY */}
          <tbody>

            {inventories.map(
              (inventory) => (

                <tr
                  key={inventory.id}
                  className="border-b"
                >

                  <td className="p-5">

                    {
                      inventory.cabinet_name
                    }

                  </td>

                  <td className="p-5">

                    {inventory.shelf}

                  </td>

                  <td className="p-5">

                    {
                      inventory.folder_count
                    }

                  </td>

                 <td className="p-5">

                    {
                        inventory.used_space
                    }

                    </td>


                    <td className="p-5">

                    <div className="w-40 bg-gray-200 rounded-full h-4 overflow-hidden">

                        <div
                        className={`h-4 rounded-full

                            ${
                            inventory.used_space >=
                            inventory.folder_count

                                ? "bg-red-500"

                                : "bg-green-500"
                            }
                        `}
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

                    </td>



                  <td className="p-5">

                    <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm">

                      {inventory.status}

                    </span>

                  </td>
                
                <td className="p-5">

                    <button
                      onClick={() =>
                        handleViewFiles(
                          inventory
                        )
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >

                      View Files

                    </button>

                  </td>

                  <td className="p-5">

                    <button
                      onClick={() =>
                        handleDeleteInventory(
                          inventory.id
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >

                      Delete

                    </button>

                  </td>
                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

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
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
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