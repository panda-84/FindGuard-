import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const parseToken = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload?.id || !payload?.role) return null;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
};

export const PrivateRoute = ({ allowedRole }) => {
  const token = localStorage.getItem("access_token");
  const role  = localStorage.getItem("role");
  const navigate   = useNavigate();
  const intervalRef = useRef(null);

  const kick = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    if (intervalRef.current) clearInterval(intervalRef.current);
    navigate("/login", { replace: true });
  };

  const runCheck = async () => {
    const t = localStorage.getItem("access_token");
    const r = localStorage.getItem("role");

    // No token → kick immediately, no server call needed
    if (!t || !r) return kick();

    // Malformed token → kick
    const payload = parseToken(t);
    if (!payload) return kick();

    // Role mismatch → kick
    if (payload.role !== r) return kick();

    // Verify signature with server
    try {
      await axios.get(`${BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${t}` },
      });
    } catch {
      return kick();
    }
  };

  useEffect(() => {
    // Only start polling if a token actually exists
    const t = localStorage.getItem("access_token");
    if (!t) return;

    runCheck();
    intervalRef.current = setInterval(runCheck, 3000);
    window.addEventListener("storage", runCheck);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("storage", runCheck);
    };
  }, []);

  // No token on initial render → go to login immediately
  if (!token) return <Navigate to="/login" replace />;

  // Role mismatch
  if (allowedRole && role !== allowedRole) {
    if (role === "admin")    return <Navigate to="/superadmin" replace />;
    if (role === "company")  return <Navigate to="/admin"      replace />;
    if (role === "customer") return <Navigate to="/dashboard"  replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;