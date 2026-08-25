import React from "react";
import AccomplishmentReportTemplate from "./AccomplishmentReportTemplate";
import AaccupTemplate from "./AaccupTemplate";
import AnnualReportTemplate from "./AnnualReportTemplate";
import StudentAccountTemplate from "./StudentAccountTemplate";
import BoardResolutionTemplate from "./BoardResolutionTemplate";
import BudgetPlanTemplate from "./BudgetPlanTemplate";
import BudgetProposalTemplate from "./BudgetProposalTemplate";
import BudgetaryRequirementsTemplate from "./BudgetaryRequirementsTemplate";
import ChecksIssuedTemplate from "./ChecksIssuedTemplate";
import ChedCommunicationTemplate from "./ChedCommunicationTemplate";
import ChedMemoOrderTemplate from "./ChedMemoOrderTemplate";
import ClassProgramTemplate from "./ClassProgramTemplate";
import CoaAnnualReportTemplate from "./CoaAnnualReportTemplate";
import CoaAuditObservationTemplate from "./CoaAuditObservationTemplate";
import CoaCircularTemplate from "./CoaCircularTemplate";
import CoaCommunicationTemplate from "./CoaCommunicationTemplate";
import CoaNoticeDisallowanceTemplate from "./CoaNoticeDisallowanceTemplate";
import CoaNoticeSuspensionTemplate from "./CoaNoticeSuspensionTemplate";
import MasterListOfRecordsForCollectionTemplate from "./MasterListOfRecordsForCollectionTemplate";
import ContractOfServiceVisitingLecturersTemplate from "./ContractOfServiceVisitingLecturersTemplate";
import CopcTemplate from "./CopcTemplate";
import CscCirculars1Template from "./CscCirculars1Template";
import CscCommunications2024Template from "./CscCommunications2024Template";
import DataAnalysisTemplate from "./DataAnalysisTemplate";
import DbmCircularsTemplate from "./DbmCircularsTemplate";
import DbmCirculars1Template from "./DbmCirculars1Template";
import DisbursementsTemplate from "./DisbursementsTemplate";
import DostCommunications2024Template from "./DostCommunications2024Template";
import HemisTemplate from "./HemisTemplate";
import IdpTemplate from "./IdpTemplate";
import IncomingCommunicationsOutsideZcPerimeterTemplate from "./IncomingCommunicationsOutsideZcPerimeterTemplate";
import IncomingCommunicationsOutsideTemplate from "./IncomingCommunicationsOutsideTemplate";
import IpcrTemplate from "./IpcrTemplate";
import JobOrdersTemplate from "./JobOrdersTemplate";
import ManualsTemplate from "./ManualsTemplate";
import MedicalRecordsTemplate from "./MedicalRecordsTemplate";
import MemoOtherMattersTemplate from "./MemoOtherMattersTemplate";
import MemorandumOtherMattersTemplate from "./MemorandumOtherMattersTemplate";
import MinutesOfMeetingsTemplate from "./MinutesOfMeetingsTemplate";
import MoaTemplate from "./MoaTemplate";
import NosaTemplate from "./NosaTemplate";
import SalnTemplate from "./SalnTemplate";
import NsiTemplate from "./NsiTemplate";
import OffensesViolationsTemplate from "./OffensesViolationsTemplate";
import OutgoingCommunicationsOutsideTemplate from "./OutgoingCommunicationsOutsideTemplate";
import PortfolioOfFacultyTemplate from "./PortfolioOfFacultyTemplate";
import PurchaseRequestsTemplate from "./PurchaseRequestsTemplate";
import ReportOfRatingsTemplate from "./ReportOfRatingsTemplate";
import RlmTemplate from "./RlmTemplate";
import SpecialOrdersTemplate from "./SpecialOrdersTemplate";
import StudentAdmissionRecordsTemplate from "./StudentAdmissionRecordsTemplate";
import StudentsInOffCampusTeachingTemplate from "./StudentsInOffCampusTeachingTemplate";
import StudentsProspectusTemplate from "./StudentsProspectusTemplate";
import StudentsThesisTemplate from "./StudentsThesisTemplate";
import StudentsAPEXTemplate from "./StudentsAPEXTemplate";
import TeachingLoadTemplate from "./TeachingLoadTemplate";
import TrainingsAndSeminarsTemplate from "./TrainingsAndSeminarsTemplate";
import VariousRecordsTemplate from "./VariousRecordsTemplate";
import VerificationRequestTemplate from "./VerificationRequestTemplate";
import VPaaMemorandaTemplate from "./VPaaMemorandaTemplate";
import VPAFIndorsementsTemplate from "./VPAFIndorsementsTemplate";
import VPAFMemorandumTemplate from "./VPAFMemorandumTemplate";
import VPREMemorandaTemplate from "./VPREMemorandaTemplate";
import DeedOfDonationsTemplate from "./DeedOfDonationsTemplate";
import FreeHigherEducationBillingTemplate from "./FreeHigherEducationBillingTemplate";

