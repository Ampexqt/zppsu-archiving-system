  import React, {
    useState,
    useEffect
  } from "react";

  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import axios
    from "axios";

    const documentCategories = {
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

  function Files() {

    const [
      category,
      setCategory
    ] = useState("");

    const [
      documentType,
      setDocumentType
    ] = useState("");

    const [
      formData,
      setFormData
    ] = useState({});

    const [
      generatedRecords,
      setGeneratedRecords
    ] = useState([]);

    const [inventories, setInventories] =
  useState([]);

  const [
  selectedInventory,
  setSelectedInventory
] = useState({});

const [legacyFile, setLegacyFile] =
  useState(null);

const [uploadingLegacy, setUploadingLegacy] =
  useState(false);

    // DOCUMENT CONFIGS
    const documentConfigs = {

    "AACCUP Findings and Recommendations": {

      fields: [

        "access_code",

        "program",

        "file_location",

      ],

    },

"ACCOMPLISHMENT REPORTS": {

  fields: [

    "access_code",

    "subject",

    "file_location",

  ],

},

"ANNUAL REPORTS": {

  fields: [

    "access_code",

    "subject",

    "file_location",

  ],

},

"ASSESSMENT RECORDS OF STUDENTS": {

  fields: [

    "access_code",

    "student_name",

    "file_location",

  ],

},  

"BOARD RESOLUTIONS": {

  fields: [

    "access_code",

    "subject",

    "file_location",

  ],

},

"BUDGET PLAN": {

  fields: [

    "access_code",

    "year_and_proposed_budget",

    "file_location",

  ],

},

"BUDGET PROPOSALS": {

  fields: [

    "access_code",

    "fiscal_year",

    "file_location",

  ],

},

"BUDGETARY REQUIREMENTS": {

  fields: [

    "access_code",

    "fiscal_year",

    "file_location",

  ],

},

 "Checks Issued": {

    fields: [

      "access_code",

      "payee",

      "amount",

      "file_location",

    ],

  },

  "CHED COMMUNICATIONS 2024": {

  fields: [

    "date",

    "access_code",

    "subject",

    "action_taken",

    "file_location",

  ],

},

"CHED Memorandum Orders 2024": {

  fields: [

    "date",

    "access_code",

    "subject",

    "action_taken",

    "file_location",

  ],

},

"Class Program": {

  fields: [

    "access_code",

    "name_of_faculty",

    "academic_year",

    "file_location",

  ],

},

"COA Annual Reports 2024": {

  fields: [

    "date",

    "access_code",

    "subject",

    "action_taken",

    "file_location",

  ],

},

"COA Audit Observation 2024": {

  fields: [

    "date",

    "access_code",

    "subject",

    "action_taken",

    "file_location",

  ],

},  

"COA Circulars": {

  fields: [

    "date",

    "access_code",

    "subject",

    "file_location",

  ],

},

"COA Communications 2024": {

  fields: [

    "date",

    "access_code",

    "subject",

    "action_taken",

    "file_location",

  ],

},

"COA NOTICE OF DISALLOWANCES 2024": {

  fields: [

    "date",

    "access_code",

    "subject",

    "action_taken",

    "file_location",

  ],

},

"COA NOTICE OF SUSPENSION 2024": {

  fields: [

    "date",

    "access_code",

    "subject",

    "action_taken",

    "file_location",

  ],

},

"Master List of Records for Collection": {

  fields: [

    "access_code",

    "receivables_from",

    "amount",

    "file_location",

  ],

},

"Contract of Service (Visiting Lecturers)": {

  fields: [

    "access_code",

    "name",

    "semester_year",

    "file_location",

  ],

},

"COPC": {

  fields: [

    "access_code",

    "program",

    "file_location",

  ],

},

"CSC Circulars": {

  fields: [

    "date",

    "access_code",

    "subject",

    "file_location",

  ],

},

"CSC Communications 2024": {

  fields: [

    "date",

    "access_code",

    "subject",

    "action_taken",

    "file_location",

  ],

},

"Data Analysis": {

  fields: [

    "access_code",

    "subject",

    "file_location",

  ],

},


"DBM Circulars": {

  fields: [

    "date",

    "access_code",

    "subject",

    "action_taken",

    "zppsu_memo_number",

    "file_location",

  ],

},

"DBM Communications 2024": {

  fields: [

    "date",

    "access_code",

    "subject",

    "tracking_details",

    "file_location",

  ],

},

"Disbursements": {

  fields: [

    "access_code",

    "particulars",

    "amount",

    "file_location",

  ],

},

"DOST Communications": {

  fields: [

    "date",

    "access_code",

    "subject",

    "action_taken",

    "file_location",

  ],

},

"HEMIS ": {

  fields: [

    "access_code",

    "semester_school_year",

    "tracking_details",

    "file_location",

  ],

},

"Individual Daily Program IDP": {

  fields: [

    "access_code",

    "name_of_faculty",

    "semester_year",

    "file_location",

  ],

},

"Incoming Communications Outside ZC Perimeter": {

  fields: [

    "date",

    "access_code",

    "agency",

    "subject",

    "action_taken",

    "file_location",

  ],

},

"Incoming Communications Within ZC": {

  fields: [

    "date",

    "access_code",

    "subject",

    "action_taken",

    "file_location",

  ],

},

"IPCR": {

  fields: [

    "access_code",

    "name_of_faculty",

    "semester_year",

    "file_location",

  ],

},

"Job Order Workers": {

  fields: [

    "access_code",

    "name",

    "period",

    "file_location",

  ],

},

"Manuals of Operations": {

  fields: [

    "access_code",

    "subject",

    "file_location",

  ],

},

"Medical Records for Students": {

  fields: [

    "access_code",

    "name",

    "file_location",

  ],

},

 "Memorandum": {

    fields: [

      "date",

      "access_code",

      "zppsu_memo_number",

      "subject",

      "personnel",

      "file_location",

    ],

  },

  "Minutes of Meetings": {

  fields: [

    "access_code",

    "agenda_and_date",

    "file_location",

  ],

},

"MOA/MOU Records": {

  fields: [

    "access_code",

    "agency",

    "subject",

    "file_location",

  ],

},

"Notice of Salary Adjustment (NOSA)": {

  fields: [

    "access_code",

    "personnel_name",

    "year",

    "file_location",

  ],

},

"SALN Records": {

  fields: [

    "access_code",

    "personnel_name",

    "year",

    "file_location",

  ],

},

"Notice of Step Increment (NSI)": {

  fields: [

    "access_code",

    "personnel_name",

    "year",

    "file_location",

  ],

},

"Offenses and Violations": {

  fields: [

    "access_code",

    "student_name",

    "school_year_semester",

    "offenses",

    "file_location",

  ],

},

"Outgoing Communications Outside ZC Perimeter": {

  fields: [

    "date",

    "access_code",

    "concerned_agency",

    "subject",

    "tracking_details",

    "file_location",

  ],

},

"Portfolio of Faculty": {

  fields: [

    "access_code",

    "faculty_name",

    "file_location",

  ],

},

"Purchase Requests": {

  fields: [

    "date",

    "access_code",

    "items",

    "amount",

    "file_location",

  ],

},

"Report of Ratings": {

  fields: [

    "access_code",

    "semester_school_year_course_year",

    "file_location",

  ],

},

"Request Letter Memorandum (RLM)": {

  fields: [

    "date",

    "access_code",

    "subject",

    "action_taken",

    "file_location",

  ],

},

"Special Orders": {

  fields: [

    "date",

    "access_code",

    "subject",

    "personnel",

    "file_location",

  ],

},

"Student Admission Records": {

  fields: [

    "access_code",

    "student_name",

    "semester_year",

    "file_location",

  ],

},

"Students In/Off Campus Teaching": {

  fields: [

    "access_code",

    "student_name",

    "assigned_school",

    "file_location",

  ],

},

"Students Prospectus": {

  fields: [

    "access_code",

    "course_and_year",

    "file_location",

  ],

},

 "Students Thesis": {

      fields: [

        "access_code",

        "student_name",

        "title_of_thesis",

        "file_location",

      ],

    },

    "Students Apprenticeship And Expo (APEX)": {

  fields: [

    "access_code",

    "student_name",

    "course_and_year",

    "file_location",

  ],

},

"Teaching Load": {

  fields: [

    "access_code",

    "faculty_name",

    "academic_year",

    "file_location",

  ],

},

"Trainings And Seminars": {

  fields: [

    "date",

    "access_code",

    "subject",

    "personnel",

    "zppsu_memo_number",

    "file_location",

  ],

},

"Various Records": {

  fields: [

    "access_code",

    "subject",

    "file_location",

  ],

},

"Verification Request": {

  fields: [

    "date",

    "access_code",

    "requesting_party",

    "student_name",

    "action_taken",

    "file_location",

  ],

},

"VPAA Memoranda": {

  fields: [

    "date",

    "access_code",

    "subject",

    "personnel",

    "file_location",

  ],

},

"VPAF Indorsements": {

  fields: [

    "access_code",

    "subject",

    "concerned_personnel",

    "file_location",

  ],

},

"VPAF Memorandum": {

  fields: [

    "date",

    "access_code",

    "subject",

    "personnel",

    "file_location",

  ],

},

"Fordeed of Donations": {

  fields: [

    "access_code",

    "donor",

    "title_of_donation",

    "file_location",

  ],

},

"Free Higher Education Billing Details": {

  fields: [

    "date",

    "access_code",

    "semester",

    "action_taken",

    "file_location",

  ],

},

  };
    // CURRENT FIELDS
    const selectedFields =

      documentConfigs[
        documentType
      ]?.fields || [];

     const assignCabinet =
async (
  fileId,
  inventoryId
) => {

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    await axios.put(

      `http://localhost:5000/api/files/assign/${fileId}`,

      {
        inventory_id:
          inventoryId
      },

      {
        headers: {

          Authorization:
            `Bearer ${token}`

        }
      }

    );

    alert(
      "Assigned successfully"
    );

    fetchFiles();

    fetchInventories();

  } catch (error) {

    console.error(error);

    alert(

      error.response?.data?.message ||

      "Assignment failed"

    );

  }

};   
    
      // FETCH FILES
    const fetchFiles =
      async () => {

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

          setGeneratedRecords(
            response.data
          );

        } catch (error) {

          console.error(error);

        }
      };

      const fetchInventories =
  async () => {

    try {

      const response =
        await axios.get(
          "http://localhost:5000/api/inventory"
        );

      setInventories(
        response.data
      );

    } catch (error) {

      console.error(error);

    }

};

    // LOAD FILES
   useEffect(() => {

  fetchFiles();

  fetchInventories();

}, []);

    // HANDLE INPUT
    const handleChange =
      (field, value) => {

        setFormData({

          ...formData,

          [field]: value,

        });
      };

    // GENERATE DOCUMENT
    const handleGenerate =
      async (e) => {

        e.preventDefault();

        try {

          const token =
  localStorage.getItem("token");

await axios.post(

  "http://localhost:5000/api/files/upload",

  {

    ...formData,

    title:

      formData.subject ||

      formData.student_name ||

      formData.program ||

      "Untitled",

    category,

    access_code:
      formData.access_code,

    subject:

      formData.subject ||

      formData.title_of_thesis ||

      formData.program ||

      "",

    document_type:
      documentType,

    memo_date:
      new Date(),

    received_date:
      new Date(),

  },

  {

    headers: {

      Authorization:
        `Bearer ${token}`,

    },

  }

);

          alert(
          "Document generated successfully!"
        );

        
        // CLEAR INPUTS ONLY
        const clearedData = {};

        selectedFields.forEach((field) => {
          clearedData[field] = "";
        });

        setFormData(clearedData);

        // REFRESH TABLE
        fetchFiles();
        } catch (error) {

          console.error(error);

          alert(
            "Generation failed"
          );
        }
      };

      const handleLegacyUpload = async () => {

  if (!legacyFile) {

    alert("Please select a file.");

    return;

  }

  try {

    setUploadingLegacy(true);

    const token =
      localStorage.getItem("token");

    const formData = new FormData();

    formData.append(
      "file",
      legacyFile
    );

    const response =
      await axios.post(

        "http://localhost:5000/api/files/upload-legacy",

        formData,

        {

          headers: {

            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "multipart/form-data",

          },

        }

      );

    console.log(response.data.extractedText);
    
    setLegacyFile(null);

  } catch (error) {

    console.error(error);

    alert(
      "Legacy upload failed."
    );

  } finally {

    setUploadingLegacy(false);

  }

};

    return (

      <div className="
        w-full
      ">

        <h1 className="
          text-5xl
          font-bold
          mb-2
        ">
          Files Management
        </h1>

        <p className="
          text-gray-500
          mb-10
        ">
          Smart automated
          document generation
        </p>

        <div className="
          bg-white
          rounded-3xl
          shadow-md
          p-8
        ">

          <h2 className="
            text-3xl
            font-bold
            mb-8
          ">
            Generate Document
          </h2>

          <form
            onSubmit={
              handleGenerate
            }
            className="
              grid
              grid-cols-3
              gap-6
            "
          >

            {/* CATEGORY */}
            <select

              value={category}

              onChange={(e) => {

                setCategory(
                  e.target.value
                );

                setDocumentType("");

                setFormData({});

              }}
              className="
                border
                rounded-2xl
                p-4
              "
            >

              <option value="">
                Select Category
              </option>

              <option>
                Administrative
              </option>

              <option>
                Academic
              </option>

              <option>
                Financial
              </option>

            </select>

            {/* DOCUMENT TYPE */}
            <select

              value={
                documentType
              }
              disabled={!category}

              onChange={(e) => {

                setDocumentType(
                  e.target.value
                );

                setFormData({});
              }}

              className="
                border
                rounded-2xl
                p-4
              "
            >

              <option value="">
                Select Document Type
              </option>

              {
                category &&
                documentCategories[category]?.map((doc) => (

                  <option
                    key={doc}
                    value={doc}
                  >
                    {doc}
                  </option>

                ))
              }

            </select>

            <div></div>

            {/* DYNAMIC INPUTS */}
            {

              selectedFields.map(
                (field) => (

                  <input

                    key={field}

                    type="text"

                    placeholder={

                      field

                        .replaceAll(
                          "_",
                          " "
                        )

                        .toUpperCase()

                    }

                    value={
                      formData[
                        field
                      ] || ""
                    }

                    onChange={(e) =>
                      handleChange(

                        field,

                        e.target.value

                      )
                    }

                    className="
                      border
                      rounded-2xl
                      p-4
                    "
                  />

                )
              )

            }

            {/* BUTTON */}
            <button

              type="submit"

              className="
                bg-[#8B0000]
                text-white
                rounded-2xl
                p-4
                font-bold
                col-span-3
                hover:bg-red-900
                transition
              "
            >

              Generate Document

            </button>

          </form>

          {/* LEGACY DOCUMENT UPLOAD */}

<div className="mt-10 border-t pt-8">

  <h2 className="text-3xl font-bold mb-2">
    ≡ƒôä Digitize Legacy Documents
  </h2>

  <p className="text-gray-500 mb-6">
    Upload scanned paper documents to convert them into searchable digital records using OCR.
  </p>

  <input
    type="file"
    accept=".pdf,.jpg,.jpeg,.png"
    onChange={(e) =>
      setLegacyFile(e.target.files[0])
    }
    className="
      border
      rounded-xl
      p-3
      w-full
    "
  />

  <button

  onClick={handleLegacyUpload}

  type="button"

  disabled={

    !legacyFile ||

    uploadingLegacy

  }
    className="
      mt-4
      bg-green-600
      text-white
      px-6
      py-3
      rounded-xl
      hover:bg-green-700
      disabled:bg-gray-400
    "
  >

    {
      uploadingLegacy

      ?

      "Uploading..."

      :

      "≡ƒôñ Upload & Process OCR"

    }

  </button>

</div>

          {/* GENERATED RECORDS */}
          <div className="
            mt-10
          ">

            <h2 className="
              text-3xl
              font-bold
              mb-6
            ">
              Generated Records
            </h2>

            <div className="
              overflow-x-auto
            ">

              <Table className="
                w-full
                border-collapse
              ">

                <TableHeader>

                  <TableRow className="
                    bg-[#8B0000]
                    text-white
                  ">

                    <TableHead className="
                      p-4
                    ">
                      Document Type
                    </TableHead>

                    <TableHead className="
                      p-4
                    ">
                      Access Code
                    </TableHead>

                    <TableHead className="
                      p-4
                    ">
                      Subject
                    </TableHead>

                    <TableHead className="
                      p-4
                    ">
                      Status
                    </TableHead>

                    <TableHead className="p-4">
                      Cabinet
                    </TableHead>

                    <TableHead className="p-4">
                      Action
                    </TableHead>

                    

                  </TableRow>

                </TableHeader>

                <TableBody>

                  {

                    generatedRecords.map(
                      (record) => (

                        <TableRow
                          key={record.id}
                          className="
                            border-b
                          "
                        >

                          <TableCell className="
                            p-4
                          ">
                            {
                              record.document_type
                            }
                          </TableCell>

                          <TableCell className="
                            p-4
                          ">
                            {
                              record.access_code
                            }
                          </TableCell>

                          <TableCell className="
                            p-4
                          ">
                            {
                              record.subject
                            }
                          </TableCell>

                          <TableCell className="
                            p-4
                          ">
                            {
                              record.status
                            }
                          </TableCell>

                          <TableCell className="p-4">

                          <select

                            value={

                              selectedInventory[
                                record.id
                              ] ||

                              record.inventory_id ||

                              ""

                            }

                            onChange={(e) =>

                              setSelectedInventory({

                                ...selectedInventory,

                                [record.id]:
                                  e.target.value,

                              })

                            }

                            className="
                              border
                              rounded-lg
                              p-2
                            "

                          >

                            <option value="">
                              Select Cabinet
                            </option>

                            {inventories.map((inv) => (

                              <option

                                key={inv.id}

                                value={inv.id}

                              >

                                {inv.cabinet_name}

                              </option>

                            ))}

                          </select>

                        </TableCell>

                        <TableCell className="p-4">

                          <button

                            onClick={() =>

                              assignCabinet(

                                record.id,

                                selectedInventory[
                                  record.id
                                ] ||

                                record.inventory_id

                              )

                            }

                            className="
                              bg-blue-500
                              text-white
                              px-4
                              py-2
                              rounded-lg
                            "

                          >

                            {

                              record.inventory_id

                              ?

                              "Move"

                              :

                              "Assign"

                            }

                          </button>

                        </TableCell>
                      </TableRow>

                      )
                    )

                  }

                </TableBody>

              </Table>

            </div>

          </div>

        </div>

      </div>
    );
  }

  export default Files;
