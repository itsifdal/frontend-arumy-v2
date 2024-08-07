import { useSearchParams } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import { useQuery } from "react-query";
import { format, parse, isValid } from "date-fns";
import axios from "axios";
import { Chart } from "react-google-charts";
import { ToastContainer, toast } from "react-toastify";
// material
import {
  Link,
  Table,
  Stack,
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
import CardsBooking from "../components/CardBooking";
import DateInputBasic from "../components/input/dateInputBasic";
import ConfirmBooking from "../components/modal/confirmBooking";
import { urlSearchParamsToQuery } from "../utils/urlSearchParamsToQuery";
import { queryToString } from "../utils/queryToString";
import { cleanQuery } from "../utils/cleanQuery";
import { mapRoomChart } from "../utils/map/roomChart";
import { fetchHeader } from "../constants/fetchHeader";
import DashboardNav from "./dashboard/dashboardNav";

const initFilter = {
  tgl_kelas: format(new Date(), "yyyy-MM-dd"),
  sort: "asc",
  sort_by: "tgl_kelas",
};

// ----------------------------------------------------------------------

export default function Dashboard() {
  const [user, setUser] = useState("");
  const [isTeacher, setIsTeacher] = useState("");
  const [filters, setFilters] = useState(initFilter);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  const [openUpdStatus, setOpenUpdStatus] = useState(false);
  const [bookingId, setBookingId] = useState();

  // localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
      setIsTeacher(foundUser.role === "Guru");
    }
  }, []);

  const {
    data: dashboard,
    isLoading: isLoadingDashboard,
    refetch: refetchBooking,
    isError: isErrorDashboard,
  } = useQuery(
    [queryKey.dashboard, cleanQuery(queryParam)],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/dashboard/booking${queryToString(queryParam)}`, {
          headers: fetchHeader,
        })
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
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/room`, {
          headers: fetchHeader,
        })
        .then((res) => res.data),
    {
      select: (roomList) => roomList.map((room) => ({ label: room?.nama_ruang })),
    }
  );

  const defaultQueryBooking = {
    ...initFilter,
    ...queryParam,
    perPage: 9999,
    ...(isTeacher && { teacherId: user.teacherId }),
  };

  const {
    data: bookings = [],
    isLoading: isLoadingBookings,
    refetch: refetchBookings,
  } = useQuery(
    [queryKey.bookings, cleanQuery(defaultQueryBooking)],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/booking${queryToString(defaultQueryBooking)}`, {
          headers: fetchHeader,
        })
        .then((res) => res.data),
    {
      select: (bookingList) => bookingList.data,
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
        if (!mapRoomChart(bookings).find((book) => book[0] === room.label)) {
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

  const SubmitFilter = (filter) => {
    setFilters((prevState) => ({ ...prevState, ...filter }));
    setSearchParams({ ...filters, ...filter });
  };

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

  const data = [columns, ...[...mapRoomChart(bookings), ...unusedRoom].sort(comparator)];

  const handleOpenModalUpdateStatus = (e) => {
    setBookingId(e.target.getAttribute("data-id"));
    setOpenUpdStatus(true);
  };
  const handleCloseModalUpdateStatus = () => setOpenUpdStatus(false);
  const onSuccessMutateBooking = (response) => {
    setOpenUpdStatus(false);
    refetchBookings();
    toast.success(response.data.message, {
      position: "top-center",
      autoClose: 5000,
      theme: "colored",
    });
  };

  const onErrorMutateBooking = (error) => {
    if (error) {
      toast.error(error.response?.data?.message || "Booking Error", {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  return (
    <Page title="Dashboard">
      <PageHeader title="Dashboard" rightContent={<DashboardNav active="bookings" />} />
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
              <Grid item xs={12} sm={6} md={4}>
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
        <ToastContainer pauseOnFocusLoss={false} />
        {!isLoadingBookings && bookings.length && !isTeacher ? (
          <Chart chartType="Timeline" data={data} width="100%" height="930px" />
        ) : null}
        {renderContent({
          isErrorDashboard,
          isLoadingDashboard,
          isTeacher,
          dashboard,
          bookings,
          handleOpenModalUpdateStatus,
        })}
      </Container>
      <ConfirmBooking
        open={openUpdStatus}
        onClose={handleCloseModalUpdateStatus}
        id={Number(bookingId)}
        callbackSuccess={(response) => {
          onSuccessMutateBooking(response);
        }}
        callbackError={(error) => {
          onErrorMutateBooking(error);
        }}
        userId={user.id}
      />
    </Page>
  );
}

function renderContent({
  isErrorDashboard,
  isLoadingDashboard,
  isTeacher,
  dashboard,
  bookings,
  handleOpenModalUpdateStatus,
}) {
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

  if (isLoadingDashboard) return <Typography>Loading Data</Typography>;
  if (isErrorDashboard) return <Typography>Error Data</Typography>;
  if ((isTeacher && !bookings.length) || (!isTeacher && !dashboard.length))
    return <Typography>No Data Found</Typography>;

  if (isTeacher) {
    return (
      <Grid container spacing="11px">
        <CardsBooking bookings={bookings} onClickConfirm={handleOpenModalUpdateStatus} />
      </Grid>
    );
  }

  return dashboard.map(({ roomName, roomId, bookings }) => (
    <Box key={roomId}>
      <Typography marginBottom={2} fontWeight={"700"}>
        {roomName}
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: "3px 4px 20px 0px rgba(0, 0, 0, 0.10)", background: "white" }}>
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
