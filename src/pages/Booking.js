/* eslint-disable camelcase */
// import { Link as RouterLink } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { format, parse, addMinutes } from "date-fns";
// Date Picker
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/";
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
  TextField,
  MenuItem,
  Box,
  Stack,
  Grid,
} from "@mui/material";
import { InfoRounded } from "@mui/icons-material";

// components
import Page from "../components/Page";
import Scrollbar from "../components/Scrollbar";
import Iconify from "../components/Iconify";
import PageHeader from "../components/PageHeader";
import BasicTable from "../components/BasicTable";
import CreateBooking from "../components/modal/createBooking";
import { cleanQuery } from "../utils/cleanQuery";
import { urlSearchParamsToQuery } from "../utils/urlSearchParamsToQuery";
import { queryToString } from "../utils/queryToString";
import { bookingStatus } from "../constants/bookingStatus";
import { queryKey } from "../constants/queryKey";
import NativeSelectBasic from "../components/input/nativeSelectBasic";
import AutoCompleteBasic from "../components/input/autoCompleteBasic";
import DateInputBasic from "../components/input/dateInputBasic";

// Style box
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const initFilter = {
  status: "",
  roomId: "",
  roomLabel: "",
  tgl_kelas: "",
  studentId: "",
  teacherId: "",
};

