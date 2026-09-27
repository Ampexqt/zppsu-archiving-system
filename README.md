# ZPPSU Archiving System

Welcome to the **ZPPSU Archiving System**! 

Whether you're an administrator trying to manage thousands of files, or a developer looking to understand how this software works, this guide will walk you through everything you need to know.

---

## 🎯 What is the ZPPSU Archiving System? (System Purpose)
The **ZPPSU Archiving System** is a secure, modern web application designed to act as a digital filing cabinet for the university. 

Instead of getting lost in mountains of physical paperwork or scattered computer folders, this system allows university staff to:
- **Upload and digitize** both modern digital files and scanned historical documents.
- **Instantly search** for any document using keywords, thanks to AI-powered text recognition (OCR) that can read text even inside scanned images.
- **Track physical storage** by mapping digital records to exact physical cabinets and boxes, so you always know where the hard copy is located.
- **Manage access securely** by ensuring only authorized personnel can upload, modify, or permanently delete important records.

It bridges the gap between physical paper storage and the digital world, ensuring institutional records are never lost.

---

## 🛠️ Technology Stack (What is it built with?)

This system is built using a modern, fast, and secure "Three-Tier" architecture:

- **Frontend (What you see & interact with):** 
  - **React.js & Vite:** Powers the fast, interactive user interface.
  - **Tailwind CSS & shadcn/ui:** Provides a clean, minimalist, and professional design.
- **Backend (The engine processing your requests):**
  - **Node.js & Express.js:** Handles the core logic, file uploads, and security rules.
  - **Tesseract.js & AI Embeddings:** Powers the Optical Character Recognition (OCR) to read text from images and enables smart semantic searches.
- **Database (The secure storage):**
  - **PostgreSQL:** A highly reliable relational database that stores all document information and user accounts.
  - **Prisma ORM:** Helps the backend talk to the database securely and efficiently.

---

## 🚀 Step-by-Step Setup Guide (From First Step to Final)

If you are a developer or IT staff setting up this system on a local computer or server, follow these steps carefully:

### Step 1: Install Prerequisites
You will need three pieces of software installed on your computer before starting:
1. **Node.js** (v18.x or higher) - *The environment that runs the code.*
2. **npm** (v9.x or higher) - *The package manager that downloads required files.*
3. **PostgreSQL** (v14 or higher) - *The database software.*

### Step 2: Set Up the Database
Open your PostgreSQL database management tool (like pgAdmin or dBeaver) and create a new, empty database named:
```sql
CREATE DATABASE zppsu_archiving_db;
```

### Step 3: Configure the System Connections
The system needs to know how to connect to your new database.
1. In the project folder, open the `backend/` folder and find the file named `.env`.
2. Open it in a text editor (like Notepad or VS Code) and update the `DATABASE_URL` line with your PostgreSQL username and password:
   ```ini
   DATABASE_URL="postgresql://<your_username>:<your_password>@localhost:5432/zppsu_archiving_db"
   PORT=5000
   JWT_SECRET=your_secret_key_here
   ```
*(Make sure to replace `<your_username>` and `<your_password>` with your actual database login details).*

### Step 4: Install Dependencies
Open your terminal (Command Prompt or Terminal) in the main project folder (`zppsu-archiving-system`) and run these two commands to download the necessary code libraries:

1. **Install Backend files:**
   ```bash
   npm install
   ```
2. **Install Frontend files:**
   ```bash
   npm install --prefix frontend
   ```

### Step 5: Prepare the Database Tables
Next, we need to tell the database how to structure our data (like creating the tables for Users, Files, etc). In the same terminal, run:

1. **Create the tables:**
   ```bash
   npm run prisma:migrate
   ```
2. **Generate the database client:**
   ```bash
   npm run prisma:generate
   ```

### Step 6: Start the Application!
You are ready to go! To start the system, run this single command in the terminal:
```bash
npm run dev
```
*(This command will launch both the backend server and the frontend interface simultaneously).*

---

## 🏁 Final Step: Using the System
1. Open your web browser (Chrome, Edge, Safari) and go to **http://localhost:5173**.
2. You will see the system's login screen. Since this is a brand new setup, click on **Sign Up** or **Register**.
3. Create your first account by entering your name, email, and a secure password.
4. **Log in** with the account you just created.
5. **Welcome to the Dashboard!** You can now begin uploading documents, managing file boxes, and utilizing the smart search features.

---
*For more detailed technical documentation, please refer to the `docs/` folder inside this repository.*
