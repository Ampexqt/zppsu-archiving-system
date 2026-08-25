# Staff Account Management — System Specification

---

## Findings

The current system has two hardcoded roles (`Admin` / `User`) with the following gaps:

1. **No access boundary enforcement per module**: The `users` table has a flat `role` string but no per-module permission definitions are documented. The frontend currently derives access by checking `role === "Admin"` inline.
2. **Missing profile metadata**: `users` lacks `phone_number`, `is_active`, `last_login`, and `department` fields needed for institutional account management.
3. **No account deactivation pipeline**: There is no `is_active` flag. Deletion is the only account removal mechanism, which is destructive and breaks audit log continuity.
4. **Promote/Demote endpoints must be removed**: `PUT /api/users/promote/:id` and `PUT /api/users/demote/:id` are removed under the new model where role is set only at creation time.
5. **Admin accounts leak into user listings**: No filter prevents Admin accounts from appearing in Staff management views.
6. **Audit log lacks context fields**: The `logs` table is missing `module` and `ip_address` fields, reducing its diagnostic and compliance value.
7. **No forced password-change mechanism**: The system has no `requires_password_change` flag for Admin-initiated temporary password resets.
8. **`AuthContext.jsx` is empty**: The auth context layer has no implementation; authentication state is read directly from `localStorage` across all pages inconsistently.

---

## Implementation

### 1. Authorization & Role Model

#### Approved Role Definitions

| Role    | DB Value  | Created By   | Deletable By                       | Description                                                               |
|---------|-----------|--------------|------------------------------------|---------------------------------------------------------------------------|
| `Admin` | `"Admin"` | Seeded / DB  | No one (protected via API guard)   | Full system access. Cannot be deleted by another Admin via UI.            |
| `User`  | `"User"`  | Admin only   | Admin (`role=User` targets only)   | Staff account. Module access is scoped per the permission matrix below.   |

> **Delete Guard Rule**: `DELETE /api/users/:id` must check `targetUser.role !== "Admin"`. If target is Admin, return `403 Forbidden`. Self-delete remains blocked.

---

#### Module Permission Matrix

| Module                   | Admin Permissions            | Staff (User) Permissions                                                      |
|--------------------------|------------------------------|-------------------------------------------------------------------------------|
| **Dashboard**            | Full stats + all analytics   | Read-only: same stat cards, no user management widgets                        |
| **Document Center**      | Full CRUD on all files       | Upload, view all, search/filter all, download all; edit/archive/delete own files only (`uploaded_by === user.id`) |
| **Files**                | Full CRUD                    | Same boundary as Document Center                                              |
| **Categories**           | Full CRUD                    | Read-only: can view all categories, cannot create/edit/delete                 |
| **Inventory**            | Full CRUD on Cabinets + Boxes | Read-only view of all cabinets and file boxes; **can assign** their own files to a Cabinet and File Box |
| **Accomplishment Reports** | Full access                | **No access** — route renders 403 / redirects to `/dashboard`                |
| **Logs**                 | Full system-wide logs        | **No access** to global Logs page                                             |
| **Users / Staff Mgmt**   | Full CRUD on `role=User`     | **No access**                                                                 |
| **Settings**             | Admin-only                   | **No access**                                                                 |

---

### 2. Database Schema Changes

#### 2.1. `users` Table — Required Column Additions

```sql
ALTER TABLE users
  ADD COLUMN phone_number             VARCHAR(20)   DEFAULT NULL,
  ADD COLUMN is_active                BOOLEAN       NOT NULL DEFAULT TRUE,
  ADD COLUMN last_login               TIMESTAMP     DEFAULT NULL,
  ADD COLUMN department               VARCHAR(100)  DEFAULT NULL,
  ADD COLUMN requires_password_change BOOLEAN       NOT NULL DEFAULT FALSE;
```

**Prisma Schema Additions** (`backend/prisma/schema.prisma`):

