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

// Helper to guarantee scalar string values (prevents Prisma String array mismatch if fields are repeated in multipart forms)
const toScalarString = (val, fallback = null) => {
  if (Array.isArray(val)) {
    const last = val[val.length - 1];
    return last !== undefined && last !== null ? String(last).trim() : fallback;
  }
  if (val !== undefined && val !== null) {
    return String(val).trim();
  }
  return fallback;
};

const toScalarDate = (val) => {
  const scalar = toScalarString(val);
  if (!scalar) return null;
  const d = new Date(scalar);
  return isNaN(d.getTime()) ? null : d;
};

// MODERN DOCUMENT UPLOAD
exports.uploadFile = async (req, res) => {
  try {
    const title = toScalarString(req.body.title);
    const category = toScalarString(req.body.category, "Uncategorized");
    const access_code = toScalarString(req.body.access_code, "N/A");
    const subject = toScalarString(req.body.subject);
    const document_type = toScalarString(req.body.document_type, "Document");
    const memo_date = toScalarDate(req.body.memo_date);
    const received_date = toScalarDate(req.body.received_date) || new Date();
    const file_box_id = toScalarString(req.body.file_box_id);

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

    // --- OCR TEXT OPTIMIZATION / CLEANUP ---
    if (extractedText) {
      // Split into lines, and remove lines that are mostly garbage/noise from the top
      let lines = extractedText.split('\n');
      while (lines.length > 0) {
        let line = lines[0].trim();
        // If line is empty, or has less than 5 characters and is mostly symbols, or doesn't have a solid word, drop it
        if (!line || line.length < 4 || (line.replace(/[^a-zA-Z]/g, '').length < 4 && !line.match(/^[A-Z0-9]{3,}$/))) {
          lines.shift();
        } else {
          break; // Found the first real line (e.g., ZAMBOANGA)
        }
      }
      extractedText = lines.join('\n').trim();
    }


    // 🤖 AI LOCAL METADATA EXTRACTION
    let finalSubject = subject;
    let finalDocType = document_type;
    let finalMemoDate = memo_date;

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

    let parsedFileBoxId = null;
    if (file_box_id) {
      const box = await prisma.file_boxes.findUnique({ where: { id: Number(file_box_id) } });
      if (!box) {
        return res.status(400).json({ message: "Specified file box does not exist" });
      }
      if (box.used_space >= box.capacity) {
        return res.status(400).json({ message: "Specified file box is already full" });
      }
      parsedFileBoxId = box.id;
    }

    // Collect dynamic template fields
    const dynamicData = { ...req.body };
    const reservedFields = [
      "title",
      "category",
      "file_box_id",
      "access_code",
      "subject",
      "document_type",
      "memo_date",
      "received_date",
    ];
    reservedFields.forEach((k) => delete dynamicData[k]);
    Object.keys(dynamicData).forEach((k) => {
      if (Array.isArray(dynamicData[k])) {
        dynamicData[k] = dynamicData[k][dynamicData[k].length - 1];
      }
    });

    // SAVE DATABASE
    const newFile = await prisma.files.create({
      data: {
        document_id: documentId,
        title: title || req.file.originalname,
        category: category || "Uncategorized",
        file_box_id: parsedFileBoxId,
        access_code: access_code || "N/A",
        subject: finalSubject || "N/A",
        document_type: finalDocType || "Document",
        file_type: fileExtension.replace(".", "").toUpperCase(),
        memo_date: finalMemoDate,
        received_date: received_date,
        file_name: req.file.filename,
        file_path: `uploads/${req.file.filename}`,
        uploaded_by: req.user?.id ? Number(req.user.id) : null,
        ocr_text: extractedText,
        embedding: embedding.length > 0 ? embedding : [],
        status: "Active",
        is_deleted: false,
        is_generated: false,
        dynamic_data: Object.keys(dynamicData).length > 0 ? dynamicData : undefined,
      },
    });

    if (parsedFileBoxId) {
      await prisma.file_boxes.update({
        where: { id: parsedFileBoxId },
        data: { used_space: { increment: 1 } },
      });
      await logsService.createLog("FILE BOX ASSIGNMENT", `Assigned file to box ${parsedFileBoxId}`, req.user.id);
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
    const title = toScalarString(req.body.title);
    const category = toScalarString(req.body.category, "Uncategorized");
    const access_code = toScalarString(req.body.access_code, "N/A");
    const subject = toScalarString(req.body.subject, "N/A");
    const document_type = toScalarString(req.body.document_type, "Document");
    const memo_date = toScalarDate(req.body.memo_date);
    const received_date = toScalarDate(req.body.received_date) || new Date();
    const file_box_id = toScalarString(req.body.file_box_id);

    const dynamicData = { ...req.body };
    const reservedFields = [
      "title",
      "category",
      "file_box_id",
      "access_code",
      "subject",
      "document_type",
      "memo_date",
      "received_date",
    ];
    reservedFields.forEach((k) => delete dynamicData[k]);
    Object.keys(dynamicData).forEach((k) => {
      if (Array.isArray(dynamicData[k])) {
        dynamicData[k] = dynamicData[k][dynamicData[k].length - 1];
      }
    });

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

    let parsedFileBoxId = null;
    if (file_box_id) {
      const box = await prisma.file_boxes.findUnique({ where: { id: Number(file_box_id) } });
      if (!box) {
        return res.status(400).json({ message: "Specified file box does not exist" });
      }
      if (box.used_space >= box.capacity) {
        return res.status(400).json({ message: "Specified file box is already full" });
      }
      parsedFileBoxId = box.id;
    }

    const newFile = await prisma.files.create({
      data: {
        document_id: documentId,
        title: title || `Generated ${document_type}`,
        category,
        file_box_id: parsedFileBoxId,
        access_code,
        subject,
        document_type,
        file_type: "EXCEL",
        is_generated: true,
        generated_type: document_type,
        memo_date,
        received_date,
        file_name: templateFileName,
        file_path: `uploads/${templateFileName}`,
        dynamic_data: Object.keys(dynamicData).length > 0 ? dynamicData : undefined,
        is_deleted: false,
        status: "Active",
        uploaded_by: req.user?.id ? Number(req.user.id) : null,
      },
    });

    await appendToExcel(document_type, { ...req.body, document_id: documentId });

    if (parsedFileBoxId) {
      await prisma.file_boxes.update({
        where: { id: parsedFileBoxId },
        data: { used_space: { increment: 1 } },
      });
      await logsService.createLog("FILE BOX ASSIGNMENT", `Assigned generated file to box ${parsedFileBoxId}`, req.user.id);
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

// GET FILES (Unrestricted for all authenticated Staff and Admins)
exports.getAllFiles = async (req, res) => {
  try {
    const files = await prisma.files.findMany({
      include: {
        user: { select: { email: true, name: true, role: true } },
        file_box: { include: { cabinet: true } },
      },
      orderBy: { id: "desc" },
    });
    return res.json(files);
  } catch (error) {
    console.error("GET FILES ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch files" });
  }
};

// SOFT DELETE FILE (Admin or Owner)
exports.deleteFile = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const file = await prisma.files.findUnique({ where: { id } });

    if (!file) return res.status(404).json({ message: "File not found" });

    // Enforce ownership: Staff can only soft-delete their own documents
    if (req.user.role !== "Admin" && file.uploaded_by !== req.user.id) {
      return res.status(403).json({ message: "Access denied. You can only delete documents you uploaded." });
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

    await logsService.createLog("DELETE", `Moved ${file.document_type || "File"} (${file.document_id || file.id}) to trash`, req.user.id);
    return res.json({ message: "File moved to trash successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete file" });
  }
};

// RESTORE FILE (Admin Only)
exports.restoreFile = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Only administrators can restore documents." });
    }

    const id = Number(req.params.id);
    const file = await prisma.files.findUnique({ where: { id } });

    if (!file) return res.status(404).json({ message: "File not found" });

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

    await logsService.createLog("RESTORE", `Restored ${restoredFile.document_type || "File"} (${restoredFile.document_id || restoredFile.id})`, req.user.id);
    return res.json({ message: "File restored successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to restore file" });
  }
};

