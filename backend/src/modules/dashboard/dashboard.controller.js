const { PrismaClient } =
  require("@prisma/client");

const prisma =
  new PrismaClient();

const getAnalytics =
  async (req, res) => {

    try {

      const totalFiles =
        await prisma.files.count();

        const maxCapacity = 500;

const storagePercentage =
  Math.round(
    (totalFiles /
      maxCapacity) * 100
  );

      const totalUsers =
        await prisma.users.count();

      const totalCategories =
        await prisma.categories.count();

      const totalLogs =
        await prisma.logs.count();

        // TOP ACTIVE USERS
const topUsers =
  await prisma.logs.groupBy({

    by: ["user_id"],

    _count: {
      id: true,
    },

    orderBy: {
      _count: {
        id: "desc",
      },
    },

    take: 5,

  });

 const topUsersWithInfo =
(
  await Promise.all(

    topUsers.map(
      async (item) => {

        if (!item.user_id) {
          return null;
        }

        const user =
          await prisma.users.findUnique({
            where: {
              id: item.user_id,
            },
          });

        return {
          name:
            user?.email ||
            "Unknown User",

          activities:
            item._count.id,
        };
      }
    )

  )
).filter(Boolean);

      // DOCUMENTS PER CATEGORY
      const documentsPerCategory =
        await prisma.files.groupBy({

          by: [
            "document_type",
          ],

          _count: {
            id: true,
          },

          orderBy: {
            _count: {
              id: "desc",
            },
          },

        });

        const cabinetUsage =
  await prisma.inventory.findMany({

    include: {
      files: true,
    },

    orderBy: {
      id: "asc",
    },

  });

      res.status(200).json({

       
        totalFiles,

        totalUsers,

        totalCategories,

        totalLogs,
       
        maxCapacity,
      
        storagePercentage,


        documentsPerCategory,

        cabinetUsage,

          topUsers:
       topUsersWithInfo,


      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

module.exports = {
  getAnalytics,
};