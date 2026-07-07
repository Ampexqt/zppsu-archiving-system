import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import axios from "axios";
import { Plus, Trash2 } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";

function Categories() {

  const [categories,
    setCategories] =
    useState([]);

  const [name, setName] =
    useState("");

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

      await axios.delete(

        `http://localhost:5000/api/categories/${id}`

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

      const response =
        await axios.get(
          "http://localhost:5000/api/categories"
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

      await axios.post(
        "http://localhost:5000/api/categories",
        { name }
      );

      alert(
        "Category added successfully!"
      );

      setName("");

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
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Categories
        </h1>

        <p className="text-gray-500 mt-2">
          Manage archive categories
        </p>

      </div>

      {/* ADD CATEGORY */}
      <Card className="mb-8 shadow-sm">
        <CardHeader className="bg-primary/5 border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Plus className="w-5 h-5" />
            Add Category
          </CardTitle>
          <CardDescription>Create a new classification category for documents.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-white"
            />
            <button
              onClick={handleAddCategory}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 h-10 rounded-md font-medium transition"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        </CardContent>
      </Card>

      {/* CATEGORY TABLE */}
      <Card className="overflow-hidden">
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
      </Card>

    </DashboardLayout>
  );
}

export default Categories;