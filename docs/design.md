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

# Color Palette

## Primary

Deep Maroon

HEX

#800000

Usage

- Primary Buttons
- Navigation
- Active Sidebar
- Headers
- Links
- Icons (Primary)

---

## Primary Hover

#660000

---

## Primary Active

#4D0000

---

## Accent

Golden Yellow

HEX

#FFD700

Usage

- Notifications
- Highlights
- Active Indicators
- Warnings
- Badges
- Progress
- Charts

---

## Accent Hover

#E6C200

---

## Background

Cream

HEX

#FDFBF7

Purpose

Reduce eye strain compared to pure white.

---

## Secondary Background

Beige

HEX

#F5F5DC

Used for:

- Sidebar background
- Secondary panels
- Empty states

---

## Surface

White

HEX

#FFFFFF

Used for:

- Cards
- Tables
- Forms
- Modals
- Archive previews

---

## Border

#E5E7EB

Very subtle.

---

## Divider

#ECECEC

---

## Text Primary

#1F2937

---

## Text Secondary

#6B7280

---

## Success

#16A34A

---

## Warning

#D97706

---

## Error

#DC2626

---

## Info

#2563EB

---

# Tailwind Role Mapping

Primary

```
#800000
```

Primary Hover

```
#660000
```

Primary Active

```
#4D0000
```

Accent

```
#FFD700
```

Background

```
#FDFBF7
```

Surface

```
#FFFFFF
```

Muted

```
#F5F5DC
```

Border

```
#E5E7EB
```

Foreground

```
#1F2937
```

Muted Foreground

```
#6B7280
```

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

White

Active Item

Maroon

Inactive

Gray

Hover

Light Beige

Icons

Outlined

Minimal

Rounded

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

Primary

Solid Maroon

Secondary

Outline

Ghost

Transparent

Danger

Red

Icon Buttons

Square

44px

---

# Status Badges

Archived

Maroon

Pending

Golden

Approved

Green

Rejected

Red

Draft

Gray

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