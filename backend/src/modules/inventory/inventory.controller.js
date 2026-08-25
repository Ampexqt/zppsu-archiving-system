const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// =======================
// CABINETS
// =======================

exports.createCabinet = async (req, res) => {
  try {
    const { name, capacity } = req.body;
    const cabinet = await prisma.cabinets.create({
      data: {
        name,
        capacity: parseInt(capacity),
        status: "Available",
      },
    });
    return res.status(201).json(cabinet);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create cabinet" });
  }
};

exports.getCabinets = async (req, res) => {
  try {
    const cabinets = await prisma.cabinets.findMany({
      include: {
        file_boxes: {
          include: { files: true },
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
    return res.json({ message: "Cabinet deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Delete failed" });
  }
};

exports.updateCabinet = async (req, res) => {
  try {
    const { name, capacity } = req.body;
    const cabinet = await prisma.cabinets.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(name && { name }),
        ...(capacity && { capacity: parseInt(capacity) }),
      },
    });
    return res.status(200).json(cabinet);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Update failed" });
  }
};


// =======================
// FILE BOXES
// =======================

exports.createFileBox = async (req, res) => {
  try {
    const { name, cabinet_id, capacity } = req.body;
    const fileBox = await prisma.file_boxes.create({
      data: {
        name,
        cabinet_id: Number(cabinet_id),
        capacity: parseInt(capacity),
        status: "Available",
      },
    });
    return res.status(201).json(fileBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create file box" });
  }
};

exports.getFileBoxes = async (req, res) => {
  try {
    const fileBoxes = await prisma.file_boxes.findMany({
      include: {
        cabinet: true,
        files: true,
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
    return res.json({ message: "File box deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Delete failed" });
  }
};

exports.updateFileBox = async (req, res) => {
  try {
    const { name, cabinet_id, capacity } = req.body;
    const fileBox = await prisma.file_boxes.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(name && { name }),
        ...(cabinet_id && { cabinet_id: Number(cabinet_id) }),
        ...(capacity && { capacity: parseInt(capacity) }),
      },
    });
    return res.status(200).json(fileBox);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Update failed" });
  }
};