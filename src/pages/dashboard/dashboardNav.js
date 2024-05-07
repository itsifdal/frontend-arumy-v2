import { Link as RouterLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Stack, Button } from "@mui/material";
import PropTypes from "prop-types";

const navItem = [
  { label: "STUDENTS", to: "/app/dashboard/students", slug: "students", isAdminOnly: true },
  { label: "TEACHERS", to: "/app/dashboard/teachers", slug: "teachers", isAdminOnly: true },
  { label: "ROOM", to: "/app/dashboard/timeline", slug: "rooms", isAdminOnly: false },
  { label: "BOOKING", to: "/app/dashboard", slug: "bookings", isAdminOnly: false },
];

export default function DashboardNav({ active }) {
  const [user, setUser] = useState("");

  // localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  return (
    <Stack direction={"row"} spacing={2}>
      {navItem.map((menu) => {
        const isMenuForAdmin = !menu.isAdminOnly || (user.role !== "Guru" && user.role !== "Reguler");
        if (isMenuForAdmin) {
          return (
            <Button
              key={menu.slug}
              variant={menu.slug === active ? "contained" : "outlined"}
              component={RouterLink}
              to={menu.to}
            >
              {menu.label}
            </Button>
          );
        }
        return null;
      })}
    </Stack>
  );
}

DashboardNav.propTypes = {
  active: PropTypes.oneOf(["students", "teachers", "rooms", "bookings"]),
};
