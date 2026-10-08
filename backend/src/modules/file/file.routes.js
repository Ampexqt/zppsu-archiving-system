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
  async (req, res) => {
    try {
      const { subject, document_type, status, is_deleted } = req.body;
      const file = await prisma.files.findUnique({ where: { id: Number(req.params.id) } });

      if (!file) return res.status(404).json({ message: "File not found" });

      // Enforce ownership: Staff can only edit files they uploaded
      if (req.user.role !== "Admin" && file.uploaded_by !== req.user.id) {
        return res.status(403).json({ message: "Access denied. You can only edit documents you uploaded." });
      }

      const updatedFile = await prisma.files.update({
        where: { id: Number(req.params.id) },
        data: {
          ...(subject !== undefined && { subject }),
          ...(document_type !== undefined && { document_type }),
          ...(status !== undefined && { status }),
          ...(is_deleted !== undefined && { is_deleted }),
        },  
      });

      if (status === "Active" && is_deleted === false && file.is_deleted === true) {
        await logsService.createLog("RESTORE", `Restored ${updatedFile.document_type || 'File'} (${updatedFile.document_id || updatedFile.id})`, req.user.id);
      } else {
        await logsService.createLog("EDIT", `Edited ${updatedFile.document_type || 'File'} (${updatedFile.document_id || updatedFile.id})`, req.user.id);
      }

      res.json(updatedFile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update file" });
    }
  }
);

module.exports = router;