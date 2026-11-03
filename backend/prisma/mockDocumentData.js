/**
 * mockDocumentData.js
 * Generates realistic institutional records for all 63 ZPPSU document types.
 * Spans diverse academic years (2022-2026), calendar months (Jan-Dec),
 * and official state university offices/regulatory agencies.
 */

const { documentCategories, documentConfigs } = require('../../frontend/src/utils/documentConfigs.js');

const PROGRAMS = [
  "BS Information Technology",
  "BS Computer Science",
  "BS Civil Engineering",
  "BS Mechanical Engineering",
  "BS Electrical Engineering",
  "BTVTED - Food Service Management",
  "BTVTED - Electrical Technology",
  "BS Hospitality Management"
];

const AGENCIES = [
  "CHED Regional Office IX",
  "Civil Service Commission - Zamboanga Field Office",
  "Commission on Audit (COA) - SUC Cluster",
  "Department of Science and Technology (DOST IX)",
  "Department of Budget and Management (DBM IX)",
  "Zamboanga City Local Government Unit (LGU)",
  "Technical Education and Skills Development Authority (TESDA IX)"
];

const FACULTY = [
  "Dr. Maria Elena Santos",
  "Prof. Renato Astrologo",
  "Engr. Roberto D. Alvarez",
  "Dr. Fatima Nur Alih",
  "Prof. Christopher Ramos",
  "Dr. Evelyn Tan-Guingona",
  "Engr. Danica Flores"
];

const STUDENTS = [
  "Mark Joseph Alvarez",
  "Sarah Mae Mendoza",
  "Joshua Kyle Fernandez",
  "Bea Angela Reyes",
  "Christian Paul Lim",
  "Princess Dianne Morales",
  "John Michael De Guzman",
  "Alyssa Nicole Ramos"
];

const DATES_POOL = [
  { year: 2022, month: 2, day: 15 },
  { year: 2022, month: 6, day: 20 },
  { year: 2022, month: 10, day: 8 },
  { year: 2023, month: 1, day: 12 },
  { year: 2023, month: 4, day: 25 },
  { year: 2023, month: 8, day: 14 },
  { year: 2023, month: 11, day: 30 },
  { year: 2024, month: 2, day: 10 },
  { year: 2024, month: 5, day: 18 },
  { year: 2024, month: 7, day: 22 },
  { year: 2024, month: 9, day: 5 },
  { year: 2024, month: 12, day: 15 },
  { year: 2025, month: 1, day: 20 },
  { year: 2025, month: 3, day: 14 },
  { year: 2025, month: 6, day: 19 },
  { year: 2025, month: 8, day: 28 },
  { year: 2025, month: 11, day: 11 },
  { year: 2026, month: 1, day: 16 },
  { year: 2026, month: 2, day: 24 },
  { year: 2026, month: 3, day: 10 },
  { year: 2026, month: 4, day: 5 },
];

function pad(num, size = 2) {
  return String(num).padStart(size, '0');
}

function formatLocationWithColorName(rawLocation = "") {
  const COLOR_MAP = {
    "#6b1d2a": "Maroon",
    "#c99a2e": "Gold",
    "#a87818": "Gold",
    "#1e293b": "Navy",
    "#2563eb": "Royal Blue",
    "#b91c1c": "Crimson",
    "#0f766e": "Teal",
    "#7e22ce": "Purple",
    "#475569": "Slate",
    "#c2410c": "Orange"
  };
  return rawLocation.replace(/\[color:([^\]]+)\]/gi, (match, colorVal) => {
    const clean = colorVal.trim().toLowerCase();
    const name = COLOR_MAP[clean] || (clean.startsWith("#") ? "" : clean);
    return name ? `(${name})` : "";
  }).replace(/\s+/g, " ").trim();
}

