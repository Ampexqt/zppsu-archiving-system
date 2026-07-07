const express = require("express");
const router = express.Router();
const controller = require("./inventory.controller");
const authMiddleware = require("../../middleware/auth.middleware");

// Cabinets
router.post("/cabinets", authMiddleware, controller.createCabinet);
router.get("/cabinets", authMiddleware, controller.getCabinets);
router.delete("/cabinets/:id", authMiddleware, controller.deleteCabinet);

// File Boxes
router.post("/file-boxes", authMiddleware, controller.createFileBox);
router.get("/file-boxes", authMiddleware, controller.getFileBoxes);
router.delete("/file-boxes/:id", authMiddleware, controller.deleteFileBox);

module.exports = router;