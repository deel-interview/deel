import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const loggedUser = localStorage.getItem("deel-user");
  const isUser = loggedUser && JSON.parse(loggedUser);
  const location = useLocation();

  if (isUser?.id) {
    return <Outlet />;
  }

  return <Navigate to={"/login"} state={{ from: location }} replace />;
};

export default ProtectedRoutes;
