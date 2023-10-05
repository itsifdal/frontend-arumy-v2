// component
import Iconify from "../../components/Iconify";
// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: "dashboard",
    path: "/app/dashboard",
    icon: getIcon("eva:pie-chart-2-fill"),
  },
  {
    title: "user",
    path: "/app/user",
    icon: getIcon("eva:people-fill"),
  },
  {
    title: "room",
    path: "/app/room",
    icon: getIcon("eva:people-fill"),
  },
  {
    title: "booking",
    path: "/app/booking",
    icon: getIcon("eva:shopping-bag-fill"),
  },
  {
    title: "blog",
    path: "/app/blog",
    icon: getIcon("eva:file-text-fill"),
  },
  {
    title: "login",
    path: "/login",
    icon: getIcon("eva:lock-fill"),
  },
];

export default navConfig;
