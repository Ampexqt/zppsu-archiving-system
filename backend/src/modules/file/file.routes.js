const express = require("express");
const router = express.Router();
const fileController = require("./file.controller");
const upload = require("./file.upload");
const prisma = require("../../../prisma/client");
const authMiddleware = require("../../middleware/auth.middleware");    
const logsService = require("../logs/logs.service");

const { requireAdmin } = require("../../middleware/role.middleware");

// UPLOAD FILE (New Modern Workflow)
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  fileController.uploadFile
);

// GENERATE DOCUMENT (Previously uploadFile)
router.post(
  "/generate",
  authMiddleware,
  fileController.generateDocument
);

// SEARCH FILES
router.get(
  "/search",
  authMiddleware,
  fileController.searchFiles
);

// GET FILES
router.get(
  "/",
  authMiddleware,
  fileController.getAllFiles
);

// PERMANENT DELETE (Admin Only)
router.delete(
  "/permanent/:id",
  authMiddleware,
  requireAdmin,
  fileController.permanentDeleteFile
);

// SOFT DELETE (Admin or Owner)
router.delete(
  "/:id",
  authMiddleware,
  fileController.deleteFile
);

// RESTORE (Admin Only)
router.put(
  "/restore/:id",
  authMiddleware,
  requireAdmin,
  fileController.restoreFile
);

// ASSIGN FILE BOX
router.put(
  "/assign/:id",
  authMiddleware,
  fileController.assignFileBox
);

// UPDATE FILE (Admin or Owner)
router.put(
  "/:id",
  authMiddleware,
  fileController.updateFile
);

module.exports = router;