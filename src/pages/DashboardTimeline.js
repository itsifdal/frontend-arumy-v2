import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { format, parse } from "date-fns";
import axios from "axios";
import { Scheduler } from "@aldabil/react-scheduler";
import randomColor from "randomcolor";
import id from "date-fns/locale/id";
// material
import { Stack, Button, Container, Typography, Box, Grid } from "@mui/material";
// components
import { queryKey } from "../constants/queryKey";
import Page from "../components/Page";
// sections
import PageHeader from "../components/PageHeader";
import DateInputBasic from "../components/input/dateInputBasic";
import { urlSearchParamsToQuery } from "../utils/urlSearchParamsToQuery";
import { queryToString } from "../utils/queryToString";
import { cleanQuery } from "../utils/cleanQuery";

const initFilter = {
  tgl_kelas: format(new Date(), "yyyy-MM-dd"),
};

// ----------------------------------------------------------------------

export default function DashboardTimeline() {
  const navigate = useNavigate();
  const [foundUser, setFoundUser] = useState(true);
  const [filters, setFilters] = useState(initFilter);

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);

  const { data: rooms = [] } = useQuery(
    [queryKey.rooms],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/room`).then((res) => res.data),
    {
      select: (roomList) =>
        roomList.map((room) => ({
          room_id: room.id,
          title: room.nama_ruang,
          branch: room.cabang.nama_cabang,
          color: randomColor({
            luminosity: "dark",
          }),
        })),
    }
  );

  const defaultQueryBooking = {
    tgl_kelas: format(new Date(), "yyyy-MM-dd"),
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
          event_id: booking.id,
          title: JSON.parse(booking.user_group)
            .map((student) => student.nama_murid)
            .join(", "),
          start: parse(booking.jam_booking, "HH:mm:ss", new Date()),
          end: parse(booking.selesai, "HH:mm:ss", new Date()),
          color: randomColor({
            luminosity: "dark",
          }),
          room_id: booking.roomId,
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

  function renderContent() {
    if (isLoadingBookings) return <Typography>Loading Data</Typography>;

    if (!bookings.length) return <Typography>No Data Found</Typography>;

    return (
      <Scheduler
        events={bookings}
        resources={rooms}
        resourceViewMode={"tabs"}
        resourceFields={{
          idField: "room_id",
          textField: "title",
          subTextField: "branch",
          colorField: "color",
        }}
        locale={id}
        hourFormat={24}
        view="day"
        day={{
          startHour: 8,
          endHour: 17,
          step: 60,
          navigation: false,
        }}
        disableViewNavigator
        editable={false}
        deletable={false}
        draggable={false}
        onEventClick={() => {}}
      />
    );
  }

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
        {renderContent()}
      </Container>
    </Page>
  );
}
