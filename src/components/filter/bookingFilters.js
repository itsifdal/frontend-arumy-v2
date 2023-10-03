import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import { format, parse, isValid } from "date-fns";
import PropTypes from "prop-types";
import { Button, Stack, Grid, Drawer, IconButton, Box, ToggleButtonGroup, ToggleButton } from "@mui/material";

import AutoCompleteBasic from "../input/autoCompleteBasic";
import DateInputBasic from "../input/dateInputBasic";
import NativeSelectBasic from "../input/nativeSelectBasic";
import { queryKey } from "../../constants/queryKey";
import { bookingStatus, bookingStatusObj } from "../../constants/bookingStatus";
import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";
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

export default function BookingFilters({ toggleValue }) {
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
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    if (!newValue) {
      navigate(`/app/booking/`);
    } else {
      navigate(`/app/booking/${newValue}`);
    }
  };

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

  return (
    <>
      <Stack justifyContent={"flex-end"} direction={"row"} gap={2}>
        <ToggleButtonGroup value={toggleValue} exclusive onChange={handleChange} aria-label="Platform">
          <ToggleButton value="upcoming">Upcoming</ToggleButton>
          <ToggleButton value="past">Past</ToggleButton>
        </ToggleButtonGroup>
        <Button variant="outlined" startIcon={<Iconify icon="mdi:filter-outline" />} onClick={toggleDrawer(true)}>
          {filterString.filter((element) => element !== undefined).length
            ? `${filterString.filter((element) => element !== undefined).join(", ")}`
            : "Filter"}
        </Button>
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
BookingFilters.propTypes = {
  toggleValue: PropTypes.string,
};

function BookingFilterForm({ toggleDrawer }) {
  const [openRoom, setOpenRoom] = useState(false);
  const [openStudent, setOpenStudent] = useState(false);
  const [filters, setFilters] = useState(initFilter);
  const [searchParams, setSearchParams] = useSearchParams();

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
    if (toggleDrawer) toggleDrawer(false);
    setSearchParams(filters);
  };

  const ResetFilter = () => {
    if (toggleDrawer) toggleDrawer(false);
    setSearchParams();
  };

  return (
    <Stack width={"100%"} direction={"column"} spacing={2}>
      <Grid container flexGrow={1} gap={1}>
        <Grid item xs={12}>
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
        <Grid item xs={12}>
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
        <Grid item xs={12}>
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
        <Grid item xs={12}>
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
      <Stack spacing={1} direction={"row"} flexShrink={0} alignItems="flex-end" width={"100%"}>
        <Button
          variant="contained"
          onClick={SubmitFilter}
          sx={{
            height: "50px",
            width: "100%",
          }}
        >
          Filter
        </Button>
        <Button
          variant="outlined"
          onClick={ResetFilter}
          sx={{
            height: "50px",
            width: "100%",
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
