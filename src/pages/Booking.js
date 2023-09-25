/* eslint-disable camelcase */
import React, { useEffect, useState } from "react";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { format, parse, addMinutes } from "date-fns";
// React Toasts
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { LoadingButton } from "@mui/lab";

// Toastify
import "react-toastify/dist/ReactToastify.css";

// material
import {
  Chip,
  Tooltip,
  Button,
  Container,
  Typography,
  Modal,
  FormControl,
  Box,
  Stack,
  Pagination,
  PaginationItem,
} from "@mui/material";
import { InfoRounded } from "@mui/icons-material";

// components
import Page from "../components/Page";
import Scrollbar from "../components/Scrollbar";
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

// Style box
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: "400px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// ----------------------------------------------------------------------
export default function Booking() {
  const [bookingId, setBookingId] = useState();
  const [user, setUser] = useState("");
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [stateModalCreate, setStateModalCreate] = useState("create");

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);

  // localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const [openDel, setOpenDel] = useState(false);
  const [openUpdStatus, setOpenUpdStatus] = useState(false);

  const { data: userDetail } = useQuery(
    [queryKey.users, "DETAIL"],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/${user?.id}`).then((res) => res.data),
    {
      enabled: Boolean(user?.id),
    }
  );

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
        ...(user.role === "Guru" && { teacherId: userDetail?.teacherId }),
      }),
    ],
    () =>
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/api/booking${queryToString({
            ...queryParam,
            ...(user.role === "Guru" && { teacherId: userDetail?.teacherId }),
          })}`
        )
        .then((res) => res.data),
    { enabled: !!userDetail }
  );

  // Open Modal Delete
  const handleOpenModalDelete = (e) => {
    e.preventDefault();
    setBookingId(e.target.getAttribute("data-id"));
    setOpenDel(true);
  };
  const handleCloseModalDelete = () => setOpenDel(false);

  const submitDeleteBooking = useMutation(() =>
    axios.delete(`${process.env.REACT_APP_BASE_URL}/api/booking/${bookingId}`)
  );

  const handleSubmitDelete = (e) => {
    e.preventDefault();
    submitDeleteBooking.mutate(
      {},
      {
        onSuccess: (response) => {
          setBookingId();
          onSuccessMutateBooking(response);
        },
        onError: (error) => {
          onErrorMutateBooking(error);
        },
      }
    );
  };

  const onSuccessMutateBooking = (response) => {
    bookingsRefetch();
    setOpenDel(false);
    setOpenModalCreate(false);
    setOpenUpdStatus(false);
    toast.success(response.data.message, {
      position: "top-center",
      autoClose: 1000,
      theme: "colored",
    });
  };

  const onErrorMutateBooking = (error) => {
    if (error) {
      toast.error("Booking Error", {
        position: "top-center",
        autoClose: 1000,
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

  const generateStatus = (status) => {
    if (status === "pending") {
      return <Chip label={status} color="warning" />;
    }
    if (status === "kadaluarsa") {
      return <Chip label={status} color="secondary" />;
    }
    if (status === "ijin") {
      return <Chip label={status} color="primary" />;
    }
    if (status === "batal") {
      return <Chip label={status} color="error" />;
    }
    if (status === "konfirmasi") {
      return <Chip label={status} color="success" />;
    }
    return <></>;
  };

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
          <Button variant="contained" color="error" size="small" data-id={book.id} onClick={handleOpenModalDelete}>
            Delete
          </Button>
        </Stack>
      );
    }
    if (isUserGuru && (book.status === "pending" || book.status === "kadaluarsa")) {
      return (
        <Button
          variant="contained"
          color="primary"
          size="small"
          margin="normal"
          data-durasi={book.durasi}
          data-id={book.id}
          onClick={handleOpenModalUpdateStatus}
        >
          Confirm
        </Button>
      );
    }
    return <></>;
  };

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
          <Typography noWrap maxWidth={"200px"} fontSize={"0.875rem"}>
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

  const tableHeader = [
    <Stack key={"tgl_kelas"} gap={1} direction={"row"} alignItems={"center"}>
      <Typography
        sx={{
          fontSize: "14px",
        }}
      >
        TGL KELAS
      </Typography>
      <Button
        sx={{
          minWidth: 0,
          padding: 0,
          fontSize: "20px",
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
          fontSize: "20px",
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
    "",
  ];
  const tableBody = bookings?.data
    ? bookings.data?.map((booking) => [
        format(parse(booking.tgl_kelas, "yyyy-MM-dd", new Date()), "dd-MM-yyyy"),
        hourModel({ timeStart: booking.jam_booking, timeEnd: booking.selesai, duration: booking.durasi }),
        booking.room.nama_ruang,
        studentModel({ students: booking.user_group }),
        booking.teacher.nama_pengajar,
        generateStatus(booking.status),
        { ...((isUserAdmin || isUserGuru) && generateButtonAction(booking)) },
      ])
    : [];
  if (!isUserAdmin && !isUserGuru) {
    tableHeader.pop();
    tableBody.map((body) => body.pop());
  }

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
          paddingY: "20px",
          zIndex: 2,
          position: "relative",
          borderTop: "1px solid #c3c3e1",
        }}
      >
        <Container maxWidth="xl">
          <BookingFilters />
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        {renderData({ bookings, tableHeader, tableBody, queryParam, isLoadingBookings })}
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

        <Modal
          open={openDel}
          onClose={handleCloseModalDelete}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={5}>
              Delete booking ?
            </Typography>
            <FormControl fullWidth>
              <LoadingButton variant="contained" type="submit" onClick={handleSubmitDelete}>
                Delete
              </LoadingButton>
            </FormControl>
          </Box>
        </Modal>

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
        />
      </Container>
    </Page>
  );
}

function renderData({ bookings, tableHeader, tableBody, queryParam, isLoadingBookings }) {
  if (isLoadingBookings) return <Typography>Loading data...</Typography>;
  if (!bookings) return <Typography>Error load data</Typography>;
  if (!bookings.data?.length) return <Typography>No data</Typography>;

  return (
    <Box marginBottom={3}>
      <Scrollbar>
        <BasicTable header={tableHeader} body={tableBody} />
      </Scrollbar>
      <Pagination
        page={bookings.pagination.current_page}
        count={bookings.pagination.total_pages}
        shape="rounded"
        sx={[{ ul: { justifyContent: "center" } }]}
        renderItem={(item) => (
          <PaginationItem
            component={RouterLink}
            to={`/app/booking${queryToString({ ...queryParam, page: item.page === 1 ? null : item.page })}`}
            {...item}
          />
        )}
      />
    </Box>
  );
}
