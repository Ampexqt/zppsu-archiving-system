# 🏛️ ZPPSU Archiving System

Welcome to the **ZPPSU Archiving System**! 

This guide is written in **plain, simple language** so that anyone—even if you have never worked with databases or code before—can set up, install, test, and use the system smoothly without errors.

---

## 📑 Table of Contents
1. [What is This System?](#-what-is-this-system)
2. [Important Security Note (Why There is No Sign-Up Page)](#-important-security-note-why-there-is-no-sign-up-page)
3. [Prerequisites (What You Need Installed First)](#-prerequisites-what-you-need-installed-first)
4. [Step 1: Create the Database](#-step-1-create-the-database)
5. [Step 2: Configure Settings (.env)](#-step-2-configure-settings-env)
6. [Step 3: Install the System Dependencies](#-step-3-install-the-system-dependencies)
7. [Step 4: Prepare Database & Seed Essential Data](#-step-4-prepare-database--seed-essential-data)
8. [Default Admin Login Credentials](#-default-admin-login-credentials)
9. [Step 5: Start the Application](#-step-5-start-the-application)
10. [Step 6: First-Time Login & Usage Guide](#-step-6-first-time-login--usage-guide)
11. [How to Create Staff Accounts](#-how-to-create-staff-accounts)
12. [Troubleshooting & Common Issues](#-troubleshooting--common-issues)

---

## 🎯 What is This System?

The **ZPPSU Archiving System** is a secure digital record-keeping application built for the university. Think of it as a **smart digital filing cabinet**:

- **Store & Digitize Records:** Upload scanned PDFs, images, and office documents.
- **Smart Text Recognition (OCR):** The system automatically reads text inside scanned photos and documents so you can search for words even if they were handwritten or photocopied.
- **Physical Location Tracking:** Whenever a document is saved, you can link it to an exact physical **Cabinet** and **Box** in the university storage room.
- **Institutional Security:** Keeps sensitive university files safe and logs every action for complete accountability.

---

## 🔒 Important Security Note (Why There is No Sign-Up Page)

Unlike social media websites, this is an **official university records system**. 

- **Public registration is disabled by design** so unauthorized visitors cannot create accounts.
- **Only the System Administrator** can create user accounts for authorized university staff.
- When you first install the system, a **Default Administrator Account** is automatically created via the database seed (see credentials below). Once logged in, the Admin can create accounts for other staff members.

---

## 💻 Prerequisites (What You Need Installed First)

Before starting, make sure these two programs are installed on your computer:

### 1. Node.js (JavaScript Runtime)
- **What it does:** Runs the backend server and frontend tools.
- **Download:** [https://nodejs.org/](https://nodejs.org/) (Choose the **LTS / Recommended** version).
- **Check if installed:** Open your computer's Terminal (or Command Prompt) and type:
  ```bash
  node -v
  npm -v
  ```
  *(You should see version numbers like `v20.x.x` or `v22.x.x`).*

### 2. PostgreSQL (Database Server)
- **What it does:** Securely stores your users, document information, categories, and logs.
- **Download:** [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
- During installation, the installer will ask you to set a password for the default user (`postgres`). **Remember this password!** You will need it in Step 2.

---

## 🛠️ Step 1: Create the Database

You need an empty database in PostgreSQL where the system can store tables.

### Option A: Using pgAdmin (Visual Tool - Easiest for Beginners)
1. Open **pgAdmin** (search for it in your Windows Start menu).
2. Enter your master password to unlock your PostgreSQL server.
3. In the left panel, expand **Servers** > **PostgreSQL**.
4. Right-click on **Databases** > Select **Create** > Click **Database...**.
5. In the **Database** field, type:
   ```text
   zppsu_archiving_db
   ```
6. Click **Save**.

### Option B: Using SQL Shell (psql) or Command Line
If you prefer the command line, open `SQL Shell (psql)` or your terminal and run:
```sql
CREATE DATABASE zppsu_archiving_db;
```

---

## ⚙️ Step 2: Configure Settings (.env)

The system needs to know your database password so it can connect.

1. Navigate to the `backend/` folder in this project:
   ```text
   zppsu-archiving-system/backend/
   ```
2. Find the file named `.env`. *(If it doesn't exist, make a copy of `.env.example` and rename it to `.env`)*.
3. Open `.env` in any text editor (like Notepad, VS Code, or Notepad++).
4. Look for the `DATABASE_URL` line:
   ```env
   DATABASE_URL="postgresql://postgres:root@localhost:5432/zppsu_archiving_db"
   PORT=5000
   JWT_SECRET=mysecretkey
   ```
5. **Update the password:** Replace `root` with the actual password you set when you installed PostgreSQL:
   ```env
   DATABASE_URL="postgresql://<your_username>:<your_password>@localhost:5432/zppsu_archiving_db"
   ```
   *Example:* If your postgres password is `mypassword123`, the line should look like:
   ```env
   DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/zppsu_archiving_db"
   ```
6. Save and close the file.

---

## 📦 Step 3: Install the System Dependencies

Open your terminal in the main project folder (`zppsu-archiving-system`):

> **Tip for Windows users:** Open File Explorer, go into the `zppsu-archiving-system` folder, click on the address bar at the top, type `cmd` or `powershell`, and press **Enter**.

Run these two commands:

### 1. Install Backend Dependencies
```bash
npm install
```
*(Wait until it finishes installing).*

### 2. Install Frontend Dependencies
```bash
npm install --prefix frontend
```
*(Wait until it finishes installing).*

---

## 🗄️ Step 4: Prepare Database & Seed Essential Data

Now we will tell the database to create all the necessary tables and populate the default administrator account and storage cabinets.

In the same terminal, run these three commands in order:

### 1. Create the Database Tables
```bash
npm run prisma:migrate
```
*(This creates all tables: `users`, `files`, `cabinets`, `file_boxes`, `categories`, and `logs`).*

### 2. Generate the Database Client
```bash
npm run prisma:generate
```
*(This connects your backend code to the database structure).*

### 3. Seed Essential Data
```bash
npm run prisma:seed
```
*(You can also simply run `npm run seed`).*

### 💡 What Does the Seed Script Do?
- ✅ **Creates the Default Administrator** (`admin@example.com`).
- ✅ **Sets up Core Categories:** `Administrative`, `Academic`, and `Financial`.
- ✅ **Sets up Physical Storage Cabinets:** 3 Cabinets (`Cabinet 01`, `Cabinet 02`, `Cabinet 03`).
- ✅ **Sets up File Boxes:** 4 Storage Boxes per cabinet (12 boxes total, each with a 50-file capacity).
- 🚫 **Zero Fake/Dummy Files:** No dummy files are added. The database starts completely clean and ready for real university uploads!

---

## 🔑 Default Admin Login Credentials

Once the seed completes, use these credentials to log in:

| Field | Value |
| :--- | :--- |
| **Login URL** | [http://localhost:5174/login](http://localhost:5174/login) |
| **Email** | `admin@example.com` |
| **Password** | `password123` |
| **Role** | **Admin** (Full Access) |

> 🔒 **Security Best Practice:** Once you log in, navigate to **Users** or settings to update your password if desired.

---

## 🚀 Step 5: Start the Application

You are all set! To start both the backend server and frontend website together, run:

```bash
npm run dev
```

You will see output indicating both servers are running:
- **Backend Server:** Running on port `5000` (`http://localhost:5000`)
- **Frontend App:** Running on port `5174` (`http://localhost:5174`)

> **To stop the system:** Click inside your terminal window and press `Ctrl + C` (then type `y` if prompted).

---

## 🖥️ Step 6: First-Time Login & Usage Guide

1. Open your web browser (Google Chrome, Microsoft Edge, Firefox, or Safari).
2. Go to: **[http://localhost:5174](http://localhost:5174)**
3. You will be greeted with the ZPPSU Guidance Office Archiving System homepage.
4. Click **Sign In** (or go directly to **[http://localhost:5174/login](http://localhost:5174/login)**).
5. Enter:
   - **Email:** `admin@example.com`
   - **Password:** `password123`
6. Click **Sign in to Dashboard**.

### 🌟 What You Can Do Once Logged In:

- 📊 **Dashboard:** View overall statistics, total uploaded documents, active categories, and storage space.
- 📁 **Document Center & Files:**
  - Click **Upload Document** to add a new digital file or scanned document.
  - Fill out document details (Title, Category, Subject, Document Type).
  - Assign the physical copy to a **Cabinet** and **File Box**.
  - The system automatically extracts text via OCR, allowing instant keyword searching.
- 🗄️ **Inventory:**
  - View physical storage racks and boxes.
  - See how many files are currently inside each box and available storage space.
  - Add new cabinets or boxes as university storage expands.
- 🏷️ **Categories:**
  - Create and manage document categories (e.g., Guidance, Financial, Student Records).
- 📜 **Activity Logs:**
  - View an audit trail of every file uploaded, edited, or deleted for compliance.

---

## 👥 How to Create Staff Accounts

Because there is no public sign-up page, administrators add university personnel manually:

1. Log in as the **Admin** (`admin@example.com`).
2. In the left navigation sidebar, click on **Users** (or go to `http://localhost:5174/users`).
3. Click the **Add User** / **Register Staff** button.
4. Fill in the staff member's details:
   - **Full Name**
   - **Email Address** (e.g., `staff@zppsu.edu.ph`)
   - **Initial Password**
   - **Role** (Select `User` for standard staff access, or `Admin` for administrative access).
5. Click **Save / Register**.
6. Give the login credentials to that staff member so they can log in at `http://localhost:5174/login`.

---

## ❓ Troubleshooting & Common Issues

### 1. `Authentication failed for user "postgres"` or `P1000` Database Error
- **Cause:** The password in `backend/.env` does not match your PostgreSQL server password.
- **Fix:** Open `backend/.env`, verify the password in `DATABASE_URL="postgresql://postgres:<YOUR_PASSWORD>@localhost:5432/zppsu_archiving_db"`, and re-run `npm run seed`.

### 2. `database "zppsu_archiving_db" does not exist`
- **Cause:** The database was not created yet in PostgreSQL.
- **Fix:** Open pgAdmin or SQL Shell and run `CREATE DATABASE zppsu_archiving_db;`, then run `npm run prisma:migrate`.

### 3. `Port 5000 or 5174 is already in use`
- **Cause:** Another program or an older instance of the system is already running in the background.
- **Fix:** Close any other open terminal windows running Node.js, or restart your computer.

### 4. `command not found: node` or `'node' is not recognized`
- **Cause:** Node.js was not installed or your terminal was open before Node.js finished installing.
- **Fix:** Close all open terminals and restart Command Prompt/PowerShell, or re-install Node.js from [nodejs.org](https://nodejs.org/).

### 5. I forgot the Admin password or want to reset to clean state
- Simply run:
  ```bash
  npm run prisma:seed
  ```
  This safely resets the default administrator account back to `admin@example.com` / `password123`.

---

## 📞 Support & Documentation

For technical specifications, architecture diagrams, and development references, check the [`docs/`](file:///d:/Web%20development/zppsu-archiving-system/docs) folder.
