const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const fs = require("fs");

// UPLOAD
const uploadFile = async (data) => {

  // GET INVENTORY
  const inventory =
    await prisma.inventory.findUnique({

      where: {
        id: data.inventory_id,
      },

    });

  // CHECK IF FULL
  if (
    inventory.used_space >=
    inventory.folder_count
  ) {

    throw new Error(
      "Cabinet is already full"
    );
  }

  // CREATE FILE
  const file =
    await prisma.files.create({

              data: {

  title:
    data.title,

  category:
    data.category,

  inventory_id:
    data.inventory_id,

  file_name:
    data.file_name,

  file_path:
    data.file_path,

  access_code:
    data.access_code,

  subject:
    data.subject,

  document_type:
    data.document_type,

  memo_date:
    new Date(data.memo_date),

  received_date:
    new Date(data.received_date),

},
    });

  // UPDATE USED SPACE
  await prisma.inventory.update({

    where: {
      id: data.inventory_id,
    },

    data: {

      used_space: {
        increment: 1,
      },

      status:
        inventory.used_space + 1 >=
        inventory.folder_count

          ? "FULL"

          : "Available",
    },

  });

  return file;
};

// GET FILES
const getAllFiles = async () => {

  return await prisma.files.findMany({

    include: {
      inventory: true,
    },

    orderBy: {
      created_at: "desc",
    },

  });
};

// DELETE FILE
const deleteFile = async (id) => {

  // FIND FILE
  const file =
    await prisma.files.findUnique({

      where: {
        id: Number(id),
      },

    });

  if (!file) {

    throw new Error(
      "File not found"
    );
  }

  // DELETE PHYSICAL FILE
  if (
    fs.existsSync(
      file.file_path
    )
  ) {

    fs.unlinkSync(
      file.file_path
    );
  }

  // DELETE DATABASE RECORD
  await prisma.files.delete({

    where: {
      id: Number(id),
    },

  });

  // GET INVENTORY
  const inventory =
    await prisma.inventory.findUnique({

      where: {
        id: file.inventory_id,
      },

    });

  // SAFE USED SPACE
  const newUsedSpace =
    Math.max(
      inventory.used_space - 1,
      0
    );

  // UPDATE INVENTORY
  await prisma.inventory.update({

    where: {
      id: file.inventory_id,
    },

    data: {

      used_space:
        newUsedSpace,

      status:
        newUsedSpace >=
        inventory.folder_count

          ? "FULL"

          : "Available",
    },

  });

  return true;
};

module.exports = {
  uploadFile,
  getAllFiles,
  deleteFile,
};