const templateMap = {
  "AACCUP FINDINGS AND RECOMMENDATIONS": AaccupTemplate,
  "ACCOMPLISHMENT REPORTS": AccomplishmentReportTemplate,
  "ANNUAL REPORTS": AnnualReportTemplate,
  "ASSESSMENT RECORDS OF STUDENTS": StudentAccountTemplate,
  "BOARD RESOLUTIONS": BoardResolutionTemplate,
  "BUDGET PLAN": BudgetPlanTemplate,
  "BUDGET PROPOSALS": BudgetProposalTemplate,
  "BUDGETARY REQUIREMENTS": BudgetaryRequirementsTemplate,
  "CHECKS ISSUED": ChecksIssuedTemplate,
  "CHED COMMUNICATIONS 2024": ChedCommunicationTemplate,
  "CHED MEMORANDUM ORDERS 2024": ChedMemoOrderTemplate,
  "CLASS PROGRAM": ClassProgramTemplate,
  "COA ANNUAL REPORTS 2024": CoaAnnualReportTemplate,
  "COA AUDIT OBSERVATION 2024": CoaAuditObservationTemplate,
  "COA CIRCULARS": CoaCircularTemplate,
  "COA COMMUNICATIONS 2024": CoaCommunicationTemplate,
  "COA NOTICE OF DISALLOWANCES 2024": CoaNoticeDisallowanceTemplate,
  "COA NOTICE OF SUSPENSION 2024": CoaNoticeSuspensionTemplate,
  "MASTER LIST OF RECORDS FOR COLLECTION": MasterListOfRecordsForCollectionTemplate,
  "CONTRACT OF SERVICE (VISITING LECTURERS)": ContractOfServiceVisitingLecturersTemplate,
  "COPC": CopcTemplate,
  "CSC CIRCULARS": CscCirculars1Template,
  "CSC COMMUNICATIONS 2024": CscCommunications2024Template,
  "DATA ANALYSIS": DataAnalysisTemplate,
  "DBM CIRCULARS": DbmCircularsTemplate,
  "DBM CIRCULARS 1": DbmCirculars1Template,
  "DISBURSEMENTS": DisbursementsTemplate,
  "DOST COMMUNICATIONS": DostCommunications2024Template,
  "HEMIS": HemisTemplate,
  "INDIVIDUAL DAILY PROGRAM IDP": IdpTemplate,
  "INCOMING COMMUNICATIONS OUTSIDE ZC PERIMETER": IncomingCommunicationsOutsideZcPerimeterTemplate,
  "INCOMING COMMUNICATIONS WITHIN ZC": IncomingCommunicationsOutsideTemplate,
  "IPCR": IpcrTemplate,
  "JOB ORDER WORKERS": JobOrdersTemplate,
  "MANUALS OF OPERATIONS": ManualsTemplate,
  "MEDICAL RECORDS FOR STUDENTS": MedicalRecordsTemplate,
  "MEMO OTHER MATTERS": MemoOtherMattersTemplate,
  "MEMORANDUM": MemorandumOtherMattersTemplate,
  "MINUTES OF MEETINGS": MinutesOfMeetingsTemplate,
  "MOA/MOU RECORDS": MoaTemplate,
  "NOTICE OF SALARY ADJUSTMENT (NOSA)": NosaTemplate,
  "SALN RECORDS": SalnTemplate,
  "NOTICE OF STEP INCREMENT (NSI)": NsiTemplate,
  "OFFENSES AND VIOLATIONS": OffensesViolationsTemplate,
  "OUTGOING COMMUNICATIONS OUTSIDE ZC PERIMETER": OutgoingCommunicationsOutsideTemplate,
  "PORTFOLIO OF FACULTY": PortfolioOfFacultyTemplate,
  "PURCHASE REQUESTS": PurchaseRequestsTemplate,
  "REPORT OF RATINGS": ReportOfRatingsTemplate,
  "REQUEST LETTER MEMORANDUM (RLM)": RlmTemplate,
  "SPECIAL ORDERS": SpecialOrdersTemplate,
  "STUDENT ADMISSION RECORDS": StudentAdmissionRecordsTemplate,
  "STUDENTS IN/OFF CAMPUS TEACHING": StudentsInOffCampusTeachingTemplate,
  "STUDENTS PROSPECTUS": StudentsProspectusTemplate,
  "STUDENTS THESIS": StudentsThesisTemplate,
  "STUDENTS APPRENTICESHIP AND EXPO (APEX)": StudentsAPEXTemplate,
  "TEACHING LOAD": TeachingLoadTemplate,
  "TRAININGS AND SEMINARS": TrainingsAndSeminarsTemplate,
  "VARIOUS RECORDS": VariousRecordsTemplate,
  "VERIFICATION REQUEST": VerificationRequestTemplate,
  "VPAA MEMORANDA": VPaaMemorandaTemplate,
  "VPAF INDORSEMENTS": VPAFIndorsementsTemplate,
  "VPAF MEMORANDUM": VPAFMemorandumTemplate,
  "VPRE MEMORANDA": VPREMemorandaTemplate,
  "FORDEED OF DONATIONS": DeedOfDonationsTemplate,
  "FREE HIGHER EDUCATION BILLING DETAILS": FreeHigherEducationBillingTemplate
};

