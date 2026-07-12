# Implementation Changes (Client Requested)

## Overview

This document defines the additional features and architectural changes requested by the client. These changes override or extend the existing implementation and must be followed throughout the project.

---

# 1. Redesign Document Upload Workflow

## Objective

Replace the old scan-first OCR workflow with a modern document upload workflow.

## Requirements

- Support uploading:
  - PDF
  - DOCX
  - PPTX
  - XLSX

- OCR should NOT run on every upload.

- OCR should only execute when:
  - the uploaded PDF is image-based
  - the uploaded file contains no machine-readable text

- Office documents (DOCX, PPTX, XLSX) must have their text automatically extracted using `officeparser` for full-text indexing.

## Expected Workflow

Upload Document

↓

Extract Text

↓

If text exists
→ Save Metadata

Else

↓

Run OCR

↓

Save OCR Text

↓

Index Document

---

# 2. Generated Documents Module

## Objective

Generated reports should become official archived documents instead of temporary downloads.

## Requirements

The system must support generating:

- Accomplishment Reports
- Master Lists
- Inventory Reports

Generated documents must:

- be stored in the database
- appear in the Document Center
- appear in Inventory
- be searchable
- generate activity logs

---

# 3. Cabinet & File Box Selection

## Objective

Every generated document must have a physical storage location.

## Requirements

Before saving a generated document:

User must select:

- Cabinet
- File Box

These values must be saved together with the generated document.

---

# 4. Automatic Document Center Integration

## Objective

Generated reports should automatically become archived documents.

## Requirements

After generating:

- Save generated document
- Create metadata
- Display inside Document Center

No manual upload should be required.

---

# 5. Automatic Inventory Integration

## Objective

Inventory should update automatically.

## Requirements

After generating a report:

- assign Cabinet
- assign File Box
- update inventory statistics
- update storage count

No manual inventory registration.

---

# 6. Inventory Redesign

## Objective

Replace the current inventory structure.

Old Structure

Cabinet

↓

Shelf

New Structure

Cabinet

↓

File Box

↓

Documents

Inventory should display:

- Cabinet
- File Box
- Capacity
- Used
- Remaining
- Status

---

# 7. File Box Management

## Objective

Allow administrators to manage File Boxes.

## Required CRUD

- Create File Box
- Edit File Box
- Delete File Box
- Assign Cabinet
- Capacity
- Status

---

# 8. Accomplishment Report Improvements

## Add Filters

- Date Range
- Department
- User
- Category

## Export

- PDF

(Optional)

- Excel

Generated reports become archived documents.

---

# 9. Database Updates

The database should support the new workflow.

Recommended additions:

- file_boxes
- generated_documents
- document_locations

Update relationships accordingly.

---

# 10. Dashboard Improvements

Dashboard should include:

- Total Documents
- Generated Reports
- Cabinet Usage
- File Box Usage
- Storage Utilization
- Recent Activities

---

# 11. Search Improvements

Search should support filtering by:

- Subject
- Category
- Cabinet
- File Box
- File Type
- Date
- Generated Documents
- Full-text content (Smart Search inside document contents)

---

# 12. Activity Log Improvements

The following actions must be logged:

- Upload
- Generate Report
- Cabinet Assignment
- File Box Assignment
- Archive
- Restore
- Delete

Each log must include:

- User
- Timestamp
- Action
- Target Document

---

# Implementation Notes

These changes extend the original capstone documentation and represent the latest client-approved requirements.

Generated documents are considered official records and must behave exactly like uploaded documents throughout the system.

The Inventory module must manage both physical storage and document mapping.

All newly implemented features must follow the existing project architecture, maintain clean code practices, and integrate with role-based access control and activity logging.