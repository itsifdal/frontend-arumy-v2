import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import { format, parse, isValid } from "date-fns";
import PropTypes from "prop-types";
import { Button, Stack, Grid, Drawer, IconButton, Typography, Box } from "@mui/material";

import AutoCompleteBasic from "../input/autoCompleteBasic";
import DateInputBasic from "../input/dateInputBasic";
import NativeSelectBasic from "../input/nativeSelectBasic";
import { queryKey } from "../../constants/queryKey";
import { bookingStatus, bookingStatusObj } from "../../constants/bookingStatus";
import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";
import useResponsive from "../../hooks/useResponsive";
import Iconify from "../Iconify";

const initFilter = {
  status: "",
  roomId: "",
  roomLabel: "",
  tgl_kelas: "",
  studentId: "",
  studentLabel: "",
  teacherId: "",
};

export default function BookingFilters() {
  const isDesktop = useResponsive("up", "lg");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(initFilter);
  const filterString = useMemo(
    () => [
      filters.studentLabel,
      filters.roomLabel,
      filters.tgl_kelas && format(parse(filters.tgl_kelas, "yyyy-MM-dd", new Date()), "d MMM yyyy"),
      filters.status && `Status ${bookingStatusObj[filters.status].label}`,
    ],
    [filters]
  );

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

  return isDesktop ? (
    <BookingFilterForm />
  ) : (
    <>
      <Stack justifyItems={"center"}>
        <IconButton aria-label="expand row" size="small" onClick={toggleDrawer(true)} sx={{ borderRadius: "10px" }}>
          <Iconify icon="mdi:filter-outline" />
          <Typography marginLeft={"10px"} fontSize={"12px"}>
            {filterString.filter((element) => element !== undefined).length
              ? `${filterString.filter((element) => element !== undefined).join(", ")}`
              : "Filter"}
          </Typography>
        </IconButton>
      </Stack>
      <Drawer anchor={"right"} open={openDrawer} onClose={toggleDrawer(false)}>
        <Stack padding={1} paddingRight={3} direction={"row"} alignItems={"flex-start"}>
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

function BookingFilterForm({ toggleDrawer }) {
  const [openRoom, setOpenRoom] = useState(false);
  const [openStudent, setOpenStudent] = useState(false);
  const [filters, setFilters] = useState(initFilter);
  const [searchParams, setSearchParams] = useSearchParams();
  const isDesktop = useResponsive("up", "lg");

  const { data: students = [], isLoading: isLoadingStudents } = useQuery(
    [queryKey.students],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/student?perPage=9999`).then((res) => res.data),
    {
      select: (students) => students.data?.map((student) => ({ value: student.id, label: student.nama_murid })),
      enabled: openStudent,
    }
  );

  const { data: rooms = [], isLoading: isLoadingRooms } = useQuery(
    [queryKey.rooms],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/room`).then((res) => res.data),
    {
      select: (roomList) => roomList.map((room) => ({ value: room.id, label: room.nama_ruang })),
      enabled: openRoom,
    }
  );

  useEffect(() => {
    // use this for escape infinite loop
    setFilters(urlSearchParamsToQuery(searchParams));
  }, [searchParams]);

  const SubmitFilter = () => {
    toggleDrawer(false);
    setSearchParams(filters);
  };

  const ResetFilter = () => {
    toggleDrawer(false);
    setSearchParams();
  };

  return (
    <Stack width={"100%"} direction={isDesktop ? "row" : "column"} spacing={2}>
      <Grid container spacing={isDesktop ? 1 : 0} flexGrow={1} gap={isDesktop ? 0 : 1}>
        <Grid item xs={12} lg={3}>
          <AutoCompleteBasic
            label="Nama Murid"
            name="studentId"
            open={openStudent}
            onOpen={() => {
              setOpenStudent(true);
            }}
            onClose={() => {
              setOpenStudent(false);
            }}
            onChange={(_, newValue) => {
              setFilters((prevState) => ({
                ...prevState,
                studentId: newValue?.value || "",
                studentLabel: newValue?.label || "",
              }));
            }}
            options={students}
            loading={isLoadingStudents}
            value={{ value: filters.studentId || "", label: filters.studentLabel || "" }}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <AutoCompleteBasic
            label="Ruang Kelas"
            name="roomId"
            open={openRoom}
            onOpen={() => {
              setOpenRoom(true);
            }}
            onClose={() => {
              setOpenRoom(false);
            }}
            onChange={(_, newValue) => {
              setFilters((prevState) => ({
                ...prevState,
                roomId: newValue?.value || "",
                roomLabel: newValue?.label || "",
              }));
            }}
            options={rooms}
            loading={isLoadingRooms}
            value={{ value: filters.roomId || "", label: filters.roomLabel || "" }}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <DateInputBasic
            disableValidation
            id="tgl_kelas"
            name="tgl_kelas"
            label="Date"
            value={parse(filters.tgl_kelas, "yyyy-MM-dd", new Date())}
            onChange={(e) => {
              if (!isValid(e.target.value)) return false;
              return setFilters((prevState) => ({ ...prevState, tgl_kelas: format(e.target.value, "yyyy-MM-dd") }));
            }}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <NativeSelectBasic
            id="status"
            name="status"
            label="Class Status"
            value={filters.status}
            onChange={(e) => {
              setFilters((prevState) => ({ ...prevState, status: e.target.value }));
            }}
            options={bookingStatus}
          />
        </Grid>
      </Grid>
      <Stack
        spacing={1}
        direction={"row"}
        flexShrink={0}
        alignItems="flex-end"
        {...(!isDesktop && {
          width: "100%",
        })}
      >
        <Button
          variant="contained"
          onClick={SubmitFilter}
          sx={{
            height: "50px",
            ...(!isDesktop && {
              width: "100%",
            }),
          }}
        >
          Filter
        </Button>
        <Button
          variant="outlined"
          onClick={ResetFilter}
          sx={{
            height: "50px",
            ...(!isDesktop && {
              width: "100%",
            }),
          }}
        >
          Reset
        </Button>
      </Stack>
    </Stack>
  );
}

BookingFilterForm.propTypes = {
  toggleDrawer: PropTypes.func,
};
