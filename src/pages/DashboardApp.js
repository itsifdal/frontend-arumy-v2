import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { format, parse } from "date-fns";
import axios from "axios";
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

const initFilter = {
  tgl_kelas: format(new Date(), "yyyy-MM-dd"),
};

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const navigate = useNavigate();
  const [foundUser, setFoundUser] = useState();
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
    refetchBooking();
  }, [searchParams, refetchBooking]);

  if (!foundUser || foundUser === undefined) {
    navigate("/login", { replace: true });
  }

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
          <Link href={`/dashboard/booking?roomId=${roomId}`} sx={{ textDecoration: "none" }} fontSize={14}>
            See More ...
          </Link>
        </Stack>
      </Box>
    ));
  }

  return (
    <Page title="Dashboard">
      <PageHeader
        title="Dashboard"
        rightContent={
          <Stack direction={"row"} spacing={2}>
            <Button variant="contained">ROOM</Button>
            <Button variant="outlined">TEACHER</Button>
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
