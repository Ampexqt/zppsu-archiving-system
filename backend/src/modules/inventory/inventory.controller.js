  const { PrismaClient } =
    require("@prisma/client");

  const prisma =
    new PrismaClient();

  // CREATE INVENTORY
  const createInventory =
    async (req, res) => {

      try {

        const {
          cabinet_name,
          shelf,
          folder_count,
        } = req.body;

        const inventory =
          await prisma.inventory.create({
            data: {
              cabinet_name,
              shelf,
              folder_count: parseInt(folder_count),
              status: "Available",
            },
          });

        res.status(201).json(
          inventory
        );

      } catch (error) {

        console.error(error);

        res.status(500).json({
          message:
            "Failed to create inventory",
        });
      }
    };

  // GET ALL INVENTORY
  const getInventories =
    async (req, res) => {

      try {

        const inventories =
    await prisma.inventory.findMany({

      include: {
        files: true,
      },

      orderBy: {
        id: "asc",
      },

    });

  const updatedInventories =
    inventories.map((inventory) => ({

      ...inventory,

      used_space:
        inventory.files.length,

    }));

  res.status(200).json(
    updatedInventories
  );

      } catch (error) {

        console.error(error);

        res.status(500).json({
          message:
            "Failed to fetch inventory",
        });
      }
    };

    const deleteInventory = async (req, res) => {

    try {

      const inventoryId =
        Number(req.params.id);

      const inventory =
        await prisma.inventory.findUnique({

          where: {
            id: inventoryId
          },

          include: {
            files: true
          }

        });

      if (!inventory) {

        return res.status(404).json({

          message:
            "Cabinet not found"

        });

      }

      if (
        inventory.files.length > 0
      ) {

        return res.status(400).json({

          message:
            "Cannot delete cabinet with files inside"

        });

      }

      await prisma.inventory.delete({

        where: {
          id: inventoryId
        }

      });

      res.json({

        message:
          "Cabinet deleted successfully"

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        message:
          "Delete failed"

      });

    }

  };

  module.exports = {

    createInventory,

    getInventories,

    deleteInventory,

  };