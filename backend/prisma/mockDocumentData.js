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
    file_type: "OFFICIAL_RECORD",
    is_generated: true,
    document_id: docId,
    subject: dynamicData.subject,
    memo_date: jsDate,
    received_date: jsDate,
    created_at: jsDate,
    status: isArchived ? "Archived" : "Active",
    is_deleted: false,
    file_name: null,
    file_path: null,
    dynamic_data: dynamicData,
    file_box_id: storageLocation.fileBoxId
  };
}

// 28 authentic academic and guidance counseling Accomplishment Reports spanning Jan - Dec across 2024, 2025, and 2026
const ACCOMPLISHMENT_REPORTS_DATA = [
  // --- 2024 COMPLETE 12-MONTH CALENDAR (JANUARY TO DECEMBER) ---
  {
    year: 2024, month: 1, day: 15,
    monthName: "JANUARY",
    subject: "Guidance & Counseling Center Q1 Institutional Work & Financial Accomplishment Report FY 2024",
    action_taken: "Approved by OSAS Director; transmitted to Planning & Development Office"
  },
  {
    year: 2024, month: 2, day: 22,
    monthName: "FEBRUARY",
    subject: "Freshmen Orientation & Psychological Appraisal Services Accomplishment Report - 2nd Semester AY 2023-2024",
    action_taken: "Student psychometric profiles verified and filed in Guidance Archive"
  },
  {
    year: 2024, month: 3, day: 18,
    monthName: "MARCH",
    subject: "National Women's Month Gender-Responsive Student Counseling & Wellness Outreach Accomplishment Report",
    action_taken: "Conducted GAD-funded counseling seminars; participant evaluations archived"
  },
  {
    year: 2024, month: 4, day: 25,
    monthName: "APRIL",
    subject: "College Career Guidance & Graduating Students Exit Interview Analytics Accomplishment Report 2024",
    action_taken: "Exit interview dataset summarized for institutional CHED tracer submission"
  },
  {
    year: 2024, month: 5, day: 20,
    monthName: "MAY",
    subject: "Student Academic Deficiency Remediation & Midterm Counseling Monitoring Accomplishment Report AY 2023-2024",
    action_taken: "Consulted 86 students on academic probation; individual plans endorsed"
  },
  {
    year: 2024, month: 6, day: 28,
    monthName: "JUNE",
    subject: "Mid-Year Guidance Program Evaluation & Guidance Committee Institutional Accomplishment Report 2024",
    action_taken: "Semi-annual audit submitted to Vice President for Academic Affairs"
  },
  {
    year: 2024, month: 7, day: 19,
    monthName: "JULY",
    subject: "Special Needs Student Accommodation & Accessibility Services Accomplishment Report AY 2023-2024",
    action_taken: "Learning adjustments documented and confirmed by College Deans"
  },
  {
    year: 2024, month: 8, day: 26,
    monthName: "AUGUST",
    subject: "New Academic Year Student Intake & Initial Psychological Screening Accomplishment Report AY 2024-2025",
    action_taken: "Intake interviews completed for incoming first-year cohort across 8 colleges"
  },
  {
    year: 2024, month: 9, day: 16,
    monthName: "SEPTEMBER",
    subject: "Suicide Prevention & Mental Health Awareness Campus Campaign Accomplishment Report 2024",
    action_taken: "Campus-wide awareness campaign executed in compliance with RA 11036"
  },
  {
    year: 2024, month: 10, day: 24,
    monthName: "OCTOBER",
    subject: "Peer Facilitators Guild Leadership Training & Youth Counseling Camp Accomplishment Report 2024",
    action_taken: "Certified 45 student peer counselors; roster endorsed to Student Affairs"
  },
  {
    year: 2024, month: 11, day: 21,
    monthName: "NOVEMBER",
    subject: "Pre-Employment Seminar & Mock Job Interview Workshop Series Accomplishment Report 2024",
    action_taken: "Conducted with DOLE and PESO Zamboanga; 620 senior students trained"
  },
  {
    year: 2024, month: 12, day: 18,
    monthName: "DECEMBER",
    subject: "Guidance Center Year-End Comprehensive Performance & Target Delivery Accomplishment Report FY 2024",
    action_taken: "Certified 100% OPCR milestone delivery by Director, Guidance & Counseling"
  },

  // --- 2025 COMPLETE 12-MONTH CALENDAR (JANUARY TO DECEMBER) ---
  {
    year: 2025, month: 1, day: 17,
    monthName: "JANUARY",
    subject: "Guidance Center Q1 Operational Work Plan & Counseling Services Accomplishment Report FY 2025",
    action_taken: "Quality objectives confirmed aligned with ISO 9001:2015 institutional standards"
  },
  {
    year: 2025, month: 2, day: 20,
    monthName: "FEBRUARY",
    subject: "Psychological Test Administration & Standardized IQ/Aptitude Profiling Accomplishment Report 2025",
    action_taken: "Standardized psychometric profiles interpreted and secured in archival storage"
  },
  {
    year: 2025, month: 3, day: 14,
    monthName: "MARCH",
    subject: "Crisis Intervention & Trauma-Informed Student Support Operations Accomplishment Report 2025",
    action_taken: "Urgent student counseling cases handled and medical referrals coordinated"
  },
  {
    year: 2025, month: 4, day: 22,
    monthName: "APRIL",
    subject: "Annual Job Fair & Career Placement Counseling Summit Accomplishment Report 2025",
    action_taken: "38 participating employers; 114 graduates received on-the-spot hiring recommendations"
  },
  {
    year: 2025, month: 5, day: 27,
    monthName: "MAY",
    subject: "Routine Individual Consultation & Confidential Counseling Case Log Accomplishment Report AY 2024-2025",
    action_taken: "Logged 312 counseling consultations; statistical breakdown forwarded to OSAS"
  },
  {
    year: 2025, month: 6, day: 30,
    monthName: "JUNE",
    subject: "AACCUP Level III Accreditation Guidance Document Registry & Compliance Accomplishment Report 2025",
    action_taken: "Accreditation survey area parameters satisfied; compliance records sealed"
  },
  {
    year: 2025, month: 7, day: 18,
    monthName: "JULY",
    subject: "Student Welfare Development & Anti-Bullying Preventive Counseling Accomplishment Report 2025",
    action_taken: "Campus-wide guidance advisory released to academic departments"
  },
  {
    year: 2025, month: 8, day: 25,
    monthName: "AUGUST",
    subject: "Freshmen Psychological Assessment & Mental Health Baseline Survey Accomplishment Report AY 2025-2026",
    action_taken: "Intake assessment results indexed; counseling cohorts established"
  },
  {
    year: 2025, month: 9, day: 23,
    monthName: "SEPTEMBER",
    subject: "Substance Abuse Prevention & Life Skills Counseling Seminar Accomplishment Report 2025",
    action_taken: "Joint seminar organized with PDEA Region IX; attendance docket archived"
  },
  {
    year: 2025, month: 10, day: 28,
    monthName: "OCTOBER",
    subject: "World Mental Health Day Symposium & Expressive Arts Wellness Workshop Accomplishment Report 2025",
    action_taken: "Workshops conducted across 4 campus zones; activity reports verified"
  },
  {
    year: 2025, month: 11, day: 19,
    monthName: "NOVEMBER",
    subject: "Industry Linkage & Internship Preparation Guidance Counseling Accomplishment Report 2025",
    action_taken: "Pre-OJT clearances issued to 780 students across 6 academic divisions"
  },
  {
    year: 2025, month: 12, day: 17,
    monthName: "DECEMBER",
    subject: "Annual Guidance Services Institutional Performance & Client Feedback Audit Accomplishment Report FY 2025",
    action_taken: "98.4% student satisfaction rating certified by Guidance Assessment Board"
  },

  // --- 2026 IN-PROGRESS ACADEMIC TERM (JANUARY TO APRIL) ---
  {
    year: 2026, month: 1, day: 16,
    monthName: "JANUARY",
    subject: "Q1 Guidance Counseling Center Executive Program Implementation Accomplishment Report FY 2026",
    action_taken: "Approved by OSAS Director and logged in Central Master Catalog"
  },
  {
    year: 2026, month: 2, day: 24,
    monthName: "FEBRUARY",
    subject: "Group Guidance Dynamics & Stress Management for Graduating Engineers Accomplishment Report 2026",
    action_taken: "Conducted for College of Engineering licensure examination reviewees"
  },
  {
    year: 2026, month: 3, day: 10,
    monthName: "MARCH",
    subject: "Guidance Office Archival Digitization & Electronic Master Cataloging Accomplishment Report 2026",
    action_taken: "Full statutory compliance under RA 9470 confirmed and verified"
  },
  {
    year: 2026, month: 4, day: 5,
    monthName: "APRIL",
    subject: "Comprehensive Student Exit Clearance & Career Placement Tracker Accomplishment Report AY 2025-2026",
    action_taken: "Graduating student exit documentation compiled and archived"
  }
];

