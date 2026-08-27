import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Tags, FolderTree, Edit2 } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";

function Categories() {
  const toast = useToast();
  const modal = useModal();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data || []);
    } catch (error) {
      console.error("FETCH CATEGORIES ERROR:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!name.trim()) {
      toast.warning("Category name is required.", "Validation");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/categories",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Classification category registered successfully!", "Category Added");
      setName("");
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add category", "Error");
    }
  };

  const handleDeleteCategory = async (id) => {
    const confirmed = await modal.confirm({
      title: "Delete Classification Category",
      message: "Are you sure you want to delete this category? Any documents tagged under this category will need recategorization.",
      confirmText: "Delete Category",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Category deleted successfully.", "Removed");
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete category", "Error");
    }
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setIsEditModalOpen(true);
  };

  const handleEditCategory = async () => {
    if (!editName.trim()) {
      toast.warning("Category name is required.", "Validation");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/categories/${editingCategory.id}`,
        { name: editName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Classification category updated successfully!", "Category Updated");
      setEditingCategory(null);
      setEditName("");
      setIsEditModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update category", "Error");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1D1A1B] tracking-tight">
              Classification Categories
            </h1>
            <p className="text-xs text-[#5F5A5C] mt-0.5">
              Manage system-wide document classifications and department categories.
            </p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger className="bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] h-9 px-4 rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-6">
              <DialogHeader className="mb-3">
                <DialogTitle className="text-base font-bold text-[#1D1A1B]">New Category Classification</DialogTitle>
                <DialogDescription className="text-xs text-[#5F5A5C]">
                  Create a new document category for guidance archives.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#1D1A1B] uppercase">Category Title</label>
                  <Input
                    type="text"
                    placeholder="e.g. Guidance Counseling Notes"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
                  />
                </div>
                <Button onClick={handleAddCategory} className="w-full bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] h-10 rounded-xl font-bold text-xs mt-2 cursor-pointer">
                  Confirm Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* CATEGORIES TABLE */}
        <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl overflow-hidden">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] text-[#5F5A5C] uppercase bg-[#F4E7EA] border-b border-[#E8E3E1]">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Category Name</th>
                  <th className="px-5 py-3.5 font-bold">Created Date</th>
                  <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3E1]">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-[#F4E7EA]/40 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#1D1A1B]">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-[#F4E7EA] text-[#6B1D2A] flex items-center justify-center font-bold text-xs">
                            {cat.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#5F5A5C]">
                        {cat.created_at ? new Date(cat.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(cat)}
                          className="h-7 w-7 p-0 text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="h-7 w-7 p-0 text-[#5F5A5C] hover:text-[#4A0E1C] hover:bg-[#F4E7EA] cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-5 py-8 text-center text-[#5F5A5C] italic">
                      No classification categories created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* EDIT CATEGORY MODAL */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-md bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-6">
            <DialogHeader className="mb-3">
              <DialogTitle className="text-base font-bold text-[#1D1A1B]">Edit Category</DialogTitle>
              <DialogDescription className="text-xs text-[#5F5A5C]">
                Update the name of the classification category.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#1D1A1B] uppercase">Category Title</label>
                <Input
                  type="text"
                  placeholder="e.g. Guidance Counseling Notes"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => setIsEditModalOpen(false)} variant="outline" className="flex-1 h-10 rounded-xl font-bold text-xs bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer">
                  Cancel
                </Button>
                <Button onClick={handleEditCategory} className="flex-1 bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] h-10 rounded-xl font-bold text-xs cursor-pointer">
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

export default Categories;