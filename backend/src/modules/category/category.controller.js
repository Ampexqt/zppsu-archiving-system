const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const logsService = require("../logs/logs.service");

// Institutional Default Categories required by document templates
const DEFAULT_SYSTEM_CATEGORIES = ["Administrative", "Academic", "Financial"];

// Helper to check if a category is a protected system default
const isDefaultCategory = (name = "") => {
  return DEFAULT_SYSTEM_CATEGORIES.some(
    (d) => d.toLowerCase() === name.trim().toLowerCase()
  );
};

// CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const trimmedName = name.trim();

    // Check if category already exists (case-insensitive)
    const existing = await prisma.categories.findFirst({
      where: {
        name: { equals: trimmedName, mode: "insensitive" },
      },
    });

    if (existing) {
      return res.status(400).json({
        message: `Category "${trimmedName}" already exists`,
      });
    }

    const category = await prisma.categories.create({
      data: { name: trimmedName },
    });

    if (req.user?.id) {
      await logsService.createLog("CREATE CATEGORY", `Created category ${trimmedName}`, req.user.id);
    }

    res.status(201).json({
      message: "Category created successfully",
      category: {
        ...category,
        is_default: isDefaultCategory(category.name),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
  try {
    let categories = await prisma.categories.findMany({
      orderBy: { id: "asc" },
    });

    // Self-healing: Ensure the 3 institutional default categories always exist
    for (const defaultName of DEFAULT_SYSTEM_CATEGORIES) {
      const exists = categories.some(
        (c) => c.name.toLowerCase() === defaultName.toLowerCase()
      );
      if (!exists) {
        const created = await prisma.categories.create({
          data: { name: defaultName },
        });
        categories.push(created);
      }
    }

    // Sort: System defaults first, then custom categories
    const enriched = categories
      .map((cat) => ({
        ...cat,
        is_default: isDefaultCategory(cat.name),
      }))
      .sort((a, b) => {
        if (a.is_default && !b.is_default) return -1;
        if (!a.is_default && b.is_default) return 1;
        return a.name.localeCompare(b.name);
      });

    res.status(200).json(enriched);
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

    // Protect default system categories from deletion
    if (isDefaultCategory(category.name)) {
      return res.status(403).json({
        message: `Cannot delete default system category "${category.name}". This category is permanently required by institutional document templates.`,
      });
    }

    // Prevent deletion if active files are filed under this category
    const filesCount = await prisma.files.count({
      where: {
        category: category.name,
        is_deleted: false,
      },
    });

    if (filesCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category "${category.name}" because ${filesCount} active document(s) are filed under it. Please re-assign those documents first.`,
      });
    }

    await prisma.categories.delete({ where: { id } });

    if (req.user?.id) {
      await logsService.createLog("DELETE CATEGORY", `Deleted category ${category.name}`, req.user.id);
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const trimmedName = name.trim();
    const existing = await prisma.categories.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Category not found" });

    // Protect default system categories from renaming
    if (isDefaultCategory(existing.name)) {
      if (trimmedName.toLowerCase() !== existing.name.toLowerCase()) {
        return res.status(403).json({
          message: `Cannot rename default system category "${existing.name}". Institutional document templates rely on this exact category name.`,
        });
      }
    }

    const category = await prisma.categories.update({
      where: { id },
      data: { name: trimmedName },
    });

    if (req.user?.id) {
      await logsService.createLog("UPDATE CATEGORY", `Updated category to ${trimmedName}`, req.user.id);
    }

    res.status(200).json({
      message: "Category updated successfully",
      category: {
        ...category,
        is_default: isDefaultCategory(category.name),
      },
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
  DEFAULT_SYSTEM_CATEGORIES,
};
