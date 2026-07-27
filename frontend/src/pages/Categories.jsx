import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import axios from "axios";
import { Plus, Trash2 } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";

function Categories() {

  const [categories,
    setCategories] =
    useState([]);

  const [name, setName] =
    useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  // DELETE CATEGORY
const handleDeleteCategory =
  async (id) => {

    try {

      const confirmDelete =
        window.confirm(
          "Delete this category?"
        );

      if (!confirmDelete)
        return;

      const token = localStorage.getItem("token");
      await axios.delete(

        `http://localhost:5000/api/categories/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }

      );

      alert(
        "Category deleted successfully"
      );

      fetchCategories();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to delete category"
      );

    }
  };
  
    // FETCH CATEGORIES
  const fetchCategories =
    async () => {

    try {
      const token = localStorage.getItem("token");
      const response =
        await axios.get(
          "http://localhost:5000/api/categories",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

      setCategories(
        response.data
      );

    } catch (error) {

      console.error(error);
    }
  };

  // LOAD
  useEffect(() => {
    fetchCategories();
  }, []);

  // ADD CATEGORY
  const handleAddCategory =
    async () => {

    if (!name) {
      return alert(
        "Category name required"
      );
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/categories",
        { name },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert(
        "Category added successfully!"
      );

      setName("");
      setIsModalOpen(false);

      fetchCategories();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to add category"
      );
    }
  };

  return (
    <DashboardLayout>

      {/* HEADER */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Categories</h1>
          <p className="text-gray-500 mt-2">Manage archive categories</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 h-11 rounded-lg font-medium transition shadow-sm">
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] p-6 bg-white border border-gray-100 rounded-2xl shadow-xl">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold text-gray-900">Add New Category</DialogTitle>
              <DialogDescription className="text-gray-500 text-sm mt-1">
                Create a new classification category for documents.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Category Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Official Receipts"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 h-11 px-4 rounded-xl text-base"
                />
              </div>
              <button
                onClick={handleAddCategory}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-xl font-semibold transition shadow-sm mt-2"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* CATEGORY TABLE */}
      <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-b border-gray-100">
                <TableHead className="text-left font-semibold text-gray-600 p-5 w-1/2">Category Name</TableHead>
                <TableHead className="text-left font-semibold text-gray-600 p-5">Date Created</TableHead>
                <TableHead className="text-left font-semibold text-gray-600 p-5 w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                  <TableCell className="p-5 font-semibold text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shadow-sm">
                        {category.name.charAt(0).toUpperCase()}
                      </div>
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell className="p-5 text-gray-500 font-medium">
                    {new Date(category.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell className="p-5">
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-gray-400 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {categories.length === 0 && (
            <div className="text-center py-12 text-gray-400 font-medium">
              No categories found. Create one to get started!
            </div>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
}

export default Categories;