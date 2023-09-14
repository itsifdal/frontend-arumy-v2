import { Link as RouterLink, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import setDefaultOptions from "date-fns/setDefaultOptions";
import axios from "axios";
import id from "date-fns/locale/id";
// material
import {
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
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
// components
import { queryKey } from "../constants/queryKey";
import Page from "../components/Page";
// sections
import PageHeader from "../components/PageHeader";
import AutoCompleteBasic from "../components/input/autoCompleteBasic";
import { urlSearchParamsToQuery } from "../utils/urlSearchParamsToQuery";
import { cleanQuery } from "../utils/cleanQuery";

const initFilter = {
  teacherId: 1,
  teacherLabel: "Adi Nugroho",
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
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/teacher?perPage=9999`).then((res) => res.data),
    {
      select: (teachers) => teachers.data?.map((teacher) => ({ value: teacher.id, label: teacher.nama_pengajar })),
      enabled: openTeacher,
    }
  );

  const defaultQueryBooking = {
    teacherId: initFilter.teacherId,
    ...queryParam,
  };

  const {
    data: teacherSummary = [],
    isLoading: isLoadingTeacherSummary,
    refetch: refetchTeacherSummary,
  } = useQuery(
    [queryKey.teachers, "DASHBOARD", cleanQuery(defaultQueryBooking)],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/teacher/dashboard/${defaultQueryBooking.teacherId}`)
        .then((res) => res.data),
    {
      select: (summaries) => summaries.data?.map((summary) => ({ ...summary })),
      enabled: openTeacher,
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

  return (
    <Page title="Dashboard">
      <PageHeader
        title="Dashboard"
        rightContent={
          <Stack direction={"row"} spacing={2}>
            <Button variant="contained">TEACHERS</Button>
            <Button variant="outlined" component={RouterLink} to="/app/dashboard/timeline">
              ROOM
            </Button>
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
            </Grid>
          </Stack>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ padding: 4 }}>
        <Stack direction={"row"} gap={4} alignItems={"center"} marginBottom={2}>
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
        </Stack>
        {!isLoadingTeacherSummary ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Nama Murid</StyledTableCell>
                  <StyledTableCell align="right">Durasi Private</StyledTableCell>
                  <StyledTableCell align="right">Durasi Group</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teacherSummary.length ? (
                  teacherSummary.map((summary) => (
                    <StyledTableRow key={summary.studentId}>
                      <StyledTableCell component="th" scope="row">
                        {summary.studentName}
                      </StyledTableCell>
                      <StyledTableCell align="right">{summary.privateDuration} menit</StyledTableCell>
                      <StyledTableCell align="right">{summary.groupCount}</StyledTableCell>
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
