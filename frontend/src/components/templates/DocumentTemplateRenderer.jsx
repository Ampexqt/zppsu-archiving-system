import React, { useState } from "react";
import { 
  FileSpreadsheet, 
  Download, 
  ScanText, 
  Check, 
  Copy, 
  FileText, 
  ShieldCheck, 
  Building2, 
  FolderArchive 
} from "lucide-react";
import InstitutionalPrintHeader from "../common/InstitutionalPrintHeader";
import InstitutionalSignatoryBlock from "../common/InstitutionalSignatoryBlock";
import { exportSingleDocumentExcel } from "../../utils/singleDocumentExcelExporter";
import { API_BASE_URL } from "../../services/api";
import { 
  formatLocationWithColorName, 
  getColorNameFromHex, 
  stripColorTag, 
  parseBoxHierarchy 
} from "../inventory/storageTaxonomy";

// Import all specific templates for modular rendering
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

/**
 * DocumentTemplateRenderer
 * Full Institutional Archival Record Dossier Sheet.
 * Perfectly mirrors the Excel spreadsheet format, print sheet layout, and official state university styling.
 */
function DocumentTemplateRenderer({ document: doc }) {
  const [copied, setCopied] = useState(false);
  if (!doc) return null;

  const docTypeKey = (doc.document_type || "").toUpperCase().trim();
  const Component = templateMap[docTypeKey];
  const documentIdentifier = doc.document_id || doc.access_code || `DOC-${doc.id || "RECORD"}`;

  const formattedDate = doc.created_at
    ? new Date(doc.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  // Physical Location parsing with color resolution (no raw hex codes!)
  const boxParsed = doc.file_box ? parseBoxHierarchy(doc.file_box.name) : null;
  const cabinetName = doc.file_box?.cabinet?.name || "Unassigned Storage Unit";
  const cabinetType = doc.file_box?.cabinet?.type || "Unit";
  const boxName = stripColorTag(boxParsed?.parentBoxName || (!boxParsed?.isArchfile ? doc.file_box?.name : "Direct Placement") || "Unassigned Box Container");
  const archfileName = stripColorTag(doc.archfile?.name || doc.file_box?.archfile?.name || boxParsed?.archfileName || null);
  const archfileCode = doc.archfile?.code || doc.file_box?.archfile?.code || null;
  const rawColor = doc.archfile?.color_tag || doc.file_box?.archfile?.color_tag || boxParsed?.color || null;
  const archfileColorName = getColorNameFromHex(rawColor);

  const rawData = doc.dynamic_data || {};
  const computedLocation = doc.file_box?.cabinet?.name
    ? `${doc.file_box.cabinet.name} - ${doc.file_box.name}`
    : (doc.file_box?.name || rawData.file_location || "Unassigned");
  const fileLocation = formatLocationWithColorName(rawData.file_location || computedLocation);

  const unifiedData = {
    ...doc,
    ...rawData,
    subject: rawData.subject || doc.subject || doc.title || "—",
    access_code: rawData.access_code || doc.access_code || "N/A",
    date: rawData.date || formattedDate,
    file_location: fileLocation,
  };

  const handleExportExcel = async () => {
    try {
      await exportSingleDocumentExcel(doc, unifiedData);
      trackDownload("Excel spreadsheet");
    } catch (err) {
      console.error("Failed to export institutional excel:", err);
    }
  };

  const trackDownload = async (type = "file") => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`${API_BASE_URL}/api/logs/track`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            action: "DOWNLOAD",
            description: `Downloaded ${type} for ${doc.file_name || doc.document_id || "Document"}`,
            file_id: doc.id,
            document_id: doc.document_id,
            module: "documents"
          })
        });
      }
    } catch (e) {
      console.error("Track download error:", e);
    }
  };

  const handleCopyOcr = () => {
    if (doc.ocr_text) {
      navigator.clipboard.writeText(doc.ocr_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4 font-sans max-w-[950px] mx-auto">
      {/* EXPORT ACTION TOOLBAR */}
      <div className="flex items-center justify-between bg-[#FFFCF7] p-2.5 px-4 rounded-xl border border-[#E8E3E1] shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#A87818] uppercase tracking-wider bg-[#F2DFB0]/50 px-2 py-0.5 rounded-md border border-[#C99A2E]/30">
            Institutional Master Record
          </span>
          <span className="text-xs text-[#5F5A5C] hidden sm:inline">
            Republic of the Philippines &bull; ZPPSU Archival Records Registry
          </span>
        </div>
        <button
          onClick={handleExportExcel}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#E8E3E1] bg-[#FFFCF7] text-xs font-bold text-[#1D1A1B] hover:bg-[#F4E7EA] transition-colors shadow-xs cursor-pointer"
          title="Export record in official state university Excel layout"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#6B1D2A]" />
          <span>Export to Excel</span>
        </button>
      </div>

      {/* INSTITUTIONAL DOSSIER SHEET (MATCHING EXCEL & PRINT LAYOUT) */}
      <div className="bg-white border-2 border-black p-5 sm:p-7 shadow-sm rounded-none text-black">
        {/* 1. STATE UNIVERSITY LETTERHEAD */}
        <InstitutionalPrintHeader
          title={doc.is_generated ? `MASTERLIST OF RECORDS FOR ${(doc.document_type || "DOCUMENT").toUpperCase()}` : "OFFICIAL ARCHIVAL RECORD DOSSIER"}
          referenceCode={documentIdentifier}
          classification={doc.category || "General"}
          documentType={doc.document_type || "Record"}
        />

        {/* 2. SECTION I: REGISTRATION & CLASSIFICATION */}
        <div className="mb-4">
          <div className="bg-neutral-100 border border-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black flex justify-between items-center">
            <span>Section I: Archival Document Registration & Classification</span>
            <span className="font-mono text-[9px] font-bold">STATUS: {(doc.status || "ACTIVE").toUpperCase()}</span>
          </div>
          <table className="w-full border-collapse border border-black text-xs">
            <tbody>
              <tr>
                <td className="border border-black p-2 bg-neutral-50 font-bold w-[20%] text-neutral-800 align-middle">
                  Document Accession No.
                </td>
                <td className="border border-black p-2 font-mono font-bold text-black w-[30%] align-middle text-center">
                  {documentIdentifier}
                </td>
                <td className="border border-black p-2 bg-neutral-50 font-bold w-[20%] text-neutral-800 align-middle">
                  Registration Date
                </td>
                <td className="border border-black p-2 text-black w-[30%] align-middle text-center">
                  {formattedDate}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 bg-neutral-50 font-bold text-neutral-800 align-middle">
                  Official Subject / Title
                </td>
                <td className="border border-black p-2 font-semibold text-black align-middle text-center" colSpan="3">
                  {unifiedData.subject || doc.title || "—"}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 bg-neutral-50 font-bold text-neutral-800 align-middle">
                  Primary Category
                </td>
                <td className="border border-black p-2 text-black align-middle text-center">
                  {doc.category || "Uncategorized"}
                </td>
                <td className="border border-black p-2 bg-neutral-50 font-bold text-neutral-800 align-middle">
                  Document Classification
                </td>
                <td className="border border-black p-2 text-black font-medium align-middle text-center">
                  {doc.document_type || "Standard Document"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 3. SECTION II: PHYSICAL STORAGE CHAIN OF CUSTODY */}
        <div className="mb-4">
          <div className="bg-neutral-100 border border-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black flex justify-between items-center">
            <span>Section II: Physical Storage Chain of Custody & Repository Location</span>
            <span className="font-mono text-[9px]">OFFICE REPOSITORY UNIT</span>
          </div>
          <table className="w-full border-collapse border border-black text-xs">
            <tbody>
              <tr>
                <td className="border border-black p-2 bg-neutral-50 font-bold w-[20%] text-neutral-800 align-middle">
                  Primary Storage Unit
                </td>
                <td className="border border-black p-2 text-black w-[30%] align-middle text-center">
                  <strong>{cabinetName}</strong> <span className="text-neutral-600 text-[10px]">({cabinetType})</span>
                </td>
                <td className="border border-black p-2 bg-neutral-50 font-bold w-[20%] text-neutral-800 align-middle">
                  File Box Container
                </td>
                <td className="border border-black p-2 text-black w-[30%] align-middle text-center">
                  <strong>{boxName}</strong>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 bg-neutral-50 font-bold text-neutral-800 align-middle">
                  Archfile Binder
                </td>
                <td className="border border-black p-2 text-black align-middle text-center" colSpan="3">
                  {archfileName ? (
                    <div className="inline-flex items-center gap-2 justify-center">
                      <span className="font-bold">{archfileName}</span>
                      {archfileCode && <span className="font-mono text-[10px] text-neutral-700">[{archfileCode}]</span>}
                      {archfileColorName && (
                        <span 
                          className="text-[9.5px] uppercase font-bold px-2 py-0.5 rounded border border-black/20"
                          style={{ backgroundColor: `${rawColor}15`, color: rawColor || "#6B1D2A" }}
                        >
                          Spine: {archfileColorName}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-neutral-600 italic">Direct Unit / Box Placement (Not filed inside a separate Archfile binder)</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 bg-neutral-50 font-bold text-neutral-800 align-middle">
                  Full Location Coordinate
                </td>
                <td className="border border-black p-2 font-mono font-medium text-black align-middle text-center" colSpan="3">
                  {fileLocation}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 4. SECTION III: OFFICIAL ARCHIVE RECORD DATA */}
        <div className="mb-4">
          <div className="bg-neutral-100 border border-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black mb-2">
            <span>Section III: Official Archival Document Content & Transcript</span>
          </div>

          {/* Record Table */}
          <div className="template-viewport-container w-full overflow-x-auto mb-3">
            {Component && doc.is_generated ? (
              <Component document={doc} data={unifiedData} />
            ) : (
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
                    <td className="border border-black p-2 text-center font-mono font-bold">{doc.access_code || "N/A"}</td>
                    <td className="border border-black p-2 text-center font-medium">{unifiedData.subject || doc.title || "—"}</td>
                    <td className="border border-black p-2 text-center">{doc.status || "Active"}</td>
                    <td className="border border-black p-2 text-center">{fileLocation}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {/* Uploaded Physical Document Attachment (Only rendered when a file was uploaded via Upload Document workflow) */}
          {!doc.is_generated && doc.file_path && (
            <div className="border border-black p-3 bg-neutral-50 text-left flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-black uppercase">Original Uploaded File</p>
                <p className="text-[11px] text-neutral-700 font-mono">{doc.file_name || "Attachment"}</p>
              </div>
              <a
                href={`${API_BASE_URL}/${doc.file_path}`}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#6B1D2A] text-white text-xs font-bold rounded hover:bg-[#8B3545]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Attachment</span>
              </a>
            </div>
          )}

          {/* OCR Extracted Text Transcript if present */}
          {doc.ocr_text && (
            <div className="border border-black mt-3">
              <div className="bg-neutral-100 border-b border-black p-2 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[11px] uppercase tracking-wide text-black">
                    Certified Semantic Text Transcription (OCR Content)
                  </span>
                  <p className="text-[9px] text-neutral-600">Machine-indexed transcript extracted for searchability</p>
                </div>
                <button
                  onClick={handleCopyOcr}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-black/30 bg-white text-[10px] font-semibold text-black hover:bg-neutral-100 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-[#6B1D2A]" /> : <Copy className="w-3 h-3 text-neutral-600" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="p-3 text-xs font-serif leading-relaxed text-neutral-900 whitespace-pre-wrap bg-white text-left max-h-48 overflow-y-auto">
                {doc.ocr_text}
              </div>
            </div>
          )}
        </div>

        {/* 5. INSTITUTIONAL SIGNATORY FOOTER (2-COLUMN SIGNATORIES + RA 9470 NOTICE) */}
        <div className="mt-5 pt-3 border-t border-black">
          <InstitutionalSignatoryBlock
            documentIdentifier={documentIdentifier}
            printDate={formattedDate}
          />
        </div>
      </div>
    </div>
  );
}

export default DocumentTemplateRenderer;
