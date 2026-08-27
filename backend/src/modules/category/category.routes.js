const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");
const authMiddleware = require("../../middleware/auth.middleware");

// CREATE CATEGORY
router.post("/", authMiddleware, categoryController.createCategory);

// GET ALL CATEGORIES
router.get("/", authMiddleware, categoryController.getCategories);

// DELETE CATEGORY
router.delete("/:id", authMiddleware, categoryController.deleteCategory);

// UPDATE CATEGORY
router.put("/:id", authMiddleware, categoryController.updateCategory);

module.exports = router;