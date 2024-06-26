import { useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import setDefaultOptions from "date-fns/setDefaultOptions";
import axios from "axios";
import id from "date-fns/locale/id";
import { downloadExcel } from "react-export-table-to-excel";
// material
import {
  Chip,
  Link,
  Stack,
  Button,
  Container,
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Tooltip,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
// components
import { queryKey } from "../../../constants/queryKey";
import Page from "../../../components/Page";
// sections
import PageHeader from "../../../components/PageHeader";
import { urlSearchParamsToQuery } from "../../../utils/urlSearchParamsToQuery";
import { cleanQuery } from "../../../utils/cleanQuery";
import { queryToString } from "../../../utils/queryToString";
import { fetchHeader } from "../../../constants/fetchHeader";
import DashboardNav from "../dashboardNav";
import DashboardTeachersFilterBarDas from "./filterBar";
import { getTerm } from "../../../utils/getTerm";

const initFilter = {
  teacherId: 1,
  teacherLabel: "Adi Nugroho",
  term: getTerm(new Date()) + 1,
  termYear: new Date().getFullYear(),
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// ----------------------------------------------------------------------

export default function DashboardTeachers() {
  const [filters, setFilters] = useState(initFilter);

  const [searchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);

  setDefaultOptions({ locale: id });

  const defaultQueryDashboard = {
    teacherId: initFilter.teacherId,
    term: initFilter.term,
    termYear: initFilter.termYear,
    ...queryParam,
  };

  const {
    data: teacherSummary = [],
    isLoading: isLoadingTeacherSummary,
    refetch: refetchTeacherSummary,
  } = useQuery(
    [queryKey.teachers, "DASHBOARD", cleanQuery(defaultQueryDashboard)],
    () =>
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/api/teacher/dashboard/${defaultQueryDashboard.teacherId}${queryToString(
            defaultQueryDashboard
          )}`,
          {
            headers: fetchHeader,
          }
        )
        .then((res) => res.data),
    {
      select: (summaries) =>
        summaries.data?.map((summary) => ({
          id: summary.studentId,
          studentName: summary.studentName,
          privateDuration: summary.privateDuration,
          groupDuration: summary.groupDuration,
          privateIjinCount: summary.privateIjinCount,
          privateExpiredCount: summary.privateExpiredCount,
          privatePendingCount: summary.privatePendingCount,
          groupIjinCount: summary.groupIjinCount,
          groupExpiredCount: summary.groupExpiredCount,
          groupPendingCount: summary.groupPendingCount,
        })),
    }
  );

  // GET DATA BOOKING ALL
  const defaultQueryBookings = {
    ...defaultQueryDashboard,
    dateFrom: defaultQueryDashboard.tglAwal,
    dateTo: defaultQueryDashboard.tglAkhir,
    sort: "asc",
    sort_by: "tgl_kelas",
    perPage: 9999,
    page: 1,
  };
  const { refetch: refetchBookings } = useQuery(
    [
      queryKey.downloadBooking,
      cleanQuery({
        ...defaultQueryBookings,
      }),
    ],
    () =>
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/api/booking${queryToString({
            ...defaultQueryBookings,
          })}`,
          {
            headers: fetchHeader,
          }
        )
        .then((res) => res.data),
    {
      enabled: false,
      onSuccess: (bookings) => {
        if (bookings?.data?.length) {
          const exportedTeacherBookings = bookings.data.map((booking) => ({
            "Tanggal kelas": booking.tgl_kelas,
            "Jam mulai": booking.jam_booking,
            "Jam selesai": booking.selesai,
            "Ruang kelas": booking.room?.nama_ruang,
            "Nama murid": JSON.parse(booking.user_group)
              .map((student) => student.nama_murid)
              .join(", "),
            "Nama pengajar": booking.teacher?.nama_pengajar,
            "Durasi (menit)": booking.durasi,
            Status: booking.status,
            Notes: booking.notes || "-",
          }));
          downloadExcel({
            fileName: `Booking-${Date.now()}`,
            sheet: queryParam ? JSON.stringify(queryParam).replace('"', "").replace(",", " ").replace(":", "-") : "All",
            tablePayload: {
              header: Object.keys(exportedTeacherBookings[0]),
              body: exportedTeacherBookings,
            },
          });
        }
      },
    }
  );

  useEffect(() => {
    // use this for escape infinite loop
    setFilters((prevState) => ({ ...prevState, ...urlSearchParamsToQuery(searchParams) }));
    refetchTeacherSummary();
  }, [searchParams, refetchTeacherSummary]);

  const handleDownloadExcel = () => {
    const exportedTeacherSummary = teacherSummary.map((summary) => ({
      "Nama Murid": summary.studentName,
      "Durasi Private": summary.privateDuration,
      "Sesi Group": summary.groupDuration,
      "Booking Private Ijin": summary.privateIjinCount,
      "Booking Private Pending": summary.privatePendingCount,
      "Booking Private Kadaluarsa": summary.privateExpiredCount,
      "Booking Group Ijin": summary.groupIjinCount,
      "Booking Group Pending": summary.groupPendingCount,
      "Booking Group Kadaluarsa": summary.groupExpiredCount,
    }));
    const sheet =
      filters.term && filters.termYear
        ? `${filters.term}-${filters.termYear}`
        : `${filters.tglAwal}-${filters.tglAkhir}`;
    const fileName = `${filters.teacherLabel}-${sheet}`;
    downloadExcel({
      fileName,
      sheet,
      tablePayload: {
        header: Object.keys(exportedTeacherSummary[0]),
        body: exportedTeacherSummary,
      },
    });
  };

  const handleDownloadDetailExcel = () => {
    refetchBookings();
  };

  return (
    <Page title="Dashboard">
      <PageHeader title="Dashboard" rightContent={<DashboardNav active="teachers" />} />
      <DashboardTeachersFilterBarDas />
      <Container maxWidth="xl" sx={{ padding: 4 }}>
        <Stack direction={"row"} gap={4} alignItems={"center"} marginBottom={2} justifyContent={"space-between"}>
          <Typography as="h1" fontWeight={"bold"} fontSize={"20px"}>
            {filters.teacherLabel || initFilter.teacherLabel}
          </Typography>
          <Link
            href={`/app/booking?teacherId=${filters.teacherId || initFilter.teacherId}`}
            sx={{ textDecoration: "none" }}
            fontSize={14}
          >
            View All
          </Link>
          <Box flexGrow={1} flexShrink={1} />
          <Button onClick={handleDownloadDetailExcel} variant="contained">
            Export Detail Excel
          </Button>
          <Button onClick={handleDownloadExcel} variant="contained">
            Export Excel
          </Button>
        </Stack>
        {!isLoadingTeacherSummary ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Nama Murid</StyledTableCell>
                  <StyledTableCell align="right">Durasi Private</StyledTableCell>
                  <StyledTableCell align="right">Sesi Group</StyledTableCell>
                  <StyledTableCell align="right">Sisa Private</StyledTableCell>
                  <StyledTableCell align="right">Sisa Group</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teacherSummary.length ? (
                  teacherSummary.map((summary) => (
                    <StyledTableRow key={summary.id}>
                      <StyledTableCell component="th" scope="row">
                        {summary.studentName}
                      </StyledTableCell>
                      <StyledTableCell align="right">{summary.privateDuration} menit</StyledTableCell>
                      <StyledTableCell align="right">
                        {summary.groupDuration / 60} ({summary.groupDuration} menit)
                      </StyledTableCell>
                      <StyledTableCell width={"100px"}>
                        <Stack direction={"row"} gap={1} width={"auto"} justifyContent={"flex-end"}>
                          <Tooltip title={`${summary.privateIjinCount} booking private ijin`}>
                            <Chip label={`${summary.privateIjinCount}`} color="primary" />
                          </Tooltip>
                          <Tooltip title={`${summary.privateExpiredCount} booking private expired`}>
                            <Chip label={`${summary.privateExpiredCount}`} color="secondary" />
                          </Tooltip>
                          <Tooltip title={`${summary.privatePendingCount} booking private pending`}>
                            <Chip label={`${summary.privatePendingCount}`} color="warning" />
                          </Tooltip>
                        </Stack>
                      </StyledTableCell>
                      <StyledTableCell width={"100px"}>
                        <Stack direction={"row"} gap={1} width={"auto"} justifyContent={"flex-end"}>
                          <Tooltip title={`${summary.groupIjinCount} booking group ijin`}>
                            <Chip label={`${summary.groupIjinCount}`} color="primary" />
                          </Tooltip>
                          <Tooltip title={`${summary.groupExpiredCount} booking group expired`}>
                            <Chip label={`${summary.groupExpiredCount}`} color="secondary" />
                          </Tooltip>
                          <Tooltip title={`${summary.groupPendingCount} booking group pending`}>
                            <Chip label={`${summary.groupPendingCount}`} color="warning" />
                          </Tooltip>
                        </Stack>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell align="center" colSpan={3}>
                      Data tidak ditemukan
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </Container>
    </Page>
  );
}
