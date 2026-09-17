import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router";

const ProtectedRoute = ({ isAuthenticated, redirectPath = "/login" }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  if (!isAuthenticated()) return null;

  return <Outlet />;
};

export default ProtectedRoute;