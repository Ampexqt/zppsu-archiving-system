# 🏛️ ZPPSU Guidance Office Archiving System

Welcome to the **ZPPSU Archiving System**!

This guide is written in **plain, simple language** so that anyone—including non-technical staff and clients—can easily download, install, set up, and use the system without confusion.

---

## 🧭 Which Guide Do You Need?

| Your Goal | Where to Start |
| :--- | :--- |
| **I want to use or download the app on my laptop, tablet, or phone** | 👉 [**Option 1: Download & Install the App (Zero Technical Knowledge Required)**](#-option-1-how-to-download--install-the-app-on-any-device) |
| **I am setting up the Main Host Laptop or Office Server** | 👉 [**Option 2: Host PC Setup Guide (Step-by-Step Installation)**](#-option-2-host-pc-setup-guide-for-the-main-laptop-or-server) |
| **I want to inspect the system technologies & architecture** | 👉 [**Technology Stack Used**](#-technology-stack-used) |

---

## 📱 Option 1: How to Download & Install the App on Any Device

> 💡 **Good News for Office Staff:** You **do NOT** need to install Node.js, databases, or type code on every office laptop!  
> Once the main host laptop or server is running, **all other laptops, tablets, and phones on the office Wi-Fi can install the app with just 1 click.**

### Step 1: Connect to the Office Wi-Fi
Make sure your laptop, phone, or tablet is connected to the same Wi-Fi network or local network as the main host computer.

### Step 2: Open the System in Your Web Browser
Ask your administrator for the system address (it looks like `http://192.168.x.x:5174` or `http://localhost:5174`).  
Open **Google Chrome**, **Microsoft Edge**, or **Safari** and enter that link.

### Step 3: Install the App (Turn it into a Desktop or Mobile App)

#### On Windows (Google Chrome or Microsoft Edge):
1. Look at the right side of the address bar at the top of your browser.
2. Click the **Install** icon (or click the three dots `⋮` at the top-right > select **Save and share** > **Install ZPPSU Archiving System**).
3. Click **Install**.
4. 🎉 **Done!** A dedicated shortcut icon is now on your **Desktop** and **Start Menu**. The app will now open in its own clean window just like Microsoft Word or Excel, with no browser bars!

#### On Apple Mac (Safari or Chrome):
1. In Safari, click **File** in the top menu bar > click **Add to Dock**.
2. Or in Chrome, click the three dots `⋮` > **Install ZPPSU Archiving System**.
3. 🎉 **Done!** You now have a launch icon on your Mac Dock.

#### On Android Phones & Tablets:
1. Open the link in **Google Chrome**.
2. Tap the three dots menu `⋮` at the top right.
3. Tap **Install app** or **Add to Home Screen**.
4. 🎉 **Done!** An app icon appears on your phone's home screen.

#### On iPhone & iPad:
1. Open the link in **Safari**.
2. Tap the **Share** button (the square with an arrow pointing up).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add**.
5. 🎉 **Done!**

---

## 💻 Option 2: Host PC Setup Guide (For the Main Laptop or Server)

Follow this section on the primary laptop or computer that will act as the university office server.

### 📋 Prerequisites (What to Download First)

You only need two free programs installed on the host computer:

#### 1. Download & Install Node.js
- **What it is:** The engine that runs the system.
- **Download Link:** [https://nodejs.org/](https://nodejs.org/)
- **Instructions:** Download the **LTS (Recommended for Most Users)** version and run the installer. Click **Next** on all prompts with the default options.

#### 2. Download & Install PostgreSQL
- **What it is:** The secure database that stores your files, categories, and user accounts.
- **Download Link:** [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
- **Instructions:** Run the installer. When it asks you to choose a password for the `postgres` user:
  - ⚠️ **Important:** Write down the password you type (for example: `root` or `password123`). You will need it in Step 2 below!

---

### 🛠️ Step 1: Create the Database

1. Open **pgAdmin** from your Windows Start Menu.
2. Enter the password you chose during PostgreSQL installation to connect.
3. In the left panel:
   - Double-click **Servers** > **PostgreSQL**.
   - Right-click on **Databases** > Click **Create** > **Database...**.
4. In the **Database** name field, type:
   ```text
   zppsu_archiving_db
   ```
5. Click **Save**.

---

### ⚙️ Step 2: Configure Your Database Password (.env)

The system needs to know your PostgreSQL password so it can connect to your new database.

1. In File Explorer, go to the project folder:
   ```text
   zppsu-archiving-system/backend/
   ```
2. Look for the file named `.env`.  
   *(If you only see `.env.example`, make a copy of it and rename it to `.env`)*.
3. Right-click `.env` and open it with **Notepad** (or any text editor).
4. Find line 1:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/zppsu_archiving_db"
   PORT=5000
   JWT_SECRET=mysecretkey
   ```
5. Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation.  
   *Example:* If your password is `root`, it should look like:
   ```env
   DATABASE_URL="postgresql://postgres:root@localhost:5432/zppsu_archiving_db"
   ```
6. Save and close the file (`Ctrl + S`).

---

### 📦 Step 3: Install & Prepare the System (One-Time Setup)

1. Open File Explorer and open the `zppsu-archiving-system` main folder.
2. Click on the address bar at the top, type `cmd`, and press **Enter**. A black command window will open directly in this folder.
3. Copy and paste these three commands (press Enter after each):

#### 1. Install system dependencies:
```bash
npm install && npm install --prefix frontend
```
*(Wait 1–2 minutes until it finishes).*

#### 2. Set up database tables and generate client:
```bash
npm run prisma:migrate && npm run prisma:generate
```

#### 3. Seed default admin, categories, and cabinets:
```bash
npm run seed
```

✅ **Setup Complete!** Your database now has:
- The default Administrator account.
- University categories: *Administrative, Academic, Financial*.
- 3 Physical storage cabinets with 12 organized storage boxes ready for files.

---

### 🚀 Step 4: Start the System

Whenever you want to use the system, simply open a terminal in the project folder and run:

```bash
npm run dev
```

You will see:
- 🟢 **Backend Server:** Running on port `5000`
- 🟢 **Frontend App:** Ready at `http://localhost:5174`

Open your browser and visit: **[http://localhost:5174](http://localhost:5174)**!

> 🛑 **To stop the system:** Click inside the terminal and press `Ctrl + C`, then type `y` and press Enter.

---

## 🌐 How to Let Other Laptops in the Office Connect

You can access the system from any laptop or computer in the office connected to the same Wi-Fi:

1. On the host computer, open Command Prompt (`cmd`) and type:
   ```bash
   ipconfig
   ```
2. Look for **IPv4 Address** under your active Wi-Fi or Ethernet connection (for example: `192.168.1.45`).
3. On other office laptops, simply open their web browser and type:
   ```text
   http://192.168.1.45:5174
   ```
   *(Replace `192.168.1.45` with your actual IPv4 address).*
4. The system will load immediately! They can then click **Install App** as explained in [Option 1](#-option-1-how-to-download--install-the-app-on-any-device).

---

## 🔑 Default Login Credentials

Use these credentials to log in for the first time:

| Field | Credentials |
| :--- | :--- |
| **System URL** | [http://localhost:5174/login](http://localhost:5174/login) |
| **Email** | `admin@example.com` |
| **Password** | `password123` |
| **Role** | **Admin** (Full Management Access) |

> 🔒 **Security Notice:** There is no public registration page. This is intentional to ensure only authorized university personnel have access to institutional archives.

---

## 👥 How to Add Staff Members

Once logged in as Admin, you can easily register accounts for other staff members:

1. Log in with the **Admin** account.
2. In the left navigation menu, click **Users** (`http://localhost:5174/users`).
3. Click the **Register User** button at the top right.
4. Enter the staff member's:
   - **Full Name**
   - **Email Address** (e.g., `guidance.staff@zppsu.edu.ph`)
   - **Password**
   - **Role:** Choose `User` (Staff) or `Admin`.
5. Click **Save**.
6. That staff member can now log in from their own laptop or device using their email and password!

---

## 🌟 What Can You Do in the System?

- 📄 **Upload & Digitize Records:** Upload PDFs, scanned documents, and photos.
- 🔍 **Smart Text Search (OCR):** Search by any keyword. The system searches inside scanned text, title, subject, and document notes.
- 🗄️ **Physical Cabinet & Box Tracking:** Whenever a file is uploaded, assign it to a physical **Cabinet** and **Storage Box** in the records room so physical copies are never lost.
- 📊 **Cabinet Capacity Management:** Live storage gauges show how full each box is (with automatic warnings when boxes approach capacity).
- 📜 **Audit Trail & Activity Logs:** Automatically tracks and records who logged in, logged out, uploaded, viewed, downloaded, edited, or deleted files with timestamps and IP addresses for full legal accountability.
- 📑 **Export Masterlist:** Download the complete archive catalog to CSV / Excel spreadsheet anytime.

---

## 🛠️ Technology Stack Used

The **ZPPSU Archiving System** is built on a decoupled, enterprise-grade **Three-Tier Architecture** (Presentation Tier • Application Tier • Data Persistence Tier) designed for high performance, document throughput, data integrity, and local network accessibility.

### 🖥️ 1. Frontend & Client (Presentation Tier)
- **Framework & Core:** [React 19](https://react.dev/) (`v19.2`) — Modern declarative UI library with React Server Component support and concurrent rendering.
- **Build Tool & Bundler:** [Vite 8](https://vite.dev/) (`v8.0`) — Ultra-fast frontend development server and production bundler.
- **Progressive Web App (PWA):** [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) (`v1.3`) — Service worker caching and offline-capable PWA manifest, allowing zero-install client usage as a standalone app across Windows, macOS, Android, and iOS.
- **Styling & Design System:** [Tailwind CSS v4](https://tailwindcss.com/) (`v4.3`) & [`@tailwindcss/vite`](https://tailwindcss.com/) — Next-generation engine with custom CSS design tokens and high-performance utility compilation.
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (`v4.13`) built with [@base-ui/react](https://base-ui.com/) and [cmdk](https://cmdk.paco.me/) for accessible, unstyled component primitives.
- **Typography & Styling Helpers:** Geist Variable Font (`@fontsource-variable/geist`), `tailwind-merge`, and `class-variance-authority` (CVA).
- **Icons:** [Lucide React](https://lucide.dev/) (`v1.25`) & [React Icons](https://react-icons.github.io/react-icons/) (`v5.6`).
- **Routing:** [React Router v7](https://reactrouter.com/) (`v7.15`) — Declarative client-side routing and protected route guards.
- **HTTP Client:** [Axios](https://axios-http.com/) (`v1.16`) — Promise-based HTTP client for REST API communication.
- **Date Utilities:** `date-fns` (`v4.4`), `react-day-picker`, and `react-calendar` for administrative date picking and period filtering.

### ⚙️ 2. Backend & Application Logic (Application Tier)
- **Runtime Environment:** [Node.js](https://nodejs.org/) (v18+ LTS recommended).
- **Server Framework:** [Express.js 5](https://expressjs.com/) (`v5.2`) — Lightweight, high-throughput REST API routing engine.
- **Authentication & Security:**
  - **JWT (JSON Web Tokens):** `jsonwebtoken` (`v9.0`) for stateless token-based authorization and session management.
  - **Password Hashing:** `bcrypt` (`v6.0`) & `bcryptjs` (`v3.0`) for secure, salted password hashing.
  - **Network Guards:** `cors` (`v2.8`) middleware for Cross-Origin Resource Sharing control and Role-Based Access Control (RBAC).
  - **Environment Configuration:** `dotenv` (`v17.4`) for secure credential isolation.
- **File Upload & Ingestion:** [Multer](https://github.com/expressjs/multer) (`v2.1`) — Multipart form-data parser with automatic disk storage routing into organized upload directories.

### 🗄️ 3. Database & Persistence (Data Tier)
- **Database Engine:** [PostgreSQL](https://www.postgresql.org/) (v14+) — Industrial-grade relational database for relational schemas, ACID compliance, and relational integrity.
- **Database Driver:** `pg` (`v8.20`) — Native PostgreSQL client for Node.js.
- **ORM & Schema Migrations:** [Prisma ORM 6](https://www.prisma.io/) (`v6.6`) — Type-safe database client, declarative schema modeling, and automated database migrations.
- **File System Storage:** Local disk-based persistent document storage (`uploads/` directory) ensuring institutional records remain safely on-premises.

### 📄 4. Document Ingestion, Text Extraction & OCR Pipeline
- **Native PDF Parsing:** [`pdf-parse`](https://www.npmjs.com/package/pdf-parse) (`v2.4`) — Fast machine text extraction from digital PDF documents without running heavy OCR unnecessarily.
- **Office Document Parsing:** [`officeparser`](https://www.npmjs.com/package/officeparser) (`v7.2`) — Automated text extraction for Word documents (`.docx`), PowerPoint decks (`.pptx`), and Excel spreadsheets (`.xlsx`).
- **OCR Fallback Engine:** [Tesseract.js](https://tesseract.projectnaptha.com/) (`v7.0`) — Pure JavaScript Optical Character Recognition (OCR) fallback that automatically extracts searchable text from scanned physical documents and image-based records.

### 🧠 5. AI & Semantic Search
- **Local Neural Embeddings:** [@xenova/transformers](https://huggingface.co/docs/transformers.js) (`v2.17`) — Local Hugging Face Transformers running directly in Node.js for semantic vector search and intelligent text indexing without requiring external API keys.

### 📊 6. Analytics, Reporting & Export
- **Data Visualization:** [Recharts](https://recharts.org/) (`v3.8`) — Declarative charting library for storage capacity gauges, upload trends, category distributions, and accomplishment charts.
- **Client & Server PDF Generation:** [jsPDF](https://github.com/parallax/jsPDF) (`v4.2`) with `jspdf-autotable` (`v5.0`) on frontend, and [PDFKit](https://pdfkit.org/) (`v0.19`) on backend for formal report generation.
- **Spreadsheet Compilation:** [ExcelJS](https://github.com/exceljs/exceljs) (`v4.4`) & [XLSX](https://sheetjs.com/) (`v0.18`) for exporting document catalogs and audit masterlists to CSV and Excel `.xlsx` formats.

### 🛠️ 7. Development & Tooling
- **Process Orchestration:** `concurrently` (`v8.2`) to run both backend and frontend development environments simultaneously.
- **Hot Reloading:** `nodemon` (`v3.1`) for automatic backend server restarts on file modifications.
- **Testing & Quality:** [Playwright](https://playwright.dev/) (`v1.64`) for end-to-end workflow verification, and ESLint (`v10.2`) for code quality.

---

## ❓ Beginner Troubleshooting FAQ

### 1. "Authentication failed for user 'postgres'" or Error `P1000`
- **Cause:** The database password in `backend/.env` is incorrect.
- **Fix:** Open `backend/.env` in Notepad and ensure the password inside `DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/zppsu_archiving_db"` matches what you set during PostgreSQL installation.

### 2. "Database 'zppsu_archiving_db' does not exist"
- **Cause:** Step 1 was skipped.
- **Fix:** Open pgAdmin, right-click **Databases** > **Create** > **Database...**, name it `zppsu_archiving_db`, click Save, and then run `npm run prisma:migrate`.

### 3. "Port 5000 or 5174 is already in use"
- **Cause:** Another instance of the system is already running in the background.
- **Fix:** Close all open command prompt windows running Node.js, or restart your computer.

### 4. Other laptops cannot connect to `http://<IP>:5174`
- **Cause:** Both computers must be on the same Wi-Fi, or Windows Firewall is blocking inbound connections.
- **Fix:**
  1. Make sure both computers are connected to the exact same Wi-Fi network.
  2. In Windows search, type **Allow an app through Windows Firewall**, ensure **Node.js** has both Private and Public network boxes checked.

### 5. How do I reset the Admin account or database?
- Simply run in your terminal:
  ```bash
  npm run seed
  ```
  This restores the default admin (`admin@example.com` / `password123`), default categories, and storage cabinets safely.

---

## 📞 Support & Documentation

For technical system architecture, API specifications, and database entity diagrams, please see the [`docs/`](docs/) directory.
