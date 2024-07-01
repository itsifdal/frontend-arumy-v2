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
import { styled } from "@mui/material/styles";
import { NumericFormat } from "react-number-format";
import { format } from "date-fns";

import { urlSearchParamsToQuery } from "../../../utils/urlSearchParamsToQuery";
import { useGetPayments } from "../../payments/query";

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

export const DashboardStudentPayment = ({ enable }) => {
  const [paymentPage, setPaymentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  const studentId = Number(queryParam?.studentId) || null;

  // GET DATA BOOKING ALL
  const { data: payments, isLoading: isLoadingPayments } = useGetPayments({
    queryParam: {
      dateFrom: queryParam.dateFrom,
      dateTo: queryParam.dateTo,
      studentId,
      page: paymentPage,
      sort: "DESC",
      sort_by: "tgl_bayar",
    },
    options: {
      enable,
      select: (res) => ({
        data: res.data.map((packet) => ({
          id: packet.id,
          studentName: packet.student?.nama_murid,
          paketName: packet.paket?.nama_paket,
          paymentDate: format(new Date(packet.tgl_bayar), "dd-MM-yyyy"),
          totalPaid: packet.jumlah_bayar,
          receiptNumber: packet.receipt_number,
        })),
        pagination: res.pagination,
      }),
    },
  });

  const tableHeader = ["NAMA MURID", "NAMA PAKET", "TANGGAL BAYAR", "NOMOR INVOICE", "JUMLAH BAYAR"];
  const tableBody = payments?.data
    ? payments.data?.map((payment) => [
        payment.studentName,
        payment.paketName,
        payment.paymentDate,
        payment.receiptNumber,
        <NumericFormat
          prefix={"Rp"}
          key={payment.id}
          displayType="text"
          value={payment.totalPaid}
          thousandSeparator="."
          decimalSeparator=","
        />,
      ])
    : [];

  if (isLoadingPayments) return <Typography>Loading data...</Typography>;
  if (!payments) return <Typography>Error load data</Typography>;
  if (!payments.data?.length) return <Typography>No data</Typography>;

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
        page={payments.pagination.current_page}
        count={payments.pagination.total_pages}
        shape="rounded"
        sx={[{ ul: { justifyContent: "center" } }]}
        onChange={(_, page) => setPaymentPage(page)}
      />
    </>
  );
};

DashboardStudentPayment.propTypes = {
  enable: PropTypes.bool,
};
