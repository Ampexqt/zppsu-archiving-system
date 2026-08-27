import React, { useState } from "react";
import { Sparkles, Download, Copy, Check, FileText, ExternalLink, FileSpreadsheet } from "lucide-react";
import ExcelJS from "exceljs";
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
  const [copied, setCopied] = useState(false);
  if (!document) return null;

  const docTypeKey = (document.document_type || "").toUpperCase().trim();
  const Component = templateMap[docTypeKey];

  if (Component && document.is_generated) {
    return <Component document={document} data={document.dynamic_data || document} />;
  }

  const fileUrl = document.file_path 
    ? (document.file_path.startsWith("http") ? document.file_path : `http://localhost:5000/${document.file_path}`)
    : null;

  const isPdf = document.file_name?.toLowerCase().endsWith(".pdf") || document.file_type === "PDF";
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(document.file_name || "") || ["JPG", "JPEG", "PNG", "WEBP"].includes(document.file_type);

  const handleCopyOcr = () => {
    if (document.ocr_text) {
      navigator.clipboard.writeText(document.ocr_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Masterlist");

    const titleStr = `ZPPSU MASTERLIST OF RECORDS - ${(document.document_type || "DOCUMENT").toUpperCase()}`;

    // Add Title
    sheet.mergeCells("A1:E1");
    const titleRow = sheet.getCell("A1");
    titleRow.value = titleStr;
    titleRow.font = { bold: true, size: 14 };
    titleRow.alignment = { horizontal: "center", vertical: "middle" };

    // Add Headers
    const headerRow = sheet.addRow(["DATE", "ACCESS CODE", "SUBJECT", "STATUS", "FILE LOCATION"]);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });

    // Add Data
    const dataRow = sheet.addRow([
      new Date(document.created_at || Date.now()).toLocaleDateString(),
      document.document_id || document.access_code || `DOC-${document.id}`,
      document.subject || document.title || "—",
      document.status || "Active",
      document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : "Unassigned"
    ]);
    dataRow.eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });

    sheet.columns = [
      { width: 15 },
      { width: 20 },
      { width: 35 },
      { width: 15 },
      { width: 25 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = `${document.document_id || "Document"}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* METADATA SUMMARY TABLE */}
      <div className="w-full max-w-[950px] mx-auto bg-white border border-black overflow-hidden">
        <table className="w-full border-collapse border border-black text-sm text-black font-sans">
          <tbody>
            <tr>
              <td colSpan="5" className="border border-black text-center font-bold text-lg p-3 bg-white uppercase">
                ZPPSU MASTERLIST OF RECORDS - {document.document_type || "DOCUMENT"}
              </td>
            </tr>
            <tr className="bg-white">
              <td className="border border-black text-center font-bold p-2 w-[15%]">DATE</td>
              <td className="border border-black text-center font-bold p-2 w-[20%]">ACCESS CODE</td>
              <td className="border border-black text-center font-bold p-2 w-[30%]">SUBJECT</td>
              <td className="border border-black text-center font-bold p-2 w-[15%]">STATUS</td>
              <td className="border border-black text-center font-bold p-2 w-[20%]">FILE LOCATION</td>
            </tr>
            <tr className="bg-white">
              <td className="border border-black text-center p-2">
                {new Date(document.created_at || Date.now()).toLocaleDateString()}
              </td>
              <td className="border border-black text-center p-2">
                {document.document_id || document.access_code || `DOC-${document.id}`}
              </td>
              <td className="border border-black text-center p-2">
                {document.subject || document.title || "—"}
              </td>
              <td className="border border-black text-center p-2">
                {document.status || "Active"}
              </td>
              <td className="border border-black text-center p-2">
                {document.file_box?.cabinet?.name ? `${document.file_box.cabinet.name} - ${document.file_box.name}` : "Unassigned"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-2 max-w-[950px] mx-auto">
        <button
          onClick={handleExportExcel}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#E8E3E1] bg-[#FFFCF7] text-xs font-bold text-[#1D1A1B] hover:bg-[#F4E7EA] transition-colors shadow-xs cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>Export to Excel</span>
        </button>
        {fileUrl && (
          <a
            href={fileUrl}
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#6B1D2A] text-xs font-bold text-[#FFFCF7] hover:bg-[#8B3545] transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </a>
        )}
      </div>

      {/* EMBEDDED DOCUMENT VIEWER */}
      {fileUrl && (
        <div className="p-4 bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1D1A1B]">Document Preview</span>
            <span className="text-[11px] text-[#5F5A5C] font-mono">{document.file_name}</span>
          </div>

          {isPdf ? (
            <iframe
              src={fileUrl}
              className="w-full h-[650px] rounded-xl border border-[#E8E3E1] bg-white shadow-inner"
              title="Document PDF Preview"
            />
          ) : isImage ? (
            <div className="flex justify-center p-4 bg-[#F4E7EA]/30 rounded-xl border border-[#E8E3E1]">
              <img
                src={fileUrl}
                alt={document.title || "Document Image"}
                className="max-h-[600px] w-auto rounded-lg object-contain shadow-xs"
              />
            </div>
          ) : (
            <div className="p-8 text-center bg-[#F4E7EA]/20 rounded-xl border border-[#E8E3E1] space-y-3">
              <FileText className="w-10 h-10 text-[#6B1D2A] mx-auto" />
              <p className="text-xs text-[#5F5A5C]">
                Preview not directly supported in-browser for this file format ({document.file_type || "Document"}).
              </p>
              <a
                href={fileUrl}
                download
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6B1D2A] text-xs font-bold text-[#FFFCF7] hover:bg-[#8B3545] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download {document.file_name}</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* OCR EXTRACTED TEXT TRANSCRIPT */}
      {document.ocr_text && (
        <div className="p-5 bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E8E3E1] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#F2DFB0] border border-[#C99A2E] text-[#A87818]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider">AI & OCR Extracted Content</h4>
                <p className="text-[10px] text-[#5F5A5C]">Extracted textual content for semantic indexing</p>
              </div>
            </div>
            <button
              onClick={handleCopyOcr}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E8E3E1] bg-[#FFFCF7] text-[11px] font-semibold text-[#1D1A1B] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3 text-[#5F5A5C]" />}
              <span>{copied ? "Copied" : "Copy Text"}</span>
            </button>
          </div>
          <div className="p-4 rounded-xl bg-[#F4E7EA]/40 border border-[#E8E3E1] text-[#1D1A1B] font-mono text-xs whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed selection:bg-[#F2DFB0]">
            {document.ocr_text}
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentTemplateRenderer;
