import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
}) {

  const token =
    localStorage.getItem("token");

  // NO TOKEN
  if (!token) {
    return <Navigate to="/login" />;
  }

  // HAS TOKEN
  return children;
}

export default ProtectedRoute;