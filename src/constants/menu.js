import Iconify from "../components/Iconify";

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

export const MENU = {
  dashboard: {
    title: "Dashboard",
    path: "/app/dashboard",
    icon: getIcon("mdi:dots-grid"),
  },
  users: {
    title: "User",
    path: "/app/user",
    icon: getIcon("solar:user-bold"),
  },
  rooms: {
    title: "Rooms",
    path: "/app/room",
    icon: getIcon("material-symbols:meeting-room"),
  },
  branches: {
    title: "Branches",
    path: "/app/branches",
    icon: getIcon("material-symbols:map"),
  },
  bookings: {
    title: "Booking",
    path: "/app/booking",
    icon: getIcon("ion:time"),
  },
  posts: {
    title: "Post",
    path: "/app/post",
    icon: getIcon("fa6-solid:paper-plane"),
  },
  students: {
    title: "Students",
    path: "/app/students",
    icon: getIcon("mdi:account-student"),
  },
  teachers: {
    title: "Teachers",
    path: "/app/teachers",
    icon: getIcon("mdi:teacher"),
  },
  instruments: {
    title: "Instruments",
    path: "/app/instruments",
    icon: getIcon("mdi:music"),
  },
  logout: {
    title: "Logout",
    path: "/logout",
    icon: getIcon("heroicons-outline:logout"),
  },
  more: {
    title: "More",
    path: "/more",
    icon: getIcon("ri:more-2-fill"),
  },
  packet: {
    title: "Paket",
    path: "/app/packet",
    icon: getIcon("mdi:package"),
  },
  payment: {
    title: "Payment",
    path: "/app/payment",
    icon: getIcon("tdesign:money"),
  },
  refund: {
    title: "Refund",
    path: "/app/refund",
    icon: getIcon("mdi:cash-refund"),
  },
};
