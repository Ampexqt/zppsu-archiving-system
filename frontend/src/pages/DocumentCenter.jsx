  import { useEffect, useState }
  from "react";

  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import axios from "axios";
import { Eye, Download, Edit, RefreshCcw, Trash2 } from "lucide-react";
  import DashboardLayout from
  "../components/layout/DashboardLayout";

  import AccomplishmentReportTemplate
  from "../components/templates/AccomplishmentReportTemplate";

  import AaccupTemplate from "../components/templates/AaccupTemplate";

  import AnnualReportTemplate
  from "../components/templates/AnnualReportTemplate";


  import StudentAccountTemplate
  from "../components/templates/StudentAccountTemplate";

  import BoardResolutionTemplate
  from "../components/templates/BoardResolutionTemplate";

  import BudgetPlanTemplate
  from "../components/templates/BudgetPlanTemplate";

  import BudgetProposalTemplate from "../components/templates/BudgetProposalTemplate";

  import BudgetaryRequirementsTemplate from "../components/templates/BudgetaryRequirementsTemplate";

  import ChecksIssuedTemplate from "../components/templates/ChecksIssuedTemplate";

  import ChedCommunicationTemplate from "../components/templates/ChedCommunicationTemplate";

  import ChedMemoOrderTemplate from "../components/templates/ChedMemoOrderTemplate";

  import ClassProgramTemplate from "../components/templates/ClassProgramTemplate";

  import CoaAnnualReportTemplate from "../components/templates/CoaAnnualReportTemplate";

  import CoaAuditObservationTemplate from "../components/templates/CoaAuditObservationTemplate";

  import CoaCircularTemplate from "../components/templates/CoaCircularTemplate";

  import CoaCommunicationTemplate from "../components/templates/CoaCommunicationTemplate";

  import CoaNoticeDisallowanceTemplate from "../components/templates/CoaNoticeDisallowanceTemplate";

  import CoaNoticeSuspensionTemplate from "../components/templates/CoaNoticeSuspensionTemplate";

  import MasterListOfRecordsForCollectionTemplate from "../components/templates/MasterListOfRecordsForCollectionTemplate";

  import ContractOfServiceVisitingLecturersTemplate from "../components/templates/ContractOfServiceVisitingLecturersTemplate";

  import CopcTemplate from "../components/templates/CopcTemplate";

  import CscCirculars1Template from "../components/templates/CscCirculars1Template";

  import CscCommunications2024Template from "../components/templates/CscCommunications2024Template";

  import DataAnalysisTemplate from "../components/templates/DataAnalysisTemplate";

  import DbmCircularsTemplate from "../components/templates/DbmCircularsTemplate";

  import DbmCirculars1Template from "../components/templates/DbmCirculars1Template";

  import DisbursementsTemplate from "../components/templates/DisbursementsTemplate";

  import DostCommunications2024Template from "../components/templates/DostCommunications2024Template";

  import HemisTemplate from "../components/templates/HemisTemplate";

  import IdpTemplate from "../components/templates/IdpTemplate";

  import IncomingCommunicationsOutsideZcPerimeterTemplate from "../components/templates/IncomingCommunicationsOutsideZcPerimeterTemplate";

  import IncomingCommunicationsOutsideTemplate from "../components/templates/IncomingCommunicationsOutsideTemplate";

  import IpcrTemplate from "../components/templates/IpcrTemplate";

  import JobOrdersTemplate from "../components/templates/JobOrdersTemplate";

  import ManualsTemplate from "../components/templates/ManualsTemplate";

  import MedicalRecordsTemplate from "../components/templates/MedicalRecordsTemplate";

  import MemoOtherMattersTemplate from "../components/templates/MemoOtherMattersTemplate";

  import MemorandumOtherMattersTemplate from "../components/templates/MemorandumOtherMattersTemplate";

  import MinutesOfMeetingsTemplate from "../components/templates/MinutesOfMeetingsTemplate";

  import MoaTemplate from "../components/templates/MoaTemplate";

  import NosaTemplate from "../components/templates/NosaTemplate";

  import SalnTemplate from "../components/templates/SalnTemplate";

  import NsiTemplate from "../components/templates/NsiTemplate";

  import OffensesViolationsTemplate from "../components/templates/OffensesViolationsTemplate";

  import OutgoingCommunicationsOutsideTemplate from "../components/templates/OutgoingCommunicationsOutsideTemplate";

  import PortfolioOfFacultyTemplate from "../components/templates/PortfolioOfFacultyTemplate";

  import PurchaseRequestsTemplate from "../components/templates/PurchaseRequestsTemplate";

  import ReportOfRatingsTemplate from "../components/templates/ReportOfRatingsTemplate";

  import RlmTemplate from "../components/templates/RlmTemplate";

  import SpecialOrdersTemplate from "../components/templates/SpecialOrdersTemplate";

  import StudentAdmissionRecordsTemplate from "../components/templates/StudentAdmissionRecordsTemplate";

  import StudentsInOffCampusTeachingTemplate from "../components/templates/StudentsInOffCampusTeachingTemplate";

  import StudentsProspectusTemplate from "../components/templates/StudentsProspectusTemplate";

  import StudentsThesisTemplate from "../components/templates/StudentsThesisTemplate";

  import StudentsAPEXTemplate from "../components/templates/StudentsAPEXTemplate";

  import TeachingLoadTemplate from "../components/templates/TeachingLoadTemplate";

  import TrainingsAndSeminarsTemplate from "../components/templates/TrainingsAndSeminarsTemplate";

  import VariousRecordsTemplate from "../components/templates/VariousRecordsTemplate";

  import VerificationRequestTemplate from "../components/templates/VerificationRequestTemplate";

  import VPaaMemorandaTemplate from "../components/templates/VPaaMemorandaTemplate";

  import VPAFIndorsementsTemplate from "../components/templates/VPAFIndorsementsTemplate";

  import VPAFMemorandumTemplate from "../components/templates/VPAFMemorandumTemplate";

  import VPREMemorandaTemplate from "../components/templates/VPREMemorandaTemplate";

  import DeedOfDonationsTemplate from "../components/templates/DeedOfDonationsTemplate";

  import FreeHigherEducationBillingTemplate from "../components/templates/FreeHigherEducationBillingTemplate";

  function DocumentCenter() {

    const [files, setFiles] =
      useState([]);

    const [search, setSearch] =
      useState("");
      
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);


    const [selectedYear,
      setSelectedYear] =
        useState("");

    const [selectedMonth,
      setSelectedMonth] =
        useState("");

        const [
    selectedStatus,
    setSelectedStatus
  ] = useState("");

  const [
    selectedType,
    setSelectedType
  ] = useState("");

  const [
    showTrash,
    setShowTrash
  ] = useState(false);

    const [viewingFile,
      setViewingFile] =
        useState(null);

    const [editingFile,
      setEditingFile] =
        useState(null);

    const [editSubject,
      setEditSubject] =
        useState("");

    const [editDocumentType,
      setEditDocumentType] =
        useState("");

        const [
    editStatus,
    setEditStatus
  ] = useState("");

    // FETCH FILES
    const fetchFiles = async () => {

      try {

        const token =
    localStorage.getItem("token");

  const response =
    await axios.get(
      "http://localhost:5000/api/files",
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

   
        setFiles(
          response.data
        );
      } catch (error) {

        console.error(error);
      }
    };

    useEffect(() => {

      fetchFiles();

    }, []);

    useEffect(() => {
      setCurrentPage(1);
    }, [search, selectedYear, selectedMonth, selectedStatus, selectedType, showTrash]);

    const trackAction = async (action, description) => {
      try {
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:5000/api/logs/track", {
          action,
          description
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error("Failed to track action:", error);
      }
    };

    const handleViewFile = (file) => {
      setViewingFile(file);
      trackAction("VIEW", `Viewed ${file.document_type || 'File'} ${file.document_id}`);
    };
  
  // DELETE FILE
  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this document?"
        );

      if (!confirmDelete)
        return;
      
      try {

        // UPDATE UI FIRST
        setFiles((prevFiles) =>

          prevFiles.map((file) =>

            file.id === id

            ?

            {
              ...file,
              is_deleted: true,
              status: "Deleted",
            }

            :

            file

          )

        );

        // THEN API
        const token =
    localStorage.getItem("token");


  await axios.delete(
    `http://localhost:5000/api/files/${id}`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

      } catch (error) {

        console.error(error);

        alert(
          "Delete failed"
        );
      }
    };

    const handlePermanentDelete = async (id) => {

        console.log("PERMANENT DELETE CLICKED", id);

    const confirmDelete =
      window.confirm(
        "Permanently delete this document?"
      );

    if (!confirmDelete)
      return;

    try {

      const token =
    localStorage.getItem("token");

  await axios.delete(
    `http://localhost:5000/api/files/permanent/${id}`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );
      fetchFiles();

    } catch (error) {

      console.error(error);

      alert(
        "Permanent delete failed"
      );

    }

  };

      // QUICK STATUS UPDATE
  const handleQuickStatus =
    async (
      id,
      status
    ) => {

      try {

      const token =
    localStorage.getItem("token");

  await axios.put(

    `http://localhost:5000/api/files/${id}`,

    {

      status,

      is_deleted:
        status === "Deleted",

    },

    {

      headers: {

        Authorization:
          `Bearer ${token}`,

      },

    }

  );

        fetchFiles();

      } catch (error) {

        console.error(error);

        alert(
          "Status update failed"
        );
      }
    };

      // UPDATE FILE
      const handleUpdate =
        async () => {

          try {

          const token =
    localStorage.getItem("token");

  await axios.put(
    `http://localhost:5000/api/files/${editingFile.id}`,
    {
      subject: editSubject,
      document_type: editDocumentType,
      status: editStatus,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

            fetchFiles();

            setEditingFile(
              null
            );

          } catch (error) {

            console.error(error);

            alert(
              "Update failed"
            );
          }
        };


  // DOCUMENT COUNTS
  const totalDocuments =
    files.filter(
      (file) => !file.is_deleted
    ).length;

  const activeDocuments =
    files.filter(
      (file) =>
        file.status === "Active" &&
        !file.is_deleted
    ).length;

  const archivedDocuments =
    files.filter(
      (file) =>
        file.status === "Archived" &&
        !file.is_deleted
    ).length;

  const pendingDocuments =
    files.filter(
      (file) =>
        file.status === "Pending" &&
        !file.is_deleted
    ).length;



    // FILTER FILES
    const filteredFiles =
      files.filter((file) => {

     let smartSearch = search
  .toLowerCase()
  .trim();

  const ignoredWords = [
  "show",
  "find",
  "display",
  "search",
  "document",
  "documents",
  "all",
  "me",
  "please",
];

ignoredWords.forEach((word) => {
  smartSearch = smartSearch.replace(word, "");
});

smartSearch = smartSearch.trim();

const fuzzyMatch = (text, query) => {
  if (!text || !query) return false;

  text = text.toLowerCase();
  query = query.toLowerCase();

  // Exact match
  if (text.includes(query)) return true;

  const words = text.split(/\s+/);

  const levenshtein = (a, b) => {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // replace
            matrix[i][j - 1] + 1,     // insert
            matrix[i - 1][j] + 1      // delete
          );
        }
      }
    }

    return matrix[b.length][a.length];
  };

  for (const word of words) {
    if (levenshtein(word, query) <= 2) {
      return true;
    }
  }

  return false;
};  

  const matchesSearch =

    smartSearch === ""

    ||

    fuzzyMatch
    (file.subject, smartSearch)

    ||

    fuzzyMatch
    (file.document_type, smartSearch)

    ||

    fuzzyMatch
    (file.document_id, smartSearch)

    ||

    fuzzyMatch
    (file.category, smartSearch)

    ||

    fuzzyMatch
    (file.status, smartSearch)

    ||

    file.access_code
      ?.toLowerCase()
      .includes(smartSearch)

    ||

    file.user?.email
      ?.toLowerCase()
      .includes(smartSearch)

    ||

    file.user?.name
      ?.toLowerCase()
      .includes(smartSearch)

    ||

    file.inventory?.cabinet_name
  ?.toLowerCase()
  .includes(smartSearch)

    ||

  file.inventory?.shelf
  ?.toLowerCase()
  .includes(smartSearch)
  
    ||
    
  file.ocr_text
  ?.toLowerCase()
  .includes(smartSearch);  

        const matchesYear =

          selectedYear === ""

          ||

          new Date(
            file.memo_date
          ).getFullYear()
          .toString() ===
          selectedYear;

        const matchesMonth =

          selectedMonth === ""

          ||

          new Date(
            file.memo_date
          ).getMonth()
          .toString() ===
          selectedMonth;

          const matchesStatus =

            selectedStatus === ""

            ||

            file.status ===
            selectedStatus;

          const matchesType =

            selectedType === ""

            ||

            file.document_type ===
            selectedType;

    return (
    matchesSearch &&
    matchesYear &&
    matchesMonth &&
    matchesStatus &&
    matchesType &&
        (

        showTrash

  ?

  file.is_deleted === true

  :

  !file.is_deleted
        )

      );
      });

      const searchResultCount =
    filteredFiles.length;

    const highlightText = (text) => {
  if (!search.trim()) return text;

  const escapedSearch = search.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const regex = new RegExp(`(${escapedSearch})`, "gi");

  return String(text)
    .split(regex)
    .map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-300 rounded px-1"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
};

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFiles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);

    return (

      <DashboardLayout>

        {/* HEADER */}
        <div className="mb-6">

          <h1 className="text-3xl font-bold">

            Document Center

          </h1>

          <p className="text-gray-500 mt-1">

            Smart document retrieval
            and management

          </p>

        </div>


    {/* MINI ANALYTICS */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Total Documents</CardDescription>
        <CardTitle className="text-3xl font-bold text-primary">{totalDocuments}</CardTitle>
      </CardHeader>
    </Card>

    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Active</CardDescription>
        <CardTitle className="text-3xl font-bold text-primary">{activeDocuments}</CardTitle>
      </CardHeader>
    </Card>

    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Archived</CardDescription>
        <CardTitle className="text-3xl font-bold text-primary/60">{archivedDocuments}</CardTitle>
      </CardHeader>
    </Card>

    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Pending</CardDescription>
        <CardTitle className="text-3xl font-bold text-accent">{pendingDocuments}</CardTitle>
      </CardHeader>
    </Card>
  </div>



        {/* DOCUMENT TABLE */}
        <div
          id="print-area"
          className="
            bg-white
            rounded-2xl
            shadow-md
            p-4 sm:p-6
          "
        >
          {/* TOP BAR */}
        <div className="
            flex
            flex-col
            md:flex-row
            items-start
            md:items-center
            justify-between
            gap-4
            mb-6
          ">

            <h2 className="
              text-xl
              font-bold
            ">

              Documents

            </h2>

            {/* FILTERS */}
          <div className="
            flex
            flex-col
            sm:flex-row
            flex-wrap
            items-stretch
            sm:items-center
            gap-3
            w-full
            md:w-auto
          ">

              {/* SEARCH */}
              <input
              type="text"
              placeholder="Smart Search (document, type, uploader, status...)"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full
                md:w-[320px]
                border
                border-gray-300
                rounded-xl
                p-3
                focus:outline-none
                focus:border-[#8B0000]
              "
            />

              {/* MONTH */}
              <select
                value={selectedMonth}
                onChange={(e) =>
                  setSelectedMonth(
                    e.target.value
                  )
                }
                className="
                  border
                  border-gray-300
                  rounded-xl
                  p-3
                  outline-none
                  focus:border-[#8B0000]
                "
              >

                <option value="">
                  All Months
                </option>

                <option value="0">
                  January
                </option>

                <option value="1">
                  February
                </option>

                <option value="2">
                  March
                </option>

                <option value="3">
                  April
                </option>

                <option value="4">
                  May
                </option>

                <option value="5">
                  June
                </option>

                <option value="6">
                  July
                </option>

                <option value="7">
                  August
                </option>

                <option value="8">
                  September
                </option>

                <option value="9">
                  October
                </option>

                <option value="10">
                  November
                </option>

                <option value="11">
                  December
                </option>

              </select>

              {/* YEAR */}
              <select
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(
                    e.target.value
                  )
                }
                className="
                  border
                  border-gray-300
                  rounded-xl
                  p-3
                  outline-none
                  focus:border-[#8B0000]
                "
              >

                <option value="">
                  All Years
                </option>

                {
                  Array.from(
                    { length: 101 },
                    (_, i) => 2100 - i
                  ).map((year) => (

                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>

                  ))
                }

              </select>


                  {/* TRASH TOGGLE */}
                  <button

                    onClick={() =>
                      setShowTrash(
                        !showTrash
                      )
                    }

                    className={`
                      px-5
                      py-3
                      rounded-xl
                      text-sm font-medium
                      transition

                      ${
                        showTrash
                        ?
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                        :
                        "bg-primary/10 text-primary hover:bg-primary/20"
                      }
                    `}
                  >

                    {

                      showTrash

                      ?

                      "Back to Documents"

                      :

                      "View Trash"

                    }

                  </button>

              </div>

                </div>

              {
                search && (
                  <div className="flex justify-between items-center bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 mb-4 mt-4">
                    <div className="text-sm text-foreground flex items-center gap-2">
                      <span className="font-semibold text-primary">Smart Search:</span>
                      <span>Found <span className="font-bold">{searchResultCount}</span> result(s) for "<span className="font-medium">{search}</span>"</span>
                    </div>
                    {filteredFiles.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Top match: <span className="font-medium text-foreground">{filteredFiles[0]?.document_id}</span>
                      </div>
                    )}
                  </div>
                )
              }


              {/* TABLE */}
            <div className="overflow-x-auto">
        <Table className="w-full"> 
                  <TableHeader>

                <TableRow>

                  <TableHead className="
                    p-4
                    text-left
                  ">
                    Document ID
                  </TableHead>

                  <TableHead className="
                    p-4
                    text-left
                  ">
                    Subject
                  </TableHead>

                  <TableHead className="
                    p-4
                    text-left
                  ">
                    Document Type
                  </TableHead>

                  <TableHead className="
                    p-4
                    text-left
                  ">
                    Month and Date
                  </TableHead>

                  <TableHead className="
                    p-4
                    text-left
                  ">
                    Status
                  </TableHead>

                  <TableHead className="
                    p-4
                    text-center
                  ">
                    Actions
                  </TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {
                  filteredFiles.length > 0

                  ?(
          
                currentItems.map((file) => {

                return (
                  
                  <TableRow
                    key={file.id}
                    className="
                      border-b
                      hover:bg-gray-50
                    "
                  >

                      {/* DOCUMENT ID */}
                      <TableCell className="p-4 font-semibold text-primary">
                       {highlightText(file.document_id)}
                      </TableCell>

                      {/* SUBJECT */}
                      <TableCell className="p-4">

                        {highlightText(file.subject)}

                      </TableCell>

                      {/* DOC TYPE */}
                      <TableCell className="p-4">

                        {highlightText(file.document_type)}

                      </TableCell>

                      {/* DATE */}
                      <TableCell className="p-4">

                        {
                          file.memo_date

                          ?

                          new Date(
                            file.memo_date
                          ).toLocaleDateString()

                          :

                          "No Date"
                        }

                      </TableCell>

                      {/* STATUS */}
                      <TableCell className="p-4">

                        <span
                          className={`
                            px-4
                            py-2
                            rounded-full
                            text-white
                            text-sm
                            ${
                              file.status === "Active"
                              ? "bg-primary"
                              : file.status === "Archived"
                              ? "bg-primary/60"
                              : file.status === "Pending"
                              ? "bg-accent text-accent-foreground"
                              : "bg-secondary"
                            }
                          `}
                        >
                        {
                          highlightText(file.status || "Active")
                        }

                        </span>

                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell className="
                        p-4
                      ">

                      <div className="flex flex-wrap items-center gap-1 justify-center min-w-fit">

                          {/* VIEW */}
                          <button
                            onClick={() => handleViewFile(file)}
                            className="p-2.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition flex items-center justify-center shadow-sm"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                        {!showTrash && (
                          <>
                            {/* DOWNLOAD */}
                            <a
                              href={`http://localhost:5000/uploads/${file.file_name}`}
                              download
                              onClick={() => trackAction("DOWNLOAD", `Downloaded ${file.document_type || 'File'} ${file.document_id}`)}
                              className="p-2.5 rounded-lg bg-accent/20 text-yellow-700 hover:bg-accent hover:text-accent-foreground transition flex items-center justify-center shadow-sm"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </a>

                            {/* EDIT */}
                            <button
                              onClick={() => {
                                setEditingFile(file);
                                setEditSubject(file.subject);
                                setEditDocumentType(file.document_type);
                                setEditStatus(file.status || "Active");
                              }}
                              className="p-2.5 rounded-lg bg-accent/20 text-yellow-700 hover:bg-accent hover:text-accent-foreground transition flex items-center justify-center shadow-sm"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </>
                        )}

                            {/* RESTORE */}
                              {showTrash && (
                                <button
                                  onClick={() => handleQuickStatus(file.id, "Active")}
                                  className="p-2.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-600 hover:text-white transition flex items-center justify-center shadow-sm"
                                  title="Restore"
                                >
                                  <RefreshCcw className="w-4 h-4" />
                                </button>
                              )}

                            {/* DELETE */}
                            <button
                              onClick={() =>
                                showTrash ? handlePermanentDelete(file.id) : handleDelete(file.id)
                              }
                              className="p-2.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition flex items-center justify-center shadow-sm"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>

                        </TableCell>
                        </TableRow>

                        );

                        })

                        )

                    :
                <TableRow>

                  <TableCell
                    colSpan="6"
                    className="
                      text-center
                      py-10
                      text-gray-500
                    "
                  >

                    No matching documents found

                  </TableCell>

                </TableRow>

                }
                  

                </TableBody>

              </Table>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t border-gray-100 bg-white gap-4">
                  <div className="text-sm text-gray-500 text-center sm:text-left">
                    Showing <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-medium text-gray-900">{Math.min(indexOfLastItem, filteredFiles.length)}</span> of <span className="font-medium text-gray-900">{filteredFiles.length}</span> results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition font-medium text-gray-700"
                    >
                      Previous
                    </button>
                    <div className="text-sm text-gray-600 font-medium px-2">
                      Page {currentPage} of {totalPages}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition font-medium text-gray-700"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        {/* VIEW MODAL */}
        {
          viewingFile && (

            <div className="
              fixed
              inset-0
              bg-black/40
              flex
              items-center
              justify-center
              z-50
            ">

              <div className="
                bg-white
                rounded-2xl
                p-6
                w-[900px]
                max-h-[95vh]
                overflow-y-auto
              ">

                <div className="
                  flex
                  items-center
                  justify-between
                  mb-6
                ">

                  <h2 className="
                    text-2xl
                    font-bold
                  ">

                    Document Details

                  </h2>

                  <button

                    onClick={() =>
                      setViewingFile(
                        null
                      )
                    } 

                    className="
                      text-gray-500
                      text-xl
                    "
                  >

                    

                  </button>

                </div>

                {/* DETAILS */}
                <div className="
                    grid
                    rid-cols-1
                    md:grid-cols-[1fr_1.8fr]
                    gap-6
                        "
  >

                  {/* LEFT SIDE */}
                  <div className="
                    space-y-4
                  ">

                    <div>

                      <p className="
                        text-gray-500
                        text-sm
                      ">

                        Document ID

                      </p>

                      <p className="
                        font-semibold
                        text-[#8B0000]
                      ">

                        {
                          viewingFile.document_id
                        }

                      </p>

                    </div>

                    <div>

                      <p className="
                        text-gray-500
                        text-sm
                      ">

                        Subject

                      </p>

                      <p className="
                        font-semibold
                      ">

                        {
                          viewingFile.subject
                        }

                      </p>

                    </div>

                    <div>

                      <p className="
                        text-gray-500
                        text-sm
                      ">

                        Document Type

                      </p>

                      <p className="
                        font-semibold
                      ">

                        {
                          viewingFile.document_type
                        }

                      </p>

                    </div>

                    <div>

                      <p className="
                        text-gray-500
                        text-sm
                      ">

                        Status

                      </p>

                      <p className="
                        font-semibold
                      ">

                        {
                          viewingFile.status ||
                          "Active"
                        }

                      </p>

                    </div>

                    {/* DYNAMIC DATA IS RENDERED IN THE TABLE TEMPLATE ON THE RIGHT */}

                  </div>

                  {/* FILE PREVIEW */}

  {
    viewingFile.document_type ===
    "AACCUP Findings and Recommendations"

    ? (

      <AaccupTemplate
        data={
          viewingFile.dynamic_data || {}
        }
      />
    )

    : viewingFile.document_type
      ?.toUpperCase() ===
    "ACCOMPLISHMENT REPORTS"

    ? (

      <AccomplishmentReportTemplate
        document={viewingFile}
      />

    )

    : viewingFile.document_type
      ?.toUpperCase() ===
    "ANNUAL REPORTS"

  ? (

      <AnnualReportTemplate
        document={viewingFile}
      />

  )

  : viewingFile.document_type
      ?.toUpperCase() ===
    "ASSESSMENT RECORDS OF STUDENTS"

  ? (

      <StudentAccountTemplate
        document={viewingFile}
      />

  )

  : viewingFile.document_type
      ?.toUpperCase() ===
    "BOARD RESOLUTIONS"

  ? (

      <BoardResolutionTemplate
        document={viewingFile}
      />

  )

  : viewingFile.document_type
      ?.toUpperCase() ===
    "BUDGET PLAN"

  ? (

      <BudgetPlanTemplate
        document={viewingFile}
      />

  )

  : viewingFile.document_type
      ?.toUpperCase() ===
    "BUDGET PROPOSALS"

  ? (

      <BudgetProposalTemplate
        data={viewingFile.dynamic_data || {}}
      />

  )

  : viewingFile.document_type
      ?.toUpperCase() ===
    "BUDGETARY REQUIREMENTS"

  ? (

      <BudgetaryRequirementsTemplate
        data={viewingFile.dynamic_data || {}}
      />

  )

  : viewingFile.document_type
      ?.toUpperCase() ===
    "CHECKS ISSUED"

  ? (

      <ChecksIssuedTemplate
        data={viewingFile.dynamic_data || {}}
      />

  )

  : viewingFile.document_type
      ?.toUpperCase() ===
    "CHED COMMUNICATIONS 2024"

  ? (

      <ChedCommunicationTemplate
        data={viewingFile.dynamic_data || {}}
      />

  )

  : viewingFile.document_type
      ?.toUpperCase()
      .includes("CHED MEMORANDUM ORDERS 2024")

  ? (

      <ChedMemoOrderTemplate
    data={{
      ...viewingFile.dynamic_data,
      subject: viewingFile.subject
    }}
  />
  )

  : viewingFile.document_type
      ?.toUpperCase()
      .includes("CLASS PROGRAM")

  ? (

      <ClassProgramTemplate
        data={viewingFile.dynamic_data || {}}
      />

  )

  : viewingFile.document_type
      ?.toUpperCase()
      .includes("COA ANNUAL")

  ? (

    <CoaAnnualReportTemplate
    data={{
      ...viewingFile.dynamic_data,
      subject: viewingFile.subject
    }}
  />

  )

  : viewingFile.document_type
      ?.toUpperCase()
      .includes("COA AUDIT OBSERVATION 2024")

  ? (

      <CoaAuditObservationTemplate
        data={{
          ...viewingFile.dynamic_data,
          subject: viewingFile.subject
        }}
      />

  )

  : viewingFile.document_type
      ?.toUpperCase()
      .includes("COA CIRCULAR")

  ? (

      <CoaCircularTemplate
        data={{
          ...viewingFile.dynamic_data,
          subject: viewingFile.subject
        }}
      />

  )

  : viewingFile.document_type
      ?.toUpperCase()
      .includes("COA COMMUNICATION")

  ? (

      <CoaCommunicationTemplate
        data={{
          ...viewingFile.dynamic_data,
          subject: viewingFile.subject
        }}
      />

  )

  : viewingFile.document_type
      ?.toUpperCase()
      .includes("COA NOTICE OF DISALLOWANCES")

  ? (

      <CoaNoticeDisallowanceTemplate
        data={{
          ...viewingFile.dynamic_data,
          subject: viewingFile.subject
        }}
      />

  )

  : viewingFile.document_type
      ?.toUpperCase()
      .includes("COA NOTICE OF SUSPENSION")

  ? (

      <CoaNoticeSuspensionTemplate
        data={{
          ...viewingFile.dynamic_data,
          subject: viewingFile.subject
        }}
      />

  )

  : viewingFile.document_type
      ?.toUpperCase()
      .includes("MASTER LIST OF RECORDS FOR COLLECTION")
  ? (

      <MasterListOfRecordsForCollectionTemplate
        data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("CONTRACT OF SERVICE (VISITING LECTURERS)") ? (

      <ContractOfServiceVisitingLecturersTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )

  : viewingFile.document_type
      ?.toUpperCase()
      .includes("COPC") ? (

      <CopcTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )

  : viewingFile.document_type
      ?.toUpperCase()
      .includes("CSC CIRCULAR") ? (

      <CscCirculars1Template
          data={viewingFile.dynamic_data || {}}
      />

  )

  : viewingFile.document_type
  ?.toUpperCase()
  .includes("CSC COMMUNICATIONS 2024") ? (

  <CscCommunications2024Template
      data={viewingFile.dynamic_data || {}}
  />

  )

  : viewingFile.document_type
  ?.toUpperCase()
  .includes("DATA ANALYSIS") ? (

  <DataAnalysisTemplate
    data={viewingFile.dynamic_data || {}}
  />

  )

  : viewingFile.document_type
  ?.toUpperCase()
  .includes("DBM CIRCULARS") ? (

  <DbmCircularsTemplate
    data={viewingFile.dynamic_data || {}}
  />

  )

  : viewingFile.document_type
  ?.toUpperCase()
  .includes("DBM CIRCULARS1") ? (

  <DbmCirculars1Template
    data={viewingFile.dynamic_data || {}}
  />

  )

  :viewingFile.document_type
    ?.toUpperCase()
    .includes("DISBURSE") ? (

    <DisbursementsTemplate
      data={viewingFile.dynamic_data || {}}
    />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("DOST COMMUNICATIONS") ? (

    <DostCommunications2024Template
      data={viewingFile.dynamic_data || {}}
    />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("HEMIS") ? (

    <HemisTemplate
      data={viewingFile.dynamic_data || {}}
    />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("IDP") ? (

    <IdpTemplate
      data={viewingFile.dynamic_data || {}}
    />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("INCOMING COMMUNICATIONS OUTSIDE ZC PERIMETER") ? (

    <IncomingCommunicationsOutsideZcPerimeterTemplate
      data={viewingFile.dynamic_data || {}}
    />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("OUTSIDE ZC PERIMETER") ? (

    <IncomingCommunicationsOutsideTemplate
      data={viewingFile.dynamic_data || {}}
    />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("IPCR") ? (

    <IpcrTemplate
      data={viewingFile.dynamic_data || {}}
    />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("JOB ORDER WORKERS") ? (

    <JobOrdersTemplate
      data={viewingFile.dynamic_data || {}}
    />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("MANUAL") ? (

    <ManualsTemplate
      data={viewingFile.dynamic_data || {}}
    />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("MEDICAL RECORD") ? (

    <MedicalRecordsTemplate
      data={viewingFile.dynamic_data || {}}
    />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("MEMO") ? (

    <MemoOtherMattersTemplate
      data={viewingFile.dynamic_data || {}}
    />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("MEMORANDUM") ? (

    <MemorandumOtherMattersTemplate
        data={viewingFile.dynamic_data || {}}
    />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("MINUTES OF MEETINGS") ? (

    <MinutesOfMeetingsTemplate
        data={viewingFile.dynamic_data || {}}
    />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("MOA") ? (

    <MoaTemplate
        data={viewingFile.dynamic_data || {}}
    />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("NOSA") ? (

    <NosaTemplate
        data={viewingFile.dynamic_data || {}}
    />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("SALN") ? (

    <SalnTemplate
        data={viewingFile.dynamic_data || {}}
    />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("STEP INCREMENT") ? (

      <NsiTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("OFFENSE") ? (

      <OffensesViolationsTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("OUTGOING COMMUNICATIONS OUTSIDE") ? (

      <OutgoingCommunicationsOutsideTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("PORTFOLIO OF FACULTY") ? (

      <PortfolioOfFacultyTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("PURCHASE REQUEST") ? (

      <PurchaseRequestsTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("REPORT OF RATINGS") ? (

      <ReportOfRatingsTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("RLM") ? (

      <RlmTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("SPECIAL ORDER") ? (

      <SpecialOrdersTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("STUDENT ADMISSION RECORD") ? (

      <StudentAdmissionRecordsTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("STUDENTS IN/OFF CAMPUS TEACHING") ? (

      <StudentsInOffCampusTeachingTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("STUDENTS PROSPECTUS") ? (

      <StudentsProspectusTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("STUDENTS THESIS") ? (

      <StudentsThesisTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("APPRENTICESHIP") ? (

      <StudentsAPEXTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("TEACHING LOAD") ? (

      <TeachingLoadTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("TRAININGS") ? (

      <TrainingsAndSeminarsTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("VARIOUS RECORDS") ? (

      <VariousRecordsTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("VERIFICATION REQUEST") ? (

      <VerificationRequestTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("VPAA MEMORANDA") ? (

      <VPaaMemorandaTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("VPAF INDORSEMENTS") ? (

      <VPAFIndorsementsTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("VPAF MEMORANDUM") ? (

      <VPAFMemorandumTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("VPRE MEMORANDA") ? (

      <VPREMemorandaTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("DEED OF DONATIONS") ? (

      <DeedOfDonationsTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )
  : viewingFile.document_type
      ?.toUpperCase()
      .includes("FREE HIGHER EDUCATION BILLING") ? (

      <FreeHigherEducationBillingTemplate
          data={viewingFile.dynamic_data || {}}
      />

  )



    : viewingFile.file_name
        ?.toLowerCase()
        .endsWith(".pdf")

    ? (

      

      <iframe
        src={`http://localhost:5000/uploads/${viewingFile.file_name}`}
        title="Document Preview"
        className="
          w-full
          h-[600px]
          border
          rounded-2xl
        "
      />

    )

    : (

      <div
    className="
      w-full
      h-[600px]
      border
      rounded-2xl
      flex
      items-center
      justify-center
      text-center
      p-6
      text-gray-500
    "
  >

        Preview not available
        for this file type.

      </div>

    )
  }

                </div>

                {/* ACTIONS */}
                <div className="
                  mt-8
                  flex
                  justify-end
                  gap-3
                ">

                  <a
                    href={`http://localhost:5000/uploads/${viewingFile.file_name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 transition px-5 py-3 rounded-xl font-medium shadow-sm"
                  >
                    Open File
                  </a>

                  <a
                    href={`http://localhost:5000/uploads/${viewingFile.file_name}`}
                    download
                    className="bg-accent/20 text-yellow-700 hover:bg-accent hover:text-accent-foreground transition px-5 py-3 rounded-xl font-medium shadow-sm"
                  >
                    Download
                  </a>

                  <button
                    onClick={() => setViewingFile(null)}
                    className="bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition px-5 py-3 rounded-xl font-medium shadow-sm"
                  >
                    Close
                  </button>

                </div>

              </div>

            </div>

          )
        }

        {/* EDIT MODAL */}
        {
          editingFile && (

            <div className="
              fixed
              inset-0
              bg-black/40
              flex
              items-center
              justify-center
              z-50
            ">

              <div className="
                bg-white
                rounded-2xl
                p-6
                w-[400px]
              ">

                <h2 className="
                  text-2xl
                  font-bold
                  mb-6
                ">

                  Edit Document

                </h2>

                <div className="mb-4">

                  <label className="
                    block
                    mb-2
                    font-semibold
                  ">

                    Subject

                  </label>

                  <input
                    type="text"
                    value={editSubject}
                    onChange={(e) =>
                      setEditSubject(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-xl
                      p-3
                      outline-none
                      focus:border-[#8B0000]
                    "
                  />

                </div>

                <div className="mb-6">

                  <label className="
                    block
                    mb-2
                    font-semibold
                  ">

                    Document Type

                  </label>

                  <input
                    type="text"
                    value={editDocumentType}
                    disabled
                    className="
                      w-full
                      border
                      border-gray-300
                      bg-gray-100
                      text-gray-500
                      cursor-not-allowed
                      rounded-xl
                      p-3
                      outline-none
                    "
                  />

                </div>

                {/* STATUS */}
                <div className="mb-6">

                  <label className="
                    block
                    mb-2
                    font-semibold
                  ">

                    Status

                  </label>

                  <select
                    value={editStatus}
                    onChange={(e) =>
                      setEditStatus(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-xl
                      p-3
                      outline-none
                      focus:border-[#8B0000]
                    "
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Archived">
                      Archived
                    </option>

                    <option value="Pending">
                      Pending
                    </option>

                  </select>

                </div>
                              
                
                <div className="
                  flex
                  justify-end
                  gap-3
                ">

                  <button

                    onClick={() =>
                      setEditingFile(
                        null
                      )
                    }

                    className="
                      border
                      border-gray-300
                      px-4
                      py-2
                      rounded-xl
                    "
                  >

                    Cancel

                  </button>

                  <button

                    onClick={
                      handleUpdate
                    }

                    className="
                      bg-[#8B0000]
                      text-white
                      px-4
                      py-2
                      rounded-xl
                    "
                  >

                    Save

                  </button>

                </div>

              </div>

            </div>

          )
        }

      </DashboardLayout>
    );
  }

  export default DocumentCenter;