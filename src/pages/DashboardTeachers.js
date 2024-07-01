import { useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { format, parse, sub, isValid } from "date-fns";
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
  Grid,
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
import { queryKey } from "../constants/queryKey";
import Page from "../components/Page";
// sections
import PageHeader from "../components/PageHeader";
import AutoCompleteBasic from "../components/input/autoCompleteBasic";
import DateInputBasic from "../components/input/dateInputBasic";
import { urlSearchParamsToQuery } from "../utils/urlSearchParamsToQuery";
import { cleanQuery } from "../utils/cleanQuery";
import { queryToString } from "../utils/queryToString";
import { fetchHeader } from "../constants/fetchHeader";
import DashboardNav from "./dashboard/dashboardNav";

const initFilter = {
  teacherId: 1,
  teacherLabel: "Adi Nugroho",
  tglAwal: format(sub(new Date(), { months: 1 }), "yyyy-MM-dd"),
  tglAkhir: format(new Date(), "yyyy-MM-dd"),
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
  const [openTeacher, setOpenTeacher] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);

  setDefaultOptions({ locale: id });

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

  const defaultQueryDashboard = {
    teacherId: initFilter.teacherId,
    tglAwal: initFilter.tglAwal,
    tglAkhir: initFilter.tglAkhir,
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
      enabled: openTeacher,
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

  const SubmitFilter = (filter) => {
    setFilters((prevState) => ({ ...prevState, ...filter }));
    setSearchParams({ ...filters, ...filter });
  };

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
    downloadExcel({
      fileName: `${filters.teacherLabel}-${filters.tglAwal}-${filters.tglAkhir}`,
      sheet: `${filters.tglAwal}-${filters.tglAkhir}`,
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
                    if (!newValue?.value) return;
                    SubmitFilter({
                      teacherId: newValue?.value || initFilter.teacherId,
                      teacherLabel: newValue?.label || initFilter.teacherLabel,
                    });
                  }}
                  options={teachers}
                  loading={isLoadingTeachers}
                  value={{
                    value: filters.teacherId || initFilter.teacherId,
                    label: filters.teacherLabel || initFilter.teacherLabel,
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <DateInputBasic
                  disableValidation
                  id="tglAwal"
                  name="tglAwal"
                  label="Tanggal Awal"
                  value={parse(filters.tglAwal, "yyyy-MM-dd", new Date())}
                  onChange={(e) => {
                    if (!isValid(e.target.value)) return false;
                    return SubmitFilter({ tglAwal: format(e.target.value, "yyyy-MM-dd") });
                  }}
                  maxDate={parse(filters.tglAkhir, "yyyy-MM-dd", new Date())}
                />
              </Grid>
              <Grid item xs={4}>
                <DateInputBasic
                  disableValidation
                  id="tglAkhir"
                  name="tglAkhir"
                  label="Tanggal Akhir"
                  value={parse(filters.tglAkhir, "yyyy-MM-dd", new Date())}
                  onChange={(e) => {
                    if (!isValid(e.target.value)) return false;
                    return SubmitFilter({ tglAkhir: format(e.target.value, "yyyy-MM-dd") });
                  }}
                  minDate={parse(filters.tglAwal, "yyyy-MM-dd", new Date())}
                />
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
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
