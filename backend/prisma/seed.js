const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const documentTypesMap = {
  Administrative: [
    "Various Records", "VPAA Memoranda", "VPAF Indorsements", 
    "VPAF Memorandum", "Job Order Workers", "Manuals of Operations", 
    "Contract of Service (Visiting Lecturers)"
  ],
  Academic: [
    "AACCUP Findings and Recommendations", "ACCOMPLISHMENT REPORTS", 
    "ANNUAL REPORTS", "ASSESSMENT RECORDS OF STUDENTS", "Class Program", 
    "COPC", "Data Analysis", "HEMIS ", "Individual Daily Program IDP", 
    "IPCR", "Medical Records for Students", "Offenses and Violations", 
    "Portfolio of Faculty", "Report of Ratings", "Student Admission Records", 
    "Students In/Off Campus Teaching", "Students Prospectus", "Students Thesis", 
    "Students Apprenticeship And Expo (APEX)", "Teaching Load", "Verification Request"
  ],
  Financial: [
    "BUDGET PLAN", "BUDGET PROPOSALS", "BUDGETARY REQUIREMENTS", 
    "Checks Issued", "COA Annual Reports 2024", "COA Audit Observation 2024", 
    "COA Circulars", "COA Communications 2024", "COA NOTICE OF DISALLOWANCES 2024", 
    "COA NOTICE OF SUSPENSION 2024", "Master List of Records for Collection", 
    "DBM Circulars", "DBM Communications 2024", "Disbursements", "Purchase Requests", 
    "Fordeed of Donations", "Free Higher Education Billing Details"
  ]
};

async function main() {
  console.log('Start seeding...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // Create Admin
  const admin = await prisma.users.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password: passwordHash,
      role: 'Admin',
    },
    create: {
      name: 'System Admin',
      email: 'admin@example.com',
      password: passwordHash,
      role: 'Admin',
    },
  });
  console.log(`Verified admin user: ${admin.email}`);

  // Clean up duplicate categories
  const allCats = await prisma.categories.findMany();
  const seen = new Set();
  for (const c of allCats) {
    if (seen.has(c.name)) {
      await prisma.categories.delete({ where: { id: c.id } });
    } else {
      seen.add(c.name);
    }
  }

  // Clear existing cabinets and boxes to prevent duplicates
  // We must clear files first to avoid foreign key constraint errors
  await prisma.files.deleteMany({});
  await prisma.file_boxes.deleteMany({});
  await prisma.cabinets.deleteMany({});

  // Create Cabinets and File Boxes
  const cabinets = [];
  const fileBoxes = [];
  for (let i = 1; i <= 3; i++) {
    const cabinet = await prisma.cabinets.create({
      data: {
        name: `Cabinet 0${i}`,
        capacity: 100,
        status: "Active"
      }
    });
    cabinets.push(cabinet);

    for (let j = 1; j <= 4; j++) {
      const box = await prisma.file_boxes.create({
        data: {
          name: `Box 0${j}`,
          cabinet_id: cabinet.id,
          capacity: 50,
          used_space: 0,
          status: "Active"
        }
      });
      fileBoxes.push(box);
    }
  }
  console.log(`Created ${cabinets.length} cabinets and ${fileBoxes.length} file boxes.`);

  // Create Categories (Essential structure only - no dummy files seeded)
  const categoryNames = Object.keys(documentTypesMap);
  for (const categoryName of categoryNames) {
    let category = await prisma.categories.findFirst({ where: { name: categoryName } });
    if (!category) {
      await prisma.categories.create({ data: { name: categoryName } });
    }
  }

  console.log('\n============================================================');
  console.log('🌱 Database seeding completed successfully!');
  console.log('============================================================');
  console.log('🔑 Default Administrator Credentials:');
  console.log('   Email:    admin@example.com');
  console.log('   Password: password123');
  console.log('   Role:     Admin');
  console.log('------------------------------------------------------------');
  console.log('📁 Initialized Infrastructure:');
  console.log(`   - Categories: ${categoryNames.join(', ')}`);
  console.log(`   - Storage Cabinets: ${cabinets.length} (Cabinet 01 - 03)`);
  console.log(`   - File Boxes: ${fileBoxes.length} (Capacity: 50 each, Used: 0)`);
  console.log('   - Files: 0 (Clean database ready for real uploads)');
  console.log('============================================================\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
