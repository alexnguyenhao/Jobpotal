import NavBar from "./components/shared/NavBar";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Login from "@/components/auth/Login.jsx";
import Signup from "@/components/auth/Signup.jsx";
import Home from "@/components/Home.jsx";
import Jobs from "@/components/Jobs.jsx";
import Browse from "@/components/Browse.jsx";
import Profile from "@/components/Profile.jsx";
import JobDescription from "@/components/JobDescription.jsx";
import Companies from "@/components/admin/Companies.jsx";
import CompanyCreate from "@/components/admin/CompanyCreate.jsx";
import CompanySetup from "@/components/admin/CompanySetup.jsx";
import AdminJobs from "@/components/admin/AdminJobs.jsx"
import PostJob from "@/components/admin/PostJob.jsx";
import Applicants from "@/components/admin/Applicants.jsx";
const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/signup",
        element: <Signup />
    },
    {
        path: "/jobs",
        element:<Jobs/>
    },
    {
        path: "/browse",
        element:<Browse/>
    },
    {
        path: "/description/:id",
        element:<JobDescription/>
    },
    {
        path: "/profile",
        element:<Profile/>
    },
    {
        path:"/admin/companies",
        element:<Companies/>
    },
    {
        path:"/admin/companies/create",
        element:<CompanyCreate/>
    },
    {
        path:"/admin/companies/:id",
        element:<CompanySetup/>
    },{
        path:"/admin/jobs",
        element:<AdminJobs/>
    },{
        path:"/admin/jobs/create",
        element:<PostJob/>
    },
    {
        path:"/admin/jobs/:id/applicants",
        element:<Applicants/>
    }


])
function App() {

  return (
    <>
      <RouterProvider router={appRouter}/>
    </>
  );
}

export default App;
