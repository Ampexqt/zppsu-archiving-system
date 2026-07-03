const ExcelJS = require("exceljs");

const path =
  require("path");

  const fs = require("fs");

// TEMPLATE CONFIGS
const templateConfigs = {

  "Students Thesis": {

    fileName:
      "MASTERLIST FORMAT FOR STUDENTS THESIS.xlsx",

    startRow: 4,

    fields: {

      access_code: "A",

      student_name: "B",

      title_of_thesis: "C",

      file_location: "D",

    },

  },

  "AACCUP Findings and Recommendations": {

    fileName:
      "MASTERLIST FORMAT FOR AACCUP FINDING S AND RECOMMENDATIONS.xlsx",

    startRow: 4,

    fields: {

      access_code: "A",

      program: "B",

      file_location: "C",

    },

  },

  "AACCUP Findings and Recommendations": {

    fileName:
      "MASTERLIST FORMAT FOR AACCUP FINDING S AND RECOMMENDATIONS.xlsx",

    startRow: 4,

    fields: {

      access_code: "A",

      program: "B",

      file_location: "C",

    },

  },


  "Memorandum": {

  fileName:
    "MASTERLIST FORMAT FOR MEMORANDUM (OTHER MATTERS).xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    zppsu_memo_number: "C",

    subject: "D",

    personnel: "E",

    file_location: "F",

  },

},

"Checks Issued": {

  fileName:
    "MASTERLIST FORMAT FOR CHECKS ISSUED.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    payee: "B",

    amount: "C",

    file_location: "D",

  },

},

"CHED COMMUNICATIONS 2024": {

  fileName:
    "MASTERLIST FORMAT FOR CHED COMMUNICATIONS 2024.xlsx",

  startRow: 4,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    action_taken: "D",

    file_location: "E",

  },

},

"ACCOMPLISHMENT REPORTS": {

  fileName:
    "MASTERLIST FORMAT FOR ACCOMPLISHMENT REPORTS.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    subject: "B",

    file_location: "C",

  },

},

"ANNUAL REPORTS": {

  fileName:
    "MASTERLIST FORMAT FOR ANNUAL REPORTS.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    subject: "B",

    file_location: "C",

  },

},

"ASSESSMENT RECORDS OF STUDENTS": {

  fileName:
    "MASTERLIST FORMAT FOR ASSESSMENT RECORDS OF STUDENTS.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    student_name: "B",

    file_location: "C",

  },

},

"BOARD RESOLUTIONS": {

  fileName:
    "MASTERLIST FORMAT FOR BOARD RESOLUTIONS.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    subject: "B",

    file_location: "C",

  },

},

"BUDGET PLAN": {

  fileName:
    "MASTERLIST FORMAT FOR BUDGET PLANx.xlsx",

  startRow: 5,

  fields: {

    access_code: "A",

    year_and_proposed_budget: "B",

    file_location: "C",

  },

},

"BUDGET PROPOSALS": {

  fileName:
    "MASTERLIST FORMAT FOR BUDGET PROPOSALS.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    fiscal_year: "B",

    file_location: "C",

  },

},

"BUDGETARY REQUIREMENTS": {

  fileName:
    "MASTERLIST FORMAT FOR BUDGETARY REQUIREMENTS.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    fiscal_year: "B",

    file_location: "C",

  },

},

"CHED Memorandum Orders 2024": {

  fileName:
    "MASTERLIST FORMAT FOR CHED MEMORANDUM ORDERS 2024.xlsx",

  startRow: 4,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    action_taken: "D",

    file_location: "E",

  },

},

"Class Program": {

  fileName:
    "MASTERLIST FORMAT FOR CLASS PROGRAM.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    name_of_faculty: "B",

    academic_year: "C",

    file_location: "D",

  },

},

"COA Annual Reports 2024": {

  fileName:
    "MASTERLIST FORMAT FOR COA ANNUAL REPORTS 2024.xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    action_taken: "D",

    file_location: "E",

  },

},

"COA Audit Observation 2024": {

  fileName:
    "MASTERLIST FORMAT FOR COA AUDIT OBSERVATION 2024.xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    action_taken: "D",

    file_location: "E",

  },

},

"COA Circulars": {

  fileName:
    "MASTERLIST FORMAT FOR COA CIRCULARS.xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    file_location: "D",

  },

},

