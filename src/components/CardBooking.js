import { Stack, Button, Typography, Box, Grid, Avatar } from "@mui/material";
import { format, parse } from "date-fns";

import { stringAvatar } from "../utils/avatarProps";
import Iconify from "./Iconify";

export default function CardBooking({ bookings }) {
  return bookings.map((booking) => (
    <Stack
      key={booking.id}
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
        <Stack gap={"2px"}>
          <Typography fontWeight={"bold"} fontSize={"14px"} color={"#0D1B34"}>
            {JSON.parse(booking.user_group)
              .map((student) => student.nama_murid)
              .join(", ")}
          </Typography>
          <Typography fontSize={"14px"} color={"#8696BB"}>
            {booking.room.nama_ruang}
          </Typography>
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
          sx={{
            width: "117px",
            height: "27px",
            padding: "12px 32px",
            borderRadius: "7px",
            background: "rgba(255, 165, 0, 0.20)",
            color: "#FFA500",
          }}
        >
          Detail
        </Button>
        <Button
          sx={{
            width: "117px",
            height: "27px",
            padding: "12px 32px",
            borderRadius: "7px",
            background: "#19A551",
            color: "#FFF",
          }}
        >
          Masuk
        </Button>
      </Stack>
    </Stack>
  ));
}
