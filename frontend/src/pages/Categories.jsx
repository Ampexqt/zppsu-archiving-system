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
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left p-5">
                  Category Name
                </TableHead>
                <TableHead className="text-left p-5">
                  Date Created
                </TableHead>
                <TableHead className="p-5">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

    {categories.map(
      (category) => (

        <TableRow
          key={category.id}
          className="border-b"
        >

          <TableCell className="p-5">
            {category.name}
          </TableCell>

          <TableCell className="p-5">

            {new Date(
              category.created_at
            ).toLocaleDateString()}

          </TableCell>

          <TableCell className="p-5 text-center">
            <button

              onClick={() =>
                handleDeleteCategory(
                  category.id
                )
              }

              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition"
              title="Delete Category"
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

    </DashboardLayout>
  );
}

export default Categories;