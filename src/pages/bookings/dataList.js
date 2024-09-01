import React, { useEffect, useState, useMemo } from "react";
import { format, parse } from "date-fns";
import { Link, useSearchParams } from "react-router-dom";
import { Button, Typography, Box, Stack, Pagination, PaginationItem } from "@mui/material";

import useResponsive from "../../hooks/useResponsive";
import { queryToString } from "../../utils/queryToString";
import { cleanQuery } from "../../utils/cleanQuery";
import CollapsibleTable from "../../components/CollapsibleTable";
import Iconify from "../../components/Iconify";
import BasicTable from "../../components/BasicTable";
import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";
import ConfirmBooking from "../../components/modal/confirmBooking";

import { useGetBookings } from "./query";
import { hourModel, studentModel, generateStatus } from "./utils";
import { BookingFormModal } from "./formModal";
import { onSuccessToast, onErrorToast } from "./callback";
import { BookingDownloadButton } from "./downloadButton";

export function BookingDataList() {
  const [bookingId, setBookingId] = useState();
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenConfirmModal, setIsOpenComfirmModal] = useState(false);
  const [user, setUser] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);

  const isDesktop = useResponsive("up", "lg");

  const isUserAdmin = useMemo(() => user.role === "Admin" || user.role === "Super Admin", [user]);
  const isUserGuru = useMemo(() => user.role === "Guru", [user]);

  // localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  // GET DATA BOOKING ALL
  const {
    data: bookings,
    isLoading: isLoadingBookings,
    refetch: refetchBookings,
  } = useGetBookings({
    queryParam: cleanQuery({
      ...queryParam,
      ...(user.role === "Guru" && { teacherId: user?.teacherId }),
    }),
  });

  const onClickEdit = ({ updateId }) => {
    setBookingId(updateId);
    setIsOpenUpdateModal(true);
  };

  const onCloseModalUpdate = () => setIsOpenUpdateModal(false);

  const onClickConfirm = ({ confirmId }) => {
    setBookingId(confirmId);
    setIsOpenComfirmModal(true);
  };

  const onCloseModalConfirm = () => setIsOpenComfirmModal(false);

  const onSuccessUpdate = () => {
    refetchBookings();
    setIsOpenUpdateModal(false);
    setIsOpenComfirmModal(false);
  };

  const buttonAction = (book) => {
    if (isUserAdmin) {
      return (
        <Stack direction={"row"} spacing={1}>
          <Button variant="contained" color="success" size="small" onClick={() => onClickEdit({ updateId: book.id })}>
            Update
          </Button>
        </Stack>
      );
    }
    if (isUserGuru && (book.status === "pending" || book.status === "ijin")) {
      return (
        <Button
          variant="contained"
          color="primary"
          size="small"
          margin="normal"
          onClick={() => onClickConfirm({ confirmId: book.id })}
          {...(!isDesktop && {
            sx: {
              fontSize: "12px",
            },
          })}
        >
          Confirm
        </Button>
      );
    }
    return <></>;
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
    <BookingDownloadButton key={"action"} />,
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
    <>
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

      <BookingFormModal
        open={isOpenUpdateModal}
        onClose={onCloseModalUpdate}
        onError={(error) => onErrorToast(error)}
        onSuccess={(response) => onSuccessToast(response, onSuccessUpdate)}
        id={Number(bookingId)}
        stateModal={"update"}
      />

      <ConfirmBooking
        open={isOpenConfirmModal}
        onClose={onCloseModalConfirm}
        id={Number(bookingId)}
        onSuccess={(response) => onSuccessToast(response, onSuccessUpdate)}
        onError={(error) => onErrorToast(error)}
        userId={user.id}
      />
    </>
  );
}
