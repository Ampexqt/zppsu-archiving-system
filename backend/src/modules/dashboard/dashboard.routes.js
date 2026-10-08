const express = require("express");

const router = express.Router();

const dashboardController =
  require("./dashboard.controller");
const authMiddleware = require("../../middleware/auth.middleware");

// GET ANALYTICS
router.get(
  "/analytics",
  authMiddleware,
  dashboardController.getAnalytics
);

module.exports = router;