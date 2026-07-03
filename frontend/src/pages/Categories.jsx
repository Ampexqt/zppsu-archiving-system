import { useEffect, useState } from "react";

import axios from "axios";

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
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">

        <h2 className="text-2xl font-bold mb-6">
          Add Category
        </h2>

        <div className="flex gap-4">

          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="flex-1 border border-gray-300 rounded-xl p-4 outline-none focus:border-[#8B0000]"
          />

          <button
            onClick={
              handleAddCategory
            }
            className="bg-[#8B0000] hover:bg-[#6d0000] text-white px-8 rounded-xl transition"
          >
            Add
          </button>

        </div>

      </div>

      {/* CATEGORY TABLE */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        <table className="w-full">

          <thead className="bg-[#8B0000] text-white">

            <tr>

              <th className="text-left p-5">
                Category Name
              </th>

              <th className="text-left p-5">
                Date Created
              </th>

              <th className="p-5">
                Actions
                </th>
            </tr>

          </thead>

          <tbody>

  {categories.map(
    (category) => (

      <tr
        key={category.id}
        className="border-b"
      >

        <td className="p-5">
          {category.name}
        </td>

        <td className="p-5">

          {new Date(
            category.created_at
          ).toLocaleDateString()}

        </td>

        <td className="p-5 text-center">
          <button

            onClick={() =>
              handleDeleteCategory(
                category.id
              )
            }

            className="
              bg-red-500
              text-white
              px-4
              py-2
              rounded-lg
            "
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

    </DashboardLayout>
  );
}

export default Categories;