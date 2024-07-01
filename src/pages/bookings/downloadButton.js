import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { downloadExcel } from "react-export-table-to-excel";

import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";
import { useGetBookingDownload } from "./query";

export const BookingDownloadButton = () => {
  const [user, setUser] = useState({});

  const [searchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);

  const isUserGuru = useMemo(() => user.role === "Guru", [user]);

  // localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  // DOWNLOAD ALL BOOKING DATA
  const downloadQueryBookings = {
    ...queryParam,
    ...(isUserGuru && { teacherId: user?.teacherId }),
    sort: "desc",
    sort_by: "tgl_kelas",
    perPage: 999999,
    page: 1,
  };

  const { refetch: refetchDownloadBookings } = useGetBookingDownload({
    queryParam: downloadQueryBookings,
    options: {
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
    },
  });

  const handleDownloadExcel = () => {
    refetchDownloadBookings();
  };

  return (
    <Button key={"action"} onClick={handleDownloadExcel} variant="contained" sx={{ whiteSpace: "nowrap" }}>
      Export Excel
    </Button>
  );
};
