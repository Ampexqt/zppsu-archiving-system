# DESIGN.md
# ZPPSU Archiving System Design System

> **Version:** 1.0  
> **Product:** ZPPSU Archiving System  
> **Design Philosophy:** Minimal • Modern • Academic • Enterprise-grade • Accessible

---

# Design Vision

The **ZPPSU Archiving System** should communicate **trust, professionalism, security, and institutional credibility** while remaining extremely easy to use for daily administrative work.

Unlike commercial SaaS dashboards, this system is intended for **document-intensive workflows**, meaning readability, information hierarchy, and efficient navigation take priority over decorative visuals.

The interface should feel like a modern university information system with subtle branding rather than a marketing website.

The overall experience should emphasize:

- Clean layouts
- Large whitespace
- High readability
- Fast navigation
- Clear document hierarchy
- Strong accessibility
- Consistent interactions
- Minimal visual noise
- Professional institutional branding

---

# Target Users

Primary users include:

- University Administrators
- Records Office Personnel
- Faculty Members
- Department Staff
- Student Assistants
- Authorized Institutional Users

Users spend long hours managing records, therefore every interface should reduce cognitive load and visual fatigue.

---

# Design Keywords

- Minimalist
- Modern
- Clean
- Institutional
- Professional
- Trustworthy
- Elegant
- Organized
- Secure
- Timeless
- Calm
- Spacious
- Highly Readable
- Responsive

---

# Design Principles

## 1. Simplicity First

Every screen should display only what the user needs.

Avoid unnecessary decorations, gradients, animations, and complex illustrations.

Whitespace is part of the design.

---

## 2. Document-Centric UI

Documents are the most important content.

Everything else should support document management.

Documents should always receive the highest visual emphasis.

---

## 3. Information Hierarchy

The interface must clearly separate:

- Primary Actions
- Secondary Actions
- Metadata
- Archive Information
- Status Indicators
- Navigation

Users should never wonder where to click next.

---

## 4. Consistency

Every page should use identical:

- spacing
- typography
- card style
- table style
- iconography
- button styles
- colors

No page should feel like it belongs to another application.

---

## 5. Accessibility

Minimum contrast ratio:

AA compliant

Large clickable targets

Keyboard accessible

Visible focus states

Readable font sizes

No color-only communication.

---

# Brand Identity

The design should subtly represent the university's identity without overwhelming users.

The maroon color acts as the primary institutional branding while golden accents provide emphasis and prestige.

---

# Color Palette (Mandatory 11-Color System)

The system exclusively uses an 11-color palette designed for optimal contrast, academic prestige, and minimal eye strain:

| Role | Color Name | Hex | Primary Use Cases |
| :--- | :--- | :--- | :--- |
| **Maroon 900** | Deep Wine | `#4A0E1C` | Main hero banners, sidebar background, dark cards |
| **Maroon 700** | Rich Maroon | `#6B1D2A` | Primary buttons, active states, key headings |
| **Maroon 500** | Warm Maroon | `#8B3545` | Hover states, interactive accents |
| **Maroon 100** | Soft Rose | `#F4E7EA` | Light status badges, active item backgrounds, header bands |
| **Gold 700** | Antique Gold | `#A87818` | Strong gold accents, warning/pending text |
| **Gold 500** | Warm Gold | `#C99A2E` | Primary accent, active toggles, brand highlights |
| **Gold 200** | Soft Champagne | `#F2DFB0` | Subtle backgrounds, pending badges, table header highlights |
| **White** | Warm White | `#FFFCF7` | Main page background, card surfaces, clean modals |
| **Black** | Charcoal Ink | `#1D1A1B` | Main body text, primary headers, high contrast labels |
| **Gray** | Slate Gray | `#5F5A5C` | Secondary text, muted labels, secondary icons |
| **Light Gray** | Warm Gray | `#E8E3E1` | Borders, dividers, subtle table gridlines, disabled UI |

---

# Status Badge Mappings

- **Active / Approved / Success:** `bg-[#F4E7EA] text-[#6B1D2A] border-[#E8E3E1]`
- **Pending / In Review / Warning:** `bg-[#F2DFB0] text-[#A87818] border-[#C99A2E]`
- **Archived / Secondary:** `bg-[#FFFCF7] text-[#5F5A5C] border-[#E8E3E1]`
- **Deleted / Danger:** `bg-[#F4E7EA] text-[#4A0E1C] border-[#E8E3E1]`

---

# Typography

Primary Font

Geist

Fallback

Inter

Fallback

System UI

Reason

Modern

Professional

Excellent readability

Perfect with shadcn/ui

---

## Heading Scale

H1

40px

Bold

---

H2

32px

Semibold

---

H3

24px

Semibold

---

H4

20px

Medium

---

Body

16px

Regular

---

Small

14px

---

Caption

12px

---

# Layout

Maximum content width

1600px

Dashboard padding

32px

Section spacing

32px

Card padding

24px

Grid gap

24px

Button height

44px

Input height

44px

Border radius

12px

Cards

12px

Modal

16px

Buttons

10px

Never exceed:

16px radius

---

# Navigation

Use a collapsible left sidebar.

Sidebar width

280px

Collapsed

72px

Top Navigation

64px height

Sticky

Contains

- Search
- Notifications
- User Profile
- Settings

---

# Sidebar

Background

Deep Wine (`#4A0E1C`)

Active Item

Rich Maroon (`#6B1D2A`) with Warm White (`#FFFCF7`) Text

Inactive Item

Warm White (`#FFFCF7` / 80% opacity)

Hover State

Warm Maroon (`#8B3545`)

Brand Accent / Toggles

Warm Gold (`#C99A2E`)

Icons

Outlined, minimal, rounded (Lucide icons)

