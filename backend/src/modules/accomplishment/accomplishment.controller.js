const prisma = require("../../../prisma/client");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const logsService = require("../logs/logs.service");

exports.getReport = async (req, res) => {
  try {
    const { startDate, endDate, department, userId, category } = req.query;
    const where = {};

    if (startDate && endDate) {
      where.created_at = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (userId) {
      where.user_id = Number(userId);
    }

    // Since logs don't directly have department/category in the current schema without joins,
    // we limit filtering to date and user, as requested by the schema constraints.
    // Future enhancements can join with users/files to filter by department/category.

    const logs = await prisma.logs.findMany({ where });

    const report = {
      uploads: logs.filter((log) => log.action === "UPLOAD FILE").length,
      deletes: logs.filter((log) => log.action === "DELETE" || log.action === "PERMANENT DELETE").length,
      archives: logs.filter((log) => log.action === "ARCHIVE").length,
      restores: logs.filter((log) => log.action === "RESTORE").length,
      moves: logs.filter((log) => log.action === "MOVE").length,
      generated: logs.filter((log) => log.action === "GENERATE REPORT").length,
      recentActivities: logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 20),
    };

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate report" });
  }
};

exports.exportPdf = async (req, res) => {
  try {
    const { file_box_id } = req.body;
    
    // 1. Generate the same report data
    const logs = await prisma.logs.findMany();
    const uploads = logs.filter((log) => log.action === "UPLOAD FILE").length;
    const deletes = logs.filter((log) => log.action === "DELETE").length;
    
    // 2. Create a PDF
    const currentYear = new Date().getFullYear();
    const latestDocument = await prisma.files.findFirst({ orderBy: { id: "desc" } });
    let nextSequence = 1;
    if (latestDocument?.document_id) {
      const parts = latestDocument.document_id.split("-");
      if (parts.length === 3) nextSequence = Number(parts[2]) + 1;
    }
    const documentId = `ACC-${currentYear}-${String(nextSequence).padStart(4, "0")}`;
    const fileName = `Accomplishment_Report_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, "../../../src/uploads", fileName);
    
    // Make sure directory exists
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(20).text("ZPPSU Archiving System", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text("Accomplishment Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Total Uploads: ${uploads}`);
    doc.text(`Total Deletions: ${deletes}`);
    doc.end();

    // Wait briefly for write stream to finish before proceeding
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 3. Save as official document
    const savedFile = await prisma.files.create({
      data: {
        document_id: documentId,
        title: "Accomplishment Report",
        category: "Reports",
        file_box_id: file_box_id ? Number(file_box_id) : null,
        document_type: "ACCOMPLISHMENT REPORTS",
        file_type: "PDF",
        is_generated: true,
        generated_type: "Accomplishment",
        file_name: fileName,
        file_path: `src/uploads/${fileName}`,
        uploaded_by: req.user.id,
        status: "Active",
      },
    });

    if (file_box_id) {
      await prisma.file_boxes.update({
        where: { id: Number(file_box_id) },
        data: { used_space: { increment: 1 } },
      });
      await logsService.createLog("FILE BOX ASSIGNMENT", `Assigned Accomplishment Report to box ${file_box_id}`, req.user.id);
    }

    await logsService.createLog("GENERATE REPORT", `Generated PDF Accomplishment Report`, req.user.id);

    return res.status(201).json({ message: "PDF Generated and Archived", file: savedFile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to export PDF" });
  }
};