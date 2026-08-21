const prisma = require("../../../prisma/client");
const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");
const pdf = require("pdf-parse");
const officeParser = require("officeparser");
const { appendToExcel, getTemplateFileName } = require("../../utils/excelManager");
const logsService = require("../logs/logs.service");
const vectorService = require("./vector.service");
const extractionService = require("./extraction.service");

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
        const parsedData = await officeParser.parseOffice(req.file.path);
        extractedText = typeof parsedData?.toText === 'function' ? parsedData.toText() : String(parsedData);
      } catch (err) {
        console.error("Office Document Parsing Error:", err);
      }
    } else if ([".jpg", ".jpeg", ".png"].includes(fileExtension)) {
      try {
        console.log("Image detected. Running OCR...");
        const result = await Tesseract.recognize(req.file.path, "eng");
        extractedText = result.data.text;
      } catch (err) {
        console.error("Image OCR Error:", err);
      }
    }

    // 🤖 AI LOCAL METADATA EXTRACTION
    let finalSubject = subject;
    let finalDocType = document_type;
    let finalMemoDate = memo_date ? new Date(memo_date) : null;

    if (extractedText && extractedText.length > 10) {
      console.log("Running local AI extraction on document...");
      const aiData = await extractionService.extractMetadata(extractedText);
      if (aiData) {
        if (!finalSubject || finalSubject === "N/A" || finalSubject === "null") finalSubject = aiData.subject || finalSubject;
        if (!finalDocType || finalDocType === "Document" || finalDocType === "null") finalDocType = aiData.document_type || finalDocType;
        if (!finalMemoDate) finalMemoDate = aiData.memo_date || null;
        console.log("AI Metadata extracted:", { finalSubject, finalDocType, finalMemoDate });
      }
    }

    // GENERATE VECTOR EMBEDDING
    console.log("Generating semantic embedding for the document...");
    const embedding = await vectorService.generateEmbedding(extractedText);
    console.log(`Embedding generated with ${embedding.length} dimensions.`);

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

    const prefix = prefixMap[finalDocType] || "DOC";
    const documentId = `${prefix}-${currentYear}-${sequence}`;

    // SAVE DATABASE
    const newFile = await prisma.files.create({
      data: {
        document_id: documentId,
        title: title || req.file.originalname,
        category,
        file_box_id: file_box_id ? Number(file_box_id) : null,
        access_code: access_code || "N/A",
        subject: finalSubject || "N/A",
        document_type: finalDocType || "Document",
        file_type: fileExtension.replace(".", "").toUpperCase(),
        memo_date: finalMemoDate,
        received_date: received_date ? new Date(received_date) : null,
        file_name: req.file.filename,
        file_path: `uploads/${req.file.filename}`,
        uploaded_by: req.user.id,
        ocr_text: extractedText,
        embedding: embedding.length > 0 ? embedding : [],
        status: "Active",
        is_deleted: false,
        is_generated: false,
        category: category || "Uncategorized",
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

// SEMANTIC SEARCH FILES
exports.searchFiles = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    console.log(`Searching for: "${query}"`);
    // 1. Convert user's text query into a vector
    const queryEmbedding = await vectorService.generateEmbedding(query);
    if (!queryEmbedding || queryEmbedding.length === 0) {
      return res.status(500).json({ message: "Failed to process search query" });
    }

    // 2. Get all files with embeddings from DB
    // Optimization: If you have thousands of files, you might want to filter this by active/not-deleted first.
    const allFiles = await prisma.files.findMany({
      where: { 
        is_deleted: false,
      },
      include: {
        user: { select: { name: true, email: true } },
        file_box: { include: { cabinet: true } },
      }
    });

    // 3. Calculate similarity score for each file
    const scoredFiles = allFiles
      .filter(file => file.embedding && file.embedding.length > 0)
      .map(file => {
        const score = vectorService.cosineSimilarity(queryEmbedding, file.embedding);
        return {
          ...file,
          similarityScore: score,
        };
      })
      // 4. Sort by highest similarity
      .sort((a, b) => b.similarityScore - a.similarityScore);

    // Filter out completely irrelevant ones (e.g. score < 0.2) or just take top 10
    const topResults = scoredFiles.filter(file => file.similarityScore > 0.2).slice(0, 10);

    return res.json(topResults);
  } catch (error) {
    console.error("Semantic search error:", error);
    return res.status(500).json({ message: "Failed to search documents" });
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