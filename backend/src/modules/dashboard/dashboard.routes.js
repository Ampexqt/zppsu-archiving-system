const express = require("express");

const router = express.Router();

const dashboardController =
  require("./dashboard.controller");

// GET ANALYTICS
router.get(
  "/analytics",
  dashboardController.getAnalytics
);

module.exports = router;