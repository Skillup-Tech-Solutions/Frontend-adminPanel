import { createHashRouter } from "react-router-dom";
import Login from "../Auth/Login";
import SignUp from "../Auth/SignUp";
import ForgetPassword from "../Auth/ForgetPassword";
import Layout from "../Components/Layout";
import Users from "../Custom/Users";
import Courses from "../Pages/Courses";
import Offers from "../Pages/Offers";
import Category from "../Pages/Category";
import Carrers from "../Pages/Carrers";
import Syllabus from "../Pages/Syllabus";
import WebsiteLayout from "../Components/WebsiteLayout";
import WebHome from "../Components/WebHome";
import WebAbout from "../Components/WebAbout";
import WebContactUs from "../Pages/WebContactUs";
import WebCarrers from "../Components/WebCarrers";
import WebCoursesPage from "../Pages/WebCoursesPage";
import WebItServices from "../Components/WebItServices";
import WebServicesPage from "../Pages/WebServicesPage";
import WebServiceDetail from "../Pages/WebServiceDetail";
import WebCategory from "../Pages/WebCategory";
import AdminDashboard from "../Pages/AdminDashboard";
import WebSyllabusView from "../Pages/WebSyllabusView";
import Certificate from "../Pages/Certificate";
import ResetPassword from "../Auth/ResetPassword";
import Review from "../Auth/Review";
import ProtectedRoute from "./ProtectedRoute";

// const routes = createHashRouter([
//   {
//     path: "/signup",
//     element: <SignUp />,
//   },
//   {
//     path: "/forgotpassword",
//     element: <ForgetPassword />,
//   },
//   {
//     path: "/",
//     // element: <ProtectedRoute element={<Layout />} />,
//     element: <Layout />,
//     children: [
//       {
//         path: "users",
//         element: <Users />,
//         // element: <ProtectedRoute element={<AdminDashboard />} />,
//       },
//       {
//         path: "courses",
//         element: <Courses />
//         // element: <ProtectedRoute element={<AdminDashboard />} />,
//       },
//       {
//         path: "offers",
//         element: <Offers />
//         // element: <ProtectedRoute element={<AdminDashboard />} />,
//       },
//       {
//         path: "category",
//         element: <Category />
//         // element: <ProtectedRoute element={<AdminDashboard />} />,
//       },
//       {
//         path: "careers",
//         element: <Carrers />
//         // element: <ProtectedRoute element={<AdminDashboard />} />,
//       },
//       {
//         path: "syllabus",
//         element: <Syllabus />
//         // element: <ProtectedRoute element={<AdminDashboard />} />,
//       },

//     ],
//   },
// ]);
const routes = createHashRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/forgotpassword",
    element: <ForgetPassword />,
  },
  {
    path: "/reviews",
    element: <Review />,
  },
  {
    path: "/",
    element: <WebsiteLayout />,
    children: [
      {
        path: "/",
        element: <WebHome />,
      },
      {
        path: "/about",
        element: <WebAbout />,
      },
      {
        path: "/contact",
        element: <WebContactUs />,
      },
      {
        path: "/careers",
        element: <WebCarrers />,
      },
      {
        path: "/services/courses",
        element: <WebCoursesPage />,
      },
      {
        path: "/itservices",
        element: <WebItServices />,
      },
      {
        path: "/services",
        element: <WebServicesPage />,
      },
      {
        path: "/services/details",
        element: <WebServiceDetail />,
      },
      {
        path: "/services/category",
        element: <WebCategory />,
      },
      {
        path: "/services/courses/syllabus",
        element: <WebSyllabusView />,
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute element={<Layout />} />,
    // element: <Layout />,
    children: [
      {
        path: "dashboard",
        // element: <AdminDashboard />,
        element: <ProtectedRoute element={<AdminDashboard />} />,
      },
      {
        path: "users",
        // element: <Users />,
        element: <ProtectedRoute element={<Users />} />,
      },
      {
        path: "courses",
        // element: <Courses />
        element: <ProtectedRoute element={<Courses />} />,
      },
      {
        path: "offers",
        // element: <Offers />
        element: <ProtectedRoute element={<Offers />} />,
      },
      {
        path: "category",
        // element: <Category />
        element: <ProtectedRoute element={<Category />} />,
      },
      {
        path: "admincareers",
        // element: <Carrers />
        element: <ProtectedRoute element={<Carrers />} />,
      },
      {
        path: "syllabus",
        // element: <Syllabus />
        element: <ProtectedRoute element={<Syllabus />} />,
      },
      {
        path: "certificate",
        // element: <Certificate />
        element: <ProtectedRoute element={<Certificate />} />,
      },

    ],
  },
]);

export default routes;
