import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles = ["admin", "student"] }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userRole = localStorage.getItem("userRole");
    
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
    
    if (userRole && !allowedRoles.includes(userRole)) {
      // Redirect based on user role
      if (userRole === "student") {
        navigate("/fee-payment");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate, allowedRoles]);

  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("userRole");
  
  if (!isLoggedIn) {
    return null;
  }
  
  if (userRole && !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
}