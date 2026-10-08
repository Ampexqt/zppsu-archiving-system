const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/role.middleware");

// CREATE CATEGORY (Admin Only)
router.post("/", authMiddleware, requireAdmin, categoryController.createCategory);

// GET ALL CATEGORIES (Staff & Admin)
router.get("/", authMiddleware, categoryController.getCategories);

// DELETE CATEGORY (Admin Only)
router.delete("/:id", authMiddleware, requireAdmin, categoryController.deleteCategory);

// UPDATE CATEGORY (Admin Only)
router.put("/:id", authMiddleware, requireAdmin, categoryController.updateCategory);

module.exports = router;