---

# Recommended Icon Library

Use

Lucide Icons

Reasons

- Native with shadcn/ui
- Minimal
- Consistent stroke
- Lightweight
- Professional
- Excellent accessibility
- Perfect for enterprise dashboards

Preferred icons include:

- Folder
- FolderArchive
- FileText
- Files
- Database
- Search
- Upload
- Download
- Clock3
- Calendar
- User
- Users
- ShieldCheck
- Building2
- GraduationCap
- School
- Archive
- Trash2
- History
- ScanSearch
- Bell
- Settings
- LogOut
- ChevronRight
- ChevronDown
- Plus
- Pencil
- Eye
- Filter
- LayoutDashboard

Avoid filled icons.

Use only outline icons.

Maintain a consistent 2px stroke width.

---

# Components

Framework

shadcn/ui

Required Components

- Button
- Card
- Table
- Data Table
- Input
- Label
- Dialog
- Alert Dialog
- Dropdown Menu
- Command
- Sheet
- Tooltip
- Avatar
- Badge
- Breadcrumb
- Separator
- Tabs
- Pagination
- Skeleton
- Calendar
- Popover
- Select
- Checkbox
- Radio Group
- Textarea
- Sonner Toast
- Accordion
- Scroll Area

---

# Cards

Flat

No heavy shadows

Use only

shadow-sm

Hover

shadow-md

Border

1px

White background

---

# Tables

Tables are the core UI.

Requirements

Sticky header

Alternating row hover

Search

Sorting

Filtering

Pagination

Responsive

Rounded container

Light borders

Large spacing

Readable typography

Status badges

---

# Forms

Minimal

One-column when possible

Two-column on desktop

Clear labels

No floating labels

Validation below input

Large click targets

---

# Buttons
 
Primary Action

Solid Rich Maroon (`#6B1D2A`) with Warm White (`#FFFCF7`) text (Hover: Warm Maroon `#8B3545`)

Secondary Action

Outline with Warm Gray (`#E8E3E1`) border and Charcoal Ink (`#1D1A1B`) text (Hover: Soft Rose `#F4E7EA`)

Ghost / Action Link

Transparent background with Slate Gray (`#5F5A5C`) text (Hover: Rich Maroon `#6B1D2A` and Soft Rose `#F4E7EA`)

Danger Action

Deep Wine (`#4A0E1C`) / Soft Rose (`#F4E7EA`) container with Deep Wine text (Hover: Warm Maroon `#8B3545`)

Icon Buttons

Square, 36px–44px, minimal padding, rounded-lg/xl
 
---
 
# Status Badges
 
Active / Approved / Verified

Soft Rose (`#F4E7EA`) background with Rich Maroon (`#6B1D2A`) text and Warm Gray (`#E8E3E1`) border
 
Pending / In Review / Warning

Soft Champagne (`#F2DFB0`) background with Antique Gold (`#A87818`) text and Warm Gold (`#C99A2E`) border
 
Archived / Secondary / Neutral

Warm White (`#FFFCF7`) background with Slate Gray (`#5F5A5C`) text and Warm Gray (`#E8E3E1`) border
 
Rejected / Deleted / High Priority

Soft Rose (`#F4E7EA`) background with Deep Wine (`#4A0E1C`) text and Warm Gray (`#E8E3E1`) border
 
Draft

Warm White (`#FFFCF7`) background with Slate Gray (`#5F5A5C`) text and Warm Gray (`#E8E3E1`) border
 
---

# Search Experience

Global search should be available in the navbar.

Support:

- Archive Number
- Document Title
- Department
- Date
- Author
- Tags
- Keywords

Instant filtering preferred.

---

# Empty States

Use:

Minimal illustration

Simple icon

Helpful message

Single CTA

Avoid large decorative artwork.

---

# Loading States

Use Skeleton loaders.

Avoid spinning indicators for large tables.

---

# Animations

Minimal only.

Recommended:

Fade

Scale

Slide

150–200ms

Never use flashy animations.

---

# Shadows

Very subtle.

Allowed

shadow-sm

shadow-md

Avoid

Heavy elevation

Blurred shadows

Neumorphism

Glassmorphism

---

# Responsive Design

Mobile

Single column

Tablet

Adaptive grid

Desktop

Multi-column dashboard

Sidebar collapses automatically.

Tables should become horizontally scrollable.

Forms stack vertically.

Cards resize gracefully.

---

# Accessibility

Minimum touch target

44x44

Keyboard navigation

Required

Visible focus ring

Required

Screen reader labels

Required

Semantic HTML

Required

Color contrast

WCAG AA or better

---

# Dashboard Style

The dashboard should resemble a modern institutional management platform rather than a generic admin template.

Characteristics:

- Spacious layouts
- Strong typography hierarchy
- Minimal borders
- Flat surfaces
- Subtle elevation
- Consistent spacing
- Document-first workflow
- High-density data without clutter

---

# Overall UI Inspiration

The interface should take inspiration from the design quality and usability of:

- shadcn/ui
- Vercel Dashboard
- Linear
- Notion
- GitHub
- Microsoft Fluent (layout discipline only)
- Radix UI
- Clerk Dashboard
- Supabase Studio

Do **not** imitate these products directly. Instead, adopt their shared principles of clarity, consistency, restrained aesthetics, and exceptional usability.

---

# Design Summary

The ZPPSU Archiving System should present itself as a premium, university-grade records management platform with a timeless visual identity. Every interface should prioritize document management efficiency, institutional trust, and accessibility through minimalist layouts, subtle branding, consistent spacing, Lucide outline icons, shadcn/ui components, and responsive design. The experience should feel calm, organized, and dependable, enabling administrators and staff to work confidently for extended periods without unnecessary visual distractions.