```prisma
model users {
  id                       Int       @id @default(autoincrement())
  name                     String
  email                    String    @unique
  password                 String
  role                     String    @default("User")
  phone_number             String?
  department               String?
  is_active                Boolean   @default(true)
  last_login               DateTime?
  requires_password_change Boolean   @default(false)
  created_at               DateTime  @default(now())

  logs  logs[]
  files files[]
}
```

> `department` is stored as a plain `String?`. No separate `departments` table — consistent with existing flat schema pattern.

---

#### 2.2. `logs` Table — Audit Trail Extension

```sql
ALTER TABLE logs
  ADD COLUMN module     VARCHAR(50)  DEFAULT NULL,
  ADD COLUMN ip_address VARCHAR(45)  DEFAULT NULL;
```

**Prisma Schema**:

```prisma
model logs {
  id          Int      @id @default(autoincrement())
  action      String
  description String
  user_id     Int?
  module      String?
  ip_address  String?
  created_at  DateTime @default(now())

  user users? @relation(fields: [user_id], references: [id])
}
```

**Audit Log Action Registry**:

| Action               | Module          | Description Pattern                                              |
|----------------------|-----------------|------------------------------------------------------------------|
| `LOGIN`              | `auth`          | `"{name} logged in"`                                             |
| `LOGOUT`             | `auth`          | `"{name} logged out"`                                            |
| `UPLOAD`             | `files`         | `"Uploaded file: {title} (ARC-{id})"`                           |
| `ARCHIVE`            | `files`         | `"Archived file: {title}"`                                       |
| `RESTORE`            | `files`         | `"Restored file: {title}"`                                       |
| `DELETE`             | `files`         | `"Soft-deleted file: {title}"`                                   |
| `PERMANENT_DELETE`   | `files`         | `"Permanently deleted file: {title}"`                            |
| `GENERATE_REPORT`    | `accomplishment`| `"Generated: {report_name} ({date_range})"`                      |
| `CABINET_ASSIGN`     | `inventory`     | `"Assigned file {title} to Cabinet {name}"`                      |
| `FILEBOX_ASSIGN`     | `inventory`     | `"Assigned file {title} to Box {name}"`                          |
| `CREATE_STAFF`       | `users`         | `"Admin {name} created staff account for {email}"`               |
| `DELETE_STAFF`       | `users`         | `"Admin {name} deleted staff account {email}"`                   |
| `RESET_PASSWORD`     | `users`         | `"Admin {name} reset password for {email}"`                      |
| `DEACTIVATE_ACCOUNT` | `users`         | `"Admin {name} deactivated account {email}"`                     |
| `REACTIVATE_ACCOUNT` | `users`         | `"Admin {name} reactivated account {email}"`                     |
| `UPDATE_STAFF`       | `users`         | `"Admin {name} updated profile for {email}"`                     |

---

### 3. Backend API Endpoints

#### 3.1. Auth Module — Login Flow with `is_active` and `last_login` Enforcement

**File**: `backend/src/modules/auth/auth.service.js`

```js
// LOGIN — extended with is_active check and last_login update
const loginUser = async (data, ip) => {
  const { email, password } = data;

  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) throw new Error("Invalid email or password");

  if (!user.is_active)
    throw new Error("Your account has been deactivated. Contact an administrator.");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid email or password");

  // Update last_login timestamp
  await prisma.users.update({
    where: { id: user.id },
    data: { last_login: new Date() },
  });

  // Log login event
  await prisma.logs.create({
    data: {
      action: "LOGIN",
      description: `${user.name} logged in`,
      user_id: user.id,
      module: "auth",
      ip_address: ip,
    },
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      requires_password_change: user.requires_password_change,
    },
  };
};
```

> **Token response includes** `requires_password_change`. Frontend redirects to `/change-password` if `true`.

---

#### 3.2. Staff Management Endpoints (`/api/users`)

**Remove** from `user.routes.js`:
- `PUT /api/users/promote/:id`
- `PUT /api/users/demote/:id`

---

##### `GET /api/users` — List Staff Accounts (Admin Only)

