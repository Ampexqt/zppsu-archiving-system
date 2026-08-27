export const documentCategories = {
  Administrative: [
    "BOARD RESOLUTIONS",
    "CHED COMMUNICATIONS 2024",
    "CHED Memorandum Orders 2024",
    "CSC Circulars",
    "CSC Communications 2024",
    "DOST Communications",
    "Incoming Communications Outside ZC Perimeter",
    "Incoming Communications Within ZC",
    "Memorandum",
    "Minutes of Meetings",
    "MOA/MOU Records",
    "Notice of Salary Adjustment (NOSA)",
    "SALN Records",
    "Notice of Step Increment (NSI)",
    "Outgoing Communications Outside ZC Perimeter",
    "Request Letter Memorandum (RLM)",
    "Special Orders",
    "Trainings And Seminars",
    "Various Records",
    "VPAA Memoranda",
    "VPAF Indorsements",
    "VPAF Memorandum",
    "Job Order Workers",
    "Manuals of Operations",
    "Contract of Service (Visiting Lecturers)"
  ],
  Academic: [
    "AACCUP Findings and Recommendations",
    "ACCOMPLISHMENT REPORTS",
    "ANNUAL REPORTS",
    "ASSESSMENT RECORDS OF STUDENTS",
    "Class Program",
    "COPC",
    "Data Analysis",
    "HEMIS ",
    "Individual Daily Program IDP",
    "IPCR",
    "Medical Records for Students",
    "Offenses and Violations",
    "Portfolio of Faculty",
    "Report of Ratings",
    "Student Admission Records",
    "Students In/Off Campus Teaching",
    "Students Prospectus",
    "Students Thesis",
    "Students Apprenticeship And Expo (APEX)",
    "Teaching Load",
    "Verification Request"
  ],
  Financial: [
    "BUDGET PLAN",
    "BUDGET PROPOSALS",
    "BUDGETARY REQUIREMENTS",
    "Checks Issued",
    "COA Annual Reports 2024",
    "COA Audit Observation 2024",
    "COA Circulars",
    "COA Communications 2024",
    "COA NOTICE OF DISALLOWANCES 2024",
    "COA NOTICE OF SUSPENSION 2024",
    "Master List of Records for Collection",
    "DBM Circulars",
    "DBM Communications 2024",
    "Disbursements",
    "Purchase Requests",
    "Fordeed of Donations",
    "Free Higher Education Billing Details"
  ],
};

