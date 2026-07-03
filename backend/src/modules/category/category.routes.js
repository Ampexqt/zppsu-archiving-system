const express = require("express");

const router = express.Router();

const categoryController =
  require("./category.controller");

// CREATE CATEGORY
router.post(
  "/",
  categoryController.createCategory
);

// GET ALL CATEGORIES
router.get(
  "/",
  categoryController.getCategories
);

// DELETE CATEGORY
router.delete(
  "/:id",
  categoryController.deleteCategory
);

module.exports = router;