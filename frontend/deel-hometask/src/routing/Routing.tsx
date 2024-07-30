import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import ProtectedRoutes from "./ProtectedRoutes";
import LoginPage from "../pages/auth/login";
import Contract from "../pages/Contract";
import ContractsPage from "../pages/ContractsPage";
import JobsPage from "../pages/JobsPage";

const Routing = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Home />} />
        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/contracts/:id" element={<Contract />} />
      </Route>
    </Routes>
  );
};

export default Routing;
