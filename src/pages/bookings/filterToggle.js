import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { format, parse } from "date-fns";
import { Button, Stack, Drawer, IconButton, Box } from "@mui/material";

import useResponsive from "../../hooks/useResponsive";
import { bookingStatusObj } from "../../constants/bookingStatus";
import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";
import Iconify from "../../components/Iconify";
import { BookingFilterForm } from "./filterForm";

const initFilter = {
  status: "",
  roomId: "",
  roomLabel: "",
  dateFrom: "",
  dateTo: "",
  studentId: "",
  studentLabel: "",
  teacherId: "",
  teacherLabel: "",
};

export function BookingFilters() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(initFilter);
  const filterString = useMemo(
    () => [
      filters.studentLabel,
      filters.teacherLabel,
      filters.roomLabel,
      filters.dateFrom && format(parse(filters.dateFrom, "yyyy-MM-dd", new Date()), "d MMM yyyy"),
      filters.dateTo && format(parse(filters.dateTo, "yyyy-MM-dd", new Date()), "d MMM yyyy"),
      filters.status && `Status ${bookingStatusObj[filters.status].label}`,
    ],
    [filters]
  );
  const isDesktop = useResponsive("up", "lg");

  useEffect(() => {
    // use this for escape infinite loop
    setFilters(urlSearchParamsToQuery(searchParams));
  }, [searchParams]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setOpenDrawer(open);
  };

  const ResetFilter = () => {
    if (toggleDrawer) toggleDrawer(false);
    setSearchParams();
  };

  return (
    <>
      <Stack direction={"row"} width={isDesktop ? "auto" : "100%"} justifyContent={"flex-end"} alignSelf={"stretch"}>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="mdi:filter-outline" />}
          onClick={toggleDrawer(true)}
          sx={{ lineHeight: 1.2, ...(!isDesktop && { width: "100%" }) }}
        >
          {filterString.filter((element) => element !== undefined).length
            ? `${filterString.filter((element) => element !== undefined).join(", ")}`
            : "Filter"}
        </Button>
        {filterString.filter((element) => element !== undefined).length ? (
          <IconButton aria-label="clear" onClick={ResetFilter}>
            <Iconify icon="ic:round-close" sx={{ width: "20px", height: "20px" }} />
          </IconButton>
        ) : null}
      </Stack>
      <Drawer anchor={"right"} open={openDrawer} onClose={toggleDrawer(false)}>
        <Stack padding={2} gap={1} paddingRight={4} direction={"row"} alignItems={"flex-start"}>
          <IconButton aria-label="back" onClick={toggleDrawer(false)}>
            <Iconify icon="ph:arrow-left-bold" sx={{ width: "20px", height: "20px" }} />
          </IconButton>
          <Box paddingTop={1}>
            <BookingFilterForm toggleDrawer={toggleDrawer()} />
          </Box>
        </Stack>
      </Drawer>
    </>
  );
}
