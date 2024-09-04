import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../utils/authContext";

const AdminRoute = ({ component: Component, ...rest }) => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/admin/login/" replace />;
  }

  return <Component {...rest} />;
};

export default AdminRoute;