"COA Communications 2024": {

  fileName:
    "MASTERLIST FORMAT FOR COA COMMUNICATIONS 2024.xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    action_taken: "D",

    file_location: "E",

  },

},

"COA NOTICE OF DISALLOWANCES 2024": {

  fileName:
    "MASTERLIST FORMAT FOR COA NOTICE OF DISALLOWANCES 2024.xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    action_taken: "D",

    file_location: "E",

  },

},

"COA NOTICE OF SUSPENSION 2024": {

  fileName:
    "MASTERLIST FORMAT FOR COA NOTICE OF SUSPENSION 2024.xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    action_taken: "D",

    file_location: "E",

  },

},

"Master List of Records for Collection": {
  fileName: "MASTERLIST FORMAT FOR COLLECTIONS.xlsx",

  startRow: 4,

  fields: {
    access_code: "A",
    receivables_from: "B",
    amount: "C",
    file_location: "D",
  },
},

"COPC": {

  fileName:
    "MASTERLIST FORMAT FOR COPC.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    program: "B",

    file_location: "C",

  },

},

"CSC Circulars": {

  fileName:
    "MASTERLIST FORMAT FOR CSC CIRCULARS1.xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    file_location: "D",

  },

},

"CSC Communications 2024": {

  fileName:
    "MASTERLIST FORMAT FOR CSC COMMUNICATIONS 2024.xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    action_taken: "D",

    file_location: "E",

  },

},

"Data Analysis": {

  fileName:
    "MASTERLIST FORMAT FOR DATA ANALYSISx.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    subject: "B",

    file_location: "C",

  },

},

"DBM Circulars": {

  fileName:
    "MASTERLIST FORMAT FOR DBM CIRCULARS.xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    action_taken: "D",

    zppsu_memo_number: "E",

    file_location: "F",

  },

},

"DBM Communications 2024": {

  fileName:
    "MASTERLIST FORMAT FOR DBM COMMUNICATIONS 2024.xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    tracking_details: "D",

    file_location: "E",

  },

},

"Disbursements": {

  fileName:
    "MASTERLIST FORMAT FOR DISBURSEMENTS.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    particulars: "B",

    amount: "C",

    file_location: "D",

  },

},

"DOST Communications": {

  fileName:
    "MASTERLIST FORMAT FOR DOST COMMUNICATIONS 2024.xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    action_taken: "D",

    file_location: "E",

  },

},

"HEMIS ": {

  fileName:
    "MASTERLIST FORMAT FOR HEMIS .xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    semester_school_year: "B",

    tracking_details: "C",

    file_location: "D",

  },

},

"Individual Daily Program IDP": {

  fileName:
    "MASTERLIST FORMAT FOR IDPx.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    name_of_faculty: "B",

    semester_year: "C",

    file_location: "D",

  },

},


"Incoming Communications Outside ZC Perimeter": {

  fileName:
    "MASTERLIST FORMAT FOR INCOMING COMMUNICATIONS WITHIN ZC PERIMETER (REVISED).xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    agency: "C",

    subject: "D",

    action_taken: "E",

    file_location: "F",

  },

},

"Incoming Communications Within ZC": {

  fileName:
    "MASTERLIST FORMAT FOR INCOMING COMMUNICATIONS WITHIN ZC.xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    action_taken: "D",

    file_location: "E",

  },

},

"IPCR": {

  fileName:
    "MASTERLIST FORMAT FOR IPCRx.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    name_of_faculty: "B",

    semester_year: "C",

    file_location: "D",

  },

},

"Job Order Workers": {

  fileName:
    "MASTERLIST FORMAT FOR JOB ORDERSx.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    name: "B",

    period: "C",

    file_location: "D",

  },

},

"Manuals of Operations": {

  fileName:
    "MASTERLIST FORMAT FOR MANUALS.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    subject: "B",

    file_location: "C",

  },

},

"Medical Records for Students": {

  fileName:
    "MASTERLIST FORMAT FOR MEDICAL RECORDS OF BSIT STUDENTS.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    name: "B",

    file_location: "C",

  },

},

"Minutes of Meetings": {

  fileName:
    "MASTERLIST FORMAT FOR MINUTES OF MEETINGSx.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    agenda_and_date: "B",

    file_location: "C",

  },

},

