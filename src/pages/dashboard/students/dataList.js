import React, { useEffect, useState } from "react";
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
  Button,
  Stack,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { useSearchParams, Link } from "react-router-dom";

import { useGetQuotaStudents } from "../../students/query";
import { urlSearchParamsToQuery } from "../../../utils/urlSearchParamsToQuery";
import { queryToString } from "../../../utils/queryToString";
import Iconify from "../../../components/Iconify";
import { initQuery } from "./constant";
import { DashboardStudentModal } from "./studentModal";

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

const buttonSortStyle = {
  minWidth: 0,
  padding: 0,
  fontSize: "16px",
  color: "white",
  ":hover": {
    bgcolor: "transparent",
  },
};

export default function DashboardStudentsData() {
  const [isOpenStudentModal, setIsOpenStudentModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = { ...initQuery, ...urlSearchParamsToQuery(searchParams) };
  const studentId = Number(queryParam?.studentId) || null;
  delete queryParam.studentId;

  const {
    data: students = [],
    isLoading,
    isError,
  } = useGetQuotaStudents({
    queryParam,
  });

  useEffect(() => {
    if (studentId) {
      setIsOpenStudentModal(true);
    }
  }, [studentId]);

  const onClickStudent = (id) => {
    delete queryParam.studentId;
    setSearchParams({ ...queryParam, studentId: id });
  };

  const onCloseStudentModal = () => {
    delete queryParam.studentId;
    setSearchParams({ ...queryParam });
    setIsOpenStudentModal(false);
  };

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error Loading Data</>;
  if (students.data.length === 0) return <>No Data Found</>;

  return (
    <>
      <Box paddingBottom={"20px"}>
        <TableContainer component={Paper} sx={{ marginBottom: "20px" }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nama Murid</StyledTableCell>
                <StyledTableCell align="right">Quota Priv.</StyledTableCell>
                <StyledTableCell align="right">Quota Group</StyledTableCell>
                <StyledTableCell align="right">Taken Priv.</StyledTableCell>
                <StyledTableCell align="right">Taken Group</StyledTableCell>
                <StyledTableCell align="right">
                  <Stack direction={"row"} gap={"5px"} justifyContent={"flex-end"}>
                    <Button
                      sx={buttonSortStyle}
                      disabled={queryParam.sort === "ASC" && queryParam.sort_by === "privateQuotaLeft"}
                      onClick={() => {
                        setSearchParams({ ...queryParam, sort: "ASC", sort_by: "privateQuotaLeft", page: 1 });
                      }}
                    >
                      <Iconify icon="octicon:sort-asc-16" />
                    </Button>
                    <Button
                      sx={buttonSortStyle}
                      onClick={() => {
                        setSearchParams({ ...queryParam, sort: "DESC", sort_by: "privateQuotaLeft", page: 1 });
                      }}
                      disabled={queryParam.sort === "DESC" && queryParam.sort_by === "privateQuotaLeft"}
                    >
                      <Iconify icon="octicon:sort-desc-16" />
                    </Button>
                    <span>Sisa Priv.</span>
                  </Stack>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Stack direction={"row"} gap={"5px"} justifyContent={"flex-end"}>
                    <Button
                      sx={buttonSortStyle}
                      disabled={queryParam.sort === "ASC" && queryParam.sort_by === "groupQuotaLeft"}
                      onClick={() => {
                        setSearchParams({ ...queryParam, sort: "ASC", sort_by: "groupQuotaLeft", page: 1 });
                      }}
                    >
                      <Iconify icon="octicon:sort-asc-16" />
                    </Button>
                    <Button
                      sx={buttonSortStyle}
                      onClick={() => {
                        setSearchParams({ ...queryParam, sort: "DESC", sort_by: "groupQuotaLeft", page: 1 });
                      }}
                      disabled={queryParam.sort === "DESC" && queryParam.sort_by === "groupQuotaLeft"}
                    >
                      <Iconify icon="octicon:sort-desc-16" />
                    </Button>
                    <span>Sisa Group</span>
                  </Stack>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.data.length ? (
                students.data.map((summary) => (
                  <StyledTableRow key={summary.studentId}>
                    <StyledTableCell component="th" scope="row">
                      <Button
                        variant="text"
                        onClick={() => onClickStudent(summary.studentId)}
                        sx={{ fontSize: "14px", padding: "0 5px" }}
                      >
                        {summary.studentName}
                      </Button>
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

      {studentId ? (
        <DashboardStudentModal open={isOpenStudentModal} onClose={onCloseStudentModal} studentId={studentId} />
      ) : null}
    </>
  );
}
