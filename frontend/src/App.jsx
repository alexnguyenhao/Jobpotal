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

// Recruiter pages
import Companies from "@/components/admin/company/Companies.jsx";
import CompanyCreate from "@/components/admin/company/CompanyCreate.jsx";
import CompanySetup from "@/components/admin/company/CompanySetup.jsx";
import AdminJobs from "@/components/admin/job/AdminJobs.jsx";
import PostJob from "@/components/admin/job/PostJob.jsx";
import Applicants from "@/components/admin/applicant/Applicants.jsx";
import ProfileCompany from "@/components/admin/company/ProfileCompany.jsx";
import Resume from "@/components/profile/Resume.jsx";
import RecruiterResume from "./components/admin/applicant/RecruiterResume.jsx";
import JobDescriptionRecruiter from "@/components/admin/job/JobDescriptionRecruiter.jsx";
import UpdateJob from "@/components/admin/job/UpdateJob.jsx";

// CV Pages
import CVHome from "@/components/cv/CVHome.jsx";
import CVBuilder from "@/components/cv/CVBuilder.jsx";
import CVList from "@/components/cv/CVList.jsx";
import CVView from "@/components/cv/CVView.jsx";
import ApplicantCVView from "@/components/admin/applicant/ApplicantCVView.jsx";

// Public Career Guide
import CareerGuide from "@/components/careerguide/CareerGuide.jsx";
import GuideDetail from "./components/careerguide/GuideDetail";

// User Settings
import Notifications from "@/components/Notifications.jsx";
import AppliedJobTable from "@/components/AppliedJobTable.jsx";
import SavedJobTable from "@/components/SavedJobTable.jsx";
import SettingAccount from "@/components/SettingAccount.jsx";

// --- ADMIN IMPORT ---
import AdminLogin from "@/components/DashBoardAdmin/Auth/AdminLogin.jsx";
import ProtectedAdminRoute from "@/components/DashBoardAdmin/Auth/ProtectedAdminRoute.jsx";
import AdminLayout from "./components/DashBoardAdmin/Dashboard/Layout/AdminLayout.jsx";
import AdminDashboard from "@/components/DashBoardAdmin/Dashboard/AdminDashboard.jsx";

// Admin Tables
import AdminUsersTable from "./components/DashBoardAdmin/AdminUsersTable.jsx";
import AdminJobsTable from "./components/DashBoardAdmin/AdminJobsTable.jsx";
import AdminCompaniesTable from "./components/DashBoardAdmin/AdminCompaniesTable.jsx";
import AdminApplicationsTable from "./components/DashBoardAdmin/AdminApplicationsTable.jsx";
import CategoryTable from "./components/DashBoardAdmin/CategoryTable.jsx";

// Admin Details
import UserDetail from "./components/DashBoardAdmin/UserDetail.jsx";
import CompanyDetail from "./components/DashBoardAdmin/CompanyDetail.jsx";
import JobDetail from "./components/DashBoardAdmin/JobDetail.jsx";

// ✅ ADMIN CAREER GUIDE IMPORTS (ĐÃ SỬA)
import CareerGuideHome from "@/components/DashBoardAdmin/careerGuides/CareerGuideHome.jsx";
import CareerGuideCreate from "@/components/DashBoardAdmin/careerGuides/CareerGuideCreate.jsx";
import CareerGuideEdit from "@/components/DashBoardAdmin/careerGuides/CareerGuideEdit.jsx";
import CareerGuideDetail from "@/components/DashBoardAdmin/careerGuides/CareerGuideDetail.jsx";

const appRouter = createBrowserRouter([
  // ✅ Routes có layout chung (NavBar + Footer)
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/jobs", element: <Jobs /> },
      { path: "/browse", element: <Browse /> },
      { path: "/notifications", element: <Notifications /> },
      { path: "/description/:id", element: <JobDescription /> },
      { path: "/profile", element: <Profile /> },
      { path: "/saved-jobs", element: <SavedJobTable /> },
      { path: "/applied-jobs", element: <AppliedJobTable /> },
      { path: "/setting-account", element: <SettingAccount /> },
      { path: "/recruiter/companies", element: <Companies /> },
      { path: "/recruiter/companies/create", element: <CompanyCreate /> },
      { path: "/recruiter/companies/:id", element: <CompanySetup /> },
      { path: "/recruiter/jobs", element: <AdminJobs /> },
      { path: "/recruiter/jobs/create", element: <PostJob /> },
      { path: "/recruiter/jobs/:id/applicants", element: <Applicants /> },
      { path: "/recruiter/jobs/edit/:id", element: <UpdateJob /> },
      {
        path: "/recruiter/jobs/descriptions/:id",
        element: <JobDescriptionRecruiter />,
      },
      { path: "/company/:id", element: <ProfileCompany /> },
      { path: "/company/update/:id", element: <CompanySetup /> },
      { path: "/resume", element: <Resume /> },
      {
        path: "/recruiter/applicants/resume/:userId",
        element: <RecruiterResume />,
      },
      { path: "/cv/home", element: <CVHome /> },
      { path: "/cv/builder", element: <CVBuilder /> },
      { path: "/cv/list", element: <CVList /> },
      { path: "/cv/:id", element: <CVView /> },
      { path: "/cv/view/:id", element: <ApplicantCVView /> },
      { path: "/career-guides", element: <CareerGuide /> },
      { path: "/career-guide/detail/:id", element: <GuideDetail /> },
    ],
  },

  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/verify-email", element: <Verification /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/forgot-password", element: <ForgotPassword /> },

  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedAdminRoute>
        <AdminLayout />
      </ProtectedAdminRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      // --- Tables ---
      {
        path: "users",
        element: <AdminUsersTable />,
      },
      {
        path: "jobs",
        element: <AdminJobsTable />,
      },
      {
        path: "companies",
        element: <AdminCompaniesTable />,
      },
      {
        path: "applications",
        element: <AdminApplicationsTable />,
      },
      { path: "category", element: <CategoryTable /> },

      {
        path: "users/:id",
        element: <UserDetail />,
      },
      {
        path: "companies/:id",
        element: <CompanyDetail />,
      },
      {
        path: "jobs/:id",
        element: <JobDetail />,
      },
      {
        path: "career-guides",
        element: <CareerGuideHome />,
      },
      {
        path: "career-guides/create",
        element: <CareerGuideCreate />,
      },
      {
        path: "career-guides/edit/:id",
        element: <CareerGuideEdit />,
      },
      {
        path: "career-guides/detail/:id",
        element: <CareerGuideDetail />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
