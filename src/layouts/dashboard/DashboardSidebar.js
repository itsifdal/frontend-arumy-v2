import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
import { Box, Drawer } from "@mui/material";
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
    path: "/dashboard/app",
    icon: getIcon("mdi:dots-grid"),
  },
  {
    title: "user",
    path: "/dashboard/user",
    icon: getIcon("solar:user-bold"),
  },
  {
    title: "rooms",
    path: "/dashboard/room",
    icon: getIcon("material-symbols:meeting-room"),
  },
  {
    title: "branches",
    path: "/dashboard/branches",
    icon: getIcon("material-symbols:map"),
  },
  {
    title: "booking",
    path: "/dashboard/booking",
    icon: getIcon("ion:time"),
  },
  {
    title: "post",
    path: "/dashboard/post",
    icon: getIcon("fa6-solid:paper-plane"),
  },
  {
    title: "students",
    path: "/dashboard/students",
    icon: getIcon("mdi:account-student"),
  },
  {
    title: "teachers",
    path: "/dashboard/teachers",
    icon: getIcon("mdi:teacher"),
  },
  {
    title: "instruments",
    path: "/dashboard/instruments",
    icon: getIcon("mdi:music"),
  },
];

const navConfigNonAdmin = [
  {
    title: "dashboard",
    path: "/dashboard/app",
    icon: getIcon("mdi:dots-grid"),
  },
  {
    title: "booking",
    path: "/dashboard/booking",
    icon: getIcon("ion:time"),
  },
  {
    title: "post",
    path: "/dashboard/post",
    icon: getIcon("fa6-solid:paper-plane"),
  },
];

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();

  const [user, setUser] = useState();

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

  let nav;
  if (user && user.role === "Admin") {
    nav = <NavSection navConfig={navConfigAdmin} />;
  } else {
    nav = <NavSection navConfig={navConfigNonAdmin} />;
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
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
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
