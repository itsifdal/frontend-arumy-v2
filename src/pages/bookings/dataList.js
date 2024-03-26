import { useQuery } from "react-query";
import { format, parse } from "date-fns";
import axios from "axios";
import PropTypes from "prop-types";
import { downloadExcel } from "react-export-table-to-excel";
import { Button, Typography, Box, Stack, Pagination, PaginationItem } from "@mui/material";
import { Link } from "react-router-dom";

import useResponsive from "../../hooks/useResponsive";
import { queryToString } from "../../utils/queryToString";
import { queryKey } from "../../constants/queryKey";
import { cleanQuery } from "../../utils/cleanQuery";
import CollapsibleTable from "../../components/CollapsibleTable";
import { fetchHeader } from "../../constants/fetchHeader";
import Iconify from "../../components/Iconify";
import { hourModel, studentModel, generateStatus } from "./utils";
import BasicTable from "../../components/BasicTable";

export function BookingData({
  bookings,
  queryParam,
  isLoadingBookings,
  setSearchParams,
  isUserAdmin,
  isUserGuru,
  buttonAction,
  user,
}) {
  const isDesktop = useResponsive("up", "lg");

  // DOWNLOAD ALL BOOKING DATA
  const downloadQueryBookings = {
    ...queryParam,
    ...(isUserGuru && { teacherId: user?.teacherId }),
    sort: "desc",
    sort_by: "tgl_kelas",
    perPage: 9999,
    page: 1,
  };
  const { refetch: refetchDownloadBookings } = useQuery(
    [
      queryKey.downloadBooking,
      cleanQuery({
        ...downloadQueryBookings,
      }),
    ],
    () =>
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/api/booking${queryToString({
            ...downloadQueryBookings,
          })}`,
          {
            headers: fetchHeader,
          }
        )
        .then((res) => res.data),
    {
      enabled: false,
      onSuccess: (bookings) => {
        if (bookings?.data?.length) {
          const exportedTeacherSummary = bookings.data.map((booking) => ({
            "Tanggal kelas": booking.tgl_kelas,
            "Jam mulai": booking.jam_booking,
            "Jam selesai": booking.selesai,
            "Ruang kelas": booking.room?.nama_ruang,
            "Nama murid": JSON.parse(booking.user_group)
              .map((student) => student.nama_murid)
              .join(", "),
            "Nama pengajar": booking.teacher?.nama_pengajar,
            "Durasi (menit)": booking.durasi,
            Status: booking.status,
            Notes: booking.notes || "-",
          }));
          downloadExcel({
            fileName: `Booking-${Date.now()}`,
            sheet: queryParam ? JSON.stringify(queryParam).replace('"', "").replace(",", " ").replace(":", "-") : "All",
            tablePayload: {
              header: Object.keys(exportedTeacherSummary[0]),
              body: exportedTeacherSummary,
            },
          });
        }
      },
    }
  );

  const handleDownloadExcel = () => {
    refetchDownloadBookings();
  };

  const tableHeader = [
    <Stack key={"tgl_kelas"} gap={1} direction={"row"} alignItems={"center"}>
      <Typography fontSize={["12px", "14px"]} {...(!isDesktop && { fontWeight: "bold" })}>
        TGL KELAS
      </Typography>
      <Button
        sx={{
          minWidth: 0,
          padding: 0,
          fontSize: isDesktop ? "20px" : "14px",
          ":hover": {
            bgcolor: "transparent",
          },
        }}
        disabled={queryParam.sort === "asc" && queryParam.sort_by === "tgl_kelas"}
        onClick={() => {
          setSearchParams({ ...queryParam, sort: "asc", sort_by: "tgl_kelas" });
        }}
      >
        <Iconify icon="octicon:sort-asc-16" />
      </Button>
      <Button
        sx={{
          minWidth: 0,
          padding: 0,
          fontSize: isDesktop ? "20px" : "14px",
          ":hover": {
            bgcolor: "transparent",
          },
        }}
        onClick={() => {
          setSearchParams({ ...queryParam, sort: "desc", sort_by: "tgl_kelas" });
        }}
        disabled={queryParam.sort === "desc" && queryParam.sort_by === "tgl_kelas"}
      >
        <Iconify icon="octicon:sort-desc-16" />
      </Button>
    </Stack>,
    "JAM BOOKING",
    "RUANG KELAS",
    "MURID",
    "PENGAJAR",
    "STATUS",
    <Button key={"action"} onClick={handleDownloadExcel} variant="contained" sx={{ whiteSpace: "nowrap" }}>
      Export Excel
    </Button>,
  ];

  const tableBody = bookings?.data
    ? bookings.data?.map((booking) => [
        format(parse(booking.tgl_kelas, "yyyy-MM-dd", new Date()), "dd-MM-yyyy"),
        hourModel({ timeStart: booking.jam_booking, timeEnd: booking.selesai, duration: booking.durasi }),
        booking.room.nama_ruang,
        studentModel({ students: booking.user_group }),
        booking.teacher.nama_pengajar,
        generateStatus({ status: booking.status, isMobile: !isDesktop }),
        { ...((isUserAdmin || isUserGuru) && buttonAction(booking)) },
      ])
    : [];

  if (!isUserAdmin && !isUserGuru) {
    tableHeader.pop();
    tableBody.map((body) => body.pop());
  }

  if (isLoadingBookings) return <Typography>Loading data...</Typography>;
  if (!bookings) return <Typography>Error load data</Typography>;
  if (!bookings.data?.length) return <Typography>No data</Typography>;

  return (
    <Box marginBottom={3}>
      {isDesktop ? (
        <BasicTable header={tableHeader} body={tableBody} />
      ) : (
        <CollapsibleTable header={tableHeader} body={tableBody} />
      )}
      <Pagination
        page={bookings.pagination.current_page}
        count={bookings.pagination.total_pages}
        shape="rounded"
        sx={[{ ul: { justifyContent: "center" } }]}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`/app/booking${queryToString({ ...queryParam, page: item.page === 1 ? null : item.page })}`}
            {...item}
          />
        )}
      />
    </Box>
  );
}
BookingData.propTypes = {
  bookings: PropTypes.object,
  queryParam: PropTypes.object.isRequired,
  isLoadingBookings: PropTypes.bool.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  buttonAction: PropTypes.func.isRequired,
  isUserAdmin: PropTypes.bool.isRequired,
  isUserGuru: PropTypes.bool.isRequired,
  user: PropTypes.object,
};
