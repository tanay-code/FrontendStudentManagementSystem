import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AppContext from "../../context/AppContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useContext(AppContext);
  console.log("protected route", user);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user !== null) {
      setIsLoading(false);
    }
  }, [user]);

  if (!user) {
    return <div>Loading....</div>;
  }
  // If user is not logged in, redirect to login
  if (!user) {
    console.log("reached here>>>>>>>>>>>>>>>>>>>>>>>>>>>>", user);
    return <Navigate to="/" />;
  }

  // If role is required and user does not have the required role, redirect to unauthorized page
  if (requiredRole && user.roles !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
