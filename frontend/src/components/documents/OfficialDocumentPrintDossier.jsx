import React from "react";
import InstitutionalPrintHeader from "../common/InstitutionalPrintHeader";
import InstitutionalSignatoryBlock from "../common/InstitutionalSignatoryBlock";
import { API_BASE_URL } from "../../services/api";

// Import all specific templates for clean print rendering
import AccomplishmentReportTemplate from "../templates/AccomplishmentReportTemplate";
import AaccupTemplate from "../templates/AaccupTemplate";
import AnnualReportTemplate from "../templates/AnnualReportTemplate";
import StudentAccountTemplate from "../templates/StudentAccountTemplate";
import BoardResolutionTemplate from "../templates/BoardResolutionTemplate";
import BudgetPlanTemplate from "../templates/BudgetPlanTemplate";
import BudgetProposalTemplate from "../templates/BudgetProposalTemplate";
import BudgetaryRequirementsTemplate from "../templates/BudgetaryRequirementsTemplate";
import ChecksIssuedTemplate from "../templates/ChecksIssuedTemplate";
import ChedCommunicationTemplate from "../templates/ChedCommunicationTemplate";
import ChedMemoOrderTemplate from "../templates/ChedMemoOrderTemplate";
import ClassProgramTemplate from "../templates/ClassProgramTemplate";
import CoaAnnualReportTemplate from "../templates/CoaAnnualReportTemplate";
import CoaAuditObservationTemplate from "../templates/CoaAuditObservationTemplate";
import CoaCircularTemplate from "../templates/CoaCircularTemplate";
import CoaCommunicationTemplate from "../templates/CoaCommunicationTemplate";
import CoaNoticeDisallowanceTemplate from "../templates/CoaNoticeDisallowanceTemplate";
import CoaNoticeSuspensionTemplate from "../templates/CoaNoticeSuspensionTemplate";
import MasterListOfRecordsForCollectionTemplate from "../templates/MasterListOfRecordsForCollectionTemplate";
import ContractOfServiceVisitingLecturersTemplate from "../templates/ContractOfServiceVisitingLecturersTemplate";
import CopcTemplate from "../templates/CopcTemplate";
import CscCirculars1Template from "../templates/CscCirculars1Template";
import CscCommunications2024Template from "../templates/CscCommunications2024Template";
import DataAnalysisTemplate from "../templates/DataAnalysisTemplate";
import DbmCircularsTemplate from "../templates/DbmCircularsTemplate";
import DbmCirculars1Template from "../templates/DbmCirculars1Template";
import DisbursementsTemplate from "../templates/DisbursementsTemplate";
import DostCommunications2024Template from "../templates/DostCommunications2024Template";
import HemisTemplate from "../templates/HemisTemplate";
import IdpTemplate from "../templates/IdpTemplate";
import IncomingCommunicationsOutsideZcPerimeterTemplate from "../templates/IncomingCommunicationsOutsideZcPerimeterTemplate";
import IncomingCommunicationsOutsideTemplate from "../templates/IncomingCommunicationsOutsideTemplate";
import IpcrTemplate from "../templates/IpcrTemplate";
import JobOrdersTemplate from "../templates/JobOrdersTemplate";
import ManualsTemplate from "../templates/ManualsTemplate";
import MedicalRecordsTemplate from "../templates/MedicalRecordsTemplate";
import MemoOtherMattersTemplate from "../templates/MemoOtherMattersTemplate";
import MemorandumOtherMattersTemplate from "../templates/MemorandumOtherMattersTemplate";
import MinutesOfMeetingsTemplate from "../templates/MinutesOfMeetingsTemplate";
import MoaTemplate from "../templates/MoaTemplate";
import NosaTemplate from "../templates/NosaTemplate";
import SalnTemplate from "../templates/SalnTemplate";
import NsiTemplate from "../templates/NsiTemplate";
import OffensesViolationsTemplate from "../templates/OffensesViolationsTemplate";
import OutgoingCommunicationsOutsideTemplate from "../templates/OutgoingCommunicationsOutsideTemplate";
import PortfolioOfFacultyTemplate from "../templates/PortfolioOfFacultyTemplate";
import PurchaseRequestsTemplate from "../templates/PurchaseRequestsTemplate";
import ReportOfRatingsTemplate from "../templates/ReportOfRatingsTemplate";
import RlmTemplate from "../templates/RlmTemplate";
import SpecialOrdersTemplate from "../templates/SpecialOrdersTemplate";
import StudentAdmissionRecordsTemplate from "../templates/StudentAdmissionRecordsTemplate";
import StudentsInOffCampusTeachingTemplate from "../templates/StudentsInOffCampusTeachingTemplate";
import StudentsProspectusTemplate from "../templates/StudentsProspectusTemplate";
import StudentsThesisTemplate from "../templates/StudentsThesisTemplate";
import StudentsAPEXTemplate from "../templates/StudentsAPEXTemplate";
import TeachingLoadTemplate from "../templates/TeachingLoadTemplate";
import TrainingsAndSeminarsTemplate from "../templates/TrainingsAndSeminarsTemplate";
import VariousRecordsTemplate from "../templates/VariousRecordsTemplate";
import VerificationRequestTemplate from "../templates/VerificationRequestTemplate";
import VPaaMemorandaTemplate from "../templates/VPaaMemorandaTemplate";
import VPAFIndorsementsTemplate from "../templates/VPAFIndorsementsTemplate";
import VPAFMemorandumTemplate from "../templates/VPAFMemorandumTemplate";
import VPREMemorandaTemplate from "../templates/VPREMemorandaTemplate";
import DeedOfDonationsTemplate from "../templates/DeedOfDonationsTemplate";
import FreeHigherEducationBillingTemplate from "../templates/FreeHigherEducationBillingTemplate";

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

