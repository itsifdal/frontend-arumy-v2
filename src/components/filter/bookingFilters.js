import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import { format, parse, isValid } from "date-fns";
import PropTypes from "prop-types";
import { Button, Stack, Drawer, IconButton, Box, ToggleButtonGroup, ToggleButton } from "@mui/material";

import useResponsive from "../../hooks/useResponsive";
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
  dateFrom: "",
  dateTo: "",
  studentId: "",
  studentLabel: "",
  teacherId: "",
  teacherLabel: "",
};

export default function BookingFilters() {
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
  const queryParam = urlSearchParamsToQuery(searchParams);

  const handleChange = (event, newValue) => {
    if (!newValue) {
      // remove filter when click again
      const tempQueryParam = queryParam;
      delete tempQueryParam.eventTime;
      delete tempQueryParam.sort;
      delete tempQueryParam.sort_by;

      setSearchParams({ ...tempQueryParam });
    } else {
      const query = {
        ...queryParam,
        eventTime: newValue,
        ...(newValue === "upcoming" && { sort: "asc", sort_by: "tgl_kelas" }),
        ...(newValue === "past" && { sort: "desc", sort_by: "tgl_kelas" }),
      };
      setSearchParams(query);
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

  const ResetFilter = () => {
    if (toggleDrawer) toggleDrawer(false);
    setSearchParams();
  };

  return (
    <>
      <Stack justifyContent={"flex-end"} direction={"row"} gap={isDesktop ? 2 : 1} flexWrap={"wrap"}>
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
        <Stack direction={"row"} width={isDesktop ? "auto" : "100%"} justifyContent={"flex-end"}>
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
BookingFilters.propTypes = {
  toggleValue: PropTypes.string,
};

function BookingFilterForm({ toggleDrawer }) {
  const [openRoom, setOpenRoom] = useState(false);
  const [openStudent, setOpenStudent] = useState(false);
  const [openTeacher, setOpenTeacher] = useState(false);
  const [filters, setFilters] = useState(initFilter);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isTeacher, setIsTeacher] = useState(false);

  const { data: students = [], isLoading: isLoadingStudents } = useQuery(
    [queryKey.students],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/student?perPage=9999`).then((res) => res.data),
    {
      select: (students) => students.data?.map((student) => ({ value: student.id, label: student.nama_murid })),
      enabled: openStudent,
    }
  );

  const { data: teachers = [], isLoading: isLoadingTeachers } = useQuery(
    [queryKey.teachers],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/teacher?perPage=9999`).then((res) => res.data),
    {
      select: (teachers) => teachers.data?.map((teacher) => ({ value: teacher.id, label: teacher.nama_pengajar })),
      enabled: openTeacher,
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

  // localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setIsTeacher(foundUser.role === "Guru");
    }
  }, []);

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
    <Stack width={"100%"} minWidth={["90vw", "50vw", "40vw"]} direction={"column"} gap={2}>
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
      {!isTeacher ? (
        <AutoCompleteBasic
          label="Nama Pengajar"
          name="teacherId"
          open={openTeacher}
          onOpen={() => {
            setOpenTeacher(true);
          }}
          onClose={() => {
            setOpenTeacher(false);
          }}
          onChange={(_, newValue) => {
            setFilters((prevState) => ({
              ...prevState,
              teacherId: newValue?.value || "",
              teacherLabel: newValue?.label || "",
            }));
          }}
          options={teachers}
          loading={isLoadingTeachers}
          value={{ value: filters.teacherId || "", label: filters.teacherLabel || "" }}
        />
      ) : null}
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
      <Stack direction={"row"} gap={2}>
        <DateInputBasic
          disableValidation
          id="dateFrom"
          name="dateFrom"
          label="From Date"
          value={parse(filters.dateFrom, "yyyy-MM-dd", new Date())}
          onChange={(e) => {
            if (e.target.value === null)
              return setFilters((prevState) => {
                delete prevState.dateFrom;
                return { ...prevState };
              });
            if (!isValid(e.target.value)) return false;
            return setFilters((prevState) => ({ ...prevState, dateFrom: format(e.target.value, "yyyy-MM-dd") }));
          }}
        />
        <DateInputBasic
          disableValidation
          id="dateTo"
          name="dateTo"
          label="To Date"
          value={parse(filters.dateTo, "yyyy-MM-dd", new Date())}
          onChange={(e) => {
            if (e.target.value === null)
              return setFilters((prevState) => {
                delete prevState.dateTo;
                return { ...prevState };
              });
            if (!isValid(e.target.value)) return false;
            return setFilters((prevState) => ({ ...prevState, dateTo: format(e.target.value, "yyyy-MM-dd") }));
          }}
        />
      </Stack>
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
