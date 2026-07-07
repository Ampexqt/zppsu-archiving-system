# Client Revisions

## Purpose

This document records all approved requirement changes requested by the client after the original capstone documentation was completed.

These revisions take precedence over the original documentation whenever conflicts exist.

---

# Revision History

## Revision 1
**Date:** July 6, 2026

### Requested by
Client

### Status
Approved

---

## 1. Revise OCR Workflow

### Original Requirement

Users upload scanned documents and the system automatically performs OCR.

### Revised Requirement

Users should upload documents directly instead of scanning.

Supported file types:

- PDF
- DOCX
- PPTX

OCR should only execute when the uploaded PDF is image-based or does not contain machine-readable text.

### Reason

To simplify document uploading and improve usability.

---

## 2. Generated Documents Module

### Original Requirement

The documentation only mentions generating reports.

### Revised Requirement

Generated reports become official archived documents.

After generation they must automatically:

- Save to the Document Center
- Register in Inventory
- Create Activity Logs
- Become searchable

### Reason

Generated reports are official university records and should be managed like uploaded documents.

---

## 3. Cabinet Selection During Report Generation

### Original Requirement

Not specified.

### Revised Requirement

Before saving a generated document, the user must select:

- Cabinet

### Reason

Every generated physical document must have a storage location.

---

## 4. File Box Selection

### Original Requirement

Documentation references Drawers.

### Revised Requirement

Replace the physical storage workflow with:

Cabinet

↓

File Box

Generated documents must be assigned to a File Box.

### Reason

Matches the actual filing process used by the office.

---

## 5. Inventory Synchronization

### Original Requirement

Inventory only tracks uploaded documents.

### Revised Requirement

Generated reports must automatically update Inventory.

No manual registration should be required.

### Reason

Avoid duplicate work and maintain accurate inventory records.

---

## 6. Document Center Synchronization

### Original Requirement

Generated reports were not stored.

### Revised Requirement

Every generated report must automatically appear in the Document Center.

### Reason

Generated reports are official archived documents.

---

# Impact on the System

The following modules require updates:

- Document Upload
- OCR Processing
- Generated Documents
- Document Center
- Inventory
- Cabinet Management
- File Box Management
- Dashboard
- Activity Logs
- Database Schema

---

# Database Impact

The following database changes are recommended:

- Add File Boxes
- Support Generated Documents
- Store Cabinet assignments
- Store File Box assignments
- Update document relationships

---

# Documentation Impact

The following documentation should be updated:

- Functional Requirements
- System Flow
- DFD
- ERD
- Database Design
- Project Overview

---

# Development Notes

These revisions are officially approved by the client and supersede conflicting details found in the original capstone documentation.

All future development should follow this document together with:

- project-overview.md
- implementation-changes.md

If future revisions are requested, append them below using the same format.

---

# Revision Template

## Revision X
**Date:**

### Requested by

### Status

### Original Requirement

### Revised Requirement

### Reason

### Modules Affected

### Database Impact

### Documentation Impact

### Notes