# Landing Page Revision Specification

## Findings
The existing landing page (`frontend/src/pages/Home.jsx`) functions as a basic static marketing brochure with placeholder cards, failing to demonstrate the institutional authority, real-time searchability, and physical-to-digital inventory capabilities of the **ZPPSU Records & Document Management System**. 

Key gaps identified:
1. **Generic Visual Tone**: Resembles a generic SaaS template rather than an authoritative university repository built with the official ZPPSU palette (Deep Maroon `#800000`, Golden Yellow `#FFD700`, Cream `#FDFBF7`, Neutral `#1F2937`).
2. **Disconnected Navigation**: Navbar and Footer lack role-aware state handling (Guest vs. Authenticated User) and deep-linking to functional modules (`/document-center`, `/inventory`, `/reports`).
3. **Missing Interactive Query Interface**: No interactive mock search/retrieval bar in the Hero section to demonstrate immediate archive number/OCR lookup.
4. **Absence of Institutional Metrics & Live Feeds**: Missing live departmental metrics (Cabinets, File Boxes, Digitized Volumes) and recent upload activity ticker.

---

## Implementation

### 1. Design System & Token Enforcement
All components must adhere strictly to the repository design tokens specified in `docs/design.md`.

```css
/* Core Institutional Palette */
--primary: #800000;         /* Deep Maroon */
--primary-hover: #660000;   /* Deep Maroon Hover */
--primary-active: #4D0000;  /* Deep Maroon Active */
--accent: #FFD700;          /* Golden Yellow */
--accent-hover: #E6C200;    /* Golden Yellow Hover */
--bg-cream: #FDFBF7;        /* Main Page Background */
--bg-muted: #F5F5DC;        /* Beige / Secondary Panel */
--surface: #FFFFFF;         /* Card / Table Surface */
--border: #E5E7EB;          /* Subtle Gray Border */
--divider: #ECECEC;         /* Section Divider */
--text-primary: #1F2937;    /* Charcoal Text */
--text-secondary: #6B7280;  /* Slate Subtext */

/* Typography & Constraints */
--font-sans: 'Geist', 'Inter', system-ui, sans-serif;
--max-width: 1600px;
--radius-card: 12px;
--radius-button: 10px;
--shadow-card: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
```

---

### 2. Information Architecture & Section Hierarchy

```
+-----------------------------------------------------------------------------------+
| 1. INSTITUTIONAL TOPBAR & NAVIGATION (Guest vs. Authenticated State Switcher)      |
+-----------------------------------------------------------------------------------+
| 2. HERO REGION: INSTITUTIONAL QUERY & RETRIEVAL WORKSPACE                         |
|    - Authority Trust Badge (Official ZPPSU Records & Guidance Archive)            |
|    - Direct Document/Archive Search Mockup Bar (Archive No., Subject, Cabinet)    |
|    - Primary Action Bar (Portal Login / Direct Document Center Deep Link)         |
+-----------------------------------------------------------------------------------+
| 3. REAL-TIME INSTITUTIONAL METRICS (Departmental Records, Boxes, Cabinets)       |
+-----------------------------------------------------------------------------------+
| 4. CORE ARCHITECTURAL PILLARS (Physical-to-Digital, OCR, Compliance, Audit)      |
+-----------------------------------------------------------------------------------+
| 5. RECENT INSTITUTIONAL UPLOAD ACTIVITY FEED (Simulated Live Audit & Logs)        |
+-----------------------------------------------------------------------------------+
| 6. GOVERNANCE & ACCESS CONTROL MATRIX (Admin vs. Department Staff Permissions)    |
+-----------------------------------------------------------------------------------+
| 7. ENTERPRISE FOOTER & CAMPUS DIRECTORY (Official ZPPSU Campus & Office Links)    |
+-----------------------------------------------------------------------------------+
```

---

### 3. Component & Layout Specifications

