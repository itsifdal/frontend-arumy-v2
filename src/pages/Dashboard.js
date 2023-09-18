import { Link as RouterLink, useSearchParams } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import { useQuery } from "react-query";
import { format, parse, isValid } from "date-fns";
import axios from "axios";
import { Chart } from "react-google-charts";
// material
import {
  Link,
  Table,
  Stack,
  Button,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  Paper,
  tableCellClasses,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
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

export default function Dashboard() {
  const [filters, setFilters] = useState(initFilter);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);

  const {
    data: dashboard,
    isLoading: isLoadingDashboard,
    refetch: refetchBooking,
  } = useQuery(
    [queryKey.dashboard],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/dashboard/booking${queryToString(queryParam)}`)
        .then((res) => res.data),
    {
      select: (dashboards) =>
        dashboards.data.map((dashboard) => ({
          roomName: dashboard.roomName,
          roomId: dashboard.roomId,
          bookings: dashboard.booking.map((book) => {
            const arrayStudent = JSON.parse(book.user_group)
              .map((student) => student.nama_murid)
              .join(", ");
            return {
              id: book.id,
              startTime: book.jam_booking,
              classType: book.jenis_kelas,
              studentName: arrayStudent,
              instrument: book.instrument?.nama_instrument,
              teacherName: book.teacher?.nama_pengajar,
            };
          }),
        })),
    }
  );

  const { data: rooms = [] } = useQuery(
    [queryKey.rooms],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/room`).then((res) => res.data),
    {
      select: (roomList) => roomList.map((room) => ({ label: room.nama_ruang })),
    }
  );

  const defaultQueryBooking = {
    ...initFilter,
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
        bookingList.data.map((booking) => [
          booking.room.nama_ruang,
          `${JSON.parse(booking.user_group)
            .map((student) => student.nama_murid)
            .join(", ")} - ${booking.teacher.nama_pengajar}`,
          parse(booking.jam_booking, "HH:mm:ss", new Date()),
          parse(booking.selesai, "HH:mm:ss", new Date()),
        ]),
    }
  );

  useEffect(() => {
    // use this for escape infinite loop
    setFilters((prevState) => ({ ...prevState, ...urlSearchParamsToQuery(searchParams) }));
    refetchBooking();
    refetchBookings();
  }, [searchParams, refetchBooking, refetchBookings]);

  const unusedRoom = useMemo(() => {
    if (rooms.length && bookings.length) {
      const bookList = [];
      rooms.forEach((room) => {
        if (!bookings.find((book) => book[0] === room.label)) {
          bookList.push([
            room.label,
            "Jadwal Kosong",
            parse("08:00:00", "HH:mm:ss", new Date()),
            parse("08:00:00", "HH:mm:ss", new Date()),
          ]);
        }
      });
      return bookList;
    }
    return [];
  }, [bookings, rooms]);

  const StyledTableCell = styled(TableCell)({
    [`&.${tableCellClasses.head}`]: {
      borderColor: "#c7c7e4",
      color: "#737DAA",
      textAlign: "left",
      paddingTop: 10,
      paddingBottom: 10,
    },
    [`&.${tableCellClasses.body}`]: {
      border: 0,
      textAlign: "left",
      paddingTop: 8,
      paddingBottom: 8,
    },
  });

  const StyledTableRow = styled(TableRow)({
    // hide last border
    "&:last-child td": {
      paddingBottom: 20,
    },
  });

  const SubmitFilter = (filter) => {
    setFilters((prevState) => ({ ...prevState, ...filter }));
    setSearchParams({ ...filters, ...filter });
  };

  function renderContent() {
    if (isLoadingDashboard) return <Typography>Loading Data</Typography>;

    if (!dashboard.length) return <Typography>No Data Found</Typography>;

    return dashboard.map(({ roomName, roomId, bookings }) => (
      <Box key={roomId}>
        <Typography marginBottom={2} fontWeight={"700"}>
          {roomName}
        </Typography>
        <TableContainer
          component={Paper}
          sx={{ boxShadow: "3px 4px 20px 0px rgba(0, 0, 0, 0.10)", background: "white" }}
        >
          <Table size="small" aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>WAKTU</StyledTableCell>
                <StyledTableCell>JENIS KELAS</StyledTableCell>
                <StyledTableCell>NAMA ANAK</StyledTableCell>
                <StyledTableCell>INSTRUMENT</StyledTableCell>
                <StyledTableCell>PENGAJAR</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <StyledTableRow key={booking.id}>
                  <StyledTableCell>{booking.startTime}</StyledTableCell>
                  <StyledTableCell>{booking.classType}</StyledTableCell>
                  <StyledTableCell>{booking.studentName}</StyledTableCell>
                  <StyledTableCell>{booking.instrument}</StyledTableCell>
                  <StyledTableCell>{booking.teacherName}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction={"row"} justifyContent={"flex-end"} paddingY={2}>
          <Link href={`/app/booking?roomId=${roomId}`} sx={{ textDecoration: "none" }} fontSize={14}>
            See More ...
          </Link>
        </Stack>
      </Box>
    ));
  }

  function comparator(a, b) {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  }

  const columns = [
    { type: "string", id: "Ruang Kelas" },
    { type: "string", id: "Nama Murid" },
    { type: "date", id: "Start Booking" },
    { type: "date", id: "End Booking" },
  ];

  const data = [columns, ...[...bookings, ...unusedRoom].sort(comparator)];

  return (
    <Page title="Dashboard">
      <PageHeader
        title="Dashboard"
        rightContent={
          <Stack direction={"row"} spacing={2}>
            <Button variant="outlined" component={RouterLink} to="/app/dashboard/teachers">
              TEACHERS
            </Button>
            <Button variant="outlined" component={RouterLink} to="/app/dashboard/timeline">
              ROOM
            </Button>
            <Button variant="contained">BOOKING</Button>
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
                    if (!isValid(e.target.value)) return false;
                    return SubmitFilter({ tgl_kelas: format(e.target.value, "yyyy-MM-dd") });
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        {!isLoadingBookings && bookings.length ? (
          <Chart chartType="Timeline" data={data} width="100%" height="850px" />
        ) : null}
        {renderContent()}
      </Container>
    </Page>
  );
}
