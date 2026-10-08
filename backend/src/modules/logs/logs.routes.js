const express = require("express");
const router = express.Router();
const prisma = require("../../../prisma/client");
const authMiddleware = require("../../middleware/auth.middleware");
const logsService = require("./logs.service");

// GET /api/logs — Admin only, returns all logs with user relation
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const logs = await prisma.logs.findMany({
      orderBy: { created_at: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/logs/file/:id — Get full audit trail for a specific file (Admin & Staff)
router.get("/file/:id", authMiddleware, async (req, res) => {
  try {
    const fileId = req.params.id;
    const documentId = req.query.document_id;
    const result = await logsService.getFileAuditTrail(fileId, documentId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/logs/track — Action tracking (Views, Downloads, etc.)
router.post("/track", authMiddleware, async (req, res) => {
  try {
    const { action, description, file_id, document_id, module = "documents" } = req.body;
    await logsService.createLog(
      action,
      description,
      req.user?.id,
      module,
      req.ip,
      file_id,
      document_id
    );
    res.status(201).json({ message: "Action tracked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;