"MOA/MOU Records": {

  fileName:
    "MASTERLIST FORMAT FOR MOAs.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    agency: "B",

    subject: "C",

    file_location: "D",

  },

},

"Notice of Salary Adjustment (NOSA)": {

  fileName:
    "MASTERLIST FORMAT FOR NOTICE OF SALARY ADJUSTMENT (NOSA).xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    personnel_name: "B",

    year: "C",

    file_location: "D",

  },

},

"SALN Records": {

  fileName:
    "MASTERLIST FORMAT FOR NOTICE OF SALN.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    personnel_name: "B",

    year: "C",

    file_location: "D",

  },

},

"Notice of Step Increment (NSI)": {

  fileName:
    "MASTERLIST FORMAT FOR NOTICE OF STEP INCREMENTS.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    personnel_name: "B",

    year: "C",

    file_location: "D",

  },

},

"Offenses and Violations": {

  fileName:
    "MASTERLIST FORMAT FOR OFFENSES AND VIOLATIONS.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    student_name: "B",

    school_year_semester: "C",

    offenses: "D",

    file_location: "E",

  },

},

"Outgoing Communications Outside ZC Perimeter": {

  fileName:
    "MASTERLIST FORMAT FOR OUTGONG COMMUNICATIONS OUTSIDE ZC PERIMETER 2024.xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    concerned_agency: "C",

    subject: "D",

    tracking_details: "E",

    file_location: "F",

  },

},

"Portfolio of Faculty": {

  fileName:
    "MASTERLIST FORMAT FOR PORTFOLIO OF FACULTY.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    faculty_name: "B",

    file_location: "C",

  },

},

"Purchase Requests": {

  fileName:
    "MASTERLIST FORMAT FOR PURCHASE REQUESTS .xlsx",

  startRow: 4,

  fields: {

    date: "A",

    access_code: "B",

    items: "C",

    amount: "D",

    file_location: "E",

  },

},

"Report of Ratings": {

  fileName:
    "MASTERLIST FORMAT FOR REPORT OF RATINGSx.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    semester_school_year_course_year: "B",

    file_location: "C",

  },

},

"Request Letter Memorandum (RLM)": {

  fileName:
    "MASTERLIST FORMAT FOR RLM.xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    action_taken: "D",

    file_location: "E",

  },

},

"Special Orders": {

  fileName:
    "MASTERLIST FORMAT FOR SPECIAL ORDERx.xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    personnel: "D",

    file_location: "E",

  },

},

"Student Admission Records": {

  fileName:
    "MASTERLIST FORMAT FOR STUDENT ADMISSIONN RECORDSx.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    student_name: "B",

    semester_year: "C",

    file_location: "D",

  },

},

"Students In/Off Campus Teaching": {

  fileName:
    "MASTERLIST FORMAT FOR STUDENTS IN AND OFF CAMPUS TEACHING.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    student_name: "B",

    assigned_school: "C",

    file_location: "D",

  },

},

"Students Prospectus": {

  fileName:
    "MASTERLIST FORMAT FOR STUDENTS PROSPECTUS.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    course_and_year: "B",

    file_location: "C",

  },

},

"Students Apprenticeship And Expo (APEX)": {

  fileName:
    "MASTERLIST FORMAT FOR STUDENTS_ APEX.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    student_name: "B",

    course_and_year: "C",

    file_location: "D",

  },

},

"Teaching Load": {

  fileName:
    "MASTERLIST FORMAT FOR TEACHING LOAD.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    faculty_name: "B",

    academic_year: "C",

    file_location: "D",

  },

},

"Trainings And Seminars": {

  fileName:
    "MASTERLIST FORMAT FOR TRAININGS AND SEMINARS.xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    personnel: "D",

    zppsu_memo_number: "E",

    file_location: "F",

  },

},

"Various Records": {

  fileName:
    "MASTERLIST FORMAT FOR VARIOUS RECORDS.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    subject: "B",

    file_location: "C",

  },

},

"Verification Request": {

  fileName:
    "MASTERLIST FORMAT FOR VERIFICATION REQUEST.xlsx",

  startRow: 4,

  fields: {

    date: "A",

    access_code: "B",

    requesting_party: "C",

    student_name: "D",

    action_taken: "E",

    file_location: "F",

  },

},

