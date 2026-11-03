import { formatLocationWithColorName } from "../components/inventory/storageTaxonomy";

const getCleanLocation = (document, data) => {
  const loc = document?.file_box?.cabinet?.name
    ? `${document.file_box.cabinet.name} - ${document.file_box.name}`
    : ((data || {}).file_location || "Unassigned");
  return formatLocationWithColorName(loc);
};

export const templateConfig = {
  "AACCUP FINDINGS AND RECOMMENDATIONS": {
    headers: ["ACCESS CODE", "PROGRAM", "FILE LOCATION"],
    getRowData: (document, data) => [
      (data || {}).access_code || "N/A",
      (data || {}).program,
      getCleanLocation(document, data),
    ]
  },
  "ACCOMPLISHMENT REPORTS": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "STATUS", "FILE LOCATION"],
    getRowData: (document, data) => [
      (data || {}).date || (document.created_at ? new Date(document.created_at).toLocaleDateString() : ""),
      document.access_code || "N/A",
      document.subject || document.title || "",
      document.status || "Active",
      getCleanLocation(document, data),
    ]
  },
  "ANNUAL REPORTS": {
    headers: ["ACCESS CODE", "SUBJECT", "FILE LOCATION"],
    getRowData: (document, data) => [
      document.access_code || "N/A",
      document.subject,
      getCleanLocation(document, data),
    ]
  },
  "ASSESSMENT RECORDS OF STUDENTS": {
    headers: ["ACCESS CODE", "NAME OF STUDENT", "FILE LOCATION"],
    getRowData: (document, data) => [
      document.access_code || "N/A",
      data.student_name,
      getCleanLocation(document, data),
    ]
  },
  "BOARD RESOLUTIONS": {
    headers: ["ACCESS CODE", "SUBJECT", "FILE LOCATION"],
    getRowData: (document, data) => [
      document.access_code || "N/A",
      document.subject,
      getCleanLocation(document, data),
    ]
  },
  "BUDGET PLAN": {
    headers: ["ACCESS CODE", "YEAR AND PROPOSED BUDGET", "FILE LOCATION"],
    getRowData: (document, data) => [
      document.access_code || "N/A",
      data.year_and_proposed_budget,
      getCleanLocation(document, data),
    ]
  },
  "BUDGET PROPOSALS": {
    headers: ["ACCESS CODE", "FISCAL YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.fiscal_year || "",
      getCleanLocation(document, data),
    ]
  },
  "BUDGETARY REQUIREMENTS": {
    headers: ["ACCESS CODE", "FISCAL YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.fiscal_year || "",
      getCleanLocation(document, data),
    ]
  },
  "CHECKS ISSUED": {
    headers: ["ACCESS CODE", "PAYEE", "AMOUNT", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.payee || "",
      data.amount || "",
      getCleanLocation(document, data),
    ]
  },
  "CHED COMMUNICATIONS 2024": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.action_taken,
      getCleanLocation(document, data),
    ]
  },
  "CHED MEMORANDUM ORDERS 2024": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date || "",
      data.access_code || "N/A",
      data.subject || "",
      data.action_taken || "",
      getCleanLocation(document, data),
    ]
  },
  "CLASS PROGRAM": {
    headers: ["ACCESS CODE", "NAME OF FACULTY", "ACADEMIC YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.name_of_faculty || "",
      data.academic_year || "",
      getCleanLocation(document, data),
    ]
  },
  "COA ANNUAL REPORTS 2024": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date || "",
      data.access_code || "N/A",
      data.subject || "",
      data.action_taken || "",
      getCleanLocation(document, data),
    ]
  },
  "COA AUDIT OBSERVATION 2024": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION", "JANUARY"],
    getRowData: (document, data) => [
      data.date || "",
      data.access_code || "N/A",
      data.subject || "",
      data.action_taken || "",
      getCleanLocation(document, data),
    ]
  },
  "COA CIRCULARS": {
    headers: ["DATE", "SUBJECT", "FILE LOCATION", "JANUARY"],
    getRowData: (document, data) => [
      data.date || "",
      data.access_code || "N/A",
      data.subject || "",
      getCleanLocation(document, data),
    ]
  },
  "COA COMMUNICATIONS 2024": {
    headers: ["DATE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION", "JANUARY"],
    getRowData: (document, data) => [
      data.date || "",
      data.access_code || "N/A",
      data.subject || "",
      data.action_taken || "",
      getCleanLocation(document, data),
    ]
  },
  "COA NOTICE OF DISALLOWANCES 2024": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION", "JANUARY"],
    getRowData: (document, data) => [
      data.date || "",
      data.access_code || "N/A",
      data.subject || "",
      data.action_taken || "",
      getCleanLocation(document, data),
    ]
  },
  "COA NOTICE OF SUSPENSION 2024": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION", "JANUARY"],
    getRowData: (document, data) => [
      data.date || "",
      data.access_code || "N/A",
      data.subject || "",
      data.action_taken || "",
      getCleanLocation(document, data),
    ]
  },
  "MASTER LIST OF RECORDS FOR COLLECTION": {
    headers: ["ACCESS CODE", "RECEIVABLES FROM", "AMOUNT", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.receivables_from || "",
      data.amount || "",
      getCleanLocation(document, data),
    ]
  },
  "CONTRACT OF SERVICE (VISITING LECTURERS)": {
    headers: ["ACCESS CODE", "NAME", "SEMESTER/YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      ,
      ,
      ,
      ,
    ]
  },
  "COPC": {
    headers: ["ACCESS CODE", "PROGRAM", "FILE LOCATION"],
    getRowData: (document, data) => [
      ,
      ,
      ,
    ]
  },
  "CSC CIRCULARS": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "FILE LOCATION", "JANUARY"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      getCleanLocation(document, data),
    ]
  },
  "CSC COMMUNICATIONS 2024": {
    headers: ["DATE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION", "JANUARY"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.action_taken,
      getCleanLocation(document, data),
    ]
  },
  "DATA ANALYSIS": {
    headers: ["ACCESS CODE", "SUBJECT", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.subject,
      getCleanLocation(document, data),
    ]
  },
  "DBM CIRCULARS": {
    headers: ["DATE", "SUBJECT", "ACTION TAKEN", "ZPPSU MEMO NUMBER", "FILE LOCATION", "JANUARY"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.action_taken,
      data.memo_number,
      getCleanLocation(document, data),
    ]
  },
  "DBM CIRCULARS 1": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "FILE LOCATION", "JANUARY"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      getCleanLocation(document, data),
    ]
  },
  "DISBURSEMENTS": {
    headers: ["ACCESS CODE", "PARTICULARS", "AMOUNT", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.particulars,
      data.amount,
      getCleanLocation(document, data),
    ]
  },
  "DOST COMMUNICATIONS": {
    headers: ["DATE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION", "JANUARY"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.action_taken,
      getCleanLocation(document, data),
    ]
  },
  "HEMIS": {
    headers: ["ACCESS CODE", "SEMESTER/SCHOOL YEAR", "TRACKING DETAILS", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.semester_school_year,
      data.tracking_details,
      getCleanLocation(document, data),
    ]
  },
  "INDIVIDUAL DAILY PROGRAM IDP": {
    headers: ["ACCESS CODE", "NAME OF FACULTY", "SEMESTER/YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.name_of_faculty,
      data.semester_year,
      getCleanLocation(document, data),
    ]
  },
  "INCOMING COMMUNICATIONS OUTSIDE ZC PERIMETER": {
    headers: ["DATE", "ACCESS CODE", "AGENCY", "SUBJECT", "ACTION TAKEN", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.agency,
      data.subject,
      data.action_taken,
      getCleanLocation(document, data),
    ]
  },
  "INCOMING COMMUNICATIONS WITHIN ZC": {
    headers: ["DATE", "ACCESS CODE", "AGENCY", "SUBJECT", "ACTION TAKEN", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.agency,
      data.subject,
      data.action_taken,
      getCleanLocation(document, data),
    ]
  },
  "IPCR": {
    headers: ["ACCESS CODE", "NAME OF FACULTY", "SEMESTER/YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.name_of_faculty,
      data.semester_year,
      getCleanLocation(document, data),
    ]
  },
  "JOB ORDER WORKERS": {
    headers: ["ACCESS CODE", "NAME", "PERIOD", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.name,
      data.period,
      getCleanLocation(document, data),
    ]
  },
  "MANUALS OF OPERATIONS": {
    headers: ["ACCESS CODE", "SUBJECT", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.subject,
      getCleanLocation(document, data),
    ]
  },
  "MEDICAL RECORDS FOR STUDENTS": {
    headers: ["ACCESS CODE", "NAME", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.name,
      getCleanLocation(document, data),
    ]
  },
  "MEMO OTHER MATTERS": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "PERSONNEL", "ZPPSU MEMO NUMBER", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.personnel,
      data.memo_number,
      getCleanLocation(document, data),
    ]
  },
  "MEMORANDUM": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "PERSONNEL", "ZPPSU MEMO NUMBER", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.personnel,
      data.memo_number,
      getCleanLocation(document, data),
    ]
  },
  "MINUTES OF MEETINGS": {
    headers: ["ACCESS CODE", "AGENDA AND DATE OF MEETING", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.agenda_and_date_of_meeting,
      getCleanLocation(document, data),
    ]
  },
  "MOA/MOU RECORDS": {
    headers: ["ACCESS CODE", "AGENCY", "SUBJECT", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.agency,
      data.subject,
      getCleanLocation(document, data),
    ]
  },
  "NOTICE OF SALARY ADJUSTMENT (NOSA)": {
    headers: ["ACCESS CODE", "NAME OF PERSONNEL", "YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.personnel_name,
      data.year,
      getCleanLocation(document, data),
    ]
  },
  "SALN RECORDS": {
    headers: ["ACCESS CODE", "NAME OF PERSONNEL", "YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.personnel_name,
      data.year,
      getCleanLocation(document, data),
    ]
  },
  "NOTICE OF STEP INCREMENT (NSI)": {
    headers: ["ACCESS CODE", "NAME OF PERSONNEL", "YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.personnel,
      data.year,
      getCleanLocation(document, data),
    ]
  },
  "OFFENSES AND VIOLATIONS": {
    headers: ["ACCESS CODE", "NAME OF STUDENT", "SY YEAR, SEMESTER", "OFFENSES", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.student_name,
      data.school_year_semester,
      data.offenses,
      getCleanLocation(document, data),
    ]
  },
  "OUTGOING COMMUNICATIONS OUTSIDE ZC PERIMETER": {
    headers: ["DATE", "ACCESS CODE", "CONCERNED AGENCY", "SUBJECT", "TRACKING DETAILS", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.concerned_agency,
      data.subject,
      data.tracking_details,
      getCleanLocation(document, data),
    ]
  },
  "PORTFOLIO OF FACULTY": {
    headers: ["ACCESS CODE", "NAME OF FACULTY", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.faculty_name,
      getCleanLocation(document, data),
    ]
  },
  "PURCHASE REQUESTS": {
    headers: ["DATE", "ACCESS CODE", "ITEMS", "AMOUNT", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.items,
      data.amount,
      getCleanLocation(document, data),
    ]
  },
  "REPORT OF RATINGS": {
    headers: ["ACCESS CODE", "SEMESTER, SCHOOL YEAR, COURSE PROGRAM, YEAR LEVEL", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.details,
      getCleanLocation(document, data),
    ]
  },
  "REQUEST LETTER MEMORANDUM (RLM)": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.action_taken,
      getCleanLocation(document, data),
    ]
  },
  "SPECIAL ORDERS": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "PERSONNEL", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.personnel,
      getCleanLocation(document, data),
    ]
  },
  "STUDENT ADMISSION RECORDS": {
    headers: ["ACCESS CODE", "NAME", "SEMESTER/YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.name,
      data.semester_year,
      getCleanLocation(document, data),
    ]
  },
  "STUDENTS IN/OFF CAMPUS TEACHING": {
    headers: ["ACCESS CODE", "NAME OF STUDENT", "ASSIGNED SCHOOL", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.student_name,
      data.assigned_school,
      getCleanLocation(document, data),
    ]
  },
  "STUDENTS PROSPECTUS": {
    headers: ["ACCESS CODE", "COURSE AND YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.course_and_year,
      getCleanLocation(document, data),
    ]
  },
  "STUDENTS THESIS": {
    headers: ["ACCESS CODE", "NAME OF STUDENT", "TITLE OF THESIS", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.student_name,
      data.thesis_title,
      getCleanLocation(document, data),
    ]
  },
  "STUDENTS APPRENTICESHIP AND EXPO (APEX)": {
    headers: ["ACCESS CODE", "NAME OF STUDENT", "COURSE AND YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.student_name,
      data.course_and_year,
      getCleanLocation(document, data),
    ]
  },
  "TEACHING LOAD": {
    headers: ["ACCESS CODE", "NAME OF FACULTY", "ACADEMIC YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.faculty_name,
      data.academic_year,
      getCleanLocation(document, data),
    ]
  },
  "TRAININGS AND SEMINARS": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "PERSONNEL", "ZPPSU MEMO NUMBER", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.personnel,
      data.zppsu_memo_number,
      getCleanLocation(document, data),
    ]
  },
  "VARIOUS RECORDS": {
    headers: ["ACCESS CODE", "SUBJECT", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.subject,
      getCleanLocation(document, data),
    ]
  },
  "VERIFICATION REQUEST": {
    headers: ["DATE", "ACCESS CODE", "REQUESTING PARTY", "NAME OF STUDENT", "ACTION TAKEN", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.requesting_party,
      data.student_name,
      data.action_taken,
      getCleanLocation(document, data),
    ]
  },
  "VPAA MEMORANDA": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "PERSONNEL", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.personnel,
      getCleanLocation(document, data),
    ]
  },
  "VPAF INDORSEMENTS": {
    headers: ["ACCESS CODE", "SUBJECT", "CONCERNED PERSONNEL", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.subject,
      data.concerned_personnel,
      getCleanLocation(document, data),
    ]
  },
  "VPAF MEMORANDUM": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "PERSONNEL", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.personnel,
      getCleanLocation(document, data),
    ]
  },
  "VPRE MEMORANDA": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "PERSONNEL", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.personnel,
      getCleanLocation(document, data),
    ]
  },
  "FORDEED OF DONATIONS": {
    headers: ["ACCESS CODE", "DONOR", "TITLE OF DONATION", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.donor,
      data.title_of_donation,
      getCleanLocation(document, data),
    ]
  },
  "FREE HIGHER EDUCATION BILLING DETAILS": {
    headers: ["DATE", "ACCESS CODE", "SEMESTER", "ACTION TAKEN", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.semester,
      data.action_taken,
      getCleanLocation(document, data),
    ]
  },
};