#### Section 1: Institutional Navbar (`frontend/src/components/layout/Navbar.jsx`)
- **Sticky Height**: `64px` with background `rgba(255, 255, 255, 0.95)`, `backdrop-blur-md`, border `1px solid #E5E7EB`.
- **Branding Block**:
  - University Logo: `40px` circular emblem with subtle `#E5E7EB` border.
  - Text Hierarchy: Primary Title `ZPPSU Guidance & Records` (18px Bold `#1F2937`), Subtitle `INSTITUTIONAL ARCHIVING SYSTEM` (9px Bold `#800000`, tracking 0.15em).
- **Navigation Links**:
  - `Home` (`#home`)
  - `Query Portal` (`#search-hero`)
  - `Department Metrics` (`#metrics`)
  - `Physical Architecture` (`#architecture`)
  - `Activity Feed` (`#activity-feed`)
  - `Compliance` (`#compliance`)
- **State Switcher Matrix**:
  - **Guest State**:
    - "Login Portal" CTA: Solid `#800000` button, hover `#660000`, icon `LogIn`. Directs to `/login`.
  - **Authenticated State** (checks `localStorage.getItem("token")` / `useAuth`):
    - User Badge: Avatar with initials in `#800000` text on `#F5F5DC` bg.
    - Role Indicator: Badge displaying `ADMIN` or `STAFF`.
    - Quick Action: "Enter Dashboard" button (`/dashboard`) with `ArrowRight` icon.
    - Logout Action: Quick exit button calling auth context clear.

#### Section 2: Search & Query Hero Interface
- **Headline**: "Institutional Document Vault & Student Records Archive"
- **Sub-headline**: "Unified digital retention, OCR indexation, and physical cabinet tracking for the Zamboanga Peninsula Polytechnic State University."
- **Interactive Search/Query Simulation Bar**:
  - Input Container: `h-[56px]`, `bg-white`, `border-2 border-[#800000]/20`, `rounded-xl`, `shadow-sm`.
  - Input Field: Placeholder `"Search by Archive No. (e.g. ARC-2024-001), Subject, OCR keyword, or Cabinet..."`
  - Category Selector Dropdown: `All Classifications`, `Guidance Records`, `Accomplishment Reports`, `Administrative`, `Academic`.
  - Action Button: Solid Maroon `#800000` button with `Search` icon. Clicking redirects to `/login` (guest) or `/document-center?search=...` (authenticated).
  - Quick Search Pills:
    - `"ARC-2024-GUID"`
    - `"Cabinet A-01 / Box 3"`
    - `"2023-2024 Accomplishment Report"`
    - `"Counseling Intake Summary"`

#### Section 3: Institutional Metrics & Capacity Block
- **Layout**: 4-column responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, gap `20px`).
- **Metric Cards (`bg-white`, `border border-[#E5E7EB]`, `rounded-xl`, `p-6`)**:
  1. **Total Indexed Records**: `12,840+` (Icon: `FolderArchive`, Color: `#800000`)
  2. **Physical Cabinets Mapped**: `48 Active` across Guidance Offices (Icon: `Building2`, Color: `#800000`)
  3. **File Boxes Synchronized**: `256 Boxes` with dual digital mapping (Icon: `Database`, Color: `#800000`)
  4. **Compliance & Audit Rate**: `100% Verified` ISO 9001:2015 aligned (Icon: `ShieldCheck`, Color: `#16A34A`)

#### Section 4: Dual Physical-to-Digital Architecture Showcase
- **Headline**: "Bridging Digital Archives with Physical Campus Cabinets"
- **Interactive Visual Comparison Grid (2 Columns)**:
  - **Left Card - Physical Storage Hierarchy**:
    - Visual layout showing: `Office` → `Cabinet ID (e.g., CAB-G01)` → `File Box (e.g., BOX-12)` → `Physical Folder`.
    - Live capacity indicator bar (showing document threshold, e.g., `85% capacity`).
  - **Right Card - Digital Metadata & OCR Engine**:
    - Scanned PDF preview with OCR text recognition highlight.
    - Metadata pills: Subject, Category, Date Received, Retention Expiry, Uploaded By.

