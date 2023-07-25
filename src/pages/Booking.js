/* eslint-disable camelcase */
// import { Link as RouterLink } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Moment Libs
import Moment from "moment";
// Date Picker
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker, DatePicker } from "@mui/x-date-pickers/";
// React Toasts
import { ToastContainer, toast } from "react-toastify";

// Toastify
import "react-toastify/dist/ReactToastify.css";

// material
import {
  Link,
  Badge,
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

// components
import axios from "axios";
import Page from "../components/Page";
import Scrollbar from "../components/Scrollbar";
import Iconify from "../components/Iconify";
import PageHeader from "../components/PageHeader";
import BasicTable from "../components/BasicTable";

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

// ----------------------------------------------------------------------
export default function Booking() {
  const [bookings, setBookings] = useState("");
  const [id, setBookingId] = useState("");

  const [rooms, setRooms] = useState("");
  const [roomId, setRoomId] = useState("");

  const [user, setUser] = useState("");
  const [durasi, setDurasi] = useState("");
  const [jenisKelas, setJenisKelas] = useState("");
  const [statusKelas, setStatusKelas] = useState("all");
  const [dt, setDate] = useState(null);
  const [tm_start, setTmStart] = useState(null);
  const [tm_end, setTmEnd] = useState(null);

  // localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  // range dates
  const [rangeAwal, setRangeAwal] = useState("");
  const [rangeAkhir, setRangeAkhir] = useState("");

  const tmstr = Moment(tm_start, "HH:mm:ss").format("HH:mm");
  const tmend = Moment(tm_end, "HH:mm:ss").format("HH:mm");

  const [openDel, setOpenDel] = useState(false);
  const [openUpdateData, setOpenUpdateData] = useState(false);
  const [openUpdTime, setOpenUpdTime] = useState(false);
  const [openUpdStatus, setOpenUpdStatus] = useState(false);

  const handleChange = (e) => {
    setRoomId(e.target.value);
  };

  const handleChangeJenis = (e) => {
    setJenisKelas(e.target.value);
  };

  const handleChangeStatus = (e) => {
    setStatusKelas(e.target.value);
  };

  // Get Room Data
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/room`).then((response) => {
      setRooms(response.data);
    });
  }, []);

  // GET DATA BOOKING BY FILTER PARAMETERS
  const getBookingByFilter = () => {
    const data = {
      status: statusKelas,
      rangeAwal,
      rangeAkhir,
    };
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/booking/filter/default`, data).then((response) => {
      setBookings(response.data);
    });
  };

  const SubmitFilter = () => {
    getBookingByFilter();
  };

  // GET DATA BOOKING ALL
  const getBookingData = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/api/booking`).then((response) => {
      setBookings(response.data);
    });
  };

  const ResetFilter = () => {
    getBookingData();
  };

  useEffect(() => {
    getBookingData();
  }, []);

  // Open Modal Delete
  const handleOpenModalDelete = (e) => {
    setBookingId(e.target.getAttribute("data-id"));
    setDurasi(e.target.getAttribute("data-durasi"));
    setOpenDel(true);
  };
  const handleCloseModalDelete = () => setOpenDel(false);
  const handleSubmitDelete = (e) => {
    e.preventDefault();
    axios.delete(`${process.env.REACT_APP_BASE_URL}/api/booking/${id}`).then((response) => {
      getBookingData();
      setOpenDel(false);
      toast.warning(response.data.message, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    });
  };

  // UPDATE DATA BOOKING SEMUA OLEH ADMIN
  const CloseModalUpdateData = () => setOpenUpdateData(false);

  const SubmitUpdateData = (e) => {
    e.preventDefault();
    const data = {
      durasi,
      roomId,
      kategori: jenisKelas,
      booking_date: dt,
      time_start: tmstr,
      time_end: tmend,
    };
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/booking/${id}`, data).then((response) => {
      getBookingData();
      setOpenUpdateData(false);
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    });
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
      getBookingData();
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
    setDurasi(e.target.getAttribute("data-durasi"));
    setOpenUpdStatus(true);
  };
  const handleCloseModalUpdateStatus = () => setOpenUpdStatus(false);
  const handleSubmitUpdStatus = (e) => {
    e.preventDefault();
    const data = {
      status: statusKelas,
    };
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/booking/updateStatus/${id}`, data).then((response) => {
      getBookingData();
      setOpenUpdStatus(false);
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    });
  };

  const navigate = useNavigate();

  const MoveToAddBookingPage = () => {
    navigate(`/dashboard/AddBooking`);
  };

  // Cek loggedin user admin
  const isUserAdmin = user.role === "Admin";
  const isUserGuru = user.role === "Guru";

  function generateStatus(status) {
    if (status === "pending") {
      return <Badge badgeContent={status} color="warning" />;
    }
    if (status === "cancel") {
      return <Badge badgeContent={status} color="error" />;
    }
    if (status === "expired") {
      return <Badge badgeContent={status} color="secondary" />;
    }
    if (status === "confirmed") {
      return <Badge badgeContent={status} color="success" />;
    }
    return <></>;
  }

  function generateButtonAction(book) {
    if (isUserAdmin) {
      return (
        <>
          <Link href={`/dashboard/UpdateBooking/${book.id}`}>
            <Button
              variant="contained"
              color="success"
              size="small"
              sx={{ margin: 1 }}
              startIcon={<Iconify icon="eva:pencil-fill" />}
            >
              Update
            </Button>
          </Link>
          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{ margin: 1 }}
            startIcon={<Iconify icon="eva:trash-fill" />}
            data-durasi={book.durasi}
            data-id={book.id}
            onClick={handleOpenModalDelete}
          >
            Delete
          </Button>
        </>
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
    return <></>;
  }

  //----
  return (
    <Page title="Booking">
      <PageHeader
        title="Bookings"
        rightContent={
          user && isUserAdmin ? (
            <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={MoveToAddBookingPage}>
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
                <TextField select size="small" value={statusKelas} onChange={handleChangeStatus} fullWidth>
                  <MenuItem selected value={"all"}>
                    Semua Status
                  </MenuItem>
                  <MenuItem value={"pending"}>Pending</MenuItem>
                  <MenuItem value={"confirmed"}>Confirmed</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  type="date"
                  size="small"
                  value={rangeAwal}
                  onChange={(e) => {
                    setRangeAwal(e.target.value);
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  type="date"
                  size="small"
                  value={rangeAkhir}
                  onChange={(e) => {
                    setRangeAkhir(e.target.value);
                  }}
                  fullWidth
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
        {Array.isArray(bookings.data) ? (
          <Scrollbar>
            <BasicTable
              header={[
                "RUANGAN",
                "JENIS",
                "DURASI",
                "STATUS",
                "TGL KELAS",
                "JAM BOOKING",
                ...((isUserAdmin || isUserGuru) && " "),
              ]}
              body={bookings.data.map((booking) => [
                booking.room.nama_ruang,
                booking.jenis_kelas === "group" ? (
                  <Badge badgeContent={booking.jenis_kelas} color="success" />
                ) : (
                  <Badge badgeContent={booking.jenis_kelas} color="primary" />
                ),
                booking.durasi,
                generateStatus(booking.status),
                Moment(booking.tgl_kelas).format("DD MMMM, YYYY"),
                booking.jam_booking,
                { ...((isUserAdmin || isUserGuru) && generateButtonAction(booking)) },
              ])}
            />
          </Scrollbar>
        ) : null}
        <div>
          <Modal
            open={openDel}
            onClose={handleCloseModalDelete}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={5}>
                Delete {durasi} ?
              </Typography>
              <FormControl fullWidth>
                <Button variant="contained" type="submit" onClick={handleSubmitDelete}>
                  Delete
                </Button>
              </FormControl>
            </Box>
          </Modal>
        </div>
        <div>
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
        </div>
        <div>
          <Modal
            open={openUpdateData}
            onClose={CloseModalUpdateData}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={5}>
                Update Booking Data
              </Typography>
              <FormControl fullWidth>
                <TextField
                  required
                  id="outlined-required"
                  margin="normal"
                  size="small"
                  label="Meeting Name"
                  name="durasi"
                  value={durasi}
                  onChange={(e) => {
                    setDurasi(e.target.value);
                  }}
                />
                <TextField
                  id="outlined-select-currency ruang"
                  select
                  margin="normal"
                  size="small"
                  label="Ruang"
                  value={roomId}
                  onChange={handleChange}
                >
                  <MenuItem value={"Ruang"}>- Ruangan -</MenuItem>
                  {Array.isArray(rooms)
                    ? rooms.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.room_name}
                        </MenuItem>
                      ))
                    : null}
                </TextField>
                <TextField
                  id="outlined-select-currency jenis"
                  select
                  margin="normal"
                  size="small"
                  label="Jenis Kelas"
                  value={jenisKelas}
                  onChange={handleChangeJenis}
                >
                  <MenuItem value={"Jenis Kelas"}>Jenis kelas</MenuItem>
                  <MenuItem value={"Privat"}>Privat</MenuItem>
                  <MenuItem value={"Group"}>Group</MenuItem>
                </TextField>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    value={dt}
                    onChange={(newValue) => {
                      setDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} margin="normal" size="small" />}
                  />
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
                <Button variant="contained" type="submit" onClick={SubmitUpdateData}>
                  Update
                </Button>
              </FormControl>
            </Box>
          </Modal>
        </div>
        <div>
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
        </div>
      </Container>
    </Page>
  );
}
