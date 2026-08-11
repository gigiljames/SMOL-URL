import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router";
import { useDispatch } from "react-redux";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Layout from "./components/Layout.tsx";
import ProtectedRoute from "./utils/ProtectedRoute.tsx";
import { refreshUserToken } from "./api/userService.ts";
import { setCredentials, setInitializing, logout } from "./store/authSlice.ts";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Attempt silent token refresh on application startup
    refreshUserToken()
      .then((res) => {
        if (res.success && res.data) {
          dispatch(
            setCredentials({
              user: res.data.user,
              accessToken: res.data.accessToken,
            })
          );
        } else {
          dispatch(setInitializing(false));
        }
      })
      .catch(() => {
        // If refresh fails or cookie missing, fallback to existing state / logout
        const token = localStorage.getItem("smol_access_token");
        if (!token) {
          dispatch(logout());
        } else {
          dispatch(setInitializing(false));
        }
      });
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
