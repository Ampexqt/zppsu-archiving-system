const prisma =
  require("../../../prisma/client");

exports.getReport =
  async (req, res) => {

    try {

      const {

        startDate,

        endDate

      } = req.query;

      const where = {};

      if (
        startDate &&
        endDate
      ) {

        where.created_at = {

          gte: new Date(startDate),

          lte: new Date(endDate),

        };

      }

      const logs =
        await prisma.logs.findMany({

          where,

        });

     const report = {

  uploads:
    logs.filter(
      (log) =>
        log.action ===
        "UPLOAD FILE"
    ).length,

  deletes:
    logs.filter(
      (log) =>
        log.action ===
        "DELETE"
    ).length,

  archives:
    logs.filter(
      (log) =>
        log.action ===
        "ARCHIVE"
    ).length,

  restores:
    logs.filter(
      (log) =>
        log.action ===
        "RESTORE"
    ).length,

  moves:
    logs.filter(
      (log) =>
        log.action ===
        "MOVE"
    ).length,

  generated:
    logs.filter(
      (log) =>
        log.action ===
        "GENERATE"
    ).length,

  // NEW
  recentActivities: logs
    .sort(
      (a, b) =>
        new Date(b.created_at) -
        new Date(a.created_at)
    )
    .slice(0, 20),

};

      res.json(report);

    } catch (error) {

      console.error(error);

      res.status(500).json({

        message:
          "Failed to generate report",

      });

    }

  };