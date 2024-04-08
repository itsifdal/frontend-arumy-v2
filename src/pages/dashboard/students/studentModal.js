import React from "react";
import { Modal, Box } from "@mui/material";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import { format, parse } from "date-fns";

import { modalStyle } from "../../../constants/modalStyle";
import { urlSearchParamsToQuery } from "../../../utils/urlSearchParamsToQuery";
import { useGetBookings } from "../../bookings/query";
import BasicTable from "../../../components/BasicTable";
import { hourModel, studentModel, generateStatus } from "../../bookings/utils";

export const DashboardStudentModal = ({ open, onClose, studentId }) => {
  const [searchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);

  // GET DATA BOOKING ALL
  const {
    data: bookings,
    isLoading: isLoadingBookings,
    refetch: refetchBookings,
  } = useGetBookings({
    queryParam: { dateFrom: queryParam.dateFrom, dateTo: queryParam.dateTo, studentId },
    options: {
      enable: open,
    },
  });
  console.log("bookings", bookings);

  const tableHeader = ["TGL KELAS", "JAM BOOKING", "RUANG KELAS", "MURID", "PENGAJAR", "STATUS"];
  const tableBody = bookings?.data
    ? bookings.data?.map((booking) => [
        format(parse(booking.tgl_kelas, "yyyy-MM-dd", new Date()), "dd-MM-yyyy"),
        hourModel({ timeStart: booking.jam_booking, timeEnd: booking.selesai, duration: booking.durasi }),
        booking.room.nama_ruang,
        studentModel({ students: booking.user_group }),
        booking.teacher.nama_pengajar,
        generateStatus({ status: booking.status }),
      ])
    : [];

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-create-booking"
        aria-describedby="modal-for-create-booking"
        disableEnforceFocus
      >
        <Box sx={{ ...modalStyle, maxWidth: 800 }}>Student Modal {studentId}</Box>

        {/* <BasicTable header={tableHeader} body={tableBody} /> */}
      </Modal>
    </>
  );
};

DashboardStudentModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  studentId: PropTypes.number,
};
