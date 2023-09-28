import PropTypes from "prop-types";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink as RouterLink, useLocation, useNavigate } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
import { Box, Drawer, BottomNavigation, BottomNavigationAction } from "@mui/material";
// hooks
import useResponsive from "../../hooks/useResponsive";
// components
import Iconify from "../../components/Iconify";
import Scrollbar from "../../components/Scrollbar";
import NavSection from "../../components/NavSection";
import AccountPopover from "./AccountPopover";
import IMAGES from "../../constants/images";

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfigAdmin = [
  {
    title: "dashboard",
    path: "/app/dashboard",
    icon: getIcon("mdi:dots-grid"),
  },
  {
    title: "user",
    path: "/app/user",
    icon: getIcon("solar:user-bold"),
  },
  {
    title: "rooms",
    path: "/app/room",
    icon: getIcon("material-symbols:meeting-room"),
  },
  {
    title: "branches",
    path: "/app/branches",
    icon: getIcon("material-symbols:map"),
  },
  {
    title: "booking",
    path: "/app/booking",
    icon: getIcon("ion:time"),
  },
  /* {
    title: "post",
    path: "/app/post",
    icon: getIcon("fa6-solid:paper-plane"),
  }, */
  {
    title: "students",
    path: "/app/students",
    icon: getIcon("mdi:account-student"),
  },
  {
    title: "teachers",
    path: "/app/teachers",
    icon: getIcon("mdi:teacher"),
  },
  {
    title: "instruments",
    path: "/app/instruments",
    icon: getIcon("mdi:music"),
  },
];

const navConfigNonAdmin = [
  {
    title: "Dashboard",
    path: "/app/dashboard",
    icon: getIcon("mdi:dots-grid"),
  },
  {
    title: "Booking",
    path: "/app/booking",
    icon: getIcon("ion:time"),
  },
  /* {
    title: "post",
    path: "/app/post",
    icon: getIcon("fa6-solid:paper-plane"),
  }, */
];

const navConfigNonAdminMobile = [
  ...navConfigNonAdmin,
  {
    title: "Logout",
    path: "/logout",
    icon: getIcon("heroicons-outline:logout"),
  },
];

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();

  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const isDesktop = useResponsive("up", "lg");

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const onLogout = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/login/logout`).then(() => {
      localStorage.clear();
      navigate("/login", { replace: true });
    });
  };

  const renderBottomNavigation = (menus) =>
    menus.map((menu) => (
      <BottomNavigationAction
        key={menu.path}
        label={menu.title}
        icon={menu.icon}
        sx={{ span: { fontSize: "12px" }, "span.Mui-selected": { fontSize: "12px" } }}
        {...(menu.path === "/logout"
          ? {
              onClick: () => onLogout(),
            }
          : {
              LinkComponent: RouterLink,
              to: menu.path,
            })}
      />
    ));

  let nav;
  let activeNav;
  if (user && user?.role === "Admin" && isDesktop) {
    nav = <NavSection navConfig={navConfigAdmin} />;
    activeNav = navConfigAdmin;
  } else if (user && user?.role === "Admin" && !isDesktop) {
    nav = <NavSection navConfig={navConfigNonAdmin} />;
    activeNav = navConfigNonAdmin;
  } else if (user && isDesktop) {
    nav = <NavSection navConfig={navConfigNonAdmin} />;
    activeNav = navConfigNonAdmin;
  } else if (user && !isDesktop) {
    nav = renderBottomNavigation(navConfigNonAdminMobile);
    activeNav = navConfigNonAdminMobile;
  }

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": { height: 1, display: "flex", flexDirection: "column" },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: "inline-flex" }}>
        <img src={IMAGES.LOGIN_LOGO} alt="logo login" />
      </Box>

      {nav}

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ my: 2, display: "flex", justifyContent: "center" }}>
        <AccountPopover />
      </Box>
    </Scrollbar>
  );

  return (
    <RootStyle>
      {/* !isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      ) */}
      {!isDesktop && user?.role !== "Admin" && (
        <BottomNavigation
          showLabels
          value={activeNav?.findIndex((menu) => menu.path === pathname)}
          sx={{ position: "fixed", width: "100%", zIndex: "10", bottom: 0, left: 0 }}
        >
          {nav}
        </BottomNavigation>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: "background.default",
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
