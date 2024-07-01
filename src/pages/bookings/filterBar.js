import React, { useEffect, useState } from "react";
import { Container, Box, Stack, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";
import { cleanQuery } from "../../utils/cleanQuery";
import useResponsive from "../../hooks/useResponsive";

import { BookingFilters } from "./filterToggle";
import { useGetBookings } from "./query";
import { pageInfo } from "./utils";

export const BookingFilterBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  const [user, setUser] = useState({});

  const isDesktop = useResponsive("up", "lg");

  // localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const { data: bookings } = useGetBookings({
    queryParam: cleanQuery({
      ...queryParam,
      ...(user.role === "Guru" && { teacherId: user?.teacherId }),
    }),
  });

  const handleChange = (_, newValue) => {
    if (!newValue) {
      // remove filter when click again
      const tempQueryParam = queryParam;
      delete tempQueryParam.eventTime;
      delete tempQueryParam.sort;
      delete tempQueryParam.sort_by;
      delete tempQueryParam.page;

      setSearchParams({ ...tempQueryParam });
    } else {
      const query = {
        ...queryParam,
        eventTime: newValue,
        ...(newValue === "upcoming" && { sort: "asc", sort_by: "tgl_kelas" }),
        ...(newValue === "past" && { sort: "desc", sort_by: "tgl_kelas" }),
        page: 1,
      };
      setSearchParams(query);
    }
  };

  return (
    <Box
      sx={{
        background: "#FFF",
        boxShadow: "0px 4px 20px 0px rgba(0, 0, 0, 0.05)",
        paddingY: isDesktop ? "20px" : "5px",
        zIndex: 2,
        position: "relative",
        borderTop: "1px solid #c3c3e1",
      }}
    >
      <Container maxWidth="xl">
        <Stack
          justifyContent={"flex-end"}
          direction={"row"}
          alignItems={"center"}
          gap={isDesktop ? 2 : 1}
          flexWrap={"wrap"}
          width={"100%"}
        >
          <Typography fontSize={"14px"}>{pageInfo(bookings?.pagination)}</Typography>

          <Box flexGrow={1} />

          <ToggleButtonGroup
            value={queryParam.eventTime || ""}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            {...(!isDesktop && { fullWidth: true })}
            sx={{
              ".MuiToggleButtonGroup-grouped": {
                borderColor: "rgba(56, 53, 161, 0.5)",
                color: "#3835A1",
                ":hover": {
                  backgroundColor: "rgba(56, 53, 161, 0.2)",
                },
                "&.Mui-selected": {
                  color: "white",
                  backgroundColor: "#3835A1",
                  ":hover": {
                    backgroundColor: "#3835A1",
                  },
                },
              },
            }}
          >
            <ToggleButton value="upcoming">Upcoming</ToggleButton>
            <ToggleButton value="past">Past</ToggleButton>
          </ToggleButtonGroup>

          <BookingFilters />
        </Stack>
      </Container>
    </Box>
  );
};
