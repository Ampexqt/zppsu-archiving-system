const prisma = require("../../../prisma/client");

// Create an audit log entry
const createLog = async (action, description, userId = null, module = null, ip = null, fileId = null, documentId = null) => {
  const data = {
    action,
    description,
    ...(userId ? { user_id: Number(userId) } : {}),
  };

  if (module) data.module = module;
  if (ip) data.ip_address = ip;
  if (fileId) data.file_id = Number(fileId);
  if (documentId) data.document_id = documentId;

  try {
    return await prisma.logs.create({ data });
  } catch (error) {
    // If the active Prisma client does not recognize extended fields, fall back to core fields
    try {
      return await prisma.logs.create({
        data: {
          action,
          description,
          ...(userId ? { user_id: Number(userId) } : {}),
        },
      });
    } catch (fallbackError) {
      console.error("Audit log creation error:", fallbackError.message);
      return null;
    }
  }
};

// Get all logs with user details
const getLogs = async () => {
  return prisma.logs.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

// Get comprehensive audit trail & action analytics for a specific file
const getFileAuditTrail = async (fileId, documentId = null) => {
  const numericFileId = fileId ? Number(fileId) : null;

  // Build search conditions
  const orConditions = [];
  if (numericFileId) orConditions.push({ file_id: numericFileId });
  if (documentId) orConditions.push({ document_id: documentId });

  // Query logs
  const logs = await prisma.logs.findMany({
    where: orConditions.length > 0 ? { OR: orConditions } : {},
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      created_at: "desc", // Option A: Present to Past
    },
  });

  // Calculate analytics
  let viewCount = 0;
  let downloadCount = 0;
  let editCount = 0;
  const viewUserMap = {};

  logs.forEach((log) => {
    const act = (log.action || "").toUpperCase();
    const userName = log.user?.name || "System Admin";

    if (act.includes("VIEW")) {
      viewCount++;
      viewUserMap[userName] = (viewUserMap[userName] || 0) + 1;
    } else if (act.includes("DOWNLOAD")) {
      downloadCount++;
    } else if (act.includes("UPDATE") || act.includes("EDIT")) {
      editCount++;
    }
  });

  return {
    logs,
    analytics: {
      viewCount,
      downloadCount,
      editCount,
      viewUserBreakdown: viewUserMap,
    },
  };
};

module.exports = { createLog, getLogs, getFileAuditTrail };