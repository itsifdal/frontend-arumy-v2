import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
//
/* import DashboardNavbar from "./DashboardNavbar"; */
import DashboardSidebar from "./DashboardSidebar";
import useResponsive from "../../hooks/useResponsive";

// ----------------------------------------------------------------------

const RootStyle = styled("div")({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
});

const MainStyle = styled("div")({
  flexGrow: 1,
  minHeight: "100vh",
  backgroundColor: "#F9FAFB",
});

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [foundUser, setFoundUser] = useState(true);
  const isDesktop = useResponsive("up", "lg");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setFoundUser(foundUser);
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  if (!foundUser || foundUser === undefined) {
    navigate("/login", { replace: true });
  }

  return (
    <RootStyle>
      {/* <DashboardNavbar onOpenSidebar={() => setOpen(true)} /> */}
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle sx={{ ...(!isDesktop && { paddingBottom: "66px" }) }}>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
