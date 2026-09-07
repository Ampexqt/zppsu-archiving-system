export const templateConfig = {
  "AACCUP FINDINGS AND RECOMMENDATIONS": {
    headers: ["ACCESS CODE", "PROGRAM", "FILE LOCATION"],
    getRowData: (document, data) => [
      (data || {}).access_code || "N/A",
      (data || {}).program,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : ((data || {}).file_location || "Unassigned"),
    ]
  },
  "ACCOMPLISHMENT REPORTS": {
    headers: ["ACCESS CODE", "SUBJECT", "FILE LOCATION"],
    getRowData: (document, data) => [
      document.access_code || "N/A",
      document.subject,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "ANNUAL REPORTS": {
    headers: ["ACCESS CODE", "SUBJECT", "FILE LOCATION"],
    getRowData: (document, data) => [
      document.access_code || "N/A",
      document.subject,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "ASSESSMENT RECORDS OF STUDENTS": {
    headers: ["ACCESS CODE", "NAME OF STUDENT", "FILE LOCATION"],
    getRowData: (document, data) => [
      document.access_code || "N/A",
      data.student_name,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "BOARD RESOLUTIONS": {
    headers: ["ACCESS CODE", "SUBJECT", "FILE LOCATION"],
    getRowData: (document, data) => [
      document.access_code || "N/A",
      document.subject,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "BUDGET PLAN": {
    headers: ["ACCESS CODE", "YEAR AND PROPOSED BUDGET", "FILE LOCATION"],
    getRowData: (document, data) => [
      document.access_code || "N/A",
      data.year_and_proposed_budget,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "BUDGET PROPOSALS": {
    headers: ["ACCESS CODE", "FISCAL YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.fiscal_year || "",
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "" || "Unassigned"),
    ]
  },
  "BUDGETARY REQUIREMENTS": {
    headers: ["ACCESS CODE", "FISCAL YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.fiscal_year || "",
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "" || "Unassigned"),
    ]
  },
  "CHECKS ISSUED": {
    headers: ["ACCESS CODE", "PAYEE", "AMOUNT", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.payee || "",
      data.amount || "",
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "" || "Unassigned"),
    ]
  },
  "CHED COMMUNICATIONS 2024": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.action_taken,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "CHED MEMORANDUM ORDERS 2024": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date || "",
      data.access_code || "N/A",
      data.subject || "",
      data.action_taken || "",
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "" || "Unassigned"),
    ]
  },
  "CLASS PROGRAM": {
    headers: ["ACCESS CODE", "NAME OF FACULTY", "ACADEMIC YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.name_of_faculty || "",
      data.academic_year || "",
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "" || "Unassigned"),
    ]
  },
  "COA ANNUAL REPORTS 2024": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date || "",
      data.access_code || "N/A",
      data.subject || "",
      data.action_taken || "",
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "" || "Unassigned"),
    ]
  },
  "COA AUDIT OBSERVATION 2024": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION", "JANUARY"],
    getRowData: (document, data) => [
      data.date || "",
      data.access_code || "N/A",
      data.subject || "",
      data.action_taken || "",
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "" || "Unassigned"),
    ]
  },
  "COA CIRCULARS": {
    headers: ["DATE", "SUBJECT", "FILE LOCATION", "JANUARY"],
    getRowData: (document, data) => [
      data.date || "",
      data.access_code || "N/A",
      data.subject || "",
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "" || "Unassigned"),
    ]
  },
  "COA COMMUNICATIONS 2024": {
    headers: ["DATE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION", "JANUARY"],
    getRowData: (document, data) => [
      data.date || "",
      data.access_code || "N/A",
      data.subject || "",
      data.action_taken || "",
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "" || "Unassigned"),
    ]
  },
  "COA NOTICE OF DISALLOWANCES 2024": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION", "JANUARY"],
    getRowData: (document, data) => [
      data.date || "",
      data.access_code || "N/A",
      data.subject || "",
      data.action_taken || "",
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "" || "Unassigned"),
    ]
  },
  "COA NOTICE OF SUSPENSION 2024": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION", "JANUARY"],
    getRowData: (document, data) => [
      data.date || "",
      data.access_code || "N/A",
      data.subject || "",
      data.action_taken || "",
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "" || "Unassigned"),
    ]
  },
  "MASTER LIST OF RECORDS FOR COLLECTION": {
    headers: ["ACCESS CODE", "RECEIVABLES FROM", "AMOUNT", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.receivables_from || "",
      data.amount || "",
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "" || "Unassigned"),
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
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "CSC COMMUNICATIONS 2024": {
    headers: ["DATE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION", "JANUARY"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.action_taken,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "DATA ANALYSIS": {
    headers: ["ACCESS CODE", "SUBJECT", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.subject,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
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
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "DBM CIRCULARS 1": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "FILE LOCATION", "JANUARY"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "DISBURSEMENTS": {
    headers: ["ACCESS CODE", "PARTICULARS", "AMOUNT", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.particulars,
      data.amount,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "DOST COMMUNICATIONS": {
    headers: ["DATE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION", "JANUARY"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.action_taken,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "HEMIS": {
    headers: ["ACCESS CODE", "SEMESTER/SCHOOL YEAR", "TRACKING DETAILS", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.semester_school_year,
      data.tracking_details,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "INDIVIDUAL DAILY PROGRAM IDP": {
    headers: ["ACCESS CODE", "NAME OF FACULTY", "SEMESTER/YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.name_of_faculty,
      data.semester_year,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
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
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
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
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "IPCR": {
    headers: ["ACCESS CODE", "NAME OF FACULTY", "SEMESTER/YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.name_of_faculty,
      data.semester_year,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "JOB ORDER WORKERS": {
    headers: ["ACCESS CODE", "NAME", "PERIOD", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.name,
      data.period,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "MANUALS OF OPERATIONS": {
    headers: ["ACCESS CODE", "SUBJECT", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.subject,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "MEDICAL RECORDS FOR STUDENTS": {
    headers: ["ACCESS CODE", "NAME", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.name,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
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
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
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
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "MINUTES OF MEETINGS": {
    headers: ["ACCESS CODE", "AGENDA AND DATE OF MEETING", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.agenda_and_date_of_meeting,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "MOA/MOU RECORDS": {
    headers: ["ACCESS CODE", "AGENCY", "SUBJECT", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.agency,
      data.subject,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "NOTICE OF SALARY ADJUSTMENT (NOSA)": {
    headers: ["ACCESS CODE", "NAME OF PERSONNEL", "YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.personnel_name,
      data.year,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "SALN RECORDS": {
    headers: ["ACCESS CODE", "NAME OF PERSONNEL", "YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.personnel_name,
      data.year,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "NOTICE OF STEP INCREMENT (NSI)": {
    headers: ["ACCESS CODE", "NAME OF PERSONNEL", "YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.personnel,
      data.year,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "OFFENSES AND VIOLATIONS": {
    headers: ["ACCESS CODE", "NAME OF STUDENT", "SY YEAR, SEMESTER", "OFFENSES", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.student_name,
      data.school_year_semester,
      data.offenses,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
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
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "PORTFOLIO OF FACULTY": {
    headers: ["ACCESS CODE", "NAME OF FACULTY", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.faculty_name,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "PURCHASE REQUESTS": {
    headers: ["DATE", "ACCESS CODE", "ITEMS", "AMOUNT", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.items,
      data.amount,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "REPORT OF RATINGS": {
    headers: ["ACCESS CODE", "SEMESTER, SCHOOL YEAR, COURSE PROGRAM, YEAR LEVEL", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.details,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "REQUEST LETTER MEMORANDUM (RLM)": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "ACTION TAKEN", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.action_taken,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "SPECIAL ORDERS": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "PERSONNEL", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.personnel,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "STUDENT ADMISSION RECORDS": {
    headers: ["ACCESS CODE", "NAME", "SEMESTER/YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.name,
      data.semester_year,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "STUDENTS IN/OFF CAMPUS TEACHING": {
    headers: ["ACCESS CODE", "NAME OF STUDENT", "ASSIGNED SCHOOL", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.student_name,
      data.assigned_school,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "STUDENTS PROSPECTUS": {
    headers: ["ACCESS CODE", "COURSE AND YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.course_and_year,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "STUDENTS THESIS": {
    headers: ["ACCESS CODE", "NAME OF STUDENT", "TITLE OF THESIS", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.student_name,
      data.thesis_title,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "STUDENTS APPRENTICESHIP AND EXPO (APEX)": {
    headers: ["ACCESS CODE", "NAME OF STUDENT", "COURSE AND YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.student_name,
      data.course_and_year,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "TEACHING LOAD": {
    headers: ["ACCESS CODE", "NAME OF FACULTY", "ACADEMIC YEAR", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.faculty_name,
      data.academic_year,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
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
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "VARIOUS RECORDS": {
    headers: ["ACCESS CODE", "SUBJECT", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.subject,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
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
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "VPAA MEMORANDA": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "PERSONNEL", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.personnel,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "VPAF INDORSEMENTS": {
    headers: ["ACCESS CODE", "SUBJECT", "CONCERNED PERSONNEL", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.subject,
      data.concerned_personnel,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "VPAF MEMORANDUM": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "PERSONNEL", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.personnel,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "VPRE MEMORANDA": {
    headers: ["DATE", "ACCESS CODE", "SUBJECT", "PERSONNEL", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.subject,
      data.personnel,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "FORDEED OF DONATIONS": {
    headers: ["ACCESS CODE", "DONOR", "TITLE OF DONATION", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.access_code || "N/A",
      data.donor,
      data.title_of_donation,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
  "FREE HIGHER EDUCATION BILLING DETAILS": {
    headers: ["DATE", "ACCESS CODE", "SEMESTER", "ACTION TAKEN", "FILE LOCATION"],
    getRowData: (document, data) => [
      data.date,
      data.access_code || "N/A",
      data.semester,
      data.action_taken,
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : (data.file_location || "Unassigned"),
    ]
  },
};
