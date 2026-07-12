const prisma = require("../../../prisma/client");
const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");
const pdf = require("pdf-parse");
const officeParser = require("officeparser");
const { appendToExcel, getTemplateFileName } = require("../../utils/excelManager");
const logsService = require("../logs/logs.service");

// MODERN DOCUMENT UPLOAD
exports.uploadFile = async (req, res) => {
  try {
    const {
      title,
      category,
      access_code,
      subject,
      document_type,
      memo_date,
      received_date,
      file_box_id
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let extractedText = "";

    // Text Extraction and Conditional OCR for PDFs and Office Docs
    if (fileExtension === ".pdf") {
      try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdf(dataBuffer);
        extractedText = pdfData.text.trim();

        // If no machine-readable text found, assume image-based PDF and run OCR
        if (extractedText.length < 50) {
          console.log("PDF has no readable text. Running OCR...");
          const result = await Tesseract.recognize(req.file.path, "eng");
          extractedText = result.data.text;
        }
      } catch (err) {
        console.error("PDF Parsing/OCR Error:", err);
      }
    } else if ([".docx", ".pptx", ".xlsx"].includes(fileExtension)) {
      try {
        console.log(`Parsing office document: ${req.file.path}`);
        extractedText = await officeParser.parseOfficeAsync(req.file.path);
      } catch (err) {
        console.error("Office Document Parsing Error:", err);
      }
    }

    // GENERATE DOCUMENT ID
    const currentYear = new Date().getFullYear();
    const latestDocument = await prisma.files.findFirst({ orderBy: { id: "desc" } });
    let nextSequence = 1;

    if (latestDocument?.document_id) {
      const parts = latestDocument.document_id.split("-");
      if (parts.length === 3) {
        nextSequence = Number(parts[2]) + 1;
      }
    }

    const sequence = String(nextSequence).padStart(4, "0");
    const prefixMap = {
      Memorandum: "MEMO",
      Thesis: "THESIS",
      "Budget Proposal": "BUDGET",
      Disbursement: "DISB",
      Collections: "COL",
    };

    const prefix = prefixMap[document_type] || "DOC";
    const documentId = `${prefix}-${currentYear}-${sequence}`;

    // SAVE DATABASE
    const newFile = await prisma.files.create({
      data: {
        document_id: documentId,
        title: title || req.file.originalname,
        category,
        file_box_id: file_box_id ? Number(file_box_id) : null,
        access_code,
        subject,
        document_type,
        file_type: fileExtension.replace(".", "").toUpperCase(),
        memo_date: memo_date ? new Date(memo_date) : null,
        received_date: received_date ? new Date(received_date) : null,
        file_name: req.file.filename,
        file_path: req.file.path,
        uploaded_by: req.user.id,
        ocr_text: extractedText,
        status: "Active",
        is_deleted: false,
        is_generated: false,
      },
    });

    if (file_box_id) {
      await prisma.file_boxes.update({
        where: { id: Number(file_box_id) },
        data: { used_space: { increment: 1 } },
      });
      await logsService.createLog("FILE BOX ASSIGNMENT", `Assigned file to box ${file_box_id}`, req.user.id);
    }

    await logsService.createLog("UPLOAD FILE", `Uploaded document ${document_type || "File"}`, req.user.id);

    return res.status(201).json({ message: "Document uploaded successfully", file: newFile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to upload document" });
  }
};

// GENERATE DOCUMENT (Previously uploadFile Excel generation)
exports.generateDocument = async (req, res) => {
  try {
    const {
      title,
      category,
      file_box_id,
      access_code,
      subject,
      document_type,
      memo_date,
      received_date,
    } = req.body;

    const dynamicData = { ...req.body };
    delete dynamicData.title;
    delete dynamicData.category;
    delete dynamicData.file_box_id;
    delete dynamicData.subject;
    delete dynamicData.document_type;
    delete dynamicData.memo_date;
    delete dynamicData.received_date;

    const currentYear = new Date().getFullYear();
    const latestDocument = await prisma.files.findFirst({ orderBy: { id: "desc" } });
    let nextSequence = 1;
    if (latestDocument?.document_id) {
      const parts = latestDocument.document_id.split("-");
      if (parts.length === 3) nextSequence = Number(parts[2]) + 1;
    }

    const sequence = String(nextSequence).padStart(4, "0");
    const prefixMap = {
      Memorandum: "MEMO",
      Thesis: "THESIS",
      "Budget Proposal": "BUDGET",
      Disbursement: "DISB",
      Collections: "COL",
    };

    const prefix = prefixMap[document_type] || "DOC";
    const documentId = `${prefix}-${currentYear}-${sequence}`;
    const templateFileName = getTemplateFileName(document_type);

    const newFile = await prisma.files.create({
      data: {
        document_id: documentId,
        title: title || `Generated ${document_type}`,
        category,
        file_box_id: file_box_id ? Number(file_box_id) : null,
        access_code,
        subject,
        document_type,
        file_type: "EXCEL",
        is_generated: true,
        generated_type: document_type,
        memo_date: memo_date ? new Date(memo_date) : null,
        received_date: received_date ? new Date(received_date) : null,
        file_name: templateFileName,
        file_path: `src/uploads/${templateFileName}`,
        dynamic_data: dynamicData,
        is_deleted: false,
        status: "Active",
        uploaded_by: req.user.id,
      },
    });

    await appendToExcel(document_type, { ...req.body, document_id: documentId });

    if (file_box_id) {
      await prisma.file_boxes.update({
        where: { id: Number(file_box_id) },
        data: { used_space: { increment: 1 } },
      });
      await logsService.createLog("FILE BOX ASSIGNMENT", `Assigned generated file to box ${file_box_id}`, req.user.id);
    }

    await logsService.createLog("GENERATE REPORT", `Generated ${document_type}`, req.user.id);

    return res.status(201).json({ message: "Document generated successfully", file: newFile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to generate document" });
  }
};


// GET FILES
exports.getAllFiles = async (req, res) => {
  try {
    let files;
    if (req.user.role === "Admin") {
      files = await prisma.files.findMany({
        include: { user: { select: { email: true, name: true } }, file_box: { include: { cabinet: true } } },
        orderBy: { id: "desc" },
      });
    } else {
      files = await prisma.files.findMany({
        where: { uploaded_by: req.user.id },
        include: { user: { select: { email: true, name: true } }, file_box: { include: { cabinet: true } } },
        orderBy: { id: "desc" },
      });
    }
    return res.json(files);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch files" });
  }
};

// SOFT DELETE FILE
exports.deleteFile = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const file = await prisma.files.findUnique({ where: { id } });

    if (!file) return res.status(404).json({ message: "File not found" });

    if (req.user.role !== "Admin" && file.uploaded_by !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await prisma.files.update({
      where: { id },
      data: { is_deleted: true, status: "Deleted" },
    });

    if (file.file_box_id) {
      await prisma.file_boxes.update({
        where: { id: file.file_box_id },
        data: { used_space: { decrement: 1 } },
      });
    }

    await logsService.createLog("DELETE", `Deleted ${file.document_type || "File"}`, req.user.id);
    return res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete file" });
  }
};

// RESTORE FILE
exports.restoreFile = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const file = await prisma.files.findUnique({ where: { id } });

    if (!file) return res.status(404).json({ message: "File not found" });
    if (req.user.role !== "Admin" && file.uploaded_by !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const restoredFile = await prisma.files.update({
      where: { id },
      data: { is_deleted: false, status: "Active" },
    });

    if (file.file_box_id) {
      await prisma.file_boxes.update({
        where: { id: file.file_box_id },
        data: { used_space: { increment: 1 } },
      });
    }

    await logsService.createLog("RESTORE", `Restored ${restoredFile.document_type || "File"}`, req.user.id);
    return res.json({ message: "File restored successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to restore file" });
  }
};

// PERMANENT DELETE
exports.permanentDeleteFile = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const file = await prisma.files.findUnique({ where: { id } });

    if (!file) return res.status(404).json({ message: "File not found" });
    if (req.user.role !== "Admin") return res.status(403).json({ message: "Only Admin can permanently delete files" });

    const deletedFile = await prisma.files.delete({ where: { id } });
    await logsService.createLog("PERMANENT DELETE", `Permanently deleted ${deletedFile.document_type || "File"}`, req.user.id);
    
    return res.json({ message: "File permanently deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Permanent delete failed" });
  }
};

