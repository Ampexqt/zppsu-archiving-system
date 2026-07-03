const express = require("express");

const cors = require("cors");

const path = require("path");

const authRoutes =
  require("./modules/auth/auth.routes");

const fileRoutes =
  require("./modules/file/file.routes");

const userRoutes =
  require("./modules/user/user.routes");

const logsRoutes =
  require("./modules/logs/logs.routes");

const categoryRoutes =
  require("./modules/category/category.routes");

const dashboardRoutes =
  require(
    "./modules/dashboard/dashboard.routes"
  );

const inventoryRoutes =
  require(
    "./modules/inventory/inventory.routes"
  );

  const accomplishmentRoutes =
  require(
    "./modules/accomplishment/accomplishment.routes"
  );

const otpRoutes =
require("./modules/otp/otp.routes");

const app = express();

// MIDDLEWARE
app.use(cors());

app.use(express.json());

// STATIC FILES
app.use(
  "/uploads", 
  express.static(
    path.join(__dirname, "uploads")
  )
);

console.log(
  path.join(__dirname, "uploads")
);

// ROUTES
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/files",
  fileRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/logs",
  logsRoutes
);

app.use(
  "/api/categories",
  categoryRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/otp",
  otpRoutes
);

app.use(
  "/api/inventory",
  inventoryRoutes
);

app.use(
  "/api/accomplishment",
  accomplishmentRoutes
);

module.exports = app;