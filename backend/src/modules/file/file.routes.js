const express = require("express");
const router = express.Router();
const fileController = require("./file.controller");
const upload = require("./file.upload");
const prisma = require("../../../prisma/client");
const authMiddleware = require("../../middleware/auth.middleware");    
const logsService = require("../logs/logs.service");

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

// GET FILES
router.get(
  "/",
  authMiddleware,
  fileController.getAllFiles
);

// PERMANENT DELETE
router.delete(
  "/permanent/:id",
  authMiddleware,
  fileController.permanentDeleteFile
);

// SOFT DELETE
router.delete(
  "/:id",
  authMiddleware,
  fileController.deleteFile
);

// RESTORE
router.put(
  "/restore/:id",
  authMiddleware,
  fileController.restoreFile
);

// ASSIGN FILE BOX
router.put(
  "/assign/:id",
  authMiddleware,
  fileController.assignFileBox
);

// UPDATE FILE
router.put(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const { subject, document_type, status, is_deleted } = req.body;
      const file = await prisma.files.findUnique({ where: { id: Number(req.params.id) } });

      if (req.user.role !== "Admin" && file.uploaded_by !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
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
        await logsService.createLog("RESTORE", `Restored ${updatedFile.document_type || 'File'}`, req.user.id);
      } else {
        await logsService.createLog("EDIT", `Edited ${updatedFile.document_type || 'File'} ${updatedFile.document_id}`, req.user.id);
      }

      res.json(updatedFile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update file" });
    }
  }
);

module.exports = router;