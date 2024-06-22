import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import { format, parse, isValid } from "date-fns";
import PropTypes from "prop-types";
import { Button, Stack } from "@mui/material";

import AutoCompleteBasic from "../../components/input/autoCompleteBasic";
import DateInputBasic from "../../components/input/dateInputBasic";
import NativeSelectBasic from "../../components/input/nativeSelectBasic";
import { queryKey } from "../../constants/queryKey";
import { bookingStatus } from "../../constants/bookingStatus";
import { bookingType } from "../../constants/bookingType";
import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";
import { fetchHeader } from "../../constants/fetchHeader";
import { termDate } from "../../constants/termDate";

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
  class_type: "",
};

export function BookingFilterForm({ toggleDrawer }) {
  const [openRoom, setOpenRoom] = useState(false);
  const [openStudent, setOpenStudent] = useState(false);
  const [openTeacher, setOpenTeacher] = useState(false);
  const [filters, setFilters] = useState(initFilter);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isTeacher, setIsTeacher] = useState(false);

  const { data: students = [], isLoading: isLoadingStudents } = useQuery(
    [queryKey.students],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/student?perPage=9999`, {
          headers: fetchHeader,
        })
        .then((res) => res.data),
    {
      select: (students) => students.data?.map((student) => ({ value: student.id, label: student.nama_murid })),
      enabled: openStudent,
    }
  );

  const { data: teachers = [], isLoading: isLoadingTeachers } = useQuery(
    [queryKey.teachers],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/teacher?perPage=9999`, {
          headers: fetchHeader,
        })
        .then((res) => res.data),
    {
      select: (teachers) => teachers.data?.map((teacher) => ({ value: teacher.id, label: teacher.nama_pengajar })),
      enabled: openTeacher,
    }
  );

  const { data: rooms = [], isLoading: isLoadingRooms } = useQuery(
    [queryKey.rooms],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/room`, {
          headers: fetchHeader,
        })
        .then((res) => res.data),
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
    setSearchParams({ ...filters, page: 1 });
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
          label="Mulai Tanggal"
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
          maxDate={parse(filters.dateTo, "yyyy-MM-dd", new Date())}
        />
        <DateInputBasic
          disableValidation
          id="dateTo"
          name="dateTo"
          label="Sampai Tanggal"
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
          minDate={parse(filters.dateFrom, "yyyy-MM-dd", new Date())}
        />
      </Stack>
      <NativeSelectBasic
        id="status"
        name="status"
        label="Status Booking"
        value={filters.status}
        onChange={(e) => {
          setFilters((prevState) => ({ ...prevState, status: e.target.value }));
        }}
        options={bookingStatus}
      />
      <NativeSelectBasic
        id="class_type"
        name="class_type"
        label="Jenis Booking"
        value={filters.class_type}
        onChange={(e) => {
          setFilters((prevState) => ({ ...prevState, class_type: e.target.value }));
        }}
        options={bookingType}
      />
      <NativeSelectBasic
        id="termPlaceholder"
        name="termPlaceholder"
        label="Term Booking"
        value={filters.termPlaceholder}
        onChange={(e) => {
          const arrValue = e.target.value.split("-");
          setFilters((prevState) => ({
            ...prevState,
            termPlaceholder: e.target.value,
            term: arrValue[0] ?? "",
            termYear: arrValue[1] ?? "",
          }));
        }}
        options={[
          {
            termYear: "",
            termValue: "",
            value: "",
            label: "-- Silahkan pilih term --",
          },
          ...termDate,
        ]}
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