/**
 * OfficialDocumentPrintDossier
 * Pristine, academic, institutional print document sheet for state university archival records.
 * Renders letterhead, classification summary, custody trail, document content, and signatory block.
 */
export default function OfficialDocumentPrintDossier({ file }) {
  if (!file) return null;

  const docTypeKey = (file.document_type || "").toUpperCase().trim();
  const TemplateComponent = templateMap[docTypeKey];
  const documentIdentifier = file.document_id || file.access_code || `DOC-${file.id}`;

  const formattedDate = file.created_at
    ? new Date(file.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  // Physical Location parsing
  const cabinetName = file.file_box?.cabinet?.name || "Unassigned Storage Unit";
  const cabinetType = file.file_box?.cabinet?.type || "Unit";
  const boxName = file.file_box?.name || "Unassigned Box Container";
  const archfileName = file.archfile?.name || file.file_box?.archfile?.name || null;
  const archfileCode = file.archfile?.code || file.file_box?.archfile?.code || null;
  const archfileColor = file.archfile?.color_tag || file.file_box?.archfile?.color_tag || null;

  const rawData = file.dynamic_data || {};
  const computedLocation = file.file_box?.cabinet?.name
    ? `${file.file_box.cabinet.name} - ${file.file_box.name}`
    : (file.file_box?.name || rawData.file_location || "Unassigned");

  const unifiedData = {
    ...file,
    ...rawData,
    subject: rawData.subject || file.subject || file.title || "—",
    access_code: rawData.access_code || file.access_code || "N/A",
    date: rawData.date || formattedDate,
    file_location: rawData.file_location || computedLocation,
  };

  const fileUrl = file.file_path
    ? (file.file_path.startsWith("http") ? file.file_path : `${API_BASE_URL}/${file.file_path}`)
    : null;
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(file.file_name || "") || ["JPG", "JPEG", "PNG", "WEBP"].includes(file.file_type);

  return (
    <div className="w-full bg-white text-black p-1 sm:p-2 font-sans leading-tight print-dossier-flex h-full flex-1 flex flex-col justify-between">
      {/* MAIN DOSSIER BODY (SECTIONS I, II, III) */}
      <div className="flex-1 w-full">
        {/* 1. INSTITUTIONAL LETTERHEAD */}
        <InstitutionalPrintHeader
          title={file.is_generated ? `MASTERLIST OF RECORDS FOR ${(file.document_type || "DOCUMENT").toUpperCase()}` : "OFFICIAL ARCHIVAL RECORD DOSSIER"}
          referenceCode={documentIdentifier}
          classification={file.category || "General"}
          documentType={file.document_type || "Record"}
        />

        {/* 2. ARCHIVAL CLASSIFICATION & ACCESSION SUMMARY TABLE */}
        <div className="mb-2.5">
          <div className="bg-neutral-100 border border-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black flex justify-between items-center">
            <span>Section I: Archival Document Registration & Classification</span>
            <span className="font-mono">STATUS: {file.status ? file.status.toUpperCase() : "VERIFIED ACTIVE"}</span>
          </div>
          <table className="w-full border-collapse border border-black text-[11px]">
            <tbody>
              <tr>
                <td className="border border-black p-1.5 bg-neutral-50 font-bold w-[20%] text-neutral-800 align-middle">
                  Document Accession No.
                </td>
                <td className="border border-black p-1.5 font-mono font-bold text-black w-[30%] align-middle">
                  {documentIdentifier}
                </td>
                <td className="border border-black p-1.5 bg-neutral-50 font-bold w-[20%] text-neutral-800 align-middle">
                  Registration Date
                </td>
                <td className="border border-black p-1.5 text-black w-[30%] align-middle">
                  {formattedDate}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-neutral-50 font-bold text-neutral-800 align-middle">
                  Official Subject / Title
                </td>
                <td className="border border-black p-1.5 font-semibold text-black align-middle" colSpan="3">
                  {file.subject || file.title || "—"}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-neutral-50 font-bold text-neutral-800 align-middle">
                  Primary Category
                </td>
                <td className="border border-black p-1.5 text-black align-middle">
                  {file.category || "Uncategorized"}
                </td>
                <td className="border border-black p-1.5 bg-neutral-50 font-bold text-neutral-800 align-middle">
                  Document Classification
                </td>
                <td className="border border-black p-1.5 text-black font-medium align-middle">
                  {file.document_type || "Standard Document"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 3. PHYSICAL STORAGE CHAIN OF CUSTODY TABLE */}
        <div className="mb-2.5">
          <div className="bg-neutral-100 border border-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black flex justify-between items-center">
            <span>Section II: Physical Storage Chain of Custody & Repository Location</span>
            <span className="font-mono text-[8.5px]">OFFICE REPOSITORY UNIT</span>
          </div>
          <table className="w-full border-collapse border border-black text-[11px]">
            <tbody>
              <tr>
                <td className="border border-black p-1.5 bg-neutral-50 font-bold w-[20%] text-neutral-800 align-middle">
                  Primary Storage Unit
                </td>
                <td className="border border-black p-1.5 text-black w-[30%] align-middle">
                  <strong>{cabinetName}</strong> <span className="text-neutral-600 text-[10px]">({cabinetType})</span>
                </td>
                <td className="border border-black p-1.5 bg-neutral-50 font-bold w-[20%] text-neutral-800 align-middle">
                  File Box Container
                </td>
                <td className="border border-black p-1.5 text-black w-[30%] align-middle">
                  <strong>{boxName}</strong>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-neutral-50 font-bold text-neutral-800 align-middle">
                  Archfile Binder
                </td>
                <td className="border border-black p-1.5 text-black align-middle" colSpan="3">
                  {archfileName ? (
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{archfileName}</span>
                      {archfileCode && <span className="font-mono text-[10px] text-neutral-700">[{archfileCode}]</span>}
                      {archfileColor && <span className="text-[9.5px] uppercase font-mono px-1 py-0.2 bg-neutral-100 border border-neutral-300">Spine: {archfileColor}</span>}
                    </div>
                  ) : (
                    <span className="text-neutral-600 italic">Direct Unit / Box Placement (Not filed inside a separate Archfile binder)</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 4. CORE DOCUMENT CONTENT SECTION */}
        <div className="mb-2.5">
          <div className="bg-neutral-100 border border-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black mb-1">
            <span>Section III: Official Archival Document Content & Transcript</span>
          </div>

          {/* Case A: Template Document */}
          {TemplateComponent && file.is_generated ? (
            <div className="w-full border border-black p-1 my-1 print-template-container">
              <TemplateComponent document={file} data={unifiedData} />
            </div>
          ) : (
            <div className="space-y-4">
            {/* Metadata Summary Grid for Non-generated Records */}
            <table className="w-full border-collapse border border-black text-xs">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="border border-black p-2 text-center font-bold">DATE</th>
                  <th className="border border-black p-2 text-center font-bold">ACCESS CODE</th>
                  <th className="border border-black p-2 text-center font-bold">SUBJECT</th>
                  <th className="border border-black p-2 text-center font-bold">STATUS</th>
                  <th className="border border-black p-2 text-center font-bold">FILE LOCATION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2 text-center">{formattedDate}</td>
                  <td className="border border-black p-2 text-center font-mono font-bold">{file.access_code || "N/A"}</td>
                  <td className="border border-black p-2 text-center font-medium">{file.subject || file.title || "—"}</td>
                  <td className="border border-black p-2 text-center">{file.status || "Active"}</td>
                  <td className="border border-black p-2 text-center">
                    {file.file_box?.cabinet?.name ? `${file.file_box.cabinet.name} - ${file.file_box.name}` : "Unassigned"}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Electronic Digital File Record */}
            <div className="border border-black p-3 bg-neutral-50">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-black mb-1">
                Electronic Master Repository Filing
              </h4>
              <p className="text-[10px] text-neutral-700 leading-relaxed">
                Source Document: <strong className="font-mono text-black">{file.file_name || "Digital Archival Record"}</strong> &bull;
                Format: <strong className="text-black">{file.file_type || "OFFICIAL DOCUMENT"}</strong> &bull;
                Archival Repository Status: <strong className="text-[#6B1D2A]">Verified Electronic Master on Central Server</strong>.
              </p>
              <p className="text-[9px] text-neutral-600 italic mt-1">
                The digital master artifact is securely preserved in the ZPPSU Guidance electronic repository. Authorized circulation is maintained under the official classification referenced herein.
              </p>
            </div>

            {/* Embedded Image if Applicable */}
            {isImage && fileUrl && (
              <div className="border border-black p-2 text-center">
                <img
                  src={fileUrl}
                  alt={file.title || "Archived Document Attachment"}
                  className="max-h-[500px] mx-auto object-contain"
                />
              </div>
            )}

            {/* OCR Extracted Text Transcript (Clean & Full Height, No Scrollbar) */}
            {file.ocr_text && (
              <div className="border border-black mt-4">
                <div className="bg-neutral-100 border-b border-black p-2">
                  <span className="font-bold text-[11px] uppercase tracking-wide text-black">
                    Certified Semantic Text Transcription (OCR Content)
                  </span>
                  <p className="text-[9px] text-neutral-600 mt-0.5">
                    Machine-indexed text transcript extracted for institutional accessibility and content verification.
                  </p>
                </div>
                <div className="p-4 text-xs font-serif leading-relaxed text-neutral-900 whitespace-pre-wrap bg-white">
                  {file.ocr_text}
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      {/* 5. INSTITUTIONAL SIGNATORY FOOTER (ANCHORED AT BOTTOM) */}
      <footer className="w-full mt-auto pt-4 print-avoid-break">
        <InstitutionalSignatoryBlock
          documentIdentifier={documentIdentifier}
          printDate={formattedDate}
        />
      </footer>
    </div>
  );
}