"VPAA Memoranda": {

  fileName:
    "MASTERLIST FORMAT FOR VPAA MEMORANDUMx.xlsx",

  startRow: 4,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    personnel: "D",

    file_location: "E",

  },

},

"VPAF Indorsements": {

  fileName:
    "MASTERLIST FORMAT FOR VPAF INDORSEMENTS.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    subject: "B",

    concerned_personnel: "C",

    file_location: "D",

  },

},

"VPAF Memorandum": {

  fileName:
    "MASTERLIST FORMAT FOR VPAF MEMORANDUMx.xlsx",

  startRow: 5,

  fields: {

    date: "A",

    access_code: "B",

    subject: "C",

    personnel: "D",

    file_location: "E",

  },

},

"Fordeed of Donations": {

  fileName:
    "MASTERLIST FORMAT FORDEED OF DONATIONS.xlsx",

  startRow: 4,

  fields: {

    access_code: "A",

    donor: "B",

    title_of_donation: "C",

    file_location: "D",

  },

},

"Free Higher Education Billing Details": {

  fileName:
    "MASTERLIST FORMAT FREE HIGHER EDUC BILLING .xlsx",

  startRow: 4,

  fields: {

    date: "A",

    access_code: "B",

    semester: "C",

    action_taken: "D",

    file_location: "E",

  },

},





};

  // GET TEMPLATE PATH
  const getTemplatePath = (documentType) => {

    
    

      const config = templateConfigs[documentType];
    
    

      if (!config) {
          throw new Error(`No config found for ${documentType}`);
      }

      return path.join(
          __dirname,
          "../../templates",
          config.fileName
      );
  };

  // FIND NEXT EMPTY ROW
  const findNextRow = (
    worksheet,
    firstColumn,
    startRow
  ) => {

    let row = startRow;

    while (
      worksheet.getCell(
        `${firstColumn}${row}`
      ).value
    ) {
      row++;
    }

    return row;
  };

  // APPEND TO EXCEL
  const appendToExcel =
  async (
    documentType,
    data
  ) => {
      try {

        const config =

          templateConfigs[
            documentType
          ];

        if (!config) {

          console.log(
            "No template config found"
          );

          return;
        }

        const templatePath =

          getTemplatePath(
            documentType
          );

        // READ EXCEL
      const outputPath = path.join(
    __dirname,
    "../uploads",
    config.fileName
  );

  if (!fs.existsSync(outputPath)) {

    fs.copyFileSync(
      templatePath,
      outputPath
    );

  }

  const workbook =
    new ExcelJS.Workbook();

  await workbook.xlsx.readFile(
    outputPath
  );

  const worksheet =
    workbook.getWorksheet("Sheet1");

  console.log(
    "SHEET1 DIMENSIONS:",
    worksheet.dimensions
  );

  console.log(
    "SHEET1 ACTUAL ROW COUNT:",
    worksheet.actualRowCount
  );

  console.log(
    "SHEET1 ACTUAL COLUMN COUNT:",
    worksheet.actualColumnCount
  );

    console.log(
    "ROW4 VALUES:",
    worksheet.getRow(4).values
  );

  console.log(
    "ROW4 CELL COUNT:",
    worksheet.getRow(4).cellCount
  );



        // GET FIELDS
        const currentMapping =

          config.fields;

        // FIRST COLUMN
        const firstColumn =

          Object.values(
            currentMapping
          )[0];

        // FIND NEXT ROW
        const row =
          findNextRow(

            worksheet,

            firstColumn,

            config.startRow

          );

        // WRITE DATA
        Object.keys(
          currentMapping
        ).forEach((field) => {

          const column =

            currentMapping[
              field
            ];

        const value =
    data[field] ?? "";


  worksheet.getCell(
    `${column}${row}`
  ).value =
    String(value);
        }); 

        console.log(
    "SHEETS BEFORE SAVE:",
    workbook.worksheets.map(ws => ws.name)
  );

        // SAVE FILE
      await workbook.xlsx.writeFile(
    outputPath
  );



        console.log(
          `${documentType} updated successfully`
        );

      } catch (error) {

        console.error(
          "Excel error:",
          error
        );
      }
    };

  module.exports = {

  appendToExcel,

  getTemplateFileName:
    (documentType) => {

      const config =
        templateConfigs[
          documentType
        ];

      return config
        ? config.fileName
        : null;
    },

};