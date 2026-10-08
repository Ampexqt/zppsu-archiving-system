const express = require("express");

const router = express.Router();

const authController = require("./auth.controller");
const authMiddleware = require("../../middleware/auth.middleware");

// REGISTER
router.post("/register", authController.register);

// LOGIN
router.post("/login", authController.login);

// LOGOUT
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;