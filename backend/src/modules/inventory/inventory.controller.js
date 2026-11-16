const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const logsService = require("../logs/logs.service");

// Helper: Classify container type and nesting
const isArchfileContainer = (name = "") => {
  const lower = name.toLowerCase();
  return (
    name.includes(" / ") ||
    name.includes("/") ||
    lower.includes("archfile") ||
    lower.includes("binder") ||
    name.includes("[color:")
  );
};

const parseParentBoxName = (name = "") => {
  if (name.includes(" / ") || name.includes("/")) {
    const parts = name.split(/\s*\/\s*/);
    return parts[0]?.trim() || null;
  }
  return null;
};

// =======================
// CABINETS
// =======================

exports.createCabinet = async (req, res) => {
  try {
    const { name, capacity, max_file_boxes, max_direct_archfiles } = req.body;
    const parsedMaxBoxes = max_file_boxes !== undefined && max_file_boxes !== null ? parseInt(max_file_boxes, 10) : 5;
    const parsedMaxArchfiles = max_direct_archfiles !== undefined && max_direct_archfiles !== null ? parseInt(max_direct_archfiles, 10) : 5;
    const totalCapacity = capacity ? parseInt(capacity, 10) : (parsedMaxBoxes + parsedMaxArchfiles);

    const cabinet = await prisma.cabinets.create({
      data: {
        name: name.trim(),
        capacity: totalCapacity,
        max_file_boxes: parsedMaxBoxes,
        max_direct_archfiles: parsedMaxArchfiles,
        status: "Available",
      },
    });

    if (req.user?.id) {
      await logsService.createLog(
        "CREATE CABINET",
        `Created storage cabinet ${name} (Max Boxes: ${parsedMaxBoxes}, Max Archfiles: ${parsedMaxArchfiles})`,
        req.user.id
      );
    }

    return res.status(201).json(cabinet);
  } catch (error) {
    console.error("CREATE CABINET ERROR:", error);
    return res.status(500).json({ message: "Failed to create cabinet" });
  }
};

exports.getCabinets = async (req, res) => {
  try {
    const cabinets = await prisma.cabinets.findMany({
      include: {
        file_boxes: {
          include: {
            files: {
              where: { is_deleted: false },
              orderBy: { id: "desc" },
            },
          },
        },
      },
      orderBy: { id: "asc" },
    });
    return res.status(200).json(cabinets);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch cabinets" });
  }
};

exports.deleteCabinet = async (req, res) => {
  try {
    const cabinetId = Number(req.params.id);
    const cabinet = await prisma.cabinets.findUnique({
      where: { id: cabinetId },
      include: { file_boxes: true },
    });

    if (!cabinet) {
      return res.status(404).json({ message: "Cabinet not found" });
    }
    if (cabinet.file_boxes.length > 0) {
      return res.status(400).json({ message: "Cannot delete cabinet with file boxes inside" });
    }

    await prisma.cabinets.delete({ where: { id: cabinetId } });

    if (req.user?.id) {
      await logsService.createLog("DELETE CABINET", `Deleted storage cabinet ${cabinet.name}`, req.user.id);
    }

    return res.json({ message: "Cabinet deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Delete failed" });
  }
};