function DocumentTemplateRenderer({ document }) {
  if (!document) return null;

  const docTypeKey = (document.document_type || "").toUpperCase().trim();
  const Component = templateMap[docTypeKey];

  if (Component) {
    return <Component document={document} data={document.dynamic_data || document} />;
  }

  // Clean fallback preview if specialized template not defined
  return (
    <div className="p-8 bg-white border border-gray-200 rounded-xl space-y-4">
      <div className="border-b border-gray-100 pb-4">
        <span className="text-xs uppercase tracking-widest text-[#800000] font-bold">
          {document.category || "General Record"}
        </span>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">
          {document.subject || document.title || "Document Details"}
        </h2>
        <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {document.document_id || document.access_code}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <span className="font-bold text-gray-500 uppercase">Document Type:</span>
          <p className="font-semibold text-gray-800 mt-0.5">{document.document_type || "Standard File"}</p>
        </div>
        <div>
          <span className="font-bold text-gray-500 uppercase">Status:</span>
          <p className="font-semibold text-gray-800 mt-0.5">{document.status || "Active"}</p>
        </div>
        <div>
          <span className="font-bold text-gray-500 uppercase">Storage Cabinet:</span>
          <p className="font-semibold text-gray-800 mt-0.5">{document.file_box?.cabinet?.name || "Unassigned"}</p>
        </div>
        <div>
          <span className="font-bold text-gray-500 uppercase">File Box:</span>
          <p className="font-semibold text-gray-800 mt-0.5">{document.file_box?.name || "Unassigned"}</p>
        </div>
      </div>
    </div>
  );
}

export default DocumentTemplateRenderer;
