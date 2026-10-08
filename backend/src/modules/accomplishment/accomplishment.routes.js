const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/role.middleware");
const controller = require("./accomplishment.controller");

router.get("/", authMiddleware, requireAdmin, controller.getReport);

router.post("/export", authMiddleware, requireAdmin, controller.exportPdf);

module.exports = router;