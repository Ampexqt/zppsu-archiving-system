  const prisma =
    require("../../../prisma/client");

  const fs =
    require("fs");

  const {
    appendToExcel,
    getTemplateFileName
  } = require(
    "../../utils/excelManager"
  );

  const logsService =
    require("../logs/logs.service");  

    const Tesseract = require("tesseract.js");
const path = require("path");

  // UPLOAD FILE
  exports.uploadFile =
    async (req, res) => {

      try {

        const {

          title,

          category,

          inventory_id,

          access_code,

          subject,

          document_type,

          status,

          memo_date,

          received_date,

        } = req.body;
        console.log(
    "REQ USER:",
    req.user
  );

        // DYNAMIC DATA
  const dynamicData = {
    ...req.body,
  };

  delete dynamicData.title;
  delete dynamicData.category;
  delete dynamicData.inventory_id;

  // delete dynamicData.access_code;

  delete dynamicData.subject;
  delete dynamicData.document_type;
  delete dynamicData.memo_date;
  delete dynamicData.received_date;

        // GENERATE DOCUMENT ID
        const currentYear =
          new Date()
            .getFullYear();

        const latestDocument =
    await prisma.files.findFirst({

      orderBy: {

        id: "desc",

      },

    });

  let nextSequence = 1;

  if (

    latestDocument?.document_id

  ) {

    const parts =

      latestDocument
        .document_id
        .split("-");

    const lastNumber =

      Number(parts[2]);

    nextSequence =
      lastNumber + 1;

  }

  const sequence =
    String(
      nextSequence
    ).padStart(
      4,
      "0"
    );

        const prefixMap = {

          Memorandum:
            "MEMO",

          Thesis:
            "THESIS",

          "Budget Proposal":
            "BUDGET",

          Disbursement:
            "DISB",

          Collections:
            "COL",

        };

        const prefix =

          prefixMap[
            document_type
          ] || "DOC";

        const documentId =

          `${prefix}-${currentYear}-${sequence}`;

          const templateFileName =
    getTemplateFileName(
      document_type
    );

        // SAVE DATABASE
        const newFile =
          await prisma.files.create({

            data: {

              document_id:
                documentId,

              title,

              category,

              inventory_id:
                Number(
                  inventory_id
                ),

              access_code,

              subject,

              document_type,

              memo_date:
                memo_date
                ? new Date(
                    memo_date
                  )
                : null,

              received_date:
                received_date
                ? new Date(
                    received_date
                  )
                : null,

              file_name:
                templateFileName,

              file_path:
                `src/uploads/${templateFileName}`,


              dynamic_data:
                dynamicData,

              is_deleted:
                false,

              status:
                "Active",

                uploaded_by:
                req.user.id,

            },

          });

          console.log(
    "NEW FILE:",
    newFile
  );

        // WRITE TO EXCEL
        await appendToExcel(
    document_type,
    {
      ...req.body,
      document_id: documentId
    }
  );

  console.log(
    "Excel updated successfully"
  );

  // CREATE ACTIVITY LOG
  await logsService.createLog(

    "GENERATE",

    `Generated ${document_type}`,

    req.user.id

  );

  res.status(201)
    .json({

            message:
              "Document generated successfully",

            file:
              newFile,

          });

      } catch (error) {

        console.error(error);

        res.status(500)
          .json({

            message:
              "Failed to generate document",

          });
      }
    };

  // GET FILES
  exports.getAllFiles =
    async (req, res) => {

      try {

        let files;

        // ADMIN CAN SEE ALL FILES
        if (
          req.user.role === "Admin"
        ) {

          files =
            await prisma.files.findMany({

              include: {

                user: {

                  select: {

                    email: true,
                    name: true,

                  },

                },

                inventory: true,

              },

              orderBy: {

                id: "desc",

              },

            });

        }

        // USER CAN SEE ONLY OWN FILES
        else {

          files =
            await prisma.files.findMany({

              where: {

                uploaded_by:
                  req.user.id,

              },

              include: {

                user: {

                  select: {

                    email: true,
                    name: true,

                  },

                },

              },

              orderBy: {

                id: "desc",

              },

            });

        }

        res.json(files);

      } catch (error) {

        console.error(error);

        res.status(500).json({

          message:
            "Failed to fetch files",

        });

      }

    };

  // DELETE FILE
  exports.deleteFile =
    async (req, res) => {

      try {

        const id =
          Number(
            req.params.id
          );

        const file =
          await prisma.files.findUnique({

            where: { id },

          });

          if (!file) {

    return res.status(404).json({

      message:
        "File not found",

    });

  }

          // ADMIN CAN DELETE ANY FILE
  if (
    req.user.role !== "Admin"
    &&
    file.uploaded_by !== req.user.id
  ) {

    return res.status(403).json({

      message:
        "Access denied",

    });

  }


        // SOFT DELETE
        await prisma.files.update({

          where: { id },

          data: {

            is_deleted:
              true,

            status:
              "Deleted",

          },

        });

        if (file.inventory_id) {

    await prisma.inventory.update({

      where: {
        id: file.inventory_id,
      },

      data: {

        used_space: {
          decrement: 1,
        },

      },

    });

  }

        // CREATE ACTIVITY LOG
  await logsService.createLog(

    "DELETE",

    `Deleted ${file.document_type}`,

    req.user.id

  );

        res.json({

          message:
            "File deleted successfully",

        });

      } catch (error) {

        console.error(error);

        res.status(500)
          .json({

            message:
              "Failed to delete file",

          });
      }
    };

  // RESTORE FILE
  exports.restoreFile =
    async (req, res) => {

      try {

        const id =
          Number(
            req.params.id
          );

          const file =
    await prisma.files.findUnique({

      where: { id },

    });

    if (!file) {

    return res.status(404).json({

      message:
        "File not found",

    });

  }

  if (

    req.user.role !== "Admin"

    &&

    file.uploaded_by !==
      req.user.id

  ) {

    return res.status(403).json({

      message:
        "Access denied",

    });

  }

        const restoredFile =
    await prisma.files.update({

      where: { id },

      data: {

        is_deleted:
          false,

        status:
          "Active",

      },

    });

    if (file.inventory_id) {

    await prisma.inventory.update({

      where: {
        id: file.inventory_id,
      },

      data: {

        used_space: {
          increment: 1,
        },

      },

    });

  }

  await logsService.createLog(

    "RESTORE",

    `Restored ${restoredFile.document_type}`,

    req.user.id

  );
        res.json({

          message:
            "File restored successfully",

        });

      } catch (error) {

        console.error(error);

        res.status(500)
          .json({

            message:
              "Failed to restore file",

          });
      }
    };

    // PERMANENT DELETE
  exports.permanentDeleteFile =
    async (req, res) => {

      try {

        const id =
          Number(req.params.id);

          const file =
    await prisma.files.findUnique({

      where: { id },

    });

    if (!file) {

    return res.status(404).json({

      message:
        "File not found",

    });

  }

  if (

    req.user.role !== "Admin"

  ) {

    return res.status(403).json({

      message:
        "Only Admin can permanently delete files",

    });

  }

      const deletedFile =
    await prisma.files.delete({

      where: { id }

    });

  await logsService.createLog(

    "PERMANENT DELETE",

    `Permanently deleted ${deletedFile.document_type}`,

    req.user.id 

  );

        res.json({

          message:
            "File permanently deleted"

        });

      } catch (error) {

        console.error(error);

        res.status(500).json({

          message:
            "Permanent delete failed"

        });

      }

  };

  exports.assignCabinet =
  async (req, res) => {

    try {

      const fileId =
        Number(req.params.id);

      const {
        inventory_id
      } = req.body;

      const inventory =
    await prisma.inventory.findUnique({

      where: {
        id: Number(inventory_id)
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

    inventory.files.length >=

    inventory.folder_count

  ) {

    return res.status(400).json({

      message:
        "Cabinet is already full"

    });

  }

      const file =
        await prisma.files.findUnique({

          where: {
            id: fileId
          }

        });

      if (!file) {

        return res.status(404).json({

          message:
            "File not found"

        });

      }
  // MOVE FILE IF ALREADY ASSIGNED
  if (file.inventory_id) {

    // same cabinet
    if (

      file.inventory_id ===
      Number(inventory_id)

    ) {

      return res.status(400).json({

        message:
          "File is already in this cabinet"

      });

    }

    await prisma.files.update({

      where: {
        id: fileId
      },

      data: {

        inventory_id:
          Number(inventory_id)

      }

    });

    await logsService.createLog(

      "MOVE",

      `Moved ${file.document_type} to another cabinet`,

      req.user.id

    );

    return res.json({

      message:
        "File moved successfully"

    });

  }

      await prisma.files.update({

        where: {
          id: fileId
        },

        data: {

          inventory_id:
            Number(
              inventory_id
            )

        }

      });

      await prisma.inventory.update({

        where: {
          id:
            Number(
              inventory_id
            )
        },

        data: {

          used_space: {
            increment: 1
          }

        }

      });

      await logsService.createLog(

        "ASSIGN",

        `Assigned ${file.document_type} to cabinet`,

        req.user.id

      );

      res.json({

        message:
          "File assigned successfully"

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        message:
          "Assignment failed"

      });

    }

  };

  // UPLOAD LEGACY DOCUMENT
exports.uploadLegacyFile = async (req, res) => {

  try {

   const imagePath = path.join(
  __dirname,
  "../../uploads",
  req.file.filename
);

const result = await Tesseract.recognize(
  imagePath,
  "eng"
);

const extractedText = result.data.text;

console.log("OCR RESULT:");
console.log(extractedText);

const savedFile = await prisma.files.create({

  data: {

    title: "Legacy OCR Document",

    category: "Legacy Documents",

    file_name: req.file.filename,

    file_path: req.file.path,

    uploaded_by: req.user.id,

    ocr_text: extractedText,

    status: "Active",

  },

});

return res.json({

  success: true,

  message: "Legacy document uploaded successfully.",

  file: savedFile,

});

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Legacy upload failed."

    });

  }

};