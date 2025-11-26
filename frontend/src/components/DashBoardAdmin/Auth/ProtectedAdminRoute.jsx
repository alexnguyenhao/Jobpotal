import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/admin/login");
    } else if (user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);
  return <>{children}</>;
};

export default ProtectedAdminRoute;
