import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/Layout.jsx";

// Auth pages
import Login from "@/components/auth/Login.jsx";
import Signup from "@/components/auth/Signup.jsx";
import Verification from "@/components/auth/verification.jsx";
import ResetPassword from "@/components/auth/resetPassword.jsx";
import ForgotPassword from "@/components/auth/ForgotPassword.jsx";

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
import ProfileCompany from "@/components/admin/ProfileCompany.jsx";
import Resume from "@/components/profile/Resume.jsx";

const appRouter = createBrowserRouter([
  // ✅ Routes có layout chung (NavBar + Footer)
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/jobs", element: <Jobs /> },
      { path: "/browse", element: <Browse /> },
      { path: "/description/:id", element: <JobDescription /> },
      { path: "/profile", element: <Profile /> },
      { path: "/admin/companies", element: <Companies /> },
      { path: "/admin/companies/create", element: <CompanyCreate /> },
      { path: "/admin/companies/:id", element: <CompanySetup /> },
      { path: "/admin/jobs", element: <AdminJobs /> },
      { path: "/admin/jobs/create", element: <PostJob /> },
      { path: "/admin/jobs/:id/applicants", element: <Applicants /> },
      { path: "/company/:id", element: <ProfileCompany /> },
      { path: "/company/update/:id", element: <CompanySetup /> },
      { path: "/resume/:userId", element: <Resume /> },
    ],
  },

  // ✅ Routes KHÔNG dùng layout (Auth pages)
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/verify-email", element: <Verification /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
