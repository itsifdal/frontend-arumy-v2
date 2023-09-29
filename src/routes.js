import { Navigate, useRoutes } from "react-router-dom";

// layouts
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
//
import Room from "./pages/Room";
import Post from "./pages/Post";
import PostDetail from "./pages/PostDetail";
import AddPost from "./pages/AddPost";
import AddBooking from "./pages/AddBooking";
import UpdateBooking from "./pages/UpdateBooking";
import UpdatePost from "./pages/UpdatePost";
import Booking from "./pages/Booking";
import BookingDetail from "./pages/BookingDetail";
import UpdateBookingPage from "./pages/UpdateBookingPage";
import Students from "./pages/Students";

import Rooms from "./pages/Rooms";
import User from "./pages/User";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/Page404";
import Dashboard from "./pages/Dashboard";
import DashboardTimeline from "./pages/DashboardTimeline";
import DashboardTeachers from "./pages/DashboardTeachers";
import Teachers from "./pages/Teachers";
import Branches from "./pages/Branches";
import Instruments from "./pages/Instruments";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/app",
      element: <DashboardLayout />,
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "dashboard/timeline", element: <DashboardTimeline /> },
        { path: "dashboard/teachers", element: <DashboardTeachers /> },
        { path: "user", element: <User /> },
        { path: "room", element: <Room /> },
        { path: "booking", element: <Booking /> },
        { path: "booking/:id", element: <BookingDetail /> },
        { path: "updateBookingPage/:id", element: <UpdateBookingPage /> },
        { path: "post", element: <Post /> },
        { path: "rooms", element: <Rooms /> },
        { path: "students", element: <Students /> },
        { path: "teachers", element: <Teachers /> },
        { path: "addpost", element: <AddPost /> },
        { path: "updatepost/:slug", element: <UpdatePost /> },
        { path: "postdetail/:slug", element: <PostDetail /> },
        { path: "addbooking", element: <AddBooking /> },
        { path: "updatebooking/:id", element: <UpdateBooking /> },
        { path: "branches", element: <Branches /> },
        { path: "instruments", element: <Instruments /> },
      ],
    },
    {
      path: "/forgotpassword",
      element: <ForgotPassword />,
    },
    {
      path: "/resetpassword/:token",
      element: <ResetPassword />,
    },
    {
      path: "/postdetail/:slug",
      element: <PostDetail />,
    },
    {
      path: "/",
      element: <LogoOnlyLayout />,
      children: [
        { path: "/", element: <Navigate to="/app/dashboard" /> },
        { path: "404", element: <NotFound /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);
}
