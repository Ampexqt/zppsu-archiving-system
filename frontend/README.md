# ZPPSU Archiving System - Frontend

The frontend for the **ZPPSU Archiving System**, an enterprise-grade, secure, and modern web application designed for document-intensive workflows within the university. It provides a reliable, fast, and accessible platform to manage, retrieve, and track both digital and physical academic and administrative documents.

## 🎨 Design Philosophy

The interface is built to communicate **trust, professionalism, security, and institutional credibility** while remaining extremely easy to use for daily administrative work. 

Our design emphasizes:
- **Simplicity First:** Clean layouts with heavy utilization of whitespace to structure information logically.
- **Document-Centric UI:** Documents receive the highest visual priority, with everything else supporting document discovery and management.
- **High Readability:** Focus on minimal visual noise and accessible typography.
- **Accessibility:** AA compliant contrast, keyboard navigation, and visible focus states.

## 🛠️ Technology Stack

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Component Library:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/) (Outline style for minimal visual noise)
- **Typography:** Geist (Primary) / Inter (Fallback)
- **Routing:** React Router DOM

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root of the `frontend` directory and add the necessary variables (e.g., your backend API URL).
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/       # Static assets like images and fonts
│   ├── components/   # Reusable UI components (shadcn/ui, layout, common)
│   ├── contexts/     # React contexts for global state (e.g., Auth)
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Main route components/views
│   ├── services/     # API integration and external service calls
│   ├── utils/        # Helper functions and utilities
│   ├── App.jsx       # Root component and router configuration
│   └── main.jsx      # Entry point
├── public/           # Public static files
├── index.html        # Main HTML template
├── tailwind.config.js # Tailwind CSS configuration
└── vite.config.js    # Vite bundler configuration
```

## ✨ Key Features

- **Document Management:** Upload, search, and manage digital and scanned physical archives.
- **Role-Based Dashboards:** Distinct views and controls for Administrators and Standard Users.
- **Advanced Search:** Instant retrieval using metadata indexing (subject, type, OCR text).
- **Physical Inventory Mapping:** Bridge the gap between physical cabinets and digital records.
- **Analytics & Reporting:** Real-time metrics, audit logs, and accomplishment tracking.

## 🎨 Theme & Branding

The application uses a custom theme tailored to the university's identity:
- **Primary Color:** Deep Maroon (`#800000`)
- **Accent Color:** Golden Yellow (`#FFD700`)
- **Backgrounds:** Cream (`#FDFBF7`) for reduced eye strain, Beige (`#F5F5DC`) for secondary panels, and White (`#FFFFFF`) for surfaces.
