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
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@example.com',
      password: passwordHash,
      role: 'Admin',
    },
  });
  console.log(`Created admin user with id: ${admin.id}`);

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

  // Create Categories and Files
  for (const [categoryName, docTypes] of Object.entries(documentTypesMap)) {
    let category = await prisma.categories.findFirst({ where: { name: categoryName } });
    if (!category) {
      category = await prisma.categories.create({ data: { name: categoryName } });
    }

    console.log(`Seeding files for category: ${categoryName}`);
    
    // Seed 2 files per document type
    for (const docType of docTypes) {
      for (let i = 1; i <= 2; i++) {
        const docId = `DOC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const randomBox = fileBoxes[Math.floor(Math.random() * fileBoxes.length)];
        
        await prisma.files.create({
          data: {
            title: `Sample ${docType} ${i}`,
            category: categoryName,
            document_type: docType,
            document_id: docId,
            uploaded_by: admin.id,
            status: "Active",
            subject: `Sample Subject for ${docType} ${i}`,
            memo_date: new Date(),
            file_box_id: randomBox.id,
            dynamic_data: {
              access_code: `AC-${Math.floor(1000 + Math.random() * 9000)}`,
              subject: `Sample Subject for ${docType} ${i}`,
              file_location: `${randomBox.cabinet_id} - ${randomBox.name}`,
              student_name: `Student ${Math.floor(1 + Math.random() * 100)}`,
              fiscal_year: "2024",
              payee: "Sample Payee Inc.",
            }
          }
        });

        // Increment used_space for the assigned box
        await prisma.file_boxes.update({
          where: { id: randomBox.id },
          data: { used_space: { increment: 1 } }
        });
      }
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
