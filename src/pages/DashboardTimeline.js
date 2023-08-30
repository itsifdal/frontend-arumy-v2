import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { format, parse } from "date-fns";
import axios from "axios";
import randomColor from "randomcolor";
import id from "date-fns/locale/id";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
// material
import { Stack, Button, Container, Box, Grid } from "@mui/material";
// components
import { queryKey } from "../constants/queryKey";
import Page from "../components/Page";
// sections
import PageHeader from "../components/PageHeader";
import DateInputBasic from "../components/input/dateInputBasic";
import AutoCompleteBasic from "../components/input/autoCompleteBasic";
import { urlSearchParamsToQuery } from "../utils/urlSearchParamsToQuery";
import { queryToString } from "../utils/queryToString";
import { cleanQuery } from "../utils/cleanQuery";

const initFilter = {
  tgl_kelas: format(new Date(), "yyyy-MM-dd"),
  roomId: 21,
};

// ----------------------------------------------------------------------

export default function DashboardTimeline() {
  const navigate = useNavigate();
  const [foundUser, setFoundUser] = useState(true);
  const [filters, setFilters] = useState(initFilter);
  const [openRoom, setOpenRoom] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);

  const todayStr = new Date().toISOString().replace(/T.*$/, "");

  const { data: rooms = [], isLoading: isLoadingRooms } = useQuery(
    [queryKey.rooms],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/room`).then((res) => res.data),
    {
      select: (roomList) => roomList.map((room) => ({ value: room.id, label: room.nama_ruang })),
      enabled: openRoom,
    }
  );

  const defaultQueryBooking = {
    tgl_kelas: format(new Date(), "yyyy-MM-dd"),
    roomId: 21,
    ...queryParam,
    perPage: 9999,
  };

  const {
    data: bookings = [],
    isLoading: isLoadingBookings,
    refetch: refetchBookings,
  } = useQuery(
    [queryKey.bookings, cleanQuery(defaultQueryBooking)],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/booking${queryToString(defaultQueryBooking)}`)
        .then((res) => res.data),
    {
      select: (bookingList) =>
        bookingList.data.map((booking) => ({
          id: booking.id,
          title: JSON.parse(booking.user_group)
            .map((student) => student.nama_murid)
            .join(", "),
          start: `${booking.tgl_kelas}T${booking.jam_booking}`,
          end: `${booking.tgl_kelas}T${booking.selesai}`,
          color: randomColor({
            luminosity: "dark",
          }),
          // date: "2020-07-30"
        })),
    }
  );

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setFoundUser(foundUser);
    }
  }, []);

  useEffect(() => {
    // use this for escape infinite loop
    setFilters((prevState) => ({ ...prevState, ...urlSearchParamsToQuery(searchParams) }));
    refetchBookings();
  }, [searchParams, refetchBookings]);

  if (!foundUser || foundUser === undefined) {
    navigate("/login", { replace: true });
  }

  const SubmitFilter = (filter) => {
    setFilters((prevState) => ({ ...prevState, ...filter }));
    setSearchParams({ ...filters, ...filter });
  };
  console.log(bookings);

  return (
    <Page title="Dashboard">
      <PageHeader
        title="Dashboard"
        rightContent={
          <Stack direction={"row"} spacing={2}>
            <Button variant="contained">ROOM</Button>
            <Button variant="outlined" component={RouterLink} to="/app/dashboard">
              BOOKING
            </Button>
          </Stack>
        }
      />
      <Box
        sx={{
          background: "#FFF",
          boxShadow: "0px 4px 20px 0px rgba(0, 0, 0, 0.05)",
          paddingY: "20px",
          zIndex: 2,
          position: "relative",
          borderTop: "1px solid #c3c3e1",
        }}
      >
        <Container maxWidth="xl">
          <Stack width={"100%"} direction={"row"} spacing={2}>
            <Grid container spacing={1} flexGrow={1}>
              <Grid item xs={4}>
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
                    SubmitFilter({ roomId: newValue?.value || 21, roomLabel: newValue?.label || "Online" });
                  }}
                  options={rooms}
                  loading={isLoadingRooms}
                  value={{ value: filters.roomId || 21, label: filters.roomLabel || "Online" }}
                />
              </Grid>
              <Grid item xs={4}>
                <DateInputBasic
                  disableValidation
                  id="tgl_kelas"
                  name="tgl_kelas"
                  label="Date"
                  value={parse(filters.tgl_kelas, "yyyy-MM-dd", new Date())}
                  onChange={(e) => {
                    SubmitFilter({ tgl_kelas: format(e.target.value, "yyyy-MM-dd") });
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        {!isLoadingBookings ? (
          <FullCalendar
            plugins={[timeGridPlugin]}
            initialView="timeGridDay"
            headerToolbar={{ left: "", center: "", right: "" }}
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
            nowIndicator
            now={parse(filters.tgl_kelas, "yyyy-MM-dd", new Date()) || new Date()}
            height="620px"
            locale={id}
            slotLabelFormat={{
              hour: "numeric",
              minute: "2-digit",
              omitZeroMinute: false,
              meridiem: "short",
            }}
            initialEvents={bookings}
            allDaySlot={false}
          />
        ) : null}
      </Container>
    </Page>
  );
}