Filter: returns only `role = "User"`. Admin accounts excluded.

```
GET /api/users
Authorization: Bearer <token>
```

**Response `200`**:
```json
[
  {
    "id": 4,
    "name": "Maria Santos",
    "email": "m.santos@zppsu.edu.ph",
    "role": "User",
    "department": "Guidance & Counseling",
    "phone_number": "09171234567",
    "is_active": true,
    "last_login": "2026-08-25T08:41:00.000Z",
    "created_at": "2026-07-01T00:00:00.000Z"
  }
]
```

**Guard**: `req.user.role !== "Admin"` → `403 Forbidden`

---

##### `POST /api/users` — Create Staff Account (Admin Only)

```
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Maria Santos",
  "email": "m.santos@zppsu.edu.ph",
  "password": "TemporaryPass123!",
  "department": "Guidance & Counseling",
  "phone_number": "09171234567"
}
```

**Validation**:
- `name`: required, string, min 3 chars
- `email`: required, valid email, unique
- `password`: required, min 8 chars
- `department`: optional string
- `phone_number`: optional, max 20 chars

**Role**: hardcoded to `"User"` — not a selectable field.

**Response `201`**:
```json
{
  "message": "Staff account created successfully",
  "user": { "id": 5, "name": "Maria Santos", "email": "m.santos@zppsu.edu.ph", "role": "User" }
}
```

**Errors**: `400` validation or duplicate email; `403` non-Admin requester.

**Audit**: `CREATE_STAFF`, module `users`

---

##### `PUT /api/users/:id` — Update Staff Profile (Admin Only)

```
PUT /api/users/:id
Authorization: Bearer <token>

{
  "name": "Maria C. Santos",
  "email": "m.santos@zppsu.edu.ph",
  "department": "Registrar",
  "phone_number": "09179876543"
}
```

**Guards**: `role !== "Admin"` → `403`; target `role === "Admin"` → `403`

**Response `200`**: `{ "message": "Staff account updated successfully", "user": { ... } }`

**Audit**: `UPDATE_STAFF`, module `users`

---

##### `DELETE /api/users/:id` — Delete Staff Account (Admin Only)

**Guards**:
- Requester not Admin → `403`
- Target is self → `400 "You cannot delete yourself"`
- Target `role === "Admin"` → `403 "Admin accounts cannot be deleted through Staff Management"`

**Response `200`**: `{ "message": "Staff account deleted successfully" }`

**Audit**: `DELETE_STAFF`, module `users`

---

##### `PATCH /api/users/:id/deactivate` — Deactivate Staff Account (Admin Only)

Sets `is_active = false`. Account is preserved; all associated logs and files remain intact.

Active sessions invalidated: `auth.middleware.js` must re-check `is_active` on every protected request.

**Response `200`**: `{ "message": "Account deactivated successfully" }`

**Audit**: `DEACTIVATE_ACCOUNT`, module `users`

---

##### `PATCH /api/users/:id/reactivate` — Reactivate Staff Account (Admin Only)

Sets `is_active = true`.

**Response `200`**: `{ "message": "Account reactivated successfully" }`

**Audit**: `REACTIVATE_ACCOUNT`, module `users`

---

##### `POST /api/users/:id/reset-password` — Admin Force Password Reset

**Action**:
1. Generate a random 10-character alphanumeric temporary password.
2. Hash with `bcrypt`.
3. Update `users.password`.
4. Set `users.requires_password_change = true`.
5. Return **plaintext** temporary password once (never stored).

**Guards**: `role !== "Admin"` → `403`; target `role === "Admin"` → `403`

**Response `200`**:
```json
{
  "message": "Password reset successfully. Share this temporary password with the staff member.",
  "temporary_password": "Xq7mP2zL9w"
}
```

> Frontend: display `temporary_password` in a one-time modal with Copy button. Do not display again after modal closes.

**Audit**: `RESET_PASSWORD`, module `users`

---

##### `GET /api/users/:id/activity` — Staff Activity Stream (Admin Only)