// ASSIGN FILE BOX
exports.assignFileBox = async (req, res) => {
  try {
    const fileId = Number(req.params.id);
    const { file_box_id } = req.body;

    const fileBox = await prisma.file_boxes.findUnique({
      where: { id: Number(file_box_id) },
      include: { files: true }
    });

    if (!fileBox) return res.status(404).json({ message: "File box not found" });
    if (fileBox.used_space >= fileBox.capacity) return res.status(400).json({ message: "File box is already full" });

    const file = await prisma.files.findUnique({ where: { id: fileId } });
    if (!file) return res.status(404).json({ message: "File not found" });

    // Move logic
    if (file.file_box_id) {
      if (file.file_box_id === Number(file_box_id)) return res.status(400).json({ message: "File is already in this box" });

      await prisma.files.update({ where: { id: fileId }, data: { file_box_id: Number(file_box_id) } });
      await prisma.file_boxes.update({ where: { id: file.file_box_id }, data: { used_space: { decrement: 1 } } });
      await prisma.file_boxes.update({ where: { id: Number(file_box_id) }, data: { used_space: { increment: 1 } } });

      await logsService.createLog("MOVE", `Moved ${file.document_type || "File"} to another box`, req.user.id);
      return res.json({ message: "File moved successfully" });
    }

    await prisma.files.update({ where: { id: fileId }, data: { file_box_id: Number(file_box_id) } });
    await prisma.file_boxes.update({ where: { id: Number(file_box_id) }, data: { used_space: { increment: 1 } } });

    await logsService.createLog("FILE BOX ASSIGNMENT", `Assigned ${file.document_type || "File"} to box`, req.user.id);
    return res.json({ message: "File assigned successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Assignment failed" });
  }
};