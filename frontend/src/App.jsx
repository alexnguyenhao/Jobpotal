import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NavBar from "./components/shared/NavBar";

// Auth
import Login from "@/components/auth/Login.jsx";
import Signup from "@/components/auth/Signup.jsx";

// Public pages
import Home from "@/components/Home.jsx";
import Jobs from "@/components/Jobs.jsx";
import Browse from "@/components/Browse.jsx";
import Profile from "@/components/Profile.jsx";
import JobDescription from "@/components/JobDescription.jsx";

// Admin pages
import Companies from "@/components/admin/Companies.jsx";
import CompanyCreate from "@/components/admin/CompanyCreate.jsx";
import CompanySetup from "@/components/admin/CompanySetup.jsx";
import AdminJobs from "@/components/admin/AdminJobs.jsx";
import PostJob from "@/components/admin/PostJob.jsx";
import Applicants from "@/components/admin/Applicants.jsx";

// ✅ Import component hiển thị hồ sơ công ty
import ProfileCompany from "@/components/admin/ProfileCompany.jsx";

const appRouter = createBrowserRouter([
  // Public routes
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/jobs", element: <Jobs /> },
  { path: "/browse", element: <Browse /> },
  { path: "/description/:id", element: <JobDescription /> },
  { path: "/profile", element: <Profile /> },

  // Admin routes
  { path: "/admin/companies", element: <Companies /> },
  { path: "/admin/companies/create", element: <CompanyCreate /> },
  { path: "/admin/companies/:id", element: <CompanySetup /> },
  { path: "/admin/jobs", element: <AdminJobs /> },
  { path: "/admin/jobs/create", element: <PostJob /> },
  { path: "/admin/jobs/:id/applicants", element: <Applicants /> },

  // ✅ Route mới: trang hồ sơ công ty (dùng trực tiếp ProfileCompany)
  {
    path: "/company/:id",
    element: <ProfileCompany />,
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