#### Section 5: Recent Institutional Upload Activity Feed
- **Purpose**: Demonstrates live governance, transparency, and high system utilization without exposing confidential data.
- **Layout**: Structured audit log table (`bg-white`, `border border-[#E5E7EB]`, `rounded-xl`, `overflow-hidden`).
- **Columns**:
  - `Document Reference`: Archive ID + Document Type (e.g., `[PDF] ARC-2024-0892` - Guidance Counseling Summary)
  - `Classification`: Badge with category (`Academic`, `Administrative`, `Confidential`)
  - `Physical Assignment`: Cabinet & Box tag (`Cabinet 2 / Box 04`)
  - `Action & Status`: `UPLOADED`, `ARCHIVED`, `RESTORED` badges (`#800000`, `#16A34A`, `#D97706`)
  - `Timestamp`: `2 minutes ago`, `14 minutes ago`, etc.

#### Section 6: Governance & Security Matrix
- **Layout**: 3 distinct institutional security feature cards:
  1. **Role-Based Access Control (RBAC)**: Strict segregation between System Administrators (global record management) and Department Personnel (upload & own-file modification).
  2. **Tamper-Evident Audit Logging**: Every upload, status mutation, cabinet movement, and file restoration logged with permanent immutable timestamps.
  3. **Soft-Delete Lifecycle & Recovery**: Guaranteed preservation against accidental record loss via administrator-controlled restoration pipelines.

#### Section 7: Institutional Footer (`frontend/src/components/layout/Footer.jsx`)
- **Background**: `#FFFFFF` with `#E5E7EB` top border.
- **Column 1 (Identity & Accreditation)**:
  - ZPPSU Seal and full institutional title.
  - "Official Records Archiving and Management System of the Guidance and Counseling Services Unit."
  - Accreditation badge: "Republic of the Philippines • CHED & PASUC Accredited State University".
- **Column 2 (System Navigation Endpoints)**:
  - Public Portal (`/`)
  - Document Search Directory (`/login` or `/document-center`)
  - Physical Cabinet Directory (`/inventory`)
  - Accomplishment Generator (`/accomplishment-report`)
  - System Audit Logs (`/logs`)
- **Column 3 (Campus Office Directory)**:
  - Location: `Guidance & Counseling Center, 2nd Floor Administration Building, R.T. Lim Boulevard, Baliwasan, Zamboanga City 7000`
  - Direct Phone: `(062) 991-3815`
  - Email: `guidance@zppsu.edu.ph` / `records@zppsu.edu.ph`
  - Office Hours: `Monday – Friday: 8:00 AM – 5:00 PM PHT`
- **Column 4 (Security & Compliance Links)**:
  - Data Privacy Act of 2012 (RA 10173) Notice
  - University Records Retention Guidelines
  - System Status: `Operational • v1.0.0`
- **Bottom Bar**:
  - Copyright: `© 2026 Zamboanga Peninsula Polytechnic State University. All rights reserved.`
  - System Security Statement: `Unauthorized access is strictly prohibited and subject to university disciplinary policies.`

---

### 4. Behavioral & State Logic Rules

```typescript
// Authentication & Routing State Behavior
interface NavigationState {
  isAuthenticated: boolean;
  userRole: 'ADMIN' | 'USER' | null;
  userName: string | null;
}

// Search Hero Execution
function handleHeroSearch(query: string, category: string, navigate: Function, auth: NavigationState) {
  if (!auth.isAuthenticated) {
    navigate(`/login?redirect=/document-center&q=${encodeURIComponent(query)}&cat=${encodeURIComponent(category)}`);
  } else {
    navigate(`/document-center?search=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`);
  }
}
```

---

## Required Commands
```bash
# Verify frontend dependencies and run linter
cd frontend
npm run lint

# Start the development server for visual confirmation
npm run dev
```

---

## Next Action
1. Review this specification artifact `docs/landing_page_revision.md`.
2. Implement the revised `frontend/src/pages/Home.jsx`, `frontend/src/components/layout/Navbar.jsx`, and `frontend/src/components/layout/Footer.jsx` based directly on these structural blueprints.
