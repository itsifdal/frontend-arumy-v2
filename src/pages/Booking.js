/* eslint-disable camelcase */
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { format, parse, addMinutes } from "date-fns";
// React Toasts
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import PropTypes from "prop-types";
import { downloadExcel } from "react-export-table-to-excel";

// Toastify
import "react-toastify/dist/ReactToastify.css";

// material
import { Chip, Tooltip, Button, Container, Typography, Box, Stack, Pagination, PaginationItem } from "@mui/material";
import { InfoRounded } from "@mui/icons-material";

// hooks
import useResponsive from "../hooks/useResponsive";
// components
import Page from "../components/Page";
import Iconify from "../components/Iconify";
import PageHeader from "../components/PageHeader";
import BasicTable from "../components/BasicTable";
import CreateBooking from "../components/modal/createBooking";
import ConfirmBooking from "../components/modal/confirmBooking";
import { cleanQuery } from "../utils/cleanQuery";
import { urlSearchParamsToQuery } from "../utils/urlSearchParamsToQuery";
import { queryToString } from "../utils/queryToString";
import { queryKey } from "../constants/queryKey";
import BookingFilters from "../components/filter/bookingFilters";
import CollapsibleTable from "../components/CollapsibleTable";
import { bookingStatusObj } from "../constants/bookingStatus";
import { fetchHeader } from "../constants/fetchHeader";
import { fNumber } from "../utils/formatNumber";

const hourModel = ({ timeStart, timeEnd, duration }) => {
  const formatTimeStart = format(parse(timeStart, "HH:mm:ss", new Date()), "HH:mm");
  const formatTimeEnd = timeEnd
    ? format(parse(timeEnd, "HH:mm:ss", new Date()), "HH:mm")
    : format(addMinutes(parse(timeStart, "HH:mm:ss", new Date()), duration), "HH:mm");
  return `${formatTimeStart}-${formatTimeEnd}`;
};

const studentModel = ({ students }) => {
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

const generateStatus = ({ status, isMobile }) => {
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

// ----------------------------------------------------------------------
export default function Booking() {
  const [bookingId, setBookingId] = useState();
  const [user, setUser] = useState({});
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [stateModalCreate, setStateModalCreate] = useState("create");

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  const isDesktop = useResponsive("up", "lg");

  // localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const [openUpdStatus, setOpenUpdStatus] = useState(false);

  // GET DATA BOOKING ALL
  const {
    data: bookings,
    refetch: bookingsRefetch,
    isLoading: isLoadingBookings,
  } = useQuery(
    [
      queryKey.bookings,
      cleanQuery({
        ...queryParam,
        ...(user.role === "Guru" && { teacherId: user?.teacherId }),
      }),
    ],
    () =>
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/api/booking${queryToString({
            ...queryParam,
            ...(user.role === "Guru" && { teacherId: user?.teacherId }),
          })}`,
          {
            headers: fetchHeader,
          }
        )
        .then((res) => res.data)
  );

  const pageInfo = bookings?.pagination
    ? `Halaman ${fNumber(bookings.pagination.current_page)} dari ${fNumber(
        bookings.pagination.total_pages
      )}; Ditemukan ${fNumber(bookings.pagination.total_records)} data`
    : "";

  const onSuccessMutateBooking = (response) => {
    setBookingId();
    bookingsRefetch();
    setOpenModalCreate(false);
    setOpenUpdStatus(false);
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
  // END

  // Open Modal Update Confirm
  const handleOpenModalUpdateStatus = (e) => {
    setBookingId(e.target.getAttribute("data-id"));
    setOpenUpdStatus(true);
  };
  const handleCloseModalUpdateStatus = () => setOpenUpdStatus(false);

  const handleOpenModalCreate = (e) => {
    e.preventDefault();
    const type = e.target.getAttribute("data-type");
    if (type === "update") {
      setBookingId(e.target.getAttribute("data-id"));
      setStateModalCreate("update");
    } else {
      setStateModalCreate("create");
    }
    setOpenModalCreate(true);
  };

  // Cek loggedin user admin
  const isUserAdmin = user.role === "Admin";
  const isUserGuru = user.role === "Guru";

  const generateButtonAction = (book) => {
    if (isUserAdmin) {
      return (
        <Stack direction={"row"} spacing={1}>
          <Button
            variant="contained"
            color="success"
            size="small"
            data-type="update"
            data-id={book.id}
            onClick={handleOpenModalCreate}
          >
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
          data-durasi={book.durasi}
          data-id={book.id}
          onClick={handleOpenModalUpdateStatus}
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

  //----
  return (
    <Page title="Booking">
      <PageHeader
        title="Bookings"
        rightContent={
          user && isUserAdmin ? (
            <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModalCreate}>
              Add New Booking
            </Button>
          ) : null
        }
      />
      <Box
        sx={{
          background: "#FFF",
          boxShadow: "0px 4px 20px 0px rgba(0, 0, 0, 0.05)",
          paddingY: isDesktop ? "20px" : "5px",
          zIndex: 2,
          position: "relative",
          borderTop: "1px solid #c3c3e1",
        }}
      >
        <Container maxWidth="xl">
          <BookingFilters pageInfo={pageInfo} />
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        <BookingData
          bookings={bookings}
          queryParam={queryParam}
          isLoadingBookings={isLoadingBookings}
          setSearchParams={setSearchParams}
          buttonAction={generateButtonAction}
          isUserAdmin={isUserAdmin}
          isUserGuru={isUserGuru}
          user={user}
        />

        <CreateBooking
          open={openModalCreate}
          onClose={() => setOpenModalCreate(false)}
          id={Number(bookingId)}
          state={stateModalCreate}
          callbackSuccess={(response) => {
            onSuccessMutateBooking(response);
          }}
          callbackError={(error) => {
            onErrorMutateBooking(error);
          }}
          userId={user.id}
        />

        <ConfirmBooking
          open={openUpdStatus}
          onClose={handleCloseModalUpdateStatus}
          id={Number(bookingId)}
          callbackSuccess={(response) => {
            onSuccessMutateBooking(response);
          }}
          callbackError={(error) => {
            onErrorMutateBooking(error);
          }}
          userId={user.id}
        />
      </Container>
    </Page>
  );
}

function BookingData({
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
