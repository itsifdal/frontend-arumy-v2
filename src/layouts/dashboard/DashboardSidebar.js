import PropTypes from "prop-types";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink as RouterLink, useLocation, useNavigate } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
import { Box, Drawer, BottomNavigation, BottomNavigationAction, Grid, Button, Stack } from "@mui/material";
// hooks
import useResponsive from "../../hooks/useResponsive";
// components
import Scrollbar from "../../components/Scrollbar";
import NavSection from "../../components/NavSection";
import AccountPopover from "./AccountPopover";
import IMAGES from "../../constants/images";
import { MENU } from "../../constants/menu";
import { fetchHeader } from "../../constants/fetchHeader";

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

const navConfigAdmin = [
  MENU.dashboard,
  MENU.users,
  MENU.rooms,
  MENU.branches,
  MENU.bookings,
  MENU.students,
  MENU.teachers,
  MENU.instruments,
  MENU.packet,
  MENU.payment,
];

const navConfigAdminMobile = [MENU.dashboard, MENU.bookings, MENU.users, MENU.students, MENU.more];
const navConfigAdminMore = [
  MENU.rooms,
  MENU.branches,
  MENU.bookings,
  MENU.teachers,
  MENU.instruments,
  MENU.packet,
  MENU.payment,
  MENU.logout,
];

const navConfigNonAdmin = [MENU.dashboard, MENU.bookings];
const navConfigNonAdminMobile = [...navConfigNonAdmin, MENU.logout];

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();

  const [user, setUser] = useState();
  const [openMore, setOpenMore] = useState(false);
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
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/login/logout`, {
        headers: fetchHeader,
      })
      .then(() => {
        localStorage.clear();
        navigate("/login", { replace: true });
      });
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setOpenMore(open);
  };

  const linkMenu = (menu) => {
    if (menu.path === "/logout") return { onClick: () => onLogout() };
    if (menu.path === "/more") return { onClick: toggleDrawer(true) };
    return {
      LinkComponent: RouterLink,
      to: menu.path,
    };
  };

  const renderBottomNavigation = (menus) =>
    menus.map((menu) => (
      <BottomNavigationAction
        key={menu.path}
        label={menu.title}
        icon={menu.icon}
        sx={{ span: { fontSize: "12px" }, "span.Mui-selected": { fontSize: "12px" } }}
        {...linkMenu(menu)}
      />
    ));

  let nav;
  let activeNav;
  if (user && user?.role === "Admin" && isDesktop) {
    nav = <NavSection navConfig={navConfigAdmin} />;
    activeNav = navConfigAdmin;
  } else if (user && user?.role === "Admin" && !isDesktop) {
    nav = renderBottomNavigation(navConfigAdminMobile);
    activeNav = navConfigAdminMobile;
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
      {!isDesktop && (
        <>
          <BottomNavigation
            showLabels
            value={activeNav?.findIndex((menu) => menu.path === pathname)}
            sx={{ position: "fixed", width: "100%", zIndex: "10", bottom: 0, left: 0 }}
          >
            {nav}
          </BottomNavigation>
          <Drawer anchor={"bottom"} open={openMore} onClose={toggleDrawer(false)}>
            <MoreMenu menus={navConfigAdminMore} linkMenu={linkMenu} />
          </Drawer>
        </>
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

function MoreMenu({ menus, linkMenu }) {
  return (
    <Grid container paddingX={2} paddingY={4} spacing={2}>
      {menus.map((menu) => (
        <Grid key={menu.title} item xs={4} sm={3} md={2} textAlign={"center"}>
          <Button variant="text" {...linkMenu(menu)}>
            <Stack alignItems={"center"}>
              {menu.icon}
              {menu.title}
            </Stack>
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}

MoreMenu.propTypes = {
  menus: PropTypes.array,
  linkMenu: PropTypes.func,
};