// PERMANENT DELETE (Admin Only)
exports.permanentDeleteFile = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Only administrators can permanently delete documents." });
    }

    const id = Number(req.params.id);
    const file = await prisma.files.findUnique({ where: { id } });

    if (!file) return res.status(404).json({ message: "File not found" });

    // Decrement file box used space if active in a box
    if (file.file_box_id && !file.is_deleted) {
      await prisma.file_boxes.update({
        where: { id: file.file_box_id },
        data: { used_space: { decrement: 1 } },
      });
    }

    // Safely remove file on disk if it exists
    if (file.file_name) {
      const fullDiskPath = path.join(__dirname, "../../uploads", file.file_name);
      if (fs.existsSync(fullDiskPath)) {
        try { fs.unlinkSync(fullDiskPath); } catch (e) { /* ignore cleanup error */ }
      }
    }

    const deletedFile = await prisma.files.delete({ where: { id } });
    await logsService.createLog("PERMANENT DELETE", `Permanently deleted ${deletedFile.document_type || "File"} (${deletedFile.document_id || deletedFile.id})`, req.user.id);
    
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

    const file = await prisma.files.findUnique({ where: { id: fileId } });
    if (!file) return res.status(404).json({ message: "File not found" });

    // Staff can only assign storage to their own files
    if (req.user.role !== "Admin" && file.uploaded_by !== req.user.id) {
      return res.status(403).json({ message: "Access denied. You can only assign storage to documents you uploaded." });
    }

    const fileBox = await prisma.file_boxes.findUnique({
      where: { id: Number(file_box_id) },
      include: { files: true }
    });

    if (!fileBox) return res.status(404).json({ message: "File box not found" });
    if (fileBox.used_space >= fileBox.capacity) return res.status(400).json({ message: "File box is already full" });

    // Move logic
    if (file.file_box_id) {
      if (file.file_box_id === Number(file_box_id)) return res.status(400).json({ message: "File is already in this box" });

      await prisma.files.update({ where: { id: fileId }, data: { file_box_id: Number(file_box_id) } });
      await prisma.file_boxes.update({ where: { id: file.file_box_id }, data: { used_space: { decrement: 1 } } });
      await prisma.file_boxes.update({ where: { id: Number(file_box_id) }, data: { used_space: { increment: 1 } } });

      await logsService.createLog("MOVE", `Reassigned ${file.document_type || "File"} (${file.document_id || file.id}) to box ${fileBox.name}`, req.user.id);
      return res.json({ message: "File moved successfully" });
    }

    await prisma.files.update({ where: { id: fileId }, data: { file_box_id: Number(file_box_id) } });
    await prisma.file_boxes.update({ where: { id: Number(file_box_id) }, data: { used_space: { increment: 1 } } });

    await logsService.createLog("FILE BOX ASSIGNMENT", `Assigned ${file.document_type || "File"} (${file.document_id || file.id}) to box ${fileBox.name}`, req.user.id);
    return res.json({ message: "File assigned successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Assignment failed" });
  }
};

