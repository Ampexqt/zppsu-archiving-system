# ZPPSU Archiving System - Project Overview

## 1. Introduction
The **ZPPSU Archiving System** is an enterprise-grade, secure, and modern web application designed for document-intensive workflows within the university. It serves as the central repository for institutional records, providing a reliable, fast, and accessible platform to manage, retrieve, and track both digital and physical academic and administrative documents.

## 2. Project Goals
- **Centralized Document Management:** Create a single source of truth for all university records, seamlessly linking physical cabinets to digital files.
- **Enhanced Searchability:** Enable instant retrieval of documents through advanced metadata indexing, including subject, document type, and OCR (Optical Character Recognition) text.
- **Role-Based Access Control:** Ensure strict security and privacy by managing document visibility and actions based on user roles (Admin vs User).
- **Audit & Compliance:** Maintain an accurate history and audit trail of document statuses, uploads, and modifications.
- **Analytics & Accountability:** Provide comprehensive reporting on system usage, physical storage capacities, and staff accomplishments.

## 3. Core Functionality & Use Cases

### 3.1. Digital & Legacy Document Uploading
The system caters to both modern born-digital files and scanned physical archives.
- **Standard Upload:** For current digital files, directly saving the file and generating associated metadata.
- **Legacy Document Upload:** Specifically tailored for historical documents, allowing them to be indexed and stored with retro-active dates (memo dates, received dates).
- **Data Extraction:** Support for storing extracted `ocr_text` to make scanned physical documents fully searchable.

### 3.2. Physical Storage & Inventory Mapping
Unlike standard cloud drives, this system bridges the gap between physical and digital storage.
- **Inventory Tracking:** The system manages physical `inventory` locations (Cabinets, Shelves, Folder counts, and Used space).
- **Digital-to-Physical Assignment:** A digital record can be assigned to a specific Cabinet and subsequently a specific File Box within that cabinet, ensuring precise physical location tracking.
- **Capacity Monitoring:** Real-time tracking of cabinet usage based on the total document capacity and current occupancy of all its assigned file boxes, rather than just box counts.

### 3.3. Document Lifecycle & Retention Workflow
Documents follow a strict lifecycle ensuring nothing is accidentally lost.
- **Metadata Management:** Users can update a document's Subject, Type, and Status.
- **Soft Deletion & Restoration:** Instead of immediately deleting a file, the system marks it as `is_deleted = true`. Administrators can "Restore" the document back to "Active" status, which automatically logs a RESTORE event.
- **Permanent Deletion:** Authorized personnel (Admins) can execute a permanent delete, physically removing the record from the database.

### 3.4. Accomplishment & Audit Reporting
To maintain high standards of administrative productivity, the system tracks all actions.
- **Audit Logs:** Every action (UPLOAD, DELETE, ARCHIVE, RESTORE, MOVE, GENERATE) is tied to the user's ID and timestamped.
- **Accomplishment Module:** Generates filtered reports based on date ranges (startDate, endDate) to summarize how many uploads, deletes, archives, or restores a specific department or the entire staff completed.
- **Dashboard Analytics:** Displays real-time metrics including:
  - Total Files, Users, Categories, and Logs.
  - Visual breakdowns including a Pie Chart for documents grouped by main Categories and a Bar Chart for Document Status.
  - Overall storage capacity usage and detailed Cabinet Usage monitoring based on exact document counts.

## 4. User Roles & Access Control
- **Administrators (Admin):** Have global access to modify any file, manage users, perform permanent deletions, and view comprehensive system analytics.
- **Standard Users:** Can upload documents, but can only modify or soft-delete files they explicitly uploaded (`uploaded_by === req.user.id`).

## 5. Technology Stack & Component Architecture
- **Backend:** Node.js with Express.js routing.
- **Database Architecture:** PostgreSQL managed via Prisma ORM. Key tables include `users`, `categories`, `files`, `logs`, and `inventory`.
- **Frontend Architecture:** Built using `shadcn/ui` and `Tailwind CSS` for a highly consistent enterprise feel.
- **Icons:** `Lucide Icons` (outline style for minimal visual noise).
- **Typography:** `Geist` (Primary) for excellent screen readability, falling back to `Inter`.

## 6. Design Principles
- **Simplicity First:** Avoid unnecessary decorations. Whitespace is heavily utilized to structure information logically.
- **Document-Centric UI:** Documents receive the highest visual priority. Everything else serves to support document discovery and management.
- **Information Hierarchy:** Strict visual separation between primary actions (Solid Maroon buttons), secondary actions, and metadata. Tables use distinct styling including colored status/role badges and user avatars for clear scannability.
- **Consistency:** Uniform styling across all pages regarding spacing, typography, pagination (limited to 10 records per page to reduce clutter), and hover interactions.
