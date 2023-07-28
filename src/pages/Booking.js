/* eslint-disable camelcase */
// import { Link as RouterLink } from 'react-router-dom';
import React, { useEffect, useState, useReducer } from "react";
import { useQuery, useMutation } from "react-query";
import { format, parse } from "date-fns";
// Date Picker
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker, DatePicker } from "@mui/x-date-pickers/";
// React Toasts
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

// Toastify
import "react-toastify/dist/ReactToastify.css";

// material
import {
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
import Page from "../components/Page";
import Scrollbar from "../components/Scrollbar";
import Iconify from "../components/Iconify";
import PageHeader from "../components/PageHeader";
import BasicTable from "../components/BasicTable";
import CreateBooking from "../components/modal/createBooking";
import { bookingFormReducer, initialBookingFormState, validateBookingForm } from "../utils/reducer/bookingReducer";

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
  const [id, setBookingId] = useState("");

  const [roomId, setRoomId] = useState("");

  const [user, setUser] = useState("");
  const [durasi, setDurasi] = useState("");
  const [jenisKelas, setJenisKelas] = useState("");
  const [statusKelas, setStatusKelas] = useState("all");
  const [dt, setDate] = useState(null);
  const [tm_start, setTmStart] = useState(null);
  const [tm_end, setTmEnd] = useState(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [stateModalCreate, setStateModalCreate] = useState("create");
  const [stateForm, dispatchStateForm] = useReducer(bookingFormReducer, initialBookingFormState);

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

  const tmstr = tm_start;
  const tmend = tm_end;

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

  const { data: rooms } = useQuery(["ROOMS"], () =>
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/room`).then((res) => res.data)
  );

  const SubmitFilter = () => {
    console.log("filter");
  };

  // GET DATA BOOKING ALL
  const {
    data: bookings,
    refetch: bookingsRefetch,
    isLoading: isLoadingBookings,
  } = useQuery(["BOOKINGS"], () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/booking`).then((res) => res.data));

  const ResetFilter = () => {
    console.log("reset filter");
  };

  // Open Modal Delete
  const handleOpenModalDelete = (e) => {
    setBookingId(e.target.getAttribute("data-id"));
    setDurasi(e.target.getAttribute("data-durasi"));
    setOpenDel(true);
  };
  const handleCloseModalDelete = () => setOpenDel(false);

  const submitAddStudent = useMutation((data) => axios.post(`${process.env.REACT_APP_BASE_URL}/api/booking`, data));
  const submitUpdateStudent = useMutation((data) =>
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/booking/${id}`, data)
  );
  const submitDeleteBooking = useMutation(() => axios.delete(`${process.env.REACT_APP_BASE_URL}/api/booking/${id}`));

  const handleSubmitCreate = () => {
    const errors = validateBookingForm(stateForm.values);
    const hasError = Object.values(errors).some((value) => Boolean(value));
    if (!hasError) {
      const data = {
        roomId: stateForm.values.roomId.value,
        teacherId: stateForm.values.teacherId.value,
        user_group: stateForm.values.user_group.map((student) => ({ id: student.value, nama_murid: student.label })),
        instrumentId: stateForm.values.instrumentId.value,
        tgl_kelas: format(stateForm.values.tgl_kelas, "yyyy-MM-dd"),
        cabang: stateForm.values.cabang,
        jam_booking: format(stateForm.values.jam_booking, "HH:mm"),
        jenis_kelas: stateForm.values.jenis_kelas,
        durasi: stateForm.values.durasi,
        status: "pending",
      };

      if (stateModalCreate === "update") {
        submitUpdateStudent.mutate(data, {
          onSuccess: (response) => {
            onSuccessMutateBooking(response);
          },
          onError: (error) => {
            onErrorMutateBooking(error);
          },
        });
      } else {
        submitAddStudent.mutate(data, {
          onSuccess: (response) => {
            onSuccessMutateBooking(response);
          },
          onError: (error) => {
            onErrorMutateBooking(error);
          },
        });
      }
    } else {
      dispatchStateForm({
        type: "change-error",
        value: errors,
      });
    }
  };

  const handleSubmitDelete = (e) => {
    e.preventDefault();
    submitDeleteBooking.mutate(
      {},
      {
        onSuccess: (response) => {
          onSuccessMutateBooking(response);
        },
        onError: (error) => {
          onErrorMutateBooking(error);
        },
      }
    );
  };

  function onSuccessMutateBooking(response) {
    bookingsRefetch();
    setOpenDel(false);
    setOpenModalCreate(false);
    toast.warning(response.data.message, {
      position: "top-center",
      autoClose: 1000,
      theme: "colored",
    });
  }

  function onErrorMutateBooking(error) {
    if (error.response) {
      toast.error(error.response, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    }
  }

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
      bookingsRefetch();
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
      bookingsRefetch();
      setOpenUpdStatus(false);
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    });
  };

  const MoveToAddBookingPage = () => {
    setOpenModalCreate(true);
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
          <Button
            variant="contained"
            color="success"
            size="small"
            sx={{ margin: 1 }}
            startIcon={<Iconify icon="eva:pencil-fill" />}
            onClick={() => setStateModalCreate("update")}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{ margin: 1 }}
            startIcon={<Iconify icon="eva:trash-fill" />}
            data-durasi={book.durasi}
            data-id={book.id}
            onClick={() => handleOpenModalDelete}
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

  const onChangeInput = (e) => {
    dispatchStateForm({
      type: "change-field",
      name: e.target.name,
      value: e.target.value,
      isEnableValidate: true,
    });
  };

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
        {!isLoadingBookings ? (
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
                format(parse(booking.tgl_kelas, "yyyy-MM-dd", new Date()), "dd-MM-yyyy"),
                booking.jam_booking,
                { ...((isUserAdmin || isUserGuru) && generateButtonAction(booking)) },
              ])}
            />
          </Scrollbar>
        ) : null}
        <CreateBooking
          open={openModalCreate}
          onClose={() => setOpenModalCreate(false)}
          state={stateModalCreate}
          stateForm={stateForm}
          onChange={onChangeInput}
          mutateCreate={submitAddStudent}
          mutateUpdate={submitUpdateStudent}
          onSubmit={handleSubmitCreate}
        />
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
