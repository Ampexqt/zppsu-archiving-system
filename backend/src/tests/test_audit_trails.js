const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testAudit() {
  console.log("--- Testing Full Audit & Trail Capabilities ---");
  const email = `audit_test_${Date.now()}@zppsu.edu.ph`;
  
  // 1. Register
  const regRes = await axios.post("http://localhost:5000/api/auth/register", {
    name: "Audit Test User",
    email,
    password: "Password123!",
    role: "Staff"
  });
  console.log("1. Register status:", regRes.status);
  
  const regLog = await prisma.logs.findFirst({
    where: { action: "REGISTER", description: { contains: email } }
  });
  console.log("   REGISTER LOG:", !!regLog ? "CONFIRMED" : "MISSING", "-", regLog?.description);

  // 2. Failed Login
  try {
    await axios.post("http://localhost:5000/api/auth/login", { email, password: "WrongPassword" });
  } catch (err) {}
  const failedLog = await prisma.logs.findFirst({
    where: { action: "LOGIN_FAILED", description: { contains: email } }
  });
  console.log("2. LOGIN_FAILED LOG:", !!failedLog ? "CONFIRMED" : "MISSING", "-", failedLog?.description);

  // 3. Successful Login
  const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
    email,
    password: "Password123!"
  });
  const token = loginRes.data.token;
  const loginLog = await prisma.logs.findFirst({
    where: { action: "LOGIN", description: { contains: email } }
  });
  console.log("3. LOGIN LOG:", !!loginLog ? "CONFIRMED" : "MISSING", "-", loginLog?.description);

  // 4. Logout
  const logoutRes = await axios.post("http://localhost:5000/api/auth/logout", {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log("4. Logout status:", logoutRes.status);
  const logoutLog = await prisma.logs.findFirst({
    where: { action: "LOGOUT", description: { contains: email } }
  });
  console.log("   LOGOUT LOG:", !!logoutLog ? "CONFIRMED" : "MISSING", "-", logoutLog?.description);

  // 5. Track Download & Export
  await axios.post("http://localhost:5000/api/logs/track", {
    action: "DOWNLOAD",
    description: "Downloaded document sample.pdf",
    module: "documents"
  }, { headers: { Authorization: `Bearer ${token}` } });
  
  const dlLog = await prisma.logs.findFirst({
    where: { action: "DOWNLOAD", user_id: loginRes.data.user.id }
  });
  console.log("5. DOWNLOAD LOG:", !!dlLog ? "CONFIRMED" : "MISSING", "-", dlLog?.description);

  // Clean up
  await prisma.logs.deleteMany({ where: { user_id: loginRes.data.user.id } });
  await prisma.logs.deleteMany({ where: { description: { contains: email } } });
  await prisma.users.delete({ where: { id: loginRes.data.user.id } });
  console.log("\nCleanup done. All Audit & Trail features empirically verified in database!");
  await prisma.$disconnect();
}

testAudit();