```
GET /api/users/:id/activity?page=1&limit=10
Authorization: Bearer <token>
```

Filter: `WHERE user_id = :id ORDER BY created_at DESC`

**Response `200`**:
```json
{
  "data": [
    {
      "id": 201,
      "action": "UPLOAD",
      "description": "Uploaded file: Counseling Summary AY 2024-2025",
      "module": "files",
      "ip_address": "192.168.1.12",
      "created_at": "2026-08-25T09:12:00.000Z"
    }
  ],
  "total": 84,
  "page": 1,
  "limit": 10
}
```

---

##### `POST /api/users/change-password` — Staff Self-Service Password Change

Used only by staff after login when `requires_password_change === true`.

```
POST /api/users/change-password
Authorization: Bearer <token>

{
  "current_password": "Xq7mP2zL9w",
  "new_password": "MyNewPass@123",
  "confirm_password": "MyNewPass@123"
}
```

**Validation**:
- `current_password` must match existing hash
- `new_password` ≥ 8 chars
- `new_password !== current_password`
- `new_password === confirm_password`

**On success**: set `requires_password_change = false`, return `200`.

---

#### 3.3. Auth Middleware — `is_active` Enforcement

**File**: `backend/src/middleware/auth.middleware.js`

```js
// After decoding JWT token, re-check is_active on every request
const user = await prisma.users.findUnique({ where: { id: decoded.id } });

if (!user || !user.is_active) {
  return res.status(401).json({ message: "Account is inactive or not found." });
}

req.user = user;
next();
```

---

### 4. Frontend — Staff Management Page (Admin View)

**File**: `frontend/src/pages/Users.jsx`

#### 4.1. Page Layout

```
+-------------------------------------------------------+
|  DashboardLayout (Sidebar + TopNav — identical across) |
|  +-----------------------------------------------------+
|  |  [PageHeader]                                       |
|  |  Staff Account Management          [+ Add Staff]    |
|  +-----------------------------------------------------+
|  |  [Search Input]    [Status Filter: All/Active/Inactive] |
|  +-----------------------------------------------------+
|  |  [StaffTable]                                       |
|  |  #  Avatar  Name/Email  Dept  Status  Last Login  Actions |
|  +-----------------------------------------------------+
|  |  [Pagination — 10 rows/page]                        |
|  +-----------------------------------------------------+
```

#### 4.2. Staff Table Columns

| Column     | Content                                                        |
|------------|----------------------------------------------------------------|
| Avatar     | Colored circle with initials (same as existing Users page)     |
| Name       | Full name, email as `text-[#6B7280]` subtext                   |
| Department | Plain string or `—` if null                                    |
| Status     | Badge: `Active` (`bg-[#16A34A]/10 text-[#16A34A]`) / `Inactive` (`bg-gray-100 text-gray-500`) |
| Last Login | Relative timestamp or `Never`                                   |
| Actions    | View Activity, Edit, Reset Password, Deactivate/Reactivate, Delete |

#### 4.3. Modal & Sheet Inventory

**Create Staff** (`Dialog`):
- Fields: `Name*`, `Email*`, `Password*`, `Department`, `Phone Number`
- Role locked to `"User"` — not shown as selectable
- POST `→ /api/users`

**Edit Staff** (`Dialog`):
- Fields: `Name`, `Email`, `Department`, `Phone Number`
- Role shown as read-only badge
- PUT `→ /api/users/:id`

**Reset Password** (`Dialog`):
- Step 1: Confirmation prompt
- Step 2: On confirm, call `POST /api/users/:id/reset-password`
- Step 3: Display `temporary_password` in monospace block with `Copy` button + warning banner: `"This password will not be shown again."`

**Activity Stream** (`Sheet` — slides from right):
- Triggered by "View Activity" button
- Calls `GET /api/users/:id/activity`
- Paginated log table: Action | Description | Module | IP Address | Timestamp
- Matches column layout of `frontend/src/pages/Logs.jsx`

