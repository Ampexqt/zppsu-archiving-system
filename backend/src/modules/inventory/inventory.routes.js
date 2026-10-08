const express = require("express");
const router = express.Router();
const controller = require("./inventory.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/role.middleware");

// Cabinets
router.post("/cabinets", authMiddleware, requireAdmin, controller.createCabinet);
router.get("/cabinets", authMiddleware, controller.getCabinets);
router.delete("/cabinets/:id", authMiddleware, requireAdmin, controller.deleteCabinet);
router.put("/cabinets/:id", authMiddleware, requireAdmin, controller.updateCabinet);

// File Boxes
router.post("/file-boxes", authMiddleware, requireAdmin, controller.createFileBox);
router.get("/file-boxes", authMiddleware, controller.getFileBoxes);
router.delete("/file-boxes/:id", authMiddleware, requireAdmin, controller.deleteFileBox);
router.put("/file-boxes/:id", authMiddleware, requireAdmin, controller.updateFileBox);

module.exports = router;