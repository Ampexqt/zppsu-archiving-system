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

  const monthName = (() => {
    if (unifiedData.month) return String(unifiedData.month).toUpperCase();
    const d = doc.memo_date || doc.created_at;
    if (d && !isNaN(new Date(d).getTime())) {
      return new Date(d).toLocaleDateString("en-US", { month: "long" }).toUpperCase();
    }
    return "JANUARY";
  })();

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

      {/* INSTITUTIONAL MASTERLIST DOSSIER SHEET (MATCHING EXCEL LAYOUT) */}
      <div className="bg-white border-2 border-black p-5 sm:p-7 shadow-sm rounded-none text-black">
        {/* 1. STATE UNIVERSITY LETTERHEAD (IMAGE 1) */}
        <InstitutionalPrintHeader
          referenceCode={documentIdentifier}
          classification={doc.category || "General"}
          documentType={doc.document_type || "Record"}
          hideTitleStrip={true}
        />

        {/* 2. OFFICIAL TEMPLATE TABLE WITH GOLD BANNER (IMAGE 2) */}
        <div className="template-viewport-container w-full overflow-x-auto mt-3">
          {Component && doc.is_generated ? (
            <Component document={doc} data={unifiedData} />
          ) : (
            <div className="w-full max-w-[950px] mx-auto bg-white border border-black">
              <table className="w-full border-collapse border border-black text-xs">
                <tbody>
                  <tr>
                    <td
                      colSpan="5"
                      className="border border-black font-bold text-center p-2.5 text-sm uppercase bg-white text-black"
                    >
                      ZPPSU MASTERLIST OF RECORDS- {(doc.document_type || "DOCUMENT").toUpperCase()}
                    </td>
                  </tr>
                  <tr className="font-bold text-center text-xs">
                    <td className="border border-black p-2 text-center w-[15%]">Date</td>
                    <td className="border border-black p-2 text-center w-[20%]">ACCESS CODE</td>
                    <td className="border border-black p-2 text-center w-[30%]">SUBJECT</td>
                    <td className="border border-black p-2 text-center w-[15%]">
                      {unifiedData.action_taken ? "ACTION TAKEN" : "STATUS"}
                    </td>
                    <td className="border border-black p-2 text-center w-[20%]">FILE LOCATION</td>
                  </tr>
                  <tr>
                    <td
                      colSpan="5"
                      className="border border-black font-bold p-1.5 text-xs text-black"
                      style={{ backgroundColor: "#F2DFB0" }}
                    >
                      {monthName}
                    </td>
                  </tr>
                  <tr className="text-center text-xs">
                    <td className="border border-black p-2 text-center">{formattedDate}</td>
                    <td className="border border-black p-2 text-center font-mono font-bold">{doc.access_code || "N/A"}</td>
                    <td className="border border-black p-2 text-center font-medium">{unifiedData.subject || doc.title || "—"}</td>
                    <td className="border border-black p-2 text-center">{unifiedData.action_taken || doc.status || "Active"}</td>
                    <td className="border border-black p-2 text-center">{fileLocation}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Uploaded Physical Document Attachment (Only rendered when a file was uploaded via Upload Document workflow) */}
        {!doc.is_generated && doc.file_path && (
          <div className="border border-black p-3 bg-neutral-50 text-left flex items-center justify-between mt-3">
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
    </div>
  );
}

export default DocumentTemplateRenderer;
