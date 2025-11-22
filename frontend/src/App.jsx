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
import Companies from "@/components/admin/company/Companies.jsx";
import CompanyCreate from "@/components/admin/company/CompanyCreate.jsx";
import CompanySetup from "@/components/admin/company/CompanySetup.jsx";
import AdminJobs from "@/components/admin/job/AdminJobs.jsx";
import PostJob from "@/components/admin/job/PostJob.jsx";
import Applicants from "@/components/admin/applicant/Applicants.jsx";
import ProfileCompany from "@/components/admin/company/ProfileCompany.jsx";
import Resume from "@/components/profile/Resume.jsx";
import RecruiterResume from "./components/admin/applicant/RecruiterResume.jsx";
import CVHome from "@/components/cv/CVHome.jsx";
import CVBuilder from "@/components/cv/CVBuilder.jsx";
import CVList from "@/components/cv/CVList.jsx";
import CVView from "@/components/cv/CVView.jsx";
import ApplicantCVView from "@/components/admin/applicant/ApplicantCVView.jsx";
import CareerGuideHome from "@/components/admin/careerGuides/CareerGuideHome.jsx";
import CareerGuide from "@/components/careerguide/CareerGuide.jsx";
import CareerGuideCreate from "@/components/admin/careerGuides/CareerGuideCreate.jsx";
import CareerGuideEdit from "@/components/admin/careerGuides/CareerGuideEdit.jsx";
import CareerGuideDetail from "@/components/admin/careerGuides/CareerGuideDetail.jsx";
import GuideDetail from "./components/careerguide/GuideDetail";
import JobDescriptionRecruiter from "@/components/admin/job/JobDescriptionRecruiter.jsx";
import UpdateJob from "@/components/admin/job/UpdateJob.jsx";
import Notifications from "@/components/Notifications.jsx";
import AppliedJobTable from "@/components/AppliedJobTable.jsx";
import SavedJobTable from "@/components/SavedJobTable.jsx";
import SettingAccount from "@/components/SettingAccount.jsx";

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
      {path: "/saved-jobs", element: <SavedJobTable />},
      {path: "/applied-jobs", element: <AppliedJobTable />},
      {path: "/setting-account", element: <SettingAccount />},
      { path: "/admin/companies", element: <Companies /> },
      { path: "/admin/companies/create", element: <CompanyCreate /> },
      { path: "/admin/companies/:id", element: <CompanySetup /> },
      { path: "/admin/jobs", element: <AdminJobs /> },
      { path: "/admin/jobs/create", element: <PostJob /> },
      { path: "/admin/jobs/:id/applicants", element: <Applicants /> },
      { path: "/admin/jobs/edit/:id", element: <UpdateJob /> },
      {
        path: "/admin/jobs/descriptions/:id",
        element: <JobDescriptionRecruiter />,
      },
      { path: "/company/:id", element: <ProfileCompany /> },
      { path: "/company/update/:id", element: <CompanySetup /> },
      { path: "/resume", element: <Resume /> },
      {
        path: "/admin/applicants/resume/:userId",
        element: <RecruiterResume />,
      },
      { path: "/cv/home", element: <CVHome /> },
      { path: "/cv/builder", element: <CVBuilder /> },
      { path: "/cv/list", element: <CVList /> },
      { path: "/cv/:id", element: <CVView /> },
      { path: "/cv/view/:id", element: <ApplicantCVView /> },
      { path: "/admin/career-guides", element: <CareerGuideHome /> },
      { path: "/admin/career-guides/create", element: <CareerGuideCreate /> },
      { path: "/admin/career-guides/edit/:id", element: <CareerGuideEdit /> },
      {
        path: "/admin/career-guides/detail/:id",
        element: <CareerGuideDetail />,
      },
      { path: "/career-guides", element: <CareerGuide /> },
      //<Link to={`/career-guide/detail/${guide.slug || guide._id}`}>
      { path: "/career-guide/detail/:id", element: <GuideDetail /> }, //slug
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