**Deactivate / Reactivate** (`AlertDialog`):
- Confirmation step before executing
- Button label toggles based on `is_active`: "Deactivate Account" / "Reactivate Account"

**Delete** (`AlertDialog` via `useModal`):
- Only visible for `role=User` accounts
- Hidden entirely for Admin accounts (which never appear in the filtered list)

#### 4.4. Color & Token Enforcement

```
Primary buttons       → bg-[#800000] text-white hover:bg-[#660000]
Danger buttons        → variant="destructive" (red)
Active status badge   → bg-[#16A34A]/10 text-[#16A34A]
Inactive badge        → bg-gray-100 text-gray-500
Card container        → bg-white border border-[#E5E7EB] rounded-xl shadow-sm
Table row hover       → hover:bg-[#FDFBF7] transition
Pagination            → 10 rows/page (matches all other data tables)
Icons (Lucide)        → outline only, stroke-width 2
```

---

### 5. Frontend — Staff User Sidebar (role=User)

Sidebar renders only permitted modules. Admin-only items must not render at all.

```jsx
// Only render these items when role === "User"
const staffNavItems = [
  { label: "Dashboard",        icon: LayoutDashboard, path: "/dashboard"       },
  { label: "Document Center",  icon: Files,           path: "/document-center" },
  { label: "Files",            icon: FileText,        path: "/files"           },
  { label: "Categories",       icon: FolderArchive,   path: "/categories"      },
  { label: "Inventory",        icon: Database,        path: "/inventory"       },
];
// Excluded: Users, Logs, Reports/Accomplishment, Settings
```

#### Staff Dashboard Widget Restrictions

When `role === "User"`, Dashboard page renders only:
- Total Files stat card
- Total Categories stat card
- My Uploads stat card
- Pie Chart (File Categories — read-only)
- Bar Chart (File Status — read-only)

Admin-only widgets excluded: User Count, Storage Full Details, Cabinet Management summary.

---

### 6. Forced Password Change Page

**Route**: `/change-password`
**File**: `frontend/src/pages/ChangePassword.jsx` *(new)*

**Route Guard** (`App.jsx` / protected route wrapper):
```jsx
if (user?.requires_password_change && location.pathname !== "/change-password") {
  return <Navigate to="/change-password" replace />;
}
```

**Page Layout**:
```
+------------------------------------------+
|  [ShieldCheck icon — #800000]             |
|  Password Change Required                 |
|  You must set a new password to continue. |
|                                           |
|  Current Password: [______________]       |
|  New Password:     [______________]       |
|  Confirm Password: [______________]       |
|                                           |
|        [Change Password →]                |
+------------------------------------------+
```

- Calls `POST /api/users/change-password`
- On success: clears `requires_password_change` in stored user object, redirects to `/dashboard`
- Page is locked — user cannot navigate away until password is changed

---

## Required Commands

```bash
# 1. Apply Prisma schema changes (run from /backend)
npx prisma migrate dev --name add_staff_profile_and_log_fields

# 2. Verify columns in Prisma Studio
npx prisma studio

# 3. Re-seed to ensure all existing users have is_active = true (default)
node prisma/seed.js

# 4. Restart dev server from workspace root
npm run dev
```

---

## Next Action

1. **Review and approve** all permission boundaries in Sections 1 and 3 before implementation.
2. Run Prisma migration to add new `users` and `logs` columns.
3. Remove `PUT /promote/:id` and `PUT /demote/:id` from `user.routes.js`.
4. Update `GET /api/users` filter to `role = "User"` only.
5. Implement new endpoints: `PATCH /deactivate`, `PATCH /reactivate`, `POST /reset-password`, `GET /:id/activity`, `POST /change-password`.
6. Update `auth.middleware.js` to validate `is_active` on every protected request.
7. Create `frontend/src/pages/ChangePassword.jsx` and add route guard in `App.jsx`.
8. Revise `frontend/src/pages/Users.jsx` to match Section 4 layout specifications.
9. Update sidebar component to conditionally render nav items based on `role`.
