const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// REGISTER
const registerUser = async (data) => {
  const { full_name, email, password } = data;

  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      full_name,
      email,
      password: hashedPassword,
    },
  });

  return user;
};

// LOGIN
const loginUser = async (data) => {
  const { email, password } = data;

  // Find user
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT Token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    "SECRET_KEY",
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user,
  };
};

module.exports = {
  registerUser,
  loginUser,
};