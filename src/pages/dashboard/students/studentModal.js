import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";

import { urlSearchParamsToQuery } from "../../../utils/urlSearchParamsToQuery";
import { modalStyle } from "../../../constants/modalStyle";
import { DashboardStudentBooking } from "./studentModalBooking";
import { DashboardStudentPayment } from "./studentModalPayment";
import { useGetStudent } from "../../students/query";

export const DashboardStudentModal = ({ open, onClose }) => {
  const [searchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  const studentId = Number(queryParam?.studentId) || null;

  const { data: student, isLoading: isLoadingStudent } = useGetStudent({ id: studentId });

  if (!studentId) return false;
  if (isLoadingStudent) return <Typography>Loading data...</Typography>;
  if (!student) return <Typography>Error load data</Typography>;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-create-booking"
      aria-describedby="modal-for-create-booking"
      disableEnforceFocus
    >
      <Box sx={{ ...modalStyle, maxWidth: 1000 }}>
        <Typography sx={{ fontWeight: "bold", marginBottom: "10px" }}>Booking Murid: {student.nama_murid}</Typography>
        <DashboardStudentBooking enable={open} />
        <Box paddingBottom={5} />
        <Typography sx={{ fontWeight: "bold", marginBottom: "10px" }}>Payment Murid: {student.nama_murid} </Typography>
        <DashboardStudentPayment enable={open} />
      </Box>
    </Modal>
  );
};

DashboardStudentModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
