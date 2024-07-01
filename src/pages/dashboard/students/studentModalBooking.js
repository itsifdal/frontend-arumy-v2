import React, { useState } from "react";
import {
  Paper,
  Typography,
  Pagination,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import { format, parse } from "date-fns";
import { styled } from "@mui/material/styles";

import { urlSearchParamsToQuery } from "../../../utils/urlSearchParamsToQuery";
import { useGetBookings } from "../../bookings/query";
import { generateStatus } from "../../bookings/utils";

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

export const DashboardStudentBooking = ({ enable }) => {
  const [bookingPage, setBookingPage] = useState(1);
  const [searchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  const studentId = Number(queryParam?.studentId) || null;

  // GET DATA BOOKING ALL
  const { data: bookings, isLoading: isLoadingBookings } = useGetBookings({
    queryParam: {
      dateFrom: queryParam.dateFrom,
      dateTo: queryParam.dateTo,
      studentId,
      page: bookingPage,
      sort: "DESC",
      sort_by: "tgl_kelas",
    },
    options: {
      enable,
    },
  });

  const tableHeader = ["TGL KELAS", "TIPE KELAS", "RUANG KELAS", "DURASI", "PENGAJAR", "STATUS"];
  const tableBody = bookings?.data
    ? bookings.data?.map((booking) => [
        format(parse(booking.tgl_kelas, "yyyy-MM-dd", new Date()), "dd-MM-yyyy"),
        JSON.parse(booking.user_group).length > 1 ? "Group" : "Private",
        booking.room.nama_ruang,
        `${booking.durasi} menit`,
        booking.teacher.nama_pengajar,
        generateStatus({ status: booking.status }),
      ])
    : [];

  if (isLoadingBookings) return <Typography>Loading data...</Typography>;
  if (!bookings) return <Typography>Error load data</Typography>;
  if (!bookings.data?.length) return <Typography>No data</Typography>;

  return (
    <>
      <TableContainer component={Paper} sx={{ minWidth: 800, marginBottom: "20px" }}>
        <Table
          size="small"
          sx={{
            paddingBottom: "15px",
            borderCollapse: "separate",
          }}
        >
          <TableHead>
            <TableRow>
              {tableHeader.map((head, index) => (
                <StyledTableCell key={index}>{head}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableBody.map((items, index) => (
              <StyledTableRow key={index}>
                {items && items.map((item, id) => <StyledTableCell key={id}>{item}</StyledTableCell>)}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        page={bookings.pagination.current_page}
        count={bookings.pagination.total_pages}
        shape="rounded"
        sx={[{ ul: { justifyContent: "center" } }]}
        onChange={(_, page) => setBookingPage(page)}
      />
    </>
  );
};

DashboardStudentBooking.propTypes = {
  enable: PropTypes.bool,
};