// ----------------------------------------------------------------------
export default function Booking() {
  const [id, setBookingId] = useState();
  const [user, setUser] = useState("");
  const [statusKelas, setStatusKelas] = useState("all");
  const [tm_start, setTmStart] = useState(null);
  const [tm_end, setTmEnd] = useState(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [stateModalCreate, setStateModalCreate] = useState("create");
  const [filters, setFilters] = useState(initFilter);

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

  useEffect(() => {
    // use this for escape infinite loop
    setFilters(urlSearchParamsToQuery(searchParams));
  }, [searchParams]);

  const tmstr = tm_start;
  const tmend = tm_end;

  const [openDel, setOpenDel] = useState(false);
  const [openUpdTime, setOpenUpdTime] = useState(false);
  const [openUpdStatus, setOpenUpdStatus] = useState(false);

  const [openRoom, setOpenRoom] = useState(false);
  const { data: rooms = [], isLoading: isLoadingRooms } = useQuery(
    [queryKey.rooms],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/room`).then((res) => res.data),
    {
      select: (roomList) => roomList.map((room) => ({ value: room.id, label: room.nama_ruang })),
      enabled: openRoom,
    }
  );

  const handleChangeStatus = (e) => {
    setStatusKelas(e.target.value);
  };

  const SubmitFilter = () => {
    setSearchParams(filters);
  };

  // GET DATA BOOKING ALL
  const {
    data: bookings,
    refetch: bookingsRefetch,
    isLoading: isLoadingBookings,
  } = useQuery(["BOOKINGS", cleanQuery(queryParam)], () =>
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/booking${queryToString(queryParam)}`).then((res) => res.data)
  );

  const ResetFilter = () => {
    setSearchParams(initFilter);
  };

  // Open Modal Delete
  const handleOpenModalDelete = (e) => {
    e.preventDefault();
    setBookingId(e.target.getAttribute("data-id"));
    setOpenDel(true);
  };
  const handleCloseModalDelete = () => setOpenDel(false);

  const submitDeleteBooking = useMutation(() => axios.delete(`${process.env.REACT_APP_BASE_URL}/api/booking/${id}`));

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
    toast.success(response.data.message, {
      position: "top-center",
      autoClose: 1000,
      theme: "colored",
    });
  };

  const onErrorMutateBooking = (error) => {
    if (error.response) {
      toast.error(error.response, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    }
  };
  // END

  // UPDATE DATA SCHEDULE OLEH ADMIN
  const CloseModalUpdTime = () => setOpenUpdTime(false);

  const SubmitUpdateTime = (e) => {
    e.preventDefault();
    const data = {
      time_start: tmstr,
      time_end: tmend,
    };
    console.log(data);
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/booking/updateSchedule/${id}`, data).then((response) => {
      bookingsRefetch();
      setOpenUpdTime(false);
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    });
  };
  // END

  // Open Modal Update Confirm
  const handleOpenModalUpdateStatus = (e) => {
    setBookingId(e.target.getAttribute("data-id"));
    setOpenUpdStatus(true);
  };
  const handleCloseModalUpdateStatus = () => setOpenUpdStatus(false);
  const handleSubmitUpdStatus = (e) => {
    e.preventDefault();
    const data = {
      status: statusKelas,
    };
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/booking/updateStatus/${id}`, data).then((response) => {
      bookingsRefetch();
      setOpenUpdStatus(false);
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    });
  };

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
  const tableHeader = ["TGL KELAS", "JAM BOOKING", "RUANG KELAS", "MURID", "PENGAJAR", "STATUS"];
  if (isUserAdmin || isUserGuru) tableHeader.push(" ");

  const generateStatus = (status) => {
    if (status === "pending") {
      return <Chip label={status} color="warning" />;
    }
    if (status === "cancel") {
      return <Chip label={status} color="error" />;
    }
    if (status === "expired") {
      return <Chip label={status} color="secondary" />;
    }
    if (status === "confirmed") {
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
    if (isUserGuru) {
      return (
        <Button
          variant="contained"
          color="primary"
          size="small"
          margin="normal"
          startIcon={<Iconify icon="eva:pencil-fill" />}
          data-durasi={book.durasi}
          data-id={book.id}
          onClick={handleOpenModalUpdateStatus}
        >
          Confirm
        </Button>
      );
    }
    return false;
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
          <Stack width={"100%"} direction={"row"} spacing={2}>
            <Grid container spacing={1} flexGrow={1}>
              <Grid item xs={4}>
                <AutoCompleteBasic
                  label="Ruang Kelas"
                  name="roomId"
                  open={openRoom}
                  onOpen={() => {
                    setOpenRoom(true);
                  }}
                  onClose={() => {
                    setOpenRoom(false);
                  }}
                  onChange={(_, newValue) => {
                    setFilters((prevState) => ({ ...prevState, roomId: newValue.value, roomLabel: newValue.label }));
                  }}
                  options={rooms}
                  loading={isLoadingRooms}
                  value={{ value: filters.roomId, label: filters.roomLabel }}
                />
              </Grid>
              <Grid item xs={4}>
                <DateInputBasic
                  disableValidation
                  id="tgl_kelas"
                  name="tgl_kelas"
                  label="Date"
                  value={parse(filters.tgl_kelas, "yyyy-MM-dd", new Date())}
                  onChange={(e) => {
                    setFilters((prevState) => ({ ...prevState, tgl_kelas: format(e.target.value, "yyyy-MM-dd") }));
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <NativeSelectBasic
                  id="status"
                  name="status"
                  label="Class Status"
                  value={filters.status}
                  onChange={(e) => {
                    setFilters((prevState) => ({ ...prevState, status: e }));
                  }}
                  options={bookingStatus}
                />
              </Grid>
            </Grid>
            <Stack spacing={1} direction={"row"} flexShrink={0}>
              <Button variant="outlined" onClick={SubmitFilter}>
                Filter{" "}
              </Button>
              <Button variant="outlined" onClick={ResetFilter}>
                Reset{" "}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        {!isLoadingBookings ? (
          <Scrollbar>
            <BasicTable
              header={tableHeader}
              body={bookings.data.map((booking) => [
                format(parse(booking.tgl_kelas, "yyyy-MM-dd", new Date()), "dd-MM-yyyy"),
                hourModel({ timeStart: booking.jam_booking, timeEnd: booking.selesai, duration: booking.durasi }),
                booking.room.nama_ruang,
                studentModel({ students: booking.user_group }),
                booking.teacher.nama_pengajar,
                generateStatus(booking.status),
                { ...((isUserAdmin || isUserGuru) && generateButtonAction(booking)) },
              ])}
            />
          </Scrollbar>
        ) : null}
        <CreateBooking
          open={openModalCreate}
          onClose={() => setOpenModalCreate(false)}
          id={Number(id)}
          state={stateModalCreate}
          callbackSuccess={(response) => {
            onSuccessMutateBooking(response);
          }}
          callbackError={(error) => {
            onErrorMutateBooking(error);
          }}
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

        <Modal
          open={openUpdStatus}
          onClose={handleCloseModalUpdateStatus}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={5}>
              Confirm Class
            </Typography>
            <FormControl fullWidth>
              <TextField
                id="outlined-select-currency jenis"
                select
                margin="normal"
                label="Status Kelas"
                value={statusKelas}
                onChange={handleChangeStatus}
              >
                <MenuItem value={"Jenis Kelas"}>Jenis kelas</MenuItem>
                <MenuItem value={"Pending"}>Pending</MenuItem>
                <MenuItem value={"Confirmed"}>Confirmed</MenuItem>
              </TextField>
              <Button variant="contained" type="submit" onClick={handleSubmitUpdStatus}>
                Submit
              </Button>
            </FormControl>
          </Box>
        </Modal>

        <Modal
          open={openUpdTime}
          onClose={CloseModalUpdTime}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={5}>
              Update Times
            </Typography>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Time Start"
                  ampm={false}
                  margin="normal"
                  format="hh:mm"
                  value={tmstr}
                  onChange={(newValue) => {
                    setTmStart(new Date(newValue));
                  }}
                  renderInput={(params) => <TextField {...params} margin="normal" />}
                />
                <TimePicker
                  label="Time End"
                  ampm={false}
                  value={tmend}
                  onChange={(newValue) => {
                    setTmEnd(new Date(newValue));
                  }}
                  renderInput={(params) => <TextField {...params} margin="normal" />}
                />
              </LocalizationProvider>
              <Button variant="contained" type="submit" onClick={SubmitUpdateTime}>
                Update Times
              </Button>
            </FormControl>
          </Box>
        </Modal>
      </Container>
    </Page>
  );
}
