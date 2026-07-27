# Project Scope

## Purpose

This document defines the agreed project scope for the ZPPSU Archiving System.

Its purpose is to establish clear development boundaries, identify included features, define future enhancements, and prevent scope creep during development.

This document should always be referenced together with:

- project-overview.md
- implementation-changes.md
- client-revisions.md

---

# Project Type

Progressive Web Application (PWA)

The system is a web-based document and physical records management system designed for Zamboanga Peninsula Polytechnic State University (ZPPSU).

The application should behave like a native application while remaining accessible through a web browser.

---

# Project Objectives

The project aims to:

- Digitize university records
- Manage physical document locations
- Improve document retrieval
- Provide accomplishment reporting
- Maintain document audit trails
- Support role-based access control
- Improve administrative efficiency

---

# Included Features (Current Scope)

## Authentication

- Login
- Logout
- Role-Based Access Control
- User Session Management

---

## Dashboard

- Overview Statistics
- Storage Usage
- Recent Activities
- Document Analytics
- Inventory Summary

---

## Document Center

- Upload Documents
- View Documents
- Search Documents
- Filter Documents
- Download Documents
- Archive Documents
- Restore Documents
- Soft Delete

Supported File Types:

- PDF
- DOCX
- PPTX

---

## Smart Upload

- Direct File Upload
- Automatic Metadata Extraction
- OCR for scanned/image-based PDFs only

---

## Document Categories

Manage document classifications based on the nature of documents.

---

## Physical Inventory

Manage physical document locations.

Includes:

- Cabinets
- File Boxes
- Capacity Monitoring (Document-based occupancy aggregated across File Boxes)
- Storage Status
- Dual Document Mapping (Assignment of both Cabinet and File Box)

---

## Cabinet Management

Administrators can:

- Create Cabinets
- Update Cabinets
- Delete Cabinets
- Monitor Capacity

---

## File Box Management

Administrators can:

- Create File Boxes
- Update File Boxes
- Delete File Boxes
- Assign Cabinets
- Monitor Capacity

---

## Generated Documents

Generate official system documents.

Includes:

- Accomplishment Reports
- Inventory Reports
- Master Lists

Generated documents automatically:

- Save to Document Center
- Register in Inventory
- Create Activity Logs

---

## Accomplishment Reports

Generate reports using:

- Date Range
- Department
- User
- Category

Export formats:

- PDF

(Optional)

- Excel

---

## Search

Search by:

- Subject
- Category
- Cabinet
- File Box
- File Type
- Date
- Keywords

---

## Activity Logs

Log system activities including:

- Login
- Logout
- Upload
- Generate Report
- Archive
- Restore
- Delete
- Cabinet Assignment
- File Box Assignment

---

## User Management

Manage system users including creation, role assignment (Admin/User), and deletion.

---

## User Interface & Experience Standards (UI/UX)

The application follows premium, modern design standards:
- **Consistent Pagination:** All data tables (Files, Inventory, Logs, Users, Categories) utilize a standardized pagination system (10 rows per page) to prevent visual clutter and long scrolling.
- **Premium Table UI:** Data tables are housed within rounded cards with subtle drop shadows, featuring clear column headers and responsive hover states.
- **Visual Enhancements:** Distinct user/category avatars (colored circles with initials) and custom colored badges for Roles and Statuses (e.g., Active, Admin) ensure high scannability.
- **Responsive Dashboard:** Dashboard analytics utilize distinct visual formats, including Pie charts for broad categories and Bar charts for statuses, alongside real-time capacity progress bars.

Administrators can:

- Create Users
- Edit Users
- Disable Users
- Assign Roles

---

## Progressive Web App (PWA)

The application should support:

- Installable Application
- Responsive Design
- Offline Application Shell
- Asset Caching
- Fast Loading
- Cross-Platform Support

---

# Out of Scope

The following features are NOT included unless separately approved by the client.

- Mobile Application (Android/iOS)
- Desktop Application
- AI Chatbot
- AI Document Summarization
- Facial Recognition
- Biometric Authentication
- Email Notification System
- SMS Notification System
- QR Code Tracking
- Barcode Printing
- Multi-language Support
- Cloud Storage Integration
- Third-party ERP Integration
- Payment Systems
- Public Document Portal

---

# Future Enhancements

Potential future improvements include:

- AI Semantic Search
- Document Version History
- Bulk Upload
- Bulk Archive
- QR Code Labels
- Barcode Labels
- Backup & Restore
- Dark Mode
- Advanced Analytics
- Department Dashboard
- Email Notifications

These features are not part of the current implementation unless formally requested.

---

# Scope Change Policy

Any feature requested after approval of this scope is considered a Change Request.

Examples include:

- New modules
- Workflow redesign
- Database redesign
- Additional dashboards
- New reports
- Third-party integrations
- Major UI redesigns

Approved Change Requests should be documented in:

client-revisions.md

before implementation begins.

---

# Development Principles

All implementations should follow these principles:

- Clean Architecture
- Maintainable Code
- Modular Components
- Secure Authentication
- Role-Based Authorization
- Consistent UI Design
- Responsive Layout
- Scalable Database Design
- Comprehensive Activity Logging

---

# Documentation Consistency

Whenever a feature changes, update the following documents if affected:

- project-overview.md
- implementation-changes.md
- client-revisions.md
- api-specification.md
- database-schema.md
- folder-structure.md

Documentation and implementation should always remain synchronized.

---

# Definition of Done

A feature is considered complete when:

- Functionality is implemented.
- Database changes are complete.
- API endpoints are completed.
- UI is responsive.
- Validation is implemented.
- Activity logs are recorded.
- Role permissions are enforced.
- Feature has been tested.
- Documentation has been updated.

---

# Project Deliverables

The final project includes:

- Complete Progressive Web Application (PWA)
- Responsive User Interface
- Backend API
- PostgreSQL Database
- Documentation
- Activity Logging
- Role-Based Access Control
- Physical Inventory Management
- Document Management
- Generated Reports
- Dashboard Analytics

---

# Notes

This scope represents the agreed implementation of the ZPPSU Archiving System.

Any modification beyond this scope should be reviewed, approved by the client, and documented before development proceeds.

The objective is to maintain a stable, well-documented, and maintainable system while minimizing scope creep throughout the development lifecycle.