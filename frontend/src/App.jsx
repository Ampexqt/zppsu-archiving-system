import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Files from "./pages/Files";
import ForgotPassword from "./pages/ForgotPassword";
import Users from "./pages/Users";
import Logs from "./pages/Logs";
import Categories from "./pages/Categories";
import Inventory from "./pages/Inventory";
import DocumentCenter from"./pages/DocumentCenter";
import DashboardLayout from "./components/layout/DashboardLayout";
import AccomplishmentReport from "./pages/AccomplishmentReport";

// PROTECTED ROUTE
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* FORGOT PASSWORD */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* PROTECTED DASHBOARD */}
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
  path="/inventory"
  element={<Inventory />}
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;