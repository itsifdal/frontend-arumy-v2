import { Navigate, useRoutes } from "react-router-dom";

// layouts
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
//
import Room from "./pages/rooms/page";
import Post from "./pages/Post";
import PostDetail from "./pages/PostDetail";
import AddPost from "./pages/AddPost";
import AddBooking from "./pages/AddBooking";
import UpdateBooking from "./pages/UpdateBooking";
import UpdatePost from "./pages/UpdatePost";
import Bookings from "./pages/bookings/page";
import BookingDetail from "./pages/BookingDetail";
import UpdateBookingPage from "./pages/UpdateBookingPage";
import Students from "./pages/students/page";

import Rooms from "./pages/Rooms";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/Page404";
import Dashboard from "./pages/Dashboard";
import DashboardTimeline from "./pages/dashboard/timeline/page";
import DashboardTeachers from "./pages/dashboard/teachers/page";
import Teachers from "./pages/teachers/page";
import Instruments from "./pages/instruments/page";
import BookingUpcoming from "./pages/BookingUpcoming";
import BookingPast from "./pages/BookingPast";

import Branches from "./pages/branches/page";
import Packets from "./pages/packets/page";
import Payments from "./pages/payments/page";
import Refunds from "./pages/refunds/page";
import User from "./pages/users/page";
import DashboardStudents from "./pages/dashboard/students/page";

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
        { path: "dashboard/students", element: <DashboardStudents /> },
        { path: "user", element: <User /> },
        { path: "room", element: <Room /> },
        { path: "booking", element: <Bookings /> },
        { path: "booking/upcoming", element: <BookingUpcoming /> },
        { path: "booking/past", element: <BookingPast /> },
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
        { path: "packet", element: <Packets /> },
        { path: "payment", element: <Payments /> },
        { path: "refund", element: <Refunds /> },
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
      path: "/logout",
      element: <Logout />,
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
