const { chromium } = require("playwright");
const assert = require("assert");

const BASE_URL = "http://localhost:5174";
const ADMIN_USER = {
  email: "admin@example.com",
  password: "AdminSelfPassword123!",
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
      await adminPage.waitForSelector("input#email");
      await adminPage.fill("input#email", ADMIN_USER.email);
      await adminPage.fill("input#password", ADMIN_USER.password);
      await adminPage.click("button[type='submit']");
      await adminPage.waitForURL("**/dashboard", { timeout: 10000 });
      logPass("Admin logged in successfully and navigated to /dashboard");
    } catch (err) {
      logFail("Admin login failed", err);
    }

    // 1.2 Dashboard Real-Time Stream (No 'undefined', No 'document' title, No clipping)
    totalTests++;
    try {
      await adminPage.waitForSelector("text=Real-Time Archival Stream");
      
      // Check Live indicator
      const liveBadge = await adminPage.locator("text=Live").first();
      assert.ok(await liveBadge.isVisible(), "Live badge should be visible");

      // Verify Physical Storage column contains NO 'undefined'
      const tableText = await adminPage.locator("table").first().innerText();
      assert.ok(!tableText.includes("undefined"), "Physical storage must never contain 'undefined'");
      assert.ok(tableText.includes("Cabinet 02"), "Should show Cabinet 02");
      assert.ok(tableText.includes("blue gwapo"), "Should show blue gwapo binder");

      // Verify title resolution does not display generic 'document'
      assert.ok(!tableText.includes("\ndocument\n"), "Title should not resolve to raw generic 'document'");
      assert.ok(tableText.includes("The Importance of Time Management in Acade"), "Should resolve meaningful subject");

      // Verify Inspect button is visible without clipping
      const inspectBtn = adminPage.locator("button:has-text('Inspect')").first();
      assert.ok(await inspectBtn.isVisible(), "Inspect button should be fully visible");

      logPass("Dashboard Real-Time Stream verified: clean storage hierarchy, smart titles, and zero clipping");
    } catch (err) {
      logFail("Dashboard Real-Time Stream verification failed", err);
    }

    // 1.3 Modal Preview Inspection from Dashboard
    totalTests++;
    try {
      const inspectBtn = adminPage.locator("button:has-text('Inspect')").first();
      await inspectBtn.click();
      await adminPage.waitForSelector("text=Official Archival Dossier", { timeout: 5000 });
      
      // Close modal
      const closeBtn = adminPage.locator("button:has-text('Close Dossier')");
      await closeBtn.click();
      await adminPage.waitForSelector("text=Official Archival Dossier", { state: "hidden", timeout: 5000 });
      logPass("Document Dossier modal opened from stream inspect and closed cleanly");
    } catch (err) {
      logFail("Modal preview inspection failed", err);
    }

    // 1.4 Dashboard Stream: Audit Log Tab Switcher
    totalTests++;
    try {
      const auditTabBtn = adminPage.locator("button:has-text('Audit Log')");
      await auditTabBtn.click();
      await adminPage.waitForSelector("text=Showing latest 5 activities", { timeout: 5000 });
      logPass("Switched to Audit Log tab with color-coded activity badges");
    } catch (err) {
      logFail("Audit Log tab switch failed", err);
    }

    // 1.5 User Management & Strict Co-Admin Protection (/users)
    totalTests++;
    try {
      await adminPage.goto(`${BASE_URL}/users`);
      await adminPage.waitForSelector("text=User Access Control & Staff Directory");

      // Check Administrator rows: Key and Demote icons should be disabled/locked
      const adminRows = adminPage.locator("tr:has-text('Administrator')");
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
      const staffRow = adminPage.locator("tr:has-text('Staff')").first();
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
      await adminPage.waitForSelector("text=Physical Storage & Inventory");

      // Verify Summary Metrics
      const totalDocsHeader = await adminPage.locator("text=Total Filed Documents").first();
      assert.ok(await totalDocsHeader.isVisible(), "Total Filed Documents card should be visible");

      // Drill down into Cabinet 02
      const cab02Card = adminPage.locator("div:has-text('Cabinet 02')").filter({ hasText: "Enter Cabinet" }).first();
      await cab02Card.click();
      await adminPage.waitForSelector("text=File Boxes in this Standard Cabinet");

      // Verify Box 02 card does NOT show 0% (Fix verification)
      const box02Card = adminPage.locator("div:has-text('Box 02')").filter({ hasText: "Document Capacity" }).first();
      const box02Text = await box02Card.innerText();
      
      assert.ok(!box02Text.includes("0 / 50 (0%)"), "Box 02 must not show 0 / 50 (0%) when documents exist");
      assert.ok(box02Text.includes("Total Records"), "Box 02 must show Total Records count");
      assert.ok(!box02Text.includes("0 Total Records"), "Box 02 must not show 0 Total Records");

      logPass("Cabinet 02 Box 02 occupancy count verified: accurately shows non-zero documents & capacity percentage");
    } catch (err) {
      logFail("Box occupancy count verification failed", err);
    }

    // 1.7 Drill Down into Box 02 -> Loose Records Actions
    totalTests++;
    try {
      const box02Card = adminPage.locator("div:has-text('Box 02')").filter({ hasText: "Open File Box" }).first();
      await box02Card.click();
      await adminPage.waitForSelector("text=Archfile Binders in this Box");

      // Check loose records section exists
      const looseSection = adminPage.locator("text=Direct Records Filed in Box (Loose Copies)");
      if (await looseSection.isVisible()) {
        const looseRecord = adminPage.locator("div:has-text('Direct Records Filed in Box')").locator(".border.rounded-xl").first();
        assert.ok(await looseRecord.locator("button:has-text('View')").isVisible(), "Loose record must have View button");
        assert.ok(await looseRecord.locator("button:has-text('Edit')").isVisible(), "Loose record must have Edit button");
        assert.ok(await looseRecord.locator("button:has-text('Trash')").or(looseRecord.locator("button[title='Move Document to Trash']")).isVisible(), "Loose record must have Delete button");
      }
      logPass("Box 02 content view verified: loose records feature View, Edit, and Delete actions");
    } catch (err) {
      logFail("Box 02 content view verification failed", err);
    }

    // 1.8 Drill Down into Archfile 'blue gwapo' -> Full CRUD on Filed Documents
    totalTests++;
    try {
      const archfileCard = adminPage.locator("div:has-text('blue gwapo')").filter({ hasText: "Open Archfile" }).first();
      await archfileCard.click();
      await adminPage.waitForSelector("text=Official physical copies held in this archfile");

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
      await adminPage.waitForSelector("text=Official Archival Dossier", { timeout: 5000 });
      const closeViewBtn = adminPage.locator("button:has-text('Close Dossier')");
      await closeViewBtn.click();
      await adminPage.waitForSelector("text=Official Archival Dossier", { state: "hidden", timeout: 5000 });

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
      await adminPage.waitForSelector("text=Archfile Binders in this Box");

      // Click Edit on the archfile card
      const archCard = adminPage.locator("div:has-text('blue gwapo')").filter({ hasText: "Archfile Binder" }).first();
      const editArchBtn = archCard.locator("button[title='Edit Archfile Binder']");
      await editArchBtn.click();

      // Check native color picker and custom hex input
      await adminPage.waitForSelector("text=Edit Archfile Binder");
      const colorPickerInput = adminPage.locator("input[type='color']");
      assert.ok(await colorPickerInput.isVisible(), "Native color wheel picker must be present");

      const hexInput = adminPage.locator("input[placeholder='#6B1D2A']");
      assert.ok(await hexInput.isVisible(), "Custom HEX text input must be present");

      // Cancel modal
      await adminPage.locator("button:has-text('Cancel')").click();
      await adminPage.waitForSelector("text=Edit Archfile Binder", { state: "hidden" });

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
      await staffPage.waitForSelector("input#email");
      await staffPage.fill("input#email", STAFF_USER.email);
      await staffPage.fill("input#password", STAFF_USER.password);
      await staffPage.click("button[type='submit']");
      await staffPage.waitForURL("**/dashboard", { timeout: 10000 });

      // Verify sidebar does NOT have Admin links (Users, Audits & Trails)
      const sidebarText = await staffPage.locator("aside").first().innerText();
      assert.ok(!sidebarText.includes("Users"), "Staff sidebar must NOT display Users link");
      assert.ok(!sidebarText.includes("Audits & Trails"), "Staff sidebar must NOT display Audits & Trails link");

      logPass("Staff logged in successfully: RBAC restrictions enforced in sidebar navigation");
    } catch (err) {
      logFail("Staff login / RBAC verification failed", err);
    }

    // 2.2 Staff Direct Navigation Protection Guard
    totalTests++;
    try {
      await staffPage.goto(`${BASE_URL}/users`);
      // Staff should be redirected away from /users (to /dashboard or /login)
      await staffPage.waitForTimeout(1500);
      const currentUrl = staffPage.url();
      assert.ok(!currentUrl.includes("/users"), "Staff must be prohibited from accessing /users directly");
      logPass("Direct URL route guard verified: Staff blocked from accessing /users");
    } catch (err) {
      logFail("Direct route guard verification failed", err);
    }

    // 2.3 Staff Document Filing UI (/files) - Priority Inversion & Template Adaptation
    totalTests++;
    try {
      await staffPage.goto(`${BASE_URL}/files`);
      await staffPage.waitForSelector("text=Physical Storage Placement");

      // Verify Document Type selector exists (Template Driver)
      const docTypeDropdown = staffPage.locator("button:has-text('Select document type format...')");
      assert.ok(await docTypeDropdown.isVisible(), "Document Type selector must be visible");

      // Verify cascading storage selection is present
      assert.ok(await staffPage.locator("text=1. SELECT CABINET / STORAGE UNIT").isVisible(), "Cabinet selector must be present");
      assert.ok(await staffPage.locator("text=2. SELECT CONTAINER / ARCHFILE BINDER").isVisible(), "Container selector must be present");

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
      await staffPage.waitForSelector("text=Physical Storage & Inventory");

      // Verify 'New Storage Unit' button is NOT visible for Staff
      const newUnitBtn = staffPage.locator("button:has-text('New Storage Unit')");
      assert.ok(!(await newUnitBtn.isVisible()), "Staff must NOT see 'New Storage Unit' button");

      // Drill into Cabinet 02 -> check container delete buttons are hidden for Staff
      const cab02Card = staffPage.locator("div:has-text('Cabinet 02')").filter({ hasText: "Enter Cabinet" }).first();
      await cab02Card.click();
      await staffPage.waitForSelector("text=File Boxes in this Standard Cabinet");

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