function generateAccomplishmentReport(item, aIdx, storageLocation) {
  const dateStr = `${item.year}-${pad(item.month)}-${pad(item.day)}`;
  const jsDate = new Date(Date.UTC(item.year, item.month - 1, item.day, 8, 30, 0));
  const seq = pad(100 + aIdx + 1, 4);
  const docId = `DOC-${item.year}-${seq}`;
  const accessCode = `ZPPSU-ACAD-${item.year}-${seq}`;
  const cleanLocation = formatLocationWithColorName(storageLocation.displayText);

  const isArchived = (aIdx === 5 || aIdx === 17); // Realistic status variety

  const dynamicData = {
    date: dateStr,
    access_code: accessCode,
    file_location: cleanLocation,
    subject: item.subject,
    status: isArchived ? "Archived" : "Active",
    month: item.monthName,
    action_taken: item.action_taken,
    tracking_details: `Approved by Director, Guidance & Counseling • Certified in ${storageLocation.boxName}`
  };

  return {
    title: item.subject,
    category: "Academic",
    document_type: "ACCOMPLISHMENT REPORTS",
    access_code: accessCode,
    file_type: "OFFICIAL_RECORD",
    is_generated: true,
    document_id: docId,
    subject: item.subject,
    memo_date: jsDate,
    received_date: jsDate,
    created_at: jsDate,
    status: dynamicData.status,
    is_deleted: false,
    file_name: null,
    file_path: null,
    dynamic_data: dynamicData,
    file_box_id: storageLocation.fileBoxId
  };
}

function getAll63MockRecords(storageLocations) {
  const records = [];
  let globalIndex = 0;

  for (const [category, docTypes] of Object.entries(documentCategories)) {
    for (const docType of docTypes) {
      if (docType === "ACCOMPLISHMENT REPORTS") {
        // Generate all 28 authentic Accomplishment Reports spanning Jan-Dec across multiple years
        for (let aIdx = 0; aIdx < ACCOMPLISHMENT_REPORTS_DATA.length; aIdx++) {
          const item = ACCOMPLISHMENT_REPORTS_DATA[aIdx];
          const storageLocation = storageLocations[(globalIndex + aIdx) % storageLocations.length];
          records.push(generateAccomplishmentReport(item, aIdx, storageLocation));
        }
      } else {
        const storageLocation = storageLocations[globalIndex % storageLocations.length];
        const record = generateMockRecord(docType, category, globalIndex, storageLocation);
        records.push(record);
      }
      globalIndex++;
    }
  }

  return records;
}

module.exports = {
  getAll63MockRecords
};