function generateMockRecord(docType, category, index, storageLocation) {
  const dateObj = DATES_POOL[index % DATES_POOL.length];
  const dateStr = `${dateObj.year}-${pad(dateObj.month)}-${pad(dateObj.day)}`;
  const jsDate = new Date(Date.UTC(dateObj.year, dateObj.month - 1, dateObj.day, 8, 30, 0));

  const prefix = category === "Administrative" ? "ADM" : category === "Academic" ? "ACAD" : "FIN";
  const seq = pad(index + 1, 4);
  const accessCode = `ZPPSU-${prefix}-${dateObj.year}-${seq}`;
  const docId = `DOC-${dateObj.year}-${seq}`;
  const cleanLocation = formatLocationWithColorName(storageLocation.displayText);

  const prog = PROGRAMS[index % PROGRAMS.length];
  const agency = AGENCIES[index % AGENCIES.length];
  const faculty = FACULTY[index % FACULTY.length];
  const student = STUDENTS[index % STUDENTS.length];
  const amount = `₱${((index + 1) * 12500 + 45000).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  const memoNum = `ZPPSU-MO-${dateObj.year}-${pad((index % 30) + 1, 3)}`;
  const semYear = `AY ${dateObj.year}-${dateObj.year + 1}, ${index % 2 === 0 ? "1st" : "2nd"} Semester`;

  // Dynamic field resolution based on document type
  const dynamicData = {
    date: dateStr,
    access_code: accessCode,
    file_location: cleanLocation,
    subject: `Official Filing of ${docType.trim()} - Ref: ${seq}`,
    action_taken: "Processed and officially filed in accordance with RA 9470 Archival Guidelines",
    tracking_details: `Forwarded to Records Unit • Approved by Department Head • Box ID: ${storageLocation.boxName}`,
    program: prog,
    student_name: student,
    name_of_faculty: faculty,
    faculty_name: faculty,
    name: index % 2 === 0 ? student : faculty,
    personnel: faculty,
    personnel_name: faculty,
    agency: agency,
    concerned_agency: agency,
    requesting_party: agency,
    payee: `${faculty} / Supplier Unit ${pad((index % 5) + 1)}`,
    amount: amount,
    fiscal_year: `FY ${dateObj.year}`,
    year_and_proposed_budget: `FY ${dateObj.year}: ${amount}`,
    zppsu_memo_number: memoNum,
    academic_year: `AY ${dateObj.year}-${dateObj.year + 1}`,
    semester_year: semYear,
    semester_school_year: semYear,
    semester: index % 2 === 0 ? "1st Semester" : "2nd Semester",
    particulars: `Operational allocation and documentation for ${docType.trim()}`,
    receivables_from: `Tuition & Assessment Accounts (${prog})`,
    period: `${dateStr} to ${dateObj.year}-12-31`,
    agenda_and_date: `Executive Meeting on Institutional Standards • ${dateStr}`,
    year: String(dateObj.year),
    items: `Procured ICT and Office Consumables for ${prog}`,
    semester_school_year_course_year: `${semYear} - ${prog} (Year ${(index % 4) + 1})`,
    school_year_semester: semYear,
    offenses: index % 3 === 0 ? "Late submission of clearances" : "None / Good Standing Record",
    assigned_school: `ZPPSU Laboratory High School / DepEd ZC Division`,
    course_and_year: `${prog} - 4th Year`,
    title_of_thesis: `Automated Archival & Workflow Optimization for State Universities (Case Study: ZPPSU)`,
    donor: `ZPPSU Alumni Association & Industry Partner Foundation`,
    title_of_donation: `Donation of Computer Laboratory Server & Storage Hardware`,
    concerned_personnel: faculty
  };

  // Specific descriptive subject customization
  if (docType.includes("AACCUP")) {
    dynamicData.subject = `AACCUP Institutional Survey & Recommendations for ${prog}`;
  } else if (docType.includes("BOARD RESOLUTIONS")) {
    dynamicData.subject = `Board Resolution No. ${dateObj.year}-${pad(index + 1)}: Adoption of Modernized Archiving Guidelines`;
  } else if (docType.includes("CHED")) {
    dynamicData.subject = `CHED Regulatory Compliance & Academic Directives for AY ${dateObj.year}-${dateObj.year + 1}`;
  } else if (docType.includes("COA")) {
    dynamicData.subject = `COA Compliance Review on Equipment Inventory & Property Management`;
  } else if (docType.includes("BUDGET")) {
    dynamicData.subject = `Proposed Budget Allocation for Student Affairs and Guidance Services`;
  } else if (docType.includes("Thesis")) {
    dynamicData.subject = `Undergraduate Research Thesis: ${dynamicData.title_of_thesis}`;
  } else if (docType.includes("Admission")) {
    dynamicData.subject = `Student Admission Docket & Entrance Credentials for ${student}`;
  } else if (docType.includes("Free Higher Education")) {
    dynamicData.subject = `UniFAST Billing & Free Higher Education Subsidy Manifest for ${semYear}`;
  }

  // 5 out of 63 archived for realistic variety
  const isArchived = (index % 12 === 0);

  return {
    title: dynamicData.subject,
    category: category,
    document_type: docType,
    access_code: accessCode,
    document_id: docId,
    subject: dynamicData.subject,
    memo_date: jsDate,
    received_date: jsDate,
    created_at: jsDate,
    status: isArchived ? "Archived" : "Active",
    is_deleted: false,
    file_name: `${docId}_${docType.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
    file_path: `/uploads/${dateObj.year}/${docId}.pdf`,
    dynamic_data: dynamicData,
    file_box_id: storageLocation.fileBoxId
  };
}

function getAll63MockRecords(storageLocations) {
  const records = [];
  let globalIndex = 0;

  for (const [category, docTypes] of Object.entries(documentCategories)) {
    for (const docType of docTypes) {
      const storageLocation = storageLocations[globalIndex % storageLocations.length];
      const record = generateMockRecord(docType, category, globalIndex, storageLocation);
      records.push(record);
      globalIndex++;
    }
  }

  return records;
}

module.exports = {
  getAll63MockRecords
};