// UPDATE FILE (Admin or Owner) - Updates scalar fields and merges dynamic template specifications
exports.updateFile = async (req, res) => {
  try {
    const fileId = Number(req.params.id);
    const {
      title,
      subject,
      document_type,
      status,
      access_code,
      memo_date,
      received_date,
      dynamic_data,
      is_deleted,
    } = req.body;

    const file = await prisma.files.findUnique({ where: { id: fileId } });
    if (!file) return res.status(404).json({ message: "File not found" });

    // Enforce ownership: Staff can only edit files they uploaded
    if (req.user.role !== "Admin" && file.uploaded_by !== req.user.id) {
      return res.status(403).json({ message: "Access denied. You can only edit documents you uploaded." });
    }

    // Prepare merged dynamic data safely
    const existingDynamic = typeof file.dynamic_data === "object" && file.dynamic_data !== null
      ? file.dynamic_data
      : {};
    const incomingDynamic = typeof dynamic_data === "object" && dynamic_data !== null
      ? dynamic_data
      : {};
    const mergedDynamicData = {
      ...existingDynamic,
      ...incomingDynamic,
    };

    const updatedFile = await prisma.files.update({
      where: { id: fileId },
      data: {
        ...(title !== undefined && { title: toScalarString(title, file.title) }),
        ...(subject !== undefined && { subject: toScalarString(subject, file.subject) }),
        ...(document_type !== undefined && { document_type: toScalarString(document_type, file.document_type) }),
        ...(status !== undefined && { status: toScalarString(status, file.status) }),
        ...(access_code !== undefined && { access_code: toScalarString(access_code, file.access_code) }),
        ...(memo_date !== undefined && { memo_date: toScalarDate(memo_date) }),
        ...(received_date !== undefined && { received_date: toScalarDate(received_date) }),
        ...(dynamic_data !== undefined && { dynamic_data: mergedDynamicData }),
        ...(is_deleted !== undefined && { is_deleted: Boolean(is_deleted) }),
      },
    });

    if (status === "Active" && is_deleted === false && file.is_deleted === true) {
      await logsService.createLog("RESTORE", `Restored ${updatedFile.document_type || 'File'} (${updatedFile.document_id || updatedFile.id})`, req.user.id);
    } else {
      await logsService.createLog("EDIT", `Edited ${updatedFile.document_type || 'File'} (${updatedFile.document_id || updatedFile.id})`, req.user.id);
    }

    return res.json(updatedFile);
  } catch (error) {
    console.error("UPDATE FILE ERROR:", error);
    return res.status(500).json({ message: "Failed to update file" });
  }
};
