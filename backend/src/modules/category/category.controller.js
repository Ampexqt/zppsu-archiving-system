const { PrismaClient } =
  require("@prisma/client");

const prisma = new PrismaClient();

// CREATE CATEGORY
const createCategory =
  async (req, res) => {

  try {

    const { name } = req.body;

    const category =
      await prisma.categories.create({
        data: {
          name,
        },
      });

    res.status(201).json({
      message:
        "Category created successfully",
      category,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL CATEGORIES
const getCategories =
  async (req, res) => {

  try {

    const categories =
      await prisma.categories.findMany({
        orderBy: {
          created_at: "desc",
        },
      });

    res.status(200).json(
      categories
    );

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE CATEGORY
const deleteCategory =
  async (req, res) => {

    try {

      await prisma.categories.delete({

        where: {
          id: Number(req.params.id),
        },

      });

      res.status(200).json({

        message:
          "Category deleted successfully",

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        message:
          "Failed to delete category",

      });

    }
  };

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
};