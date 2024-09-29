import React, { useState, useEffect } from "react";
import { Container, Box, Grid, Typography } from "@mui/material";
import { format, lastDayOfMonth } from "date-fns";
import PropTypes from "prop-types";

import Iconify from "../../../components/Iconify";
import { useGetTeacherHour } from "../../teachers/query";

function convertToHoursAndMinutes(totalMinutes) {
  if (!totalMinutes) return "0 Menit";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!hours) return `${minutes} Menit`;
  return `${hours} Jam ${minutes} Menit`;
}

export function DashboardTeachersSummarySection({ date }) {
  const [user, setUser] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  const [dateValue, setDateValue] = useState({
    dateFrom: format(date, "yyyy-MM-01"),
    dateTo: format(lastDayOfMonth(date), "yyyy-MM-dd"),
  });

  // localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
      setIsTeacher(foundUser.role === "Guru");
    }
  }, []);

  useEffect(() => {
    setDateValue({
      dateFrom: format(date, "yyyy-MM-01"),
      dateTo: format(lastDayOfMonth(date), "yyyy-MM-dd"),
    });
  }, [date]);

  const { data: bookingDone } = useGetTeacherHour({
    id: user.teacherId,
    queryParam: { status: "konfirmasi,hangus", dateFrom: dateValue.dateFrom, dateTo: dateValue.dateTo },
    options: {
      enabled: Boolean(user.teacherId),
      select: (data) => data.data.total_minutes,
    },
  });
  const { data: bookingPending } = useGetTeacherHour({
    id: user.teacherId,
    queryParam: { status: "pending", dateFrom: dateValue.dateFrom, dateTo: dateValue.dateTo },
    options: {
      enabled: Boolean(user.teacherId),
      select: (data) => data.data.total_minutes,
    },
  });
  const { data: bookingExpired } = useGetTeacherHour({
    id: user.teacherId,
    queryParam: { status: "kadaluarsa", dateFrom: dateValue.dateFrom, dateTo: dateValue.dateTo },
    options: {
      enabled: Boolean(user.teacherId),
      select: (data) => data.data.total_minutes,
    },
  });

  const dataToRender = [
    {
      bgColor: "#54D62C",
      number: convertToHoursAndMinutes(bookingDone),
      label: "Booking Selesai",
      iconName: "mingcute:checkbox-line",
    },
    {
      bgColor: "#FFA500",
      number: convertToHoursAndMinutes(bookingPending),
      label: "Booking Pending",
      iconName: "tabler:clock",
    },
    {
      bgColor: "#FF0000",
      number: convertToHoursAndMinutes(bookingExpired),
      label: "Booking Kadaluarsa",
      iconName: "ph:warning-bold",
    },
  ];

  if (!isTeacher) return null;

  console.log("date", date);

  return (
    <Box>
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 1 }}>
          Periode {format(date, "MMMM yyyy")}
        </Typography>
        <Grid container spacing={1} sx={{ justifyContent: "stretch" }}>
          {dataToRender.map((item) => (
            <Grid item xs={12} sm={4} key={item.label}>
              <Box
                sx={{
                  bgcolor: item.bgColor,
                  display: "flex",
                  flexDirection: "row",
                  color: "#FFF",
                  alignItems: "center",
                  padding: 2,
                  borderRadius: 1,
                  height: "100%",
                  gap: 2,
                }}
              >
                <Iconify icon={item.iconName} width={40} height={40} />
                <Box>
                  <Typography sx={{ fontWeight: "bold", fontSize: "clamp(16px, 1.5svw, 22px)" }}>
                    {item.number}
                  </Typography>
                  <Typography sx={{ fontSize: "12px" }}>{item.label}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

DashboardTeachersSummarySection.propTypes = {
  date: PropTypes.number,
};
