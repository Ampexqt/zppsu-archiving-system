const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAnalytics = async (req, res) => {
  try {
    const totalFiles = await prisma.files.count();
    const generatedReports = await prisma.files.count({ where: { is_generated: true } });
    const totalUsers = await prisma.users.count();
    const totalCategories = await prisma.categories.count();
    const totalLogs = await prisma.logs.count();

    // CALC STORAGE UTILIZATION
    const fileBoxesAgg = await prisma.file_boxes.aggregate({
      _sum: { capacity: true }
    });
    const maxCapacity = fileBoxesAgg._sum.capacity || 500; // fallback if no boxes
    const storagePercentage = Math.round((totalFiles / maxCapacity) * 100);

    // TOP ACTIVE USERS
    const topUsers = await prisma.logs.groupBy({
      by: ["user_id"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    const topUsersWithInfo = (
      await Promise.all(
        topUsers.map(async (item) => {
          if (!item.user_id) return null;
          const user = await prisma.users.findUnique({ where: { id: item.user_id } });
          return {
            name: user?.name || user?.email || "Unknown User",
            activities: item._count.id,
          };
        })
      )
    ).filter(Boolean);

    // DOCUMENTS PER CATEGORY
    const documentsPerCategory = await prisma.files.groupBy({
      by: ["document_type"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    // CABINET USAGE
    const cabinetUsage = await prisma.cabinets.findMany({
      include: {
        file_boxes: {
          select: {
            id: true,
            used_space: true,
            capacity: true
          }
        }
      },
      orderBy: { id: "asc" },
    });

    // RECENT ACTIVITIES
    const recentActivities = await prisma.logs.findMany({
      orderBy: { created_at: "desc" },
      take: 10,
      include: {
        user: { select: { name: true, email: true } }
      }
    });

    res.status(200).json({
      totalFiles,
      generatedReports,
      totalUsers,
      totalCategories,
      totalLogs,
      maxCapacity,
      storagePercentage,
      documentsPerCategory,
      cabinetUsage,
      topUsers: topUsersWithInfo,
      recentActivities,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalytics,
};