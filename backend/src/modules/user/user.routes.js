  const express = require("express");

  const router = express.Router();

  const { PrismaClient } =
    require("@prisma/client");

  const prisma = new PrismaClient();

  const authMiddleware =
    require("../../middleware/auth.middleware");
  const { requireAdmin } =
    require("../../middleware/role.middleware");

  // LOGS SERVICE
  const logsService =
    require("../logs/logs.service");

  // GET ALL USERS (Admin Only - Never expose password hashes)
  router.get("/", authMiddleware, requireAdmin, async (req, res) => {
    try {
      const users =
        await prisma.users.findMany({
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
  router.delete(
    "/:id",
    authMiddleware,
    requireAdmin,
    async (req, res) => {
      try {
        if (
          Number(req.params.id) ===
          req.user.id
        ) {
          return res.status(400).json({
            message:
              "You cannot delete yourself",
          });
        }

        const targetUser =
          await prisma.users.findUnique({
            where: {
              id: Number(req.params.id),
            },
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
          where: {
            id: Number(
              req.params.id
            ),
          },
        });

        res.status(200).json({

          message:
            "User deleted successfully",

        });

      } catch (error) {

        res.status(500).json({

          message: error.message,

        });

      }

    }
  );

  // PROMOTE USER
  router.put(
    "/promote/:id",

    authMiddleware,

    async (req, res) => {

      try {

        if (
          req.user.role !== "Admin"
        ) {

          return res.status(403).json({

            message: "Access denied",

          });

        }

        const updatedUser =
          await prisma.users.update({

            where: {

              id: Number(
                req.params.id
              ),

            },

            data: {

              role: "Admin",

            },

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
    }
  );

  // UPDATE USER
  router.put(
    "/:id",
    authMiddleware,
    async (req, res) => {
      try {
        if (req.user.role !== "Admin") {
          return res.status(403).json({ message: "Access denied" });
        }
        const { name, email } = req.body;
        const updatedUser = await prisma.users.update({
          where: { id: Number(req.params.id) },
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
    }
  );

  // DEMOTE USER
  router.put(
    "/demote/:id",

    authMiddleware,

    async (req, res) => {

      try {

        if (
          req.user.role !== "Admin"
        ) {

          return res.status(403).json({

            message: "Access denied",

          });

        }

        // PREVENT SELF DEMOTE
  if (
    Number(req.params.id) ===
    req.user.id
  ) {

    return res.status(400).json({

      message:
        "You cannot demote yourself",

    });

  }

  const adminCount =
    await prisma.users.count({

      where: {

        role: "Admin",

      },

    });

  const targetUser =
    await prisma.users.findUnique({

      where: {

        id: Number(
          req.params.id
        ),

      },

    });

  if (

    targetUser?.role ===
      "Admin"

    &&

    adminCount <= 1

  ) {

    return res.status(400).json({

      message:
        "Cannot demote the last Admin",

    });

  }

  const updatedUser =
    await prisma.users.update({

      where: {

        id: Number(
          req.params.id
        ),

      },

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
    }
  );

  // RESET PASSWORD
  router.put(
    "/reset-password/:id",
    authMiddleware,
    async (req, res) => {
      try {
        if (req.user.role !== "Admin") {
          return res.status(403).json({ message: "Access denied" });
        }
        
        const { password } = req.body;
        if (!password) {
          return res.status(400).json({ message: "Password is required" });
        }

        const bcrypt = require("bcrypt");
        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.users.update({
          where: { id: Number(req.params.id) },
          data: { password: hashedPassword },
        });

        await logsService.createLog(
          "RESET PASSWORD",
          `Admin reset password for ${updatedUser.email}`,
          req.user.id
        );

        res.json({ message: "Password reset successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
      }
    }
  );

  module.exports = router;