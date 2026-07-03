const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("AUTH MIDDLEWARE HIT");
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);

const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET
);

console.log("DECODED USER:", decoded);

req.user = decoded;
console.log(req.user);

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;    