exports.updateCabinet = async (req, res) => {
  try {
    const cabinetId = Number(req.params.id);
    const { name, capacity, max_file_boxes, max_direct_archfiles } = req.body;

    const existingCabinet = await prisma.cabinets.findUnique({
      where: { id: cabinetId },
      include: { file_boxes: true },
    });

    if (!existingCabinet) {
      return res.status(404).json({ message: "Cabinet not found" });
    }

    // Count existing direct boxes and direct archfiles
    const existingBoxesCount = existingCabinet.file_boxes.filter(
      (b) => !isArchfileContainer(b.name)
    ).length;
    const existingArchfilesCount = existingCabinet.file_boxes.filter(
      (b) => isArchfileContainer(b.name) && !parseParentBoxName(b.name)
    ).length;

    if (max_file_boxes !== undefined && max_file_boxes !== null) {
      const parsedBoxesLimit = parseInt(max_file_boxes, 10);
      if (parsedBoxesLimit < existingBoxesCount) {
        return res.status(400).json({
          message: `Cannot reduce File Box capacity to ${parsedBoxesLimit}. Storage unit currently contains ${existingBoxesCount} File Boxes. Please relocate boxes first.`,
        });
      }
    }

    if (max_direct_archfiles !== undefined && max_direct_archfiles !== null) {
      const parsedArchfilesLimit = parseInt(max_direct_archfiles, 10);
      if (parsedArchfilesLimit < existingArchfilesCount) {
        return res.status(400).json({
          message: `Cannot reduce Archfile capacity to ${parsedArchfilesLimit}. Storage unit currently contains ${existingArchfilesCount} direct Archfiles. Please relocate archfiles first.`,
        });
      }
    }

    const updatedMaxBoxes = max_file_boxes !== undefined && max_file_boxes !== null
      ? parseInt(max_file_boxes, 10)
      : (existingCabinet.max_file_boxes ?? 10);
    const updatedMaxArchfiles = max_direct_archfiles !== undefined && max_direct_archfiles !== null
      ? parseInt(max_direct_archfiles, 10)
      : (existingCabinet.max_direct_archfiles ?? 10);
    const updatedCapacity = capacity
      ? parseInt(capacity, 10)
      : (updatedMaxBoxes + updatedMaxArchfiles);

    const cabinet = await prisma.cabinets.update({
      where: { id: cabinetId },
      data: {
        ...(name && { name: name.trim() }),
        capacity: updatedCapacity,
        max_file_boxes: updatedMaxBoxes,
        max_direct_archfiles: updatedMaxArchfiles,
      },
    });

    if (req.user?.id) {
      await logsService.createLog("UPDATE CABINET", `Updated storage cabinet ${cabinet.name} limits`, req.user.id);
    }

    return res.status(200).json(cabinet);
  } catch (error) {
    console.error("UPDATE CABINET ERROR:", error);
    return res.status(500).json({ message: "Update failed" });
  }
};

// =======================
// FILE BOXES
// =======================

