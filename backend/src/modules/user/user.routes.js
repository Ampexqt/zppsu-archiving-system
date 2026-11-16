const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const authMiddleware = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/role.middleware");
const logsService = require("../logs/logs.service");

// GET ALL USERS (Admin Only - Never expose password hashes)
router.get("/", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE USER (Admin Only - Enforce Admin Protection Guard)
router.delete("/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const targetId = Number(req.params.id);

    if (targetId === req.user.id) {
      return res.status(400).json({
        message: "You cannot delete yourself",
      });
    }

    const targetUser = await prisma.users.findUnique({
      where: { id: targetId },
    });

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Admin Protection Guard: Administrators cannot be deleted
    if (targetUser.role === "Admin") {
      return res.status(403).json({
        message: "Administrator accounts cannot be deleted",
      });
    }

    await logsService.createLog(
      "DELETE USER",
      `${targetUser.email} deleted`,
      req.user.id
    );

    await prisma.users.delete({
      where: { id: targetId },
    });

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// PROMOTE USER (Admin Only - Promotes Staff to Administrator)
router.put("/promote/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const targetId = Number(req.params.id);

    const targetUser = await prisma.users.findUnique({
      where: { id: targetId },
    });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser.role === "Admin") {
      return res.status(400).json({ message: "User is already an Administrator" });
    }

    const updatedUser = await prisma.users.update({
      where: { id: targetId },
      data: { role: "Admin" },
    });

    await logsService.createLog(
      "PROMOTE USER",
      `${updatedUser.email} promoted to Admin`,
      req.user.id
    );

    res.json({
      message: "User promoted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE USER
router.put("/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { name, email } = req.body;
    const targetId = Number(req.params.id);

    const updatedUser = await prisma.users.update({
      where: { id: targetId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    await logsService.createLog(
      "UPDATE USER",
      `${updatedUser.email} updated by Admin`,
      req.user.id
    );

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// DEMOTE USER (Option 1 Guard: Administrator accounts are protected against peer demotion)
router.put("/demote/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const targetId = Number(req.params.id);

    // PREVENT SELF DEMOTE
    if (targetId === req.user.id) {
      return res.status(400).json({
        message: "You cannot demote yourself",
      });
    }

    const targetUser = await prisma.users.findUnique({
      where: { id: targetId },
    });

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Option 1 Guard: Peer Administrators cannot demote other Administrators
    if (targetUser.role === "Admin") {
      return res.status(403).json({
        message: "Administrator accounts are protected and cannot be demoted by peer administrators",
      });
    }

    const updatedUser = await prisma.users.update({
      where: { id: targetId },
      data: {
        role: "Staff",
      },
    });

    await logsService.createLog(
      "DEMOTE USER",
      `${updatedUser.email} demoted to Staff`,
      req.user.id
    );

    res.json({
      message: "User demoted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

// RESET PASSWORD (Option 1 Guard: Peer Administrators cannot reset other Admins' passwords)
router.put("/reset-password/:id", authMiddleware, async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    const isSelf = targetId === req.user.id;

    // Non-admins can only change their own password
    if (!isSelf && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const targetUser = await prisma.users.findUnique({
      where: { id: targetId },
    });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Option 1 Guard: Peer administrators cannot reset passwords for other administrators
    if (!isSelf && targetUser.role === "Admin") {
      return res.status(403).json({
        message: "Administrator credentials are protected. Peer password reset is restricted for administrator accounts.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.users.update({
      where: { id: targetId },
      data: { password: hashedPassword },
    });

    await logsService.createLog(
      "RESET PASSWORD",
      isSelf
        ? `${updatedUser.email} updated their own password`
        : `Admin reset password for ${updatedUser.email}`,
      req.user.id
    );

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
