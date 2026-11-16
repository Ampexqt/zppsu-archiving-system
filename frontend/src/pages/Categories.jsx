import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Plus, 
  Trash2, 
  Tags, 
  FolderTree, 
  Edit2, 
  Search, 
  Calendar, 
  Layers, 
  Clock, 
  FilterX,
  ShieldCheck,
  Lock
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CategoryModal from "../components/categories/CategoryModal";
import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";

// Institutional default categories permanently bound to document template formats
const DEFAULT_SYSTEM_CATEGORIES = ["Administrative", "Academic", "Financial"];

export const isDefaultCategory = (name = "") => {
  return DEFAULT_SYSTEM_CATEGORIES.some(
    (d) => d.toLowerCase() === (name || "").trim().toLowerCase()
  );
};

export default function Categories() {
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

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleCreateCategory = async (name) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/categories",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Classification category registered successfully!", "Category Added");
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add category", "Error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCategory = async (name) => {
    if (!editingCategory) return;

    if (editingCategory.is_default || isDefaultCategory(editingCategory.name)) {
      toast.warning(
        `"${editingCategory.name}" is a default institutional category and cannot be renamed.`,
        "Protected Category"
      );
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/categories/${editingCategory.id}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Classification category updated successfully!", "Category Updated");
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update category", "Error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id, catName) => {
    if (isDefaultCategory(catName)) {
      toast.warning(
        `"${catName}" is a default institutional category and cannot be deleted. All document templates rely on this schema.`,
        "Protected from Deletion"
      );
      return;
    }

    const confirmed = await modal.confirm({
      title: "Delete Classification Category",
      message: `Are you sure you want to delete "${catName}"? Any archived documents classified under this category may require re-tagging.`,
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

  // Filtered categories
  const filteredCategories = categories.filter((cat) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    return (
      cat.name?.toLowerCase().includes(term) ||
      String(cat.id).includes(term)
    );
  });

  const defaultCount = categories.filter((c) => c.is_default || isDefaultCategory(c.name)).length;
  const customCount = categories.length - defaultCount;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* SUMMARY METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* TOTAL CATEGORIES */}
          <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
                  Total Classifications
                </span>
                <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
                  {categories.length}
                </span>
                <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
                  {defaultCount} System Defaults • {customCount} Custom
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] text-[#6B1D2A]">
                <Tags className="w-5 h-5 stroke-[2]" />
              </div>
            </CardContent>
          </Card>

          {/* SYSTEM ARCHITECTURE */}
          <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
                  Document Taxonomy
                </span>
                <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
                  Standardized
                </span>
                <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
                  Bound to 60+ template formats
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F2DFB0]/50 border border-[#C99A2E]/40 text-[#A87818]">
                <Layers className="w-5 h-5 stroke-[2]" />
              </div>
            </CardContent>
          </Card>

          {/* CORE SYSTEM PROTECTION */}
          <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
                  Core Protection
                </span>
                <span className="text-lg font-bold text-[#1D1A1B] mt-1 block truncate">
                  3 Protected Defaults
                </span>
                <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
                  Admin, Academic, Financial
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] text-[#6B1D2A] shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SYSTEM REASSURANCE BANNER */}
        <div className="p-3.5 rounded-2xl bg-[#FFFCF7] border border-[#E8E3E1] flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F2DFB0]/60 border border-[#C99A2E]/40 flex items-center justify-center text-[#A87818] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1D1A1B] flex items-center gap-2">
                <span>System Core Categories Protected</span>
                <span className="text-[10px] font-bold text-[#A87818] bg-[#F2DFB0]/50 px-2 py-0.5 rounded border border-[#C99A2E]/30">
                  Institutional Guarantee
                </span>
              </h4>
              <p className="text-[11px] text-[#5F5A5C] mt-0.5">
                <strong>Administrative</strong>, <strong>Academic</strong>, and <strong>Financial</strong> categories are permanently locked against accidental deletion or renaming because institutional document templates directly rely on their schema.
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH & ACTION TOOLBAR */}
        <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl">
          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5A5C]" />
              <Input
                type="text"
                placeholder="Search classification categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-10 h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] placeholder-[#5F5A5C]/60 focus:border-[#6B1D2A]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F5A5C] hover:text-[#1D1A1B] p-1 rounded-md"
                  aria-label="Clear search"
                >
                  <FilterX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <span className="text-xs text-[#5F5A5C] hidden md:inline">
                {filteredCategories.length} categories
              </span>
              {isAdmin && (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="h-10 px-4 rounded-xl text-xs font-bold text-[#FFFCF7] bg-[#6B1D2A] hover:bg-[#8B3545] cursor-pointer shadow-xs inline-flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CATEGORIES DATA TABLE */}
        <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl overflow-hidden">
          <CardHeader className="border-b border-[#E8E3E1] py-3.5 px-6 flex flex-row items-center justify-between bg-[#FFFCF7]">
            <div>
              <CardTitle className="text-sm font-bold text-[#1D1A1B]">
                Document Classifications
              </CardTitle>
              <CardDescription className="text-xs text-[#5F5A5C]">
                Official institutional filing categories and document taxonomies
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-[#5F5A5C] uppercase bg-[#FCFAF8] border-b border-[#E8E3E1]">
                  <tr>
                    <th className="px-5 py-3.5 font-bold tracking-wider">Classification Name</th>
                    <th className="px-5 py-3.5 font-bold tracking-wider">Identifier</th>
                    <th className="px-5 py-3.5 font-bold tracking-wider">Created Date</th>
                    <th className="px-5 py-3.5 font-bold tracking-wider">Status</th>
                    {isAdmin && (
                      <th className="px-5 py-3.5 font-bold tracking-wider text-right">Actions</th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E8E3E1]">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => {
                      const isDefault = cat.is_default || isDefaultCategory(cat.name);

                      return (
                        <tr key={cat.id} className="hover:bg-[#F4E7EA]/30 transition-colors">
                          {/* CATEGORY NAME */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                {cat.name ? cat.name.charAt(0).toUpperCase() : "C"}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-[#1D1A1B]">
                                  {cat.name}
                                </span>
                                {isDefault && (
                                  <span className="text-[9px] font-bold text-[#A87818] bg-[#F2DFB0]/60 border border-[#C99A2E]/40 px-1.5 py-0.5 rounded-md inline-flex items-center gap-1 shrink-0">
                                    <ShieldCheck className="w-2.5 h-2.5" /> System Default
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* IDENTIFIER CHIP */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className="font-mono text-[11px] font-bold text-[#6B1D2A] bg-[#FFFCF7] border border-[#E8E3E1] px-2 py-0.5 rounded-md shadow-2xs">
                              CAT-{cat.id}
                            </span>
                          </td>

                          {/* CREATED DATE */}
                          <td className="px-5 py-3.5 whitespace-nowrap text-[#5F5A5C]">
                            <div className="inline-flex items-center gap-1.5 text-xs">
                              <Calendar className="w-3.5 h-3.5 text-[#5F5A5C]/70" />
                              <span>
                                {cat.created_at 
                                  ? new Date(cat.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) 
                                  : "—"}
                              </span>
                            </div>
                          </td>

                          {/* STATUS */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            {isDefault ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F2DFB0]/50 text-[#A87818] border border-[#C99A2E]/40 inline-flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" /> Core Schema
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1] inline-block">
                                Custom Tag
                              </span>
                            )}
                          </td>

                          {/* ACTIONS */}
                          {isAdmin && (
                            <td className="px-5 py-3.5 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1 justify-end">
                                {isDefault ? (
                                  <div 
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFFCF7] border border-[#E8E3E1] text-[#5F5A5C] text-[10px] font-semibold shadow-2xs cursor-not-allowed"
                                    title="System default category cannot be modified or deleted (preserves template schemas)"
                                  >
                                    <Lock className="w-3 h-3 text-[#A87818]" />
                                    <span>Locked</span>
                                  </div>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => setEditingCategory(cat)}
                                      className="h-8 w-8 rounded-lg flex items-center justify-center text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
                                      title="Edit Category"
                                      aria-label={`Edit ${cat.name}`}
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                      className="h-8 w-8 rounded-lg flex items-center justify-center text-[#5F5A5C] hover:text-[#4A0E1C] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
                                      title="Delete Category"
                                      aria-label={`Delete ${cat.name}`}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={isAdmin ? 5 : 4} className="px-5 py-12 text-center text-[#5F5A5C]">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center text-[#6B1D2A]">
                            <Tags className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-semibold text-[#1D1A1B]">No categories found</span>
                          <p className="text-xs text-[#5F5A5C] max-w-sm">
                            {search ? `No classification matches query "${search}".` : "No document categories registered."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* MODAL */}
        <CategoryModal
          isOpen={isModalOpen || Boolean(editingCategory)}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCategory(null);
          }}
          onSave={(name) => {
            if (editingCategory) {
              handleEditCategory(name);
            } else {
              handleCreateCategory(name);
            }
          }}
          initialName={editingCategory?.name || ""}
          isEdit={Boolean(editingCategory)}
          isSaving={isSaving}
        />
      </div>
    </DashboardLayout>
  );
}
