import React from "react";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Pagination,
  PaginationItem,
  Box,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { useSearchParams, Link } from "react-router-dom";
import { format, sub } from "date-fns";

import { useGetQuotaStudents } from "../../students/query";
import { urlSearchParamsToQuery } from "../../../utils/urlSearchParamsToQuery";
import { queryToString } from "../../../utils/queryToString";

// ----------------------------------------------------------------------

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

const initQuery = {
  sort: "DESC",
  sort_by: "privateQuotaLeft",
  dateFrom: format(sub(new Date(), { months: 1 }), "yyyy-MM-dd"),
  dateTo: format(new Date(), "yyyy-MM-dd"),
};

export default function DashboardStudentsData() {
  const [searchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);

  const {
    data: students = [],
    isLoading,
    isError,
  } = useGetQuotaStudents({
    queryParam: { ...initQuery, ...queryParam },
  });

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error Loading Data</>;
  if (students.data.length === 0) return <>No Data Found</>;

  return (
    <Box paddingBottom={"20px"}>
      <TableContainer component={Paper} sx={{ marginBottom: "20px" }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Nama Murid</StyledTableCell>
              <StyledTableCell align="right">Quota Private</StyledTableCell>
              <StyledTableCell align="right">Quota Group</StyledTableCell>
              <StyledTableCell align="right">Taken Private</StyledTableCell>
              <StyledTableCell align="right">Taken Group</StyledTableCell>
              <StyledTableCell align="right">Remaining Private</StyledTableCell>
              <StyledTableCell align="right">Remaining Group</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.data.length ? (
              students.data.map((summary) => (
                <StyledTableRow key={summary.studentId}>
                  <StyledTableCell component="th" scope="row">
                    {summary.studentName}
                  </StyledTableCell>
                  <StyledTableCell align="right">{summary.privateQuotaTotal || 0}</StyledTableCell>
                  <StyledTableCell align="right">{summary.groupQuotaTotal || 0}</StyledTableCell>
                  <StyledTableCell align="right">{summary.privateQuotaUsed || 0}</StyledTableCell>
                  <StyledTableCell align="right">{summary.groupQuotaUsed || 0}</StyledTableCell>
                  <StyledTableCell align="right">{summary.privateQuotaLeft || 0}</StyledTableCell>
                  <StyledTableCell align="right">{summary.groupQuotaLeft || 0}</StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell align="center" colSpan={7}>
                  Data tidak ditemukan
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        page={students.pagination.current_page}
        count={students.pagination.total_pages}
        shape="rounded"
        sx={[{ ul: { justifyContent: "center" } }]}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`/app/dashboard/students${queryToString({
              ...queryParam,
              page: item.page === 1 ? null : item.page,
            })}`}
            {...item}
          />
        )}
      />
    </Box>
  );
}
