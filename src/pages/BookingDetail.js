/* eslint-disable camelcase */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Stack, Button, Typography, Box, Grid, Avatar, Chip, IconButton } from "@mui/material";
import { format, parse } from "date-fns";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import Page from "../components/Page";
import PageHeader from "../components/PageHeader";
import { stringAvatar } from "../utils/avatarProps";
import Iconify from "../components/Iconify";
import { bookingStatusObj } from "../constants/bookingStatus";
import { queryKey } from "../constants/queryKey";
import ConfirmBooking from "../components/modal/confirmBooking";

// ----------------------------------------------------------------------
const generateStatus = (status) => {
  if (status) {
    return (
      <Chip
        size="small"
        sx={{ fontSize: "12px", height: "auto" }}
        label={bookingStatusObj[status].label}
        color={bookingStatusObj[status].color}
      />
    );
  }
  return <></>;
};

export default function BookingDetail() {
  const navigate = useNavigate();

  return (
    <Page title="Booking">
      <PageHeader
        title="Bookings"
        leftContent={
          <IconButton aria-label="back" onClick={() => navigate(-1)}>
            <Iconify icon="ph:arrow-left-bold" sx={{ width: "20px", height: "20px" }} />
          </IconButton>
        }
      />
      <Box p={2}>
        <BookingData />
      </Box>
    </Page>
  );
}

function BookingData() {
  const { id } = useParams();
  const [user, setUser] = useState("");
  const queryClient = useQueryClient();
  const [openUpdStatus, setOpenUpdStatus] = useState(false);
  const {
    data: booking,
    isLoading,
    isError,
    refetch: refetchBooking,
  } = useQuery(
    [queryKey.bookings, "DETAIL", id],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/booking/${id}`).then((res) => res.data?.data),
    {
      enabled: Boolean(id),
    }
  );

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  if (isLoading) return <Typography>Loading data...</Typography>;
  if (isError) return <Typography>Error data</Typography>;

  const bookingDetail = [
    {
      label: "DATE",
      value: <strong>{format(parse(booking.tgl_kelas, "yyyy-MM-dd", new Date()), "MMMM dd, yyyy")}</strong>,
    },
    { label: "BRANCH", value: booking.cabang },
    { label: "START", value: format(parse(booking.jam_booking, "HH:mm:ss", new Date()), "HH:mm") },
    { label: "END", value: format(parse(booking.selesai, "HH:mm:ss", new Date()), "HH:mm") },
    { label: "DURATION", value: <strong>{booking.durasi} Minutes</strong> },
    { label: "CLASS TYPE", value: booking.jenis_kelas },
    { label: "STATUS", value: generateStatus(booking.status) },
    { label: "NOTES", value: booking.notes },
  ];

  const onClickConfirm = () => {
    setOpenUpdStatus(true);
  };
  const handleCloseModalUpdateStatus = () => setOpenUpdStatus(false);
  const onSuccessMutateBooking = (response) => {
    setOpenUpdStatus(false);
    refetchBooking();
    queryClient.invalidateQueries({ queryKey: [queryKey.bookings] });
    toast.success(response.data.message, {
      position: "top-center",
      autoClose: 5000,
      theme: "colored",
    });
  };
  const onErrorMutateBooking = (error) => {
    if (error) {
      toast.error(error.response?.data?.message || "Booking Error", {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  return (
    <Stack gap={3}>
      <Stack
        borderRadius={"7px"}
        boxShadow={"2px 12px 20px 0px rgba(90, 117, 167, 0.10)"}
        padding={"15px"}
        sx={{
          background: "white",
        }}
        gap={"11px"}
      >
        <Stack direction={"row"} gap={"10px"}>
          <Avatar {...stringAvatar("Privat")} sx={{ width: 48, height: 48 }} />
          <Stack gap={"2px"} width={"100%"}>
            <Typography fontWeight={"bold"} fontSize={"14px"} color={"#0D1B34"}>
              {JSON.parse(booking.user_group)
                ?.map((student) => student.nama_murid)
                .join(", ")}
            </Typography>
            <Typography fontSize={"14px"} color={"#8696BB"}>
              {booking.room.nama_ruang}
            </Typography>
          </Stack>
        </Stack>
        <Box width={"100%"} height={"1px"} sx={{ background: "#F5F5F5" }} />
        <ToastContainer pauseOnFocusLoss={false} />
        {bookingDetail.map((detail) => (
          <Grid container key={detail.label}>
            <Grid item xs={4}>
              <Typography fontSize={"14px"} color={"#8696BB"}>
                {detail.label}
              </Typography>
            </Grid>
            <Grid item>
              <Typography fontSize={"14px"} color={"#525771"}>
                {detail.value}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Stack>
      {booking.status !== "konfirmasi" && booking.status !== "batal" ? (
        <Button
          onClick={onClickConfirm}
          data-id={booking.id}
          fullWidth
          sx={{
            padding: "12px 32px",
            borderRadius: "7px",
            background: "#19A551",
            color: "#FFF",
          }}
        >
          Masuk
        </Button>
      ) : null}
      <ConfirmBooking
        open={openUpdStatus}
        onClose={handleCloseModalUpdateStatus}
        id={Number(id)}
        callbackSuccess={(response) => {
          onSuccessMutateBooking(response);
        }}
        callbackError={(error) => {
          onErrorMutateBooking(error);
        }}
        userId={user.id}
      />
    </Stack>
  );
}
