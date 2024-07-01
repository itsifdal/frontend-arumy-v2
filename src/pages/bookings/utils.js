import { format, parse, addMinutes, isValid, differenceInMinutes } from "date-fns";
import { Chip, Tooltip, Typography, Stack } from "@mui/material";
import { InfoRounded } from "@mui/icons-material";
import { bookingStatusObj } from "../../constants/bookingStatus";
import { fNumber } from "../../utils/formatNumber";

export const hourModel = ({ timeStart, timeEnd, duration }) => {
  const formatTimeStart = format(parse(timeStart, "HH:mm:ss", new Date()), "HH:mm");
  const formatTimeEnd = timeEnd
    ? format(parse(timeEnd, "HH:mm:ss", new Date()), "HH:mm")
    : format(addMinutes(parse(timeStart, "HH:mm:ss", new Date()), duration), "HH:mm");
  return `${formatTimeStart}-${formatTimeEnd}`;
};

export const studentModel = ({ students }) => {
  if (students) {
    const arrayStudents = JSON.parse(students);
    return (
      <Stack direction={"row"}>
        <Typography noWrap maxWidth={"200px"} fontSize={["12px", "14px"]}>
          {arrayStudents.map((student) => student.nama_murid).join(", ")}
        </Typography>
        {arrayStudents.length > 1 && (
          <Tooltip title={arrayStudents.map((student) => student.nama_murid).join(", ")} placement="bottom">
            <InfoRounded fontSize="small" />
          </Tooltip>
        )}
      </Stack>
    );
  }
  return <></>;
};

export const generateStatus = ({ status, isMobile }) => {
  if (status) {
    return (
      <Chip
        label={bookingStatusObj[status].label}
        color={bookingStatusObj[status].color}
        {...(isMobile && { size: "small", sx: { fontSize: "12px", height: "auto" } })}
      />
    );
  }
  return <></>;
};

export const pageInfo = (pagination) => {
  if (pagination) {
    return `Halaman ${fNumber(pagination.current_page)} dari ${fNumber(pagination.total_pages)}; Ditemukan ${fNumber(
      pagination.total_records
    )} data`;
  }

  return "";
};

export const generateDuration = (start, end) => {
  if (isValid(start) && isValid(end)) {
    const diffTime = differenceInMinutes(end, start);
    return diffTime;
  }
  return "";
};

export const modelBooking = (booking) => {
  if (booking) {
    return {
      ...booking,
      jam_booking: format(booking.jam_booking, "HH:mm:ss"),
      tgl_kelas: format(booking.tgl_kelas, "yyyy-MM-dd"),
      user_group: booking.user_group.map((student) => ({ id: student.value, nama_murid: student.label })),
      instrumentId: booking.instrumentId.value,
      roomId: booking.roomId.value,
      teacherId: booking.teacherId.value,
    };
  }
  return {};
};
