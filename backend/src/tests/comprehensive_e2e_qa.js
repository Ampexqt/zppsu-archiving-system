const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const prisma = new PrismaClient();
const API_URL = "http://localhost:5000/api";

const results = [];

function assert(condition, testName, details = "") {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    results.push({ name: testName, status: "PASS", details });
  } else {
    console.error(`[FAIL] ${testName} - ${details}`);
    results.push({ name: testName, status: "FAIL", details });
  }
}

async function runE2ETests() {
  console.log("=================================================");
  console.log("STARTING FULL END-TO-END QA SYSTEM TEST SUITE");
  console.log("=================================================\n");

  const testEmail = `qa_staff_${Date.now()}@zppsu.edu.ph`;
  const testPassword = "StaffPassword123!";
  const testName = "QA Certified Staff Member";

  let staffToken = null;
  let staffUserId = null;
  let adminToken = null;
  let adminUserId = null;

  let testCabinetId = null;
  let testBoxId = null;
  let testCategoryId = null;
  let testFileId = null;

  try {
    // -------------------------------------------------------------------------
    // SECTION 1: AUTHENTICATION & REGISTRATION LIFECYCLE (FRESH USER)
    // -------------------------------------------------------------------------
    console.log("--- 1. Testing Registration & Authentication Lifecycle ---");

    // 1.1 Invalid registration (missing fields)
    try {
      await axios.post(`${API_URL}/auth/register`, { email: testEmail });
      assert(false, "Registration rejects missing fields", "Expected error 400");
    } catch (err) {
      assert(err.response?.status === 400, "Registration rejects missing fields", `Received status ${err.response?.status}`);
    }

    // 1.2 Valid registration
    const regRes = await axios.post(`${API_URL}/auth/register`, {
      name: testName,
      email: testEmail,
      password: testPassword,
      role: "Staff"
    });
    assert(regRes.status === 201 || regRes.status === 200, "Valid registration succeeds", `Status ${regRes.status}`);

    // 1.3 Database persistence verification for new user
    const dbUser = await prisma.users.findUnique({ where: { email: testEmail } });
    assert(!!dbUser, "User persisted in PostgreSQL database", `User ID: ${dbUser?.id}`);
    assert(dbUser?.email === testEmail, "Database email matches registration input");
    staffUserId = dbUser?.id;

    // 1.4 Duplicate registration rejection
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name: testName,
        email: testEmail,
        password: testPassword
      });
      assert(false, "Duplicate registration rejected", "Expected error 400 or 409");
    } catch (err) {
      assert([400, 409].includes(err.response?.status), "Duplicate registration rejected", `Status ${err.response?.status}`);
    }

    // 1.5 Login with invalid credentials rejected
    try {
      await axios.post(`${API_URL}/auth/login`, { email: testEmail, password: "WrongPassword" });
      assert(false, "Login rejects invalid password", "Expected error 400 or 401");
    } catch (err) {
      assert([400, 401].includes(err.response?.status), "Login rejects invalid password", `Status ${err.response?.status}`);
    }

    // 1.6 Login with valid credentials
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: testEmail,
      password: testPassword
    });
    assert(loginRes.status === 200 && !!loginRes.data.token, "Login with valid credentials succeeds and returns JWT");
    staffToken = loginRes.data.token;

    // 1.7 Admin login
    const adminLoginRes = await axios.post(`${API_URL}/auth/login`, {
      email: "admin@example.com",
      password: "password123"
    });
    assert(adminLoginRes.status === 200 && !!adminLoginRes.data.token, "Admin login succeeds");
    adminToken = adminLoginRes.data.token;
    adminUserId = adminLoginRes.data.user?.id;

    // 1.8 Unauthenticated access to protected routes blocked
    try {
      await axios.get(`${API_URL}/dashboard/analytics`);
      assert(false, "Unauthenticated request to /dashboard/analytics blocked", "Expected error 401");
    } catch (err) {
      assert(err.response?.status === 401, "Unauthenticated request to /dashboard/analytics returns 401 Unauthorized");
    }

    // -------------------------------------------------------------------------
    // SECTION 2: PHYSICAL INVENTORY & CATEGORY MANAGEMENT
    // -------------------------------------------------------------------------
    console.log("\n--- 2. Physical Inventory & Storage Management ---");

    // 2.1 Staff cannot create storage cabinet (RBAC)
    try {
      await axios.post(
        `${API_URL}/inventory/cabinets`,
        { name: "Unauthorized Cabinet", capacity: 5 },
        { headers: { Authorization: `Bearer ${staffToken}` } }
      );
      assert(false, "Staff forbidden from creating storage cabinet", "Expected 403 Forbidden");
    } catch (err) {
      assert(err.response?.status === 403, "Staff forbidden from creating storage cabinet", `Status ${err.response?.status}`);
    }

    // 2.2 Admin creates storage cabinet
    const cabRes = await axios.post(
      `${API_URL}/inventory/cabinets`,
      { name: "QA Cabinet Omega", capacity: 10 },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    assert(cabRes.status === 201 || cabRes.status === 200, "Admin creates storage cabinet successfully");
    testCabinetId = cabRes.data.id;

    // Verify DB cabinet persistence
    const dbCab = await prisma.cabinets.findUnique({ where: { id: testCabinetId } });
    assert(dbCab?.name === "QA Cabinet Omega", "Cabinet persisted in PostgreSQL database");

    // 2.3 Staff cannot create file box (RBAC)
    try {
      await axios.post(
        `${API_URL}/inventory/file-boxes`,
        { name: "Unauthorized Box", cabinet_id: testCabinetId, capacity: 5 },
        { headers: { Authorization: `Bearer ${staffToken}` } }
      );
      assert(false, "Staff forbidden from creating file boxes", "Expected 403 Forbidden");
    } catch (err) {
      assert(err.response?.status === 403, "Staff forbidden from creating file boxes", `Status ${err.response?.status}`);
    }

    // 2.4 Admin creates file box container
    const boxRes = await axios.post(
      `${API_URL}/inventory/file-boxes`,
      { name: "QA-BOX-999", cabinet_id: testCabinetId, capacity: 5 },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    assert(boxRes.status === 201 || boxRes.status === 200, "Admin creates file box container successfully");
    testBoxId = boxRes.data.id;

    // Verify DB file box persistence
    const dbBox = await prisma.file_boxes.findUnique({ where: { id: testBoxId } });
    assert(dbBox?.name === "QA-BOX-999" && dbBox.used_space === 0, "File box persisted with initial used_space = 0");

    // 2.5 Admin creates category classification
    const catRes = await axios.post(
      `${API_URL}/categories`,
      { name: "QA Psychological Evaluations" },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    assert(catRes.status === 201 || catRes.status === 200, "Admin creates document classification category");
    testCategoryId = catRes.data.category?.id || catRes.data.id;

    const dbCat = await prisma.categories.findUnique({ where: { id: testCategoryId } });
    assert(dbCat?.name === "QA Psychological Evaluations", "Category persisted in PostgreSQL database");

    // 2.6 Staff can READ categories and cabinets
    const staffCabList = await axios.get(`${API_URL}/inventory/cabinets`, {
      headers: { Authorization: `Bearer ${staffToken}` }
    });
    const staffCatList = await axios.get(`${API_URL}/categories`, {
      headers: { Authorization: `Bearer ${staffToken}` }
    });
    assert(staffCabList.status === 200 && Array.isArray(staffCabList.data), "Staff can read cabinets list");
    assert(staffCatList.status === 200 && Array.isArray(staffCatList.data), "Staff can read categories list");

    // -------------------------------------------------------------------------
    // SECTION 3: DOCUMENT FILING, UPLOAD, AND PHYSICAL LINKING
    // -------------------------------------------------------------------------
    console.log("\n--- 3. Document Lifecycle, Upload & Physical Assignment ---");

    // 3.1 Staff uploads an official guidance document
    const dummyFilePath = path.join(__dirname, "test_sample.pdf");
    fs.writeFileSync(dummyFilePath, "%PDF-1.4 Mock ZPPSU Official Guidance Report File Content");

    const formData = new FormData();
    formData.append("file", fs.createReadStream(dummyFilePath));
    formData.append("document_type", "Guidance Report");
    formData.append("category", "QA Psychological Evaluations");
    formData.append("subject", "Comprehensive Intake Evaluation - Student 2026-001");
    formData.append("file_box_id", testBoxId.toString());

    const uploadRes = await axios.post(`${API_URL}/files/upload`, formData, {
      headers: {
        Authorization: `Bearer ${staffToken}`,
        ...formData.getHeaders()
      }
    });
    assert(uploadRes.status === 201 || uploadRes.status === 200, "Staff document upload succeeds");
    testFileId = uploadRes.data.file?.id || uploadRes.data.data?.id;

    // 3.2 Database verification: File record & storage occupancy increment
    const dbFile = await prisma.files.findUnique({ where: { id: testFileId } });
    assert(!!dbFile, "Uploaded file record persisted in PostgreSQL database");
    assert(dbFile?.uploaded_by === staffUserId, "Uploaded file correctly attributes ownership to staff user");
    assert(dbFile?.file_box_id === testBoxId, "File correctly linked to target file box");

    const dbBoxAfterUpload = await prisma.file_boxes.findUnique({ where: { id: testBoxId } });
    assert(dbBoxAfterUpload?.used_space === 1, "File box used_space accurately incremented from 0 to 1");

    // 3.3 File download verification
    const downloadRes = await axios.get(`http://localhost:5000/${dbFile.file_path}`);
    assert(downloadRes.status === 200, "Uploaded file statically accessible via HTTP URL", `Path: ${dbFile.file_path}`);

    // 3.4 Staff updates own document metadata
    const updateRes = await axios.put(
      `${API_URL}/files/${testFileId}`,
      { subject: "Comprehensive Intake Evaluation - Student 2026-001 (Updated Amendment)" },
      { headers: { Authorization: `Bearer ${staffToken}` } }
    );
    assert(updateRes.status === 200, "Staff can update own document metadata");

    const dbFileUpdated = await prisma.files.findUnique({ where: { id: testFileId } });
    assert(
      dbFileUpdated?.subject === "Comprehensive Intake Evaluation - Student 2026-001 (Updated Amendment)",
      "Updated document metadata persisted in database"
    );

    // 3.5 Staff soft-deletes own document
    const softDeleteRes = await axios.delete(`${API_URL}/files/${testFileId}`, {
      headers: { Authorization: `Bearer ${staffToken}` }
    });
    assert(softDeleteRes.status === 200, "Staff can soft-delete own document");

    const dbFileSoftDeleted = await prisma.files.findUnique({ where: { id: testFileId } });
    assert(dbFileSoftDeleted?.is_deleted === true, "Document flagged as is_deleted=true in database");

    // -------------------------------------------------------------------------
    // SECTION 4: STRICT RBAC BOUNDARIES & PERMISSION VIOLATION BLOCKS
    // -------------------------------------------------------------------------
    console.log("\n--- 4. RBAC Boundary Enforcement & Forbidden Mutations ---");

    // 4.1 Staff forbidden from accessing user management
    try {
      await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${staffToken}` }
      });
      assert(false, "Staff forbidden from GET /api/users", "Expected 403 Forbidden");
    } catch (err) {
      assert(err.response?.status === 403, "Staff forbidden from GET /api/users", `Status ${err.response?.status}`);
    }

    // 4.2 Staff forbidden from accessing global audit logs
    try {
      await axios.get(`${API_URL}/logs`, {
        headers: { Authorization: `Bearer ${staffToken}` }
      });
      assert(false, "Staff forbidden from GET /api/logs", "Expected 403 Forbidden");
    } catch (err) {
      assert(err.response?.status === 403, "Staff forbidden from GET /api/logs", `Status ${err.response?.status}`);
    }

    // 4.3 Staff forbidden from accessing accomplishment reports
    try {
      await axios.get(`${API_URL}/accomplishments`, {
        headers: { Authorization: `Bearer ${staffToken}` }
      });
      assert(false, "Staff forbidden from GET /api/accomplishments", "Expected 403 Forbidden");
    } catch (err) {
      assert(err.response?.status === 403, "Staff forbidden from GET /api/accomplishments", `Status ${err.response?.status}`);
    }

    // 4.4 Staff forbidden from restoring deleted records
    try {
      await axios.put(
        `${API_URL}/files/restore/${testFileId}`,
        {},
        { headers: { Authorization: `Bearer ${staffToken}` } }
      );
      assert(false, "Staff forbidden from PUT /api/files/restore/:id", "Expected 403 Forbidden");
    } catch (err) {
      assert(err.response?.status === 403, "Staff forbidden from PUT /api/files/restore/:id", `Status ${err.response?.status}`);
    }

    // 4.5 Staff forbidden from permanent deletion
    try {
      await axios.delete(`${API_URL}/files/permanent/${testFileId}`, {
        headers: { Authorization: `Bearer ${staffToken}` }
      });
      assert(false, "Staff forbidden from DELETE /api/files/permanent/:id", "Expected 403 Forbidden");
    } catch (err) {
      assert(err.response?.status === 403, "Staff forbidden from DELETE /api/files/permanent/:id", `Status ${err.response?.status}`);
    }

    // -------------------------------------------------------------------------
    // SECTION 5: ADMIN WORKFLOWS, REPORT GENERATION & DATA INTEGRITY
    // -------------------------------------------------------------------------
    console.log("\n--- 5. Admin Workflows, Reports & System Integrity ---");

    // 5.1 Admin restores the soft-deleted file
    const restoreRes = await axios.put(
      `${API_URL}/files/restore/${testFileId}`,
      {},
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    assert(restoreRes.status === 200, "Admin restores soft-deleted file successfully");

    const dbFileRestored = await prisma.files.findUnique({ where: { id: testFileId } });
    assert(dbFileRestored?.is_deleted === false && dbFileRestored?.status === "Active", "File restored to active in database");

    // 5.2 Admin generates Accomplishment Report with PDF Export
    const exportRes = await axios.post(
      `${API_URL}/accomplishments/export`,
      {
        action: "Export Accomplishment PDF",
        export_format: "PDF",
        year: 2026,
        summary_stats: { total: 1, active: 1, deleted: 0 }
      },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    const accomplishmentPdfUrl = exportRes.data.file?.file_path || exportRes.data.downloadUrl;
    assert(exportRes.status === 201 || exportRes.status === 200 && !!accomplishmentPdfUrl, "Admin exports Accomplishment Report PDF successfully");

    const pdfFetch = await axios.get(`http://localhost:5000/${accomplishmentPdfUrl}`);
    assert(pdfFetch.status === 200, "Generated Accomplishment Report PDF accessible and downloadable via static URL");

    // 5.3 Admin permanently deletes the test file
    const permDeleteRes = await axios.delete(`${API_URL}/files/permanent/${testFileId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(permDeleteRes.status === 200, "Admin permanently deletes file record");

    // Verify DB permanent deletion & file box used_space decrement
    const dbFileDeleted = await prisma.files.findUnique({ where: { id: testFileId } });
    assert(dbFileDeleted === null, "File completely removed from PostgreSQL database");

    const dbBoxAfterPermDelete = await prisma.file_boxes.findUnique({ where: { id: testBoxId } });
    assert(dbBoxAfterPermDelete?.used_space === 0, "File box used_space decremented back to 0");

    // 5.4 Admin deletion protection: Cannot delete another Admin
    const secondAdminEmail = `admin_peer_${Date.now()}@zppsu.edu.ph`;
    const secondAdmin = await prisma.users.create({
      data: {
        name: "Peer Admin",
        email: secondAdminEmail,
        password: "hashed_dummy_pw",
        role: "Admin"
      }
    });

    try {
      await axios.delete(`${API_URL}/users/${secondAdmin.id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      assert(false, "System blocks deletion of Admin accounts", "Expected 403 Forbidden");
    } catch (err) {
      assert(err.response?.status === 403, "System blocks deletion of Admin accounts", `Status ${err.response?.status}`);
    }

    // Clean up peer admin
    await prisma.users.delete({ where: { id: secondAdmin.id } });

    // 5.5 Audit logs verification
    const logsRes = await axios.get(`${API_URL}/logs`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(logsRes.status === 200 && Array.isArray(logsRes.data), "Admin can view system audit logs");
    assert(logsRes.data.length > 0, "Audit logs contain recorded system activities");

    // -------------------------------------------------------------------------
    // SECTION 6: CLEANUP
    // -------------------------------------------------------------------------
    console.log("\n--- 6. Test Teardown & Database Cleanup ---");
    if (testBoxId) await prisma.file_boxes.delete({ where: { id: testBoxId } });
    if (testCabinetId) await prisma.cabinets.delete({ where: { id: testCabinetId } });
    if (testCategoryId) await prisma.categories.delete({ where: { id: testCategoryId } });
    if (staffUserId) await prisma.users.delete({ where: { id: staffUserId } });
    if (fs.existsSync(dummyFilePath)) fs.unlinkSync(dummyFilePath);
    console.log("Cleanup completed cleanly.");

  } catch (error) {
    console.error("UNEXPECTED ERROR DURING E2E SUITE:", error);
  } finally {
    await prisma.$disconnect();
    console.log("\n=================================================");
    console.log("TEST RUN COMPLETE");
    console.log(`TOTAL TESTS: ${results.length}`);
    const passed = results.filter((r) => r.status === "PASS").length;
    const failed = results.filter((r) => r.status === "FAIL").length;
    console.log(`PASSED: ${passed}`);
    console.log(`FAILED: ${failed}`);
    console.log("=================================================");
  }
}

runE2ETests();
