import { Stack, Button, Typography, Box, Grid, Avatar, Chip } from "@mui/material";
import { format, parse } from "date-fns";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";

import { stringAvatar } from "../utils/avatarProps";
import Iconify from "./Iconify";
import { bookingStatusObj } from "../constants/bookingStatus";

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

export default function CardsBooking({ bookings, onClickConfirm }) {
  return bookings.map((booking) => (
    <Grid item key={booking.id} xs={12} sm={6} md={4}>
      <CardBooking booking={booking} onClickConfirm={onClickConfirm} />
    </Grid>
  ));
}

export function CardBooking({ booking, onClickConfirm }) {
  const { jam_booking: jamBooking, tgl_kelas: tglKelas } = booking;
  const completeDate = parse(`${tglKelas} ${jamBooking}`, "yyyy-MM-dd HH:mm:ss", new Date());
  const isPassed = new Date() > completeDate;
  return (
    <Stack
      borderRadius={"7px"}
      boxShadow={"2px 12px 20px 0px rgba(90, 117, 167, 0.10)"}
      padding={"15px"}
      height={"100%"}
      sx={{
        background: "white",
      }}
      gap={"11px"}
    >
      <Stack direction={"row"} gap={"10px"}>
        <Avatar {...stringAvatar("Privat")} sx={{ width: 48, height: 48 }} />
        <Stack gap={"4px"} width={"100%"}>
          <Typography
            fontWeight={"bold"}
            fontSize={"14px"}
            color={"#0D1B34"}
            lineHeight={1.2}
            sx={{
              "-webkit-line-clamp": "2",
              overflow: "hidden",
              display: "-webkit-box",
              "-webkit-box-orient": "vertical",
            }}
          >
            {JSON.parse(booking.user_group)
              .map((student) => student.nama_murid)
              .join(", ")}
          </Typography>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography fontSize={"14px"} color={"#8696BB"}>
              {booking.room.nama_ruang}
            </Typography>
            {generateStatus(booking.status)}
          </Stack>
        </Stack>
      </Stack>
      <Box width={"100%"} height={"1px"} sx={{ background: "#F5F5F5" }} />
      <Grid container>
        <Grid item xs={6}>
          <Stack direction={"row"} gap={"6px"}>
            <Iconify icon="ic:round-date-range" sx={{ width: "16px", height: "16px", color: "#8696BB" }} />
            <Typography fontSize={"12px"} color={"#8696BB"}>
              {format(parse(booking.tgl_kelas, "yyyy-MM-dd", new Date()), "iiii, dd MMM")}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack direction={"row"} gap={"6px"}>
            <Iconify icon="tabler:clock" sx={{ width: "16px", height: "16px", color: "#8696BB" }} />
            <Typography fontSize={"12px"} color={"#8696BB"}>
              {`${format(parse(booking.jam_booking, "HH:mm:ss", new Date()), "HH:mm")} - 
            ${format(parse(booking.selesai, "HH:mm:ss", new Date()), "HH:mm")}`}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Stack direction={"row"} justifyContent={"space-around"}>
        <Button
          component={RouterLink}
          to={`/app/booking/${booking.id}`}
          sx={{
            width: "117px",
            height: "27px",
            padding: "12px 32px",
            borderRadius: "7px",
            background: "rgba(255, 165, 0, 0.20)",
            color: "#FFA500",
            ":hover": {
              background: "rgba(255, 165, 0, 0.20)",
            },
          }}
          {...(booking.status === "pending" || (booking.status === "ijin" && { fullWidth: true }))}
        >
          Detail
        </Button>
        {booking.status === "pending" || booking.status === "ijin" ? (
          <Button
            onClick={onClickConfirm}
            data-id={booking.id}
            disabled={!isPassed}
            sx={{
              width: "117px",
              height: "27px",
              padding: "12px 32px",
              borderRadius: "7px",
              background: "#19A551",
              color: "#FFF",
              ":hover": {
                background: "#19A551",
              },
              ":disabled": {
                background: "rgba(56, 53, 161, 0.08)",
              },
            }}
          >
            Masuk
          </Button>
        ) : null}
      </Stack>
      {!isPassed ? (
        <Typography textAlign={"center"} fontSize={"11px"} color={"#8696BB"}>
          Kelas belum dimulai. Harap menunggu kelas dimulai untuk update status.
        </Typography>
      ) : null}
    </Stack>
  );
}

CardBooking.propTypes = {
  booking: PropTypes.object,
  onClickConfirm: PropTypes.func,
};
