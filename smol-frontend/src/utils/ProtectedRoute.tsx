import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import type { RootState } from "../store/store";

function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useSelector(
    (state: RootState) => state.auth
  );

  if (isInitializing) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