exports.createFileBox = async (req, res) => {
  try {
    const { name, cabinet_id, capacity, max_archfiles } = req.body;
    const cabinetId = Number(cabinet_id);

    const cabinet = await prisma.cabinets.findUnique({
      where: { id: cabinetId },
      include: { file_boxes: true },
    });

    if (!cabinet) {
      return res.status(404).json({ message: "Storage unit not found" });
    }

    const trimmedName = String(name || "").trim();
    if (!trimmedName) {
      return res.status(400).json({ message: "Container name is required" });
    }

    // Check for duplicate container name in this storage unit
    const duplicate = cabinet.file_boxes.find(
      (b) => b.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (duplicate) {
      return res.status(400).json({
        message: `A container named '${trimmedName}' already exists in ${cabinet.name}. Please provide a distinct box code or identification label.`,
      });
    }

    const isArchfile = isArchfileContainer(trimmedName);
    const parentBoxName = parseParentBoxName(trimmedName);

    // CASE A: Nested Archfile inside a File Box (e.g. "Box 01 / HR Records [color:#...]")
    if (isArchfile && parentBoxName) {
      const parentBox = cabinet.file_boxes.find(
        (b) => b.name.trim().toLowerCase() === parentBoxName.toLowerCase()
      );

      const existingInBox = cabinet.file_boxes.filter((b) => {
        const parsed = parseParentBoxName(b.name);
        return parsed && parsed.toLowerCase() === parentBoxName.toLowerCase();
      }).length;

      const boxArchfileLimit = parentBox?.max_archfiles ?? 5;

      if (existingInBox >= boxArchfileLimit) {
        return res.status(400).json({
          message: `File Box '${parentBoxName}' is full (${existingInBox}/${boxArchfileLimit} archfile binders). Limit reached: cannot create more archfiles inside this box.`,
        });
      }
    }
    // CASE B: Direct Archfile inside Storage Unit (e.g. "Archfile HR Records [color:#...]")
    else if (isArchfile && !parentBoxName) {
      const existingDirectArchfiles = cabinet.file_boxes.filter(
        (b) => isArchfileContainer(b.name) && !parseParentBoxName(b.name)
      ).length;

      const directArchfileLimit = cabinet.max_direct_archfiles ?? 5;

      if (existingDirectArchfiles >= directArchfileLimit) {
        return res.status(400).json({
          message: `Storage unit '${cabinet.name}' has reached its direct Archfile capacity (${existingDirectArchfiles}/${directArchfileLimit} archfiles). Limit reached: cannot add more archfiles directly in this unit.`,
        });
      }
    }
    // CASE C: Direct File Box inside Storage Unit (e.g. "Box 01")
    else {
      const existingBoxes = cabinet.file_boxes.filter(
        (b) => !isArchfileContainer(b.name)
      ).length;

      const boxLimit = cabinet.max_file_boxes ?? 5;

      if (existingBoxes >= boxLimit) {
        return res.status(400).json({
          message: `Storage unit '${cabinet.name}' has reached its File Box capacity (${existingBoxes}/${boxLimit} boxes). Limit reached: cannot add more file boxes to this unit.`,
        });
      }
    }

    const parsedCapacity = capacity ? parseInt(capacity, 10) : (isArchfile ? 50 : 100);
    const parsedMaxArchfiles = max_archfiles ? parseInt(max_archfiles, 10) : 5;

    const fileBox = await prisma.file_boxes.create({
      data: {
        name: trimmedName,
        cabinet_id: cabinetId,
        capacity: parsedCapacity,
        max_archfiles: parsedMaxArchfiles,
        status: "Available",
      },
    });

    if (req.user?.id) {
      await logsService.createLog(
        "CREATE FILE BOX",
        `Created ${isArchfile ? "archfile binder" : "file box"} ${trimmedName} in ${cabinet.name}`,
        req.user.id
      );
    }

    return res.status(201).json(fileBox);
  } catch (error) {
    console.error("CREATE FILE BOX ERROR:", error);
    return res.status(500).json({ message: "Failed to create file box" });
  }
};

exports.getFileBoxes = async (req, res) => {
  try {
    const fileBoxes = await prisma.file_boxes.findMany({
      include: {
        cabinet: true,
        files: {
          where: { is_deleted: false },
          orderBy: { id: "desc" },
        },
      },
      orderBy: { id: "asc" },
    });
    return res.status(200).json(fileBoxes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch file boxes" });
  }
};

exports.deleteFileBox = async (req, res) => {
  try {
    const fileBoxId = Number(req.params.id);
    const fileBox = await prisma.file_boxes.findUnique({
      where: { id: fileBoxId },
      include: { files: true },
    });

    if (!fileBox) {
      return res.status(404).json({ message: "File box not found" });
    }
    if (fileBox.files.length > 0) {
      return res.status(400).json({ message: "Cannot delete file box with files inside" });
    }

    await prisma.file_boxes.delete({ where: { id: fileBoxId } });

    if (req.user?.id) {
      await logsService.createLog("DELETE FILE BOX", `Deleted file box ${fileBox.name}`, req.user.id);
    }

    return res.json({ message: "File box deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Delete failed" });
  }
};

exports.updateFileBox = async (req, res) => {
  try {
    const fileBoxId = Number(req.params.id);
    const { name, cabinet_id, capacity, max_archfiles } = req.body;

    const fileBox = await prisma.file_boxes.findUnique({
      where: { id: fileBoxId },
      include: { files: true },
    });

    if (!fileBox) {
      return res.status(404).json({ message: "File box not found" });
    }

    // Check for duplicate container name if name is changing
    if (name) {
      const trimmedName = String(name).trim();
      const targetCabinetId = cabinet_id ? Number(cabinet_id) : fileBox.cabinet_id;
      const duplicate = await prisma.file_boxes.findFirst({
        where: {
          cabinet_id: targetCabinetId,
          name: { equals: trimmedName, mode: "insensitive" },
          id: { not: fileBoxId },
        },
      });
      if (duplicate) {
        return res.status(400).json({
          message: `A container named '${trimmedName}' already exists in this storage unit. Please provide a distinct name.`,
        });
      }
    }

    // If max_archfiles is updated and this is a parent box, check that it's not below current nested count
    if (max_archfiles !== undefined && max_archfiles !== null) {
      const parsedArchfilesLimit = parseInt(max_archfiles, 10);
      const cabinet = await prisma.cabinets.findUnique({
        where: { id: fileBox.cabinet_id },
        include: { file_boxes: true },
      });
      const nestedCount = (cabinet?.file_boxes || []).filter((b) => {
        const parent = parseParentBoxName(b.name);
        return parent && parent.toLowerCase() === fileBox.name.trim().toLowerCase();
      }).length;

      if (parsedArchfilesLimit < nestedCount) {
        return res.status(400).json({
          message: `Cannot reduce Archfile capacity to ${parsedArchfilesLimit}. This box currently houses ${nestedCount} archfile binders. Please relocate binders first.`,
        });
      }
    }

    const updated = await prisma.file_boxes.update({
      where: { id: fileBoxId },
      data: {
        ...(name && { name: String(name).trim() }),
        ...(cabinet_id && { cabinet_id: Number(cabinet_id) }),
        ...(capacity && { capacity: parseInt(capacity, 10) }),
        ...(max_archfiles !== undefined && { max_archfiles: parseInt(max_archfiles, 10) }),
      },
    });

    if (req.user?.id) {
      await logsService.createLog("UPDATE FILE BOX", `Updated file box ${updated.name}`, req.user.id);
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error("UPDATE FILE BOX ERROR:", error);
    return res.status(500).json({ message: "Update failed" });
  }
};
