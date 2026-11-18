const { chromium } = require("playwright");
const assert = require("assert");

const BASE_URL = "http://localhost:5174";
const ADMIN_USER = {
  email: "admin@example.com",
  password: "password123",
  name: "System Admin",
};
const STAFF_USER = {
  email: "jhonharoldrueda@gmail.com",
  password: "StaffPassword123!",
  name: "Jhon Harold Rueda",
};

let passedTests = 0;
let totalTests = 0;

function logPass(msg) {
  passedTests++;
  console.log(`  \x1b[32m✔ PASS:\x1b[0m ${msg}`);
}

function logFail(msg, err) {
  console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${msg}`);
  if (err) console.error("    ", err.message || err);
}

async function runE2ETests() {
  console.log("\n=======================================================");
  console.log("  ZPPSU ARCHIVING SYSTEM - FULL E2E PLAYWRIGHT SUITE");
  console.log("  Testing all conversation features across Admin & Staff");
  console.log("=======================================================\n");

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    // ==============================================================
    // SUITE 1: ADMINISTRATOR WORKFLOW & VERIFICATION
    // ==============================================================
    console.log("\x1b[34m[SUITE 1: ADMINISTRATOR ROLE & FULL AUDIT CONTROLS]\x1b[0m");
    const adminContext = await browser.newContext({
      viewport: { width: 1366, height: 768 },
    });
    const adminPage = await adminContext.newPage();

    // 1.1 Admin Login
    totalTests++;
    try {
      await adminPage.goto(`${BASE_URL}/login`);
      await adminPage.waitForSelector("input[type='email']", { timeout: 10000 });
      await adminPage.fill("input[type='email']", ADMIN_USER.email);
      await adminPage.fill("input[type='password']", ADMIN_USER.password);
      await adminPage.click("button[type='submit']");
      await adminPage.waitForURL("**/dashboard", { timeout: 10000 });
      logPass("Admin logged in successfully and navigated to /dashboard");
    } catch (err) {
      logFail("Admin login failed", err);
    }

    // 1.2 Dashboard Real-Time Stream (No 'undefined', No 'document' title, No horizontal clipping)
    totalTests++;
    try {
      await adminPage.waitForSelector("text=Real-Time Archival Stream", { timeout: 10000 });
      await adminPage.waitForSelector("table tbody tr:has-text('DOC-')", { timeout: 10000 });

      // Check Live indicator badge
      const liveBadge = adminPage.locator("span:has-text('Live')").first();
      assert.ok(await liveBadge.isVisible(), "Live badge must be visible");

      // Verify Physical Storage column contains NO 'undefined'
      const tableText = await adminPage.locator("table").first().innerText();
      assert.ok(!tableText.includes("undefined"), "Physical storage must never contain 'undefined'");
      assert.ok(tableText.includes("Cabinet 02"), "Should show Cabinet 02");
      assert.ok(tableText.includes("blue gwapo"), "Should show blue gwapo binder");

      // Verify title resolution does not display generic 'document'
      assert.ok(!tableText.includes("\ndocument\n"), "Title should not resolve to raw generic 'document'");
      assert.ok(
        tableText.includes("The Importance of Time Management") ||
        tableText.includes("Strategies for Balancing Studies"),
        "Should resolve meaningful document subject"
      );

      // Verify Inspect button is visible without horizontal clipping
      const inspectBtn = adminPage.locator("button:has-text('Inspect')").first();
      assert.ok(await inspectBtn.isVisible(), "Inspect button should be fully visible without clipping");

      logPass("Dashboard Real-Time Stream verified: clean storage hierarchy, smart titles, and zero clipping");
    } catch (err) {
      logFail("Dashboard Real-Time Stream verification failed", err);
    }

    // 1.3 Modal Preview Inspection from Dashboard Stream
    totalTests++;
    try {
      const inspectBtn = adminPage.locator("button:has-text('Inspect')").first();
      await inspectBtn.click();
      await adminPage.waitForSelector("div[role='dialog']", { timeout: 5000 });

      // Close modal
      const closeBtn = adminPage
        .locator("div[role='dialog'] button:has-text('Close')")
        .or(adminPage.locator("button[aria-label='Close document viewer']"))
        .first();
      await closeBtn.click();
      await adminPage.waitForSelector("div[role='dialog']", { state: "hidden", timeout: 5000 });
      logPass("Document Dossier modal opened from stream inspect and closed cleanly");
    } catch (err) {
      logFail("Modal preview inspection failed", err);
    }

    // 1.4 Dashboard Stream: Audit Log Tab Switcher
    totalTests++;
    try {
      const auditTabBtn = adminPage.locator("button:has-text('Audit Log')");
      await auditTabBtn.click();
      await adminPage.waitForSelector("text=activities", { timeout: 5000 });
      
      // Switch back to Latest Records
      const recordsTabBtn = adminPage.locator("button:has-text('Latest Records')");
      await recordsTabBtn.click();
      await adminPage.waitForSelector("table tbody tr:has-text('DOC-')", { timeout: 5000 });

      logPass("Switched between Latest Records and Audit Log tabs seamlessly");
    } catch (err) {
      logFail("Audit Log tab switch failed", err);
    }

    // 1.5 User Management & Strict Co-Admin Protection (/users)
    totalTests++;
    try {
      await adminPage.goto(`${BASE_URL}/users`);
      await adminPage.waitForSelector("table tbody tr:has-text('Administrator')", { timeout: 15000 });

      // Check Administrator rows: Key, Demote, and Delete icons are disabled with protected tooltips
      const adminRows = adminPage.locator("table tbody tr:has-text('Administrator')");
      const adminRowCount = await adminRows.count();
      assert.ok(adminRowCount >= 2, "Should find at least 2 administrators in table");

      const firstAdminRow = adminRows.first();
      const disabledKeyIcon = firstAdminRow.locator("span[title*='Administrator credentials are protected']");
      const disabledDemoteIcon = firstAdminRow.locator("span[title*='Administrator accounts are protected']");
      const disabledDeleteIcon = firstAdminRow.locator("span[title*='Administrator accounts cannot be deleted']");

      assert.ok(await disabledKeyIcon.isVisible(), "Admin row key icon must have protected tooltip");
      assert.ok(await disabledDemoteIcon.isVisible(), "Admin row demote icon must have protected tooltip");
      assert.ok(await disabledDeleteIcon.isVisible(), "Admin row delete icon must have protected tooltip");

      // Check Staff rows: should have active buttons
      const staffRows = adminPage.locator("table tbody tr:has-text('Staff')");
      const staffRowCount = await staffRows.count();
      assert.ok(staffRowCount > 0, "Should find staff member accounts in table");

      const staffRow = staffRows.first();
      const activeKeyBtn = staffRow.locator("button[title='Reset Staff Password']");
      const activePromoteBtn = staffRow.locator("button[title='Promote to Administrator']");
      const activeDeleteBtn = staffRow.locator("button[title='Delete Account']");

      assert.ok(await activeKeyBtn.isVisible(), "Staff row must have active reset password button");
      assert.ok(await activePromoteBtn.isVisible(), "Staff row must have active promote button");
      assert.ok(await activeDeleteBtn.isVisible(), "Staff row must have active delete button");

      logPass("User Management Option 1 verified: peer admin credentials and roles strictly protected; staff controls active");
    } catch (err) {
      logFail("User Management protection verification failed", err);
    }

    // 1.6 Physical Storage & Inventory: Cabinet 02 Box Occupancy Count
    totalTests++;
    try {
      await adminPage.goto(`${BASE_URL}/inventory`);
      await adminPage.waitForSelector("h3:has-text('Cabinet 02')", { timeout: 15000 });

      // Verify Print Manifest and Export Manifest buttons have been completely removed
      const printManifestBtn = adminPage.locator("button:has-text('Print Manifest')");
      const exportManifestBtn = adminPage.locator("button:has-text('Export Manifest')");
      assert.ok(!(await printManifestBtn.isVisible()), "Print Manifest button must be removed from Inventory page");
      assert.ok(!(await exportManifestBtn.isVisible()), "Export Manifest button must be removed from Inventory page");

      // Drill down into Cabinet 02 using exact heading role
      const cab02Heading = adminPage.getByRole("heading", { name: "Cabinet 02", exact: true });
      await cab02Heading.click();
      await adminPage.waitForSelector("text=File Boxes in this Standard Cabinet", { timeout: 10000 });

      // Verify Box 02 card does NOT show 0% (Verifies aggregate count bugfix)
      const box02Card = adminPage.locator("div.group:has(h3:text-is('Box 02'))");
      const box02Text = await box02Card.innerText();
      
      assert.ok(!box02Text.includes("0 / 50 (0%)"), "Box 02 must not show 0 / 50 (0%) when documents exist");
      assert.ok(box02Text.includes("Total Records"), "Box 02 must show Total Records count");
      assert.ok(!box02Text.includes("0 Total Records"), "Box 02 must not show 0 Total Records");

      logPass(`Cabinet 02 Box 02 occupancy count verified: accurately shows non-zero documents & capacity percentage`);
    } catch (err) {
      logFail("Box occupancy count verification failed", err);
    }

    // 1.7 Drill Down into Box 02 -> Loose Records Actions
    totalTests++;
    try {
      await adminPage.getByRole("heading", { name: "Box 02", exact: true }).click();
      await adminPage.waitForSelector("text=Archfile Binders in this Box", { timeout: 10000 });

      // Check loose records section exists
      const looseSection = adminPage.locator("text=Direct Records Filed in Box (Loose Copies)");
      assert.ok(await looseSection.isVisible(), "Loose records section must be present in Box 02");

      const looseViewBtn = adminPage.locator("button[title='View Document Details & Preview']").first();
      const looseEditBtn = adminPage.locator("button[title='Edit Metadata & Storage Location']").first();
      const looseDeleteBtn = adminPage.locator("button[title='Move Document to Trash']").first();

      assert.ok(await looseViewBtn.isVisible(), "Loose record must have View button");
      assert.ok(await looseEditBtn.isVisible(), "Loose record must have Edit button");
      assert.ok(await looseDeleteBtn.isVisible(), "Loose record must have Delete button");

      logPass("Box 02 content view verified: loose records feature View, Edit, and Delete actions");
    } catch (err) {
      logFail("Box 02 content view verification failed", err);
    }

    // 1.8 Drill Down into Archfile 'blue gwapo' -> Full CRUD on Filed Documents
    totalTests++;
    try {
      const blueGwapoHeading = adminPage.getByRole("heading", { name: "blue gwapo", exact: true });
      await blueGwapoHeading.click();
      await adminPage.waitForSelector("text=Official physical copies held in this archfile", { timeout: 10000 });

      // Verify Document rows have View, Edit, and Delete
      const docRows = adminPage.locator("div.space-y-2 > div.border.rounded-xl");
      const docCount = await docRows.count();
      assert.ok(docCount > 0, "Archfile blue gwapo should contain document records");

      const firstDocRow = docRows.first();
      const viewBtn = firstDocRow.locator("button:has-text('View')");
      const editBtn = firstDocRow.locator("button:has-text('Edit')");
      const deleteBtn = firstDocRow.locator("button[title='Move Document to Trash']");

      assert.ok(await viewBtn.isVisible(), "Record row must have View button");
      assert.ok(await editBtn.isVisible(), "Record row must have Edit button");
      assert.ok(await deleteBtn.isVisible(), "Record row must have Delete button");

      // Click Edit button -> Verify DocumentEditModal opens with dynamic fields
      await editBtn.click();
      await adminPage.waitForSelector("text=Edit Record & Storage Location", { timeout: 5000 });
      assert.ok(await adminPage.locator("text=PHYSICAL STORAGE PLACEMENT").isVisible(), "Storage assignment must be in edit modal");

      // Close Edit modal
      const cancelEditBtn = adminPage.locator("button:has-text('Cancel')").first();
      await cancelEditBtn.click();
      await adminPage.waitForSelector("text=Edit Record & Storage Location", { state: "hidden", timeout: 5000 });

      // Click View button -> Verify DocumentViewModal opens
      await viewBtn.click();
      await adminPage.waitForSelector("div[role='dialog']", { timeout: 5000 });
      const closeViewBtn = adminPage
        .locator("div[role='dialog'] button:has-text('Close')")
        .or(adminPage.locator("button[aria-label='Close document viewer']"))
        .first();
      await closeViewBtn.click();
      await adminPage.waitForSelector("div[role='dialog']", { state: "hidden", timeout: 5000 });

      logPass("Archfile Records View verified: full in-situ View, Edit, and Delete lifecycle operational");
    } catch (err) {
      logFail("Archfile Records View CRUD verification failed", err);
    }

    // 1.9 Archfile Binder Color Customization Controls
    totalTests++;
    try {
      // Go back to Box 02
      const backBtn = adminPage.locator("button[title='Back to File Box']");
      await backBtn.click();
      await adminPage.waitForSelector("text=Archfile Binders in this Box", { timeout: 10000 });

      // Click Edit on the archfile card
      const archCard = adminPage.locator("div.group:has(h3:text-is('blue gwapo'))");
      const editArchBtn = archCard.locator("button[title='Edit Archfile']");
      await editArchBtn.click();

      // Check native color picker and custom hex input
      await adminPage.waitForSelector("text=Edit Archfile Binder", { timeout: 5000 });
      const colorPickerInput = adminPage.locator("input[type='color']");
      assert.ok(await colorPickerInput.isVisible(), "Native color wheel picker must be present");

      const hexInput = adminPage.locator("input[placeholder*='#6B1D2A']");
      assert.ok(await hexInput.isVisible(), "Custom HEX text input must be present");

      // Cancel modal
      await adminPage.locator("button:has-text('Cancel')").click();
      await adminPage.waitForSelector("text=Edit Archfile Binder", { state: "hidden", timeout: 5000 });

      logPass("Edit Archfile color customization verified: native color picker and hex input active");
    } catch (err) {
      logFail("Archfile color customization verification failed", err);
    }

    await adminContext.close();

    // ==============================================================
    // SUITE 2: STAFF ROLE WORKFLOW & RBAC RESTRICTIONS
    // ==============================================================
    console.log("\n\x1b[35m[SUITE 2: STAFF ROLE PERMISSIONS & DOCUMENT FILING FLOW]\x1b[0m");
    const staffContext = await browser.newContext({
      viewport: { width: 1366, height: 768 },
    });
    const staffPage = await staffContext.newPage();

    // 2.1 Staff Login & RBAC Verification
    totalTests++;
    try {
      await staffPage.goto(`${BASE_URL}/login`);
      await staffPage.waitForSelector("input[type='email']", { timeout: 10000 });
      await staffPage.fill("input[type='email']", STAFF_USER.email);
      await staffPage.fill("input[type='password']", STAFF_USER.password);
      await staffPage.click("button[type='submit']");
      await staffPage.waitForURL("**/dashboard", { timeout: 10000 });

      // Verify sidebar does NOT have Admin links (Users, Audits & Trails, Masterlist Reports)
      const sidebarText = await staffPage.locator("aside").first().innerText();
      assert.ok(!sidebarText.includes("Users"), "Staff sidebar must NOT display Users link");
      assert.ok(!sidebarText.includes("Audits & Trails"), "Staff sidebar must NOT display Audits & Trails link");
      assert.ok(!sidebarText.includes("Masterlist Reports"), "Staff sidebar must NOT display Masterlist Reports link");

      logPass("Staff logged in successfully: RBAC restrictions enforced in sidebar navigation");
    } catch (err) {
      logFail("Staff login / RBAC verification failed", err);
    }

    // 2.2 Staff Direct Navigation Protection Guard
    totalTests++;
    try {
      await staffPage.goto(`${BASE_URL}/users`);
      // Staff should be redirected away from /users back to /dashboard
      await staffPage.waitForURL("**/dashboard", { timeout: 5000 });
      const currentUrl = staffPage.url();
      assert.ok(!currentUrl.includes("/users"), "Staff must be prohibited from accessing /users directly");
      logPass("Direct URL route guard verified: Staff blocked from accessing /users and redirected to /dashboard");
    } catch (err) {
      logFail("Direct route guard verification failed", err);
    }

    // 2.3 Staff Document Filing UI (/files) - Priority Inversion & Template Adaptation
    totalTests++;
    try {
      await staffPage.goto(`${BASE_URL}/files`);
      await staffPage.waitForSelector("text=Direct Tagging & Template Specification", { timeout: 10000 });

      // Verify Document Type selector exists (Template Driver)
      const docTypeSelect = staffPage.locator("text=Template Driver");
      assert.ok(await docTypeSelect.isVisible(), "Document Type selector must be visible with Template Driver tag");

      // Verify cascading storage selection is present
      assert.ok(await staffPage.locator("text=1. Select Cabinet / Storage Unit").isVisible(), "Cabinet selector must be present");
      assert.ok(await staffPage.locator("text=2. Select Container / Archfile Binder").isVisible(), "Container selector must be present");

      // Verify Recently Filed Documents bar is visible at bottom
      assert.ok(await staffPage.locator("text=Recently Filed Documents").isVisible(), "Recent records strip must be present");

      logPass("Document filing page verified: Priority Inversion, storage cascading, and recent strip operational");
    } catch (err) {
      logFail("Document filing UI verification failed", err);
    }

    // 2.4 Staff Inventory View (/inventory) - Creation and Delete Controls Hidden
    totalTests++;
    try {
      await staffPage.goto(`${BASE_URL}/inventory`);
      await staffPage.waitForSelector("text=Physical Storage & Inventory", { timeout: 10000 });

      // Verify 'New Storage Unit' button is NOT visible for Staff
      const newUnitBtn = staffPage.locator("button:has-text('New Storage Unit')");
      assert.ok(!(await newUnitBtn.isVisible()), "Staff must NOT see 'New Storage Unit' button");

      // Drill into Cabinet 02 -> check container creation and delete buttons are hidden for Staff
      const cab02Heading = staffPage.getByRole("heading", { name: "Cabinet 02", exact: true });
      await cab02Heading.click();
      await staffPage.waitForSelector("text=File Boxes in this Standard Cabinet", { timeout: 10000 });

      const newBoxBtn = staffPage.locator("button:has-text('New File Box')");
      assert.ok(!(await newBoxBtn.isVisible()), "Staff must NOT see 'New File Box' button");

      const deleteBoxBtn = staffPage.locator("button[title='Delete File Box']");
      assert.ok(!(await deleteBoxBtn.isVisible()), "Staff must NOT see 'Delete File Box' button");

      logPass("Staff Inventory permissions verified: creation and deletion administrative controls hidden");
    } catch (err) {
      logFail("Staff Inventory permissions verification failed", err);
    }

    await staffContext.close();

  } finally {
    await browser.close();
  }

  console.log("\n=======================================================");
  console.log(`  PLAYWRIGHT E2E EXECUTION COMPLETED: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log("=======================================================\n");

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runE2ETests().catch((err) => {
  console.error("Test execution threw fatal error:", err);
  process.exit(1);
});
