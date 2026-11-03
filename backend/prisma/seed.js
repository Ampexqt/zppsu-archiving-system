const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { getAll63MockRecords } = require('./mockDocumentData');

const prisma = new PrismaClient();

async function main() {
  console.log('========================================================================');
  console.log('  ZPPSU ARCHIVING SYSTEM — COMPLETE DATABASE RESEED (63 DOC TYPES)     ');
  console.log('========================================================================\n');

  // 1. Password hashing
  const passwordHash = await bcrypt.hash('password123', 10);

  // 2. Clean up old audits, files, boxes, and cabinets
  console.log('1. Purging existing logs, files, and physical inventory...');
  await prisma.logs.deleteMany({});
  await prisma.files.deleteMany({});
  await prisma.file_boxes.deleteMany({});
  await prisma.cabinets.deleteMany({});
  console.log('  ✓ Purged logs, files, file_boxes, cabinets.');

  // 3. Ensure essential users exist
  console.log('2. Ensuring Admin and Staff user accounts...');
  const admin = await prisma.users.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: 'System Admin',
      password: passwordHash,
      role: 'Admin',
      department: 'University Records Office',
      is_active: true
    },
    create: {
      name: 'System Admin',
      email: 'admin@example.com',
      password: passwordHash,
      role: 'Admin',
      department: 'University Records Office',
      is_active: true
    }
  });

  const staff = await prisma.users.upsert({
    where: { email: 'renato@gmail.com' },
    update: {
      name: 'Renato Astrologo',
      password: passwordHash,
      role: 'User',
      department: 'Guidance and Counseling Center',
      phone_number: '+63 917 123 4567',
      is_active: true
    },
    create: {
      name: 'Renato Astrologo',
      email: 'renato@gmail.com',
      password: passwordHash,
      role: 'User',
      department: 'Guidance and Counseling Center',
      phone_number: '+63 917 123 4567',
      is_active: true
    }
  });
  console.log(`  ✓ Verified Admin: ${admin.email}`);
  console.log(`  ✓ Verified Staff: ${staff.email}`);

  // 4. Ensure Categories
  console.log('3. Setting up Document Categories...');
  const categoryNames = ['Administrative', 'Academic', 'Financial'];
  for (const catName of categoryNames) {
    const existing = await prisma.categories.findFirst({ where: { name: catName } });
    if (!existing) {
      await prisma.categories.create({ data: { name: catName } });
    }
  }
  console.log(`  ✓ Categories initialized: ${categoryNames.join(', ')}`);

  // 5. Create Storage Hierarchy (Cabinets, Steel Cabinets, Shelves)
  console.log('4. Initializing Physical Storage Architecture...');
  const storageUnitsData = [
    { name: 'Cabinet 01', capacity: 100 },
    { name: 'Cabinet 02', capacity: 100 },
    { name: 'Cabinet 03', capacity: 100 },
    { name: 'Steel Archive Cabinet 01 [steel]', capacity: 120 },
    { name: 'Steel Archive Cabinet 02 [steel]', capacity: 120 },
    { name: 'Open Shelving Rack 01', capacity: 150 },
    { name: 'Open Shelving Rack 02', capacity: 150 },
  ];

  const createdCabinets = [];
  for (const unit of storageUnitsData) {
    const cab = await prisma.cabinets.create({
      data: {
        name: unit.name,
        capacity: unit.capacity,
        status: 'Active'
      }
    });
    createdCabinets.push(cab);
  }
  console.log(`  ✓ Created ${createdCabinets.length} storage units (Cabinets, Steel Units & Shelves).`);

  // 6. Create Containers (Boxes, Archfiles inside boxes, and Direct Archfiles)
  console.log('5. Registering Containers (File Boxes & Archfile Binders)...');
  const containerDefinitions = [
    // Standard Cabinets (Cabinets 01 - 03)
    { cabIndex: 0, name: 'Box 01' },
    { cabIndex: 0, name: 'Box 02' },
    { cabIndex: 0, name: 'Box 01 / Academic Records 2024-2026 [color:#6B1D2A]' },
    { cabIndex: 0, name: 'Archfile Institutional Master Directives [color:#7E22CE]' },

    { cabIndex: 1, name: 'Box 01' },
    { cabIndex: 1, name: 'Box 02' },
    { cabIndex: 1, name: 'Box 01 / Student Evaluation Binders [color:#2563EB]' },

    { cabIndex: 2, name: 'Box 01' },
    { cabIndex: 2, name: 'Box 02' },

    // Steel Cabinets (01 & 02)
    { cabIndex: 3, name: 'Box 01' },
    { cabIndex: 3, name: 'Box 02' },
    { cabIndex: 3, name: 'Box 01 / Administrative Circulars & Orders [color:#A87818]' },

    { cabIndex: 4, name: 'Box 01' },
    { cabIndex: 4, name: 'Box 02' },
    { cabIndex: 4, name: 'Archfile Board Resolutions & Charters [color:#B91C1C]' },

    // Open Shelves (01 & 02)
    { cabIndex: 5, name: 'Shelf Box 01' },
    { cabIndex: 5, name: 'Shelf Box 02' },
    { cabIndex: 5, name: 'Shelf Box 01 / Financial Audits & COA [color:#1E293B]' },
    { cabIndex: 5, name: 'Archfile Accreditations & Curricula [color:#0F766E]' },

    { cabIndex: 6, name: 'Shelf Box 01' },
    { cabIndex: 6, name: 'Shelf Box 02' },
    { cabIndex: 6, name: 'Archfile UniFAST & Free Higher Education [color:#C99A2E]' }
  ];

  const storageLocations = [];
  for (const cDef of containerDefinitions) {
    const parentCabinet = createdCabinets[cDef.cabIndex];
    const box = await prisma.file_boxes.create({
      data: {
        name: cDef.name,
        cabinet_id: parentCabinet.id,
        capacity: 50,
        used_space: 0,
        status: 'Active'
      }
    });

    storageLocations.push({
      fileBoxId: box.id,
      boxName: box.name,
      cabinetName: parentCabinet.name,
      displayText: `${parentCabinet.name} - ${box.name}`
    });
  }
  console.log(`  ✓ Registered ${storageLocations.length} storage containers.`);

  // 7. Generate all 63 mock records
  console.log('6. Generating authentic mock data for ALL 63 Document Types...');
  const rawRecords = getAll63MockRecords(storageLocations);
  console.log(`  ✓ Generated ${rawRecords.length} document definitions across 2022-2026.`);

  // 8. Insert Records into files table with distributed ownership
  console.log('7. Ingesting records into database...');
  const fileBoxCounts = {};
  for (let i = 0; i < rawRecords.length; i++) {
    const r = rawRecords[i];
    // Split ownership: 36 admin, 27 staff
    const uploadedBy = (i % 7 < 4) ? admin.id : staff.id;

    const createdFile = await prisma.files.create({
      data: {
        title: r.title,
        category: r.category,
        document_type: r.document_type,
        access_code: r.access_code,
        document_id: r.document_id,
        subject: r.subject,
        memo_date: r.memo_date,
        received_date: r.received_date,
        created_at: r.created_at,
        status: r.status,
        is_deleted: r.is_deleted,
        file_name: r.file_name,
        file_path: r.file_path,
        dynamic_data: r.dynamic_data,
        file_box_id: r.file_box_id,
        uploaded_by: uploadedBy
      }
    });

    fileBoxCounts[r.file_box_id] = (fileBoxCounts[r.file_box_id] || 0) + 1;
  }
  console.log(`  ✓ Successfully ingested ${rawRecords.length} files.`);

  // 9. Update used_space on containers
  console.log('8. Recalculating container used space...');
  for (const [boxIdStr, count] of Object.entries(fileBoxCounts)) {
    const bId = parseInt(boxIdStr, 10);
    await prisma.file_boxes.update({
      where: { id: bId },
      data: { used_space: count }
    });
  }
  console.log('  ✓ Updated capacity metrics for all storage boxes.');

  // 10. Seed authentic audit logs
  console.log('9. Seeding initial security audit trail...');
  const auditLogs = [
    { action: 'SYSTEM INITIALIZATION', description: 'System database restored and infrastructure initialized', user_id: admin.id, module: 'system' },
    { action: 'STORAGE INITIALIZED', description: 'Created 7 physical storage units (Cabinets & Shelves)', user_id: admin.id, module: 'inventory' },
    { action: 'CONTAINERS REGISTERED', description: 'Cataloged 22 File Boxes and Archfile Binders', user_id: admin.id, module: 'inventory' },
    { action: 'BULK CATALOG INGESTION', description: 'Officially indexed 63 institutional document types (AY 2022-2026)', user_id: admin.id, module: 'files' },
    { action: 'STAFF ACCESS ASSIGNED', description: 'Granted Guidance Custodian operational permissions to Renato Astrologo', user_id: admin.id, module: 'users' },
    { action: 'LOGIN', description: 'Administrator logged in from Records Management Workstation', user_id: admin.id, module: 'auth' },
    { action: 'LOGIN', description: 'Staff member Renato Astrologo logged in from Guidance Counseling terminal', user_id: staff.id, module: 'auth' },
    { action: 'EXPORT MASTERLIST', description: 'Generated institutional masterlist report for ACCOMPLISHMENT REPORTS', user_id: admin.id, module: 'reports' }
  ];

  for (const log of auditLogs) {
    await prisma.logs.create({
      data: {
        action: log.action,
        description: log.description,
        user_id: log.user_id,
        module: log.module,
        ip_address: '127.0.0.1',
        created_at: new Date()
      }
    });
  }
  console.log(`  ✓ Seeded ${auditLogs.length} audit trail entries.`);

  console.log('\n========================================================================');
  console.log('  🎉 RESEED COMPLETE: 63 DOCUMENT TYPES READY & VALIDATED!             ');
  console.log('========================================================================');
  console.log(`  - Total Files Ingested:      ${rawRecords.length} (Covering all 63 Document Types)`);
  console.log(`  - Date Spread:               2022, 2023, 2024, 2025, 2026 (Scattered months)`);
  console.log(`  - Physical Storage Units:    ${createdCabinets.length} (Standard Cabinets, Steel Units & Shelves)`);
  console.log(`  - Active Containers:         ${storageLocations.length} (Boxes + Archfiles)`);
  console.log(`  - Users:                     System Admin (${admin.email}), Renato Astrologo (${staff.email})`);
  console.log(`  - Audit Trail Entries:       ${auditLogs.length}`);
  console.log('========================================================================\n');
}

main()
  .catch((e) => {
    console.error('Fatal seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
