import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Files from "./pages/Files";
import DocumentCenter from "./pages/DocumentCenter";
import Inventory from "./pages/Inventory";
import AccomplishmentReport from "./pages/AccomplishmentReport";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import Logs from "./pages/Logs";

import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ToastProvider } from "./context/ToastContext";
import { ModalProvider } from "./context/ModalContext";

function App() {
  return (
    <ToastProvider>
      <ModalProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* PROTECTED ROUTES */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/files"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Files />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/document-center"
              element={
                <ProtectedRoute>
                  <DocumentCenter />
                </ProtectedRoute>
              }
            />

            <Route
              path="/inventory"
              element={
                <ProtectedRoute adminOnly>
                  <Inventory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/accomplishment-report"
              element={
                <ProtectedRoute adminOnly>
                  <AccomplishmentReport />
                </ProtectedRoute>
              }
            />

            <Route
              path="/categories"
              element={
                <ProtectedRoute adminOnly>
                  <Categories />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute adminOnly>
                  <Users />
                </ProtectedRoute>
              }
            />

            <Route
              path="/logs"
              element={
                <ProtectedRoute adminOnly>
                  <Logs />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ModalProvider>
    </ToastProvider>
  );
}

export default App;