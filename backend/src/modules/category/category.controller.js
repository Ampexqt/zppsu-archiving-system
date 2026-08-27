const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const logsService = require("../logs/logs.service");

// CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await prisma.categories.create({
      data: { name },
    });

    if (req.user?.id) {
      await logsService.createLog("CREATE CATEGORY", `Created category ${name}`, req.user.id);
    }

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: { created_at: "desc" },
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const category = await prisma.categories.findUnique({ where: { id } });
    if (!category) return res.status(404).json({ message: "Category not found" });

    await prisma.categories.delete({ where: { id } });

    if (req.user?.id) {
      await logsService.createLog("DELETE CATEGORY", `Deleted category ${category.name}`, req.user.id);
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    const category = await prisma.categories.update({
      where: { id },
      data: { name },
    });

    if (req.user?.id) {
      await logsService.createLog("UPDATE CATEGORY", `Updated category to ${name}`, req.user.id);
    }

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update category" });
  }
};

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
};