export const documentConfigs = {
  "AACCUP Findings and Recommendations": {
    fields: ["access_code", "program", "file_location"],
  },
  "ACCOMPLISHMENT REPORTS": {
    fields: ["access_code", "subject", "file_location"],
  },
  "ANNUAL REPORTS": {
    fields: ["access_code", "subject", "file_location"],
  },
  "ASSESSMENT RECORDS OF STUDENTS": {
    fields: ["access_code", "student_name", "file_location"],
  },
  "BOARD RESOLUTIONS": {
    fields: ["access_code", "subject", "file_location"],
  },
  "BUDGET PLAN": {
    fields: ["access_code", "year_and_proposed_budget", "file_location"],
  },
  "BUDGET PROPOSALS": {
    fields: ["access_code", "fiscal_year", "file_location"],
  },
  "BUDGETARY REQUIREMENTS": {
    fields: ["access_code", "fiscal_year", "file_location"],
  },
  "Checks Issued": {
    fields: ["access_code", "payee", "amount", "file_location"],
  },
  "CHED COMMUNICATIONS 2024": {
    fields: ["date", "access_code", "subject", "action_taken", "file_location"],
  },
  "CHED Memorandum Orders 2024": {
    fields: ["date", "access_code", "subject", "action_taken", "file_location"],
  },
  "Class Program": {
    fields: ["access_code", "name_of_faculty", "academic_year", "file_location"],
  },
  "COA Annual Reports 2024": {
    fields: ["date", "access_code", "subject", "action_taken", "file_location"],
  },
  "COA Audit Observation 2024": {
    fields: ["date", "access_code", "subject", "action_taken", "file_location"],
  },
  "COA Circulars": {
    fields: ["date", "access_code", "subject", "file_location"],
  },
  "COA Communications 2024": {
    fields: ["date", "access_code", "subject", "action_taken", "file_location"],
  },
  "COA NOTICE OF DISALLOWANCES 2024": {
    fields: ["date", "access_code", "subject", "action_taken", "file_location"],
  },
  "COA NOTICE OF SUSPENSION 2024": {
    fields: ["date", "access_code", "subject", "action_taken", "file_location"],
  },
  "Master List of Records for Collection": {
    fields: ["access_code", "receivables_from", "amount", "file_location"],
  },
  "Contract of Service (Visiting Lecturers)": {
    fields: ["access_code", "name", "semester_year", "file_location"],
  },
  "COPC": {
    fields: ["access_code", "program", "file_location"],
  },
  "CSC Circulars": {
    fields: ["date", "access_code", "subject", "file_location"],
  },
  "CSC Communications 2024": {
    fields: ["date", "access_code", "subject", "action_taken", "file_location"],
  },
  "Data Analysis": {
    fields: ["access_code", "subject", "file_location"],
  },
  "DBM Circulars": {
    fields: ["date", "access_code", "subject", "action_taken", "zppsu_memo_number", "file_location"],
  },
  "DBM Communications 2024": {
    fields: ["date", "access_code", "subject", "tracking_details", "file_location"],
  },
  "Disbursements": {
    fields: ["access_code", "particulars", "amount", "file_location"],
  },
  "DOST Communications": {
    fields: ["date", "access_code", "subject", "action_taken", "file_location"],
  },
  "HEMIS ": {
    fields: ["access_code", "semester_school_year", "tracking_details", "file_location"],
  },
  "Individual Daily Program IDP": {
    fields: ["access_code", "name_of_faculty", "semester_year", "file_location"],
  },
  "Incoming Communications Outside ZC Perimeter": {
    fields: ["date", "access_code", "agency", "subject", "action_taken", "file_location"],
  },
  "Incoming Communications Within ZC": {
    fields: ["date", "access_code", "subject", "action_taken", "file_location"],
  },
  "IPCR": {
    fields: ["access_code", "name_of_faculty", "semester_year", "file_location"],
  },
  "Job Order Workers": {
    fields: ["access_code", "name", "period", "file_location"],
  },
  "Manuals of Operations": {
    fields: ["access_code", "subject", "file_location"],
  },
  "Medical Records for Students": {
    fields: ["access_code", "name", "file_location"],
  },
  "Memorandum": {
    fields: ["date", "access_code", "zppsu_memo_number", "subject", "personnel", "file_location"],
  },
  "Minutes of Meetings": {
    fields: ["access_code", "agenda_and_date", "file_location"],
  },
  "MOA/MOU Records": {
    fields: ["access_code", "agency", "subject", "file_location"],
  },
  "Notice of Salary Adjustment (NOSA)": {
    fields: ["access_code", "personnel_name", "year", "file_location"],
  },
  "SALN Records": {
    fields: ["access_code", "personnel_name", "year", "file_location"],
  },
  "Notice of Step Increment (NSI)": {
    fields: ["access_code", "personnel_name", "year", "file_location"],
  },
  "Offenses and Violations": {
    fields: ["access_code", "student_name", "school_year_semester", "offenses", "file_location"],
  },
  "Outgoing Communications Outside ZC Perimeter": {
    fields: ["date", "access_code", "concerned_agency", "subject", "tracking_details", "file_location"],
  },
  "Portfolio of Faculty": {
    fields: ["access_code", "faculty_name", "file_location"],
  },
  "Purchase Requests": {
    fields: ["date", "access_code", "items", "amount", "file_location"],
  },
  "Report of Ratings": {
    fields: ["access_code", "semester_school_year_course_year", "file_location"],
  },
  "Request Letter Memorandum (RLM)": {
    fields: ["date", "access_code", "subject", "action_taken", "file_location"],
  },
  "Special Orders": {
    fields: ["date", "access_code", "subject", "personnel", "file_location"],
  },
  "Student Admission Records": {
    fields: ["access_code", "student_name", "semester_year", "file_location"],
  },
  "Students In/Off Campus Teaching": {
    fields: ["access_code", "student_name", "assigned_school", "file_location"],
  },
  "Students Prospectus": {
    fields: ["access_code", "course_and_year", "file_location"],
  },
  "Students Thesis": {
    fields: ["access_code", "student_name", "title_of_thesis", "file_location"],
  },
  "Students Apprenticeship And Expo (APEX)": {
    fields: ["access_code", "student_name", "course_and_year", "file_location"],
  },
  "Teaching Load": {
    fields: ["access_code", "faculty_name", "academic_year", "file_location"],
  },
  "Trainings And Seminars": {
    fields: ["date", "access_code", "subject", "personnel", "zppsu_memo_number", "file_location"],
  },
  "Various Records": {
    fields: ["access_code", "subject", "file_location"],
  },
  "Verification Request": {
    fields: ["date", "access_code", "requesting_party", "student_name", "action_taken", "file_location"],
  },
  "VPAA Memoranda": {
    fields: ["date", "access_code", "subject", "personnel", "file_location"],
  },
  "VPAF Indorsements": {
    fields: ["access_code", "subject", "concerned_personnel", "file_location"],
  },
  "VPAF Memorandum": {
    fields: ["date", "access_code", "subject", "personnel", "file_location"],
  },
  "Fordeed of Donations": {
    fields: ["access_code", "donor", "title_of_donation", "file_location"],
  },
  "Free Higher Education Billing Details": {
    fields: ["date", "access_code", "semester", "action_taken", "file_location"],
  },
};

export const getFieldsForDocumentType = (documentType) => {
  return documentConfigs[documentType]?.fields || [];
};
