const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { PrismaClient } =
  require("@prisma/client");

const prisma = new PrismaClient();

// LOGS SERVICE
const logsService =
  require("../logs/logs.service");

// REGISTER
const register = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    // CHECK IF USER EXISTS
    const existingUser =
      await prisma.users.findUnique({

        where: { email },

      });

    if (existingUser) {

      return res.status(400).json({

        message:
          "Email already exists",

      });
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // CREATE USER
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "Staff",
      },
    });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        ...user,
        role: user.role === "Admin" ? "Admin" : "Staff",
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIND USER
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const effectiveRole = user.role === "Admin" ? "Admin" : "Staff";

    // CREATE TOKEN
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: effectiveRole,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // CREATE LOG
    await logsService.createLog("LOGIN", `${user.email} logged in`, user.id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        ...user,
        role: effectiveRole,
      },
    });

  } catch (error) {

    res.status(500).json({

      message:
        error.message,

    });
  }
};

module.exports = {
  register,
  login,
};