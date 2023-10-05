/* eslint-disable camelcase */
// ----------------------------------------------------------------------
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// Moment Libs
import Moment from "moment";
// material
import { Typography, MenuItem, Container, Stack, Button, TextField, FormControl } from "@mui/material";
// Date Picker
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { TimePicker, DatePicker } from "@mui/x-date-pickers/";

import axios from "axios";
import Page from "../components/Page";

const Swal = require("sweetalert2");
// ----------------------------------------------------------------------
export default function Booking() {
  const navigate = useNavigate();

  // ##ROOM
  // Store Room Data
  const [rooms, setRooms] = useState("");
  // Get Room Data
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/room`).then((response) => {
      setRooms(response.data);
    });
  }, []);

  // ##TEACHER
  // Store Teacher Data
  const [teachers, setTeachers] = useState("");
  // Get Teacher Data
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/teacher`).then((response) => {
      setTeachers(response.data);
    });
  }, []);

  // ##INSTRUMENT
  // Store Instrument Data
  const [instruments, setInstruments] = useState("");
  // Get Instrument Data
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/instrument`).then((response) => {
      setInstruments(response.data);
    });
  }, []);

  const [roomId, setRoomId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [instrumentId, setInstrumentId] = useState("");
  const [classDate, setClassDate] = useState("");
  const [cabang, setCabang] = useState("");
  const [tm_start, setTmStart] = useState(null);
  const [jenis_kelas, setJenisKelas] = useState(null);
  const [durasi, setDurasi] = useState(null);

  const tmstr = Moment(tm_start, "HH:mm").format("HH:mm");

  const momentObj = Moment(classDate);
  const formattedDate = momentObj.format("YYYY-MM-DD");

  const handleSubmitCreate = (e) => {
    e.preventDefault();
    const data = {
      roomId,
      teacherId,
      instrumentId,
      tgl_kelas: formattedDate,
      cabang,
      jam_booking: tmstr,
      jenis_kelas,
      durasi,
      status: "pending",
    };
    console.log(data);
    if (tmstr < "06:00:00") {
      // axios.post(`${process.env.REACT_APP_BASE_URL}/api/booking`, data)
      Swal.fire({
        title: "Invalid Schedule!",
        text: "Booking Kelas berlaku pada jam 07.00 - 16.00",
        icon: "error",
        confirmButtonText: "Close",
      });
    } else {
      axios.post(`${process.env.REACT_APP_BASE_URL}/api/booking`, data).then((response) => {
        if (response.data.message === "Invalid Request, Schedule Same") {
          Swal.fire({
            title: "Invalid Schedule!",
            text: "Kelas telah dibooking Pada jam yang sama",
            icon: "error",
            confirmButtonText: "Close",
          });
        } else {
          navigate(`/app/booking`);
          // Swal.fire({
          //   title: 'Valid Request!',
          //   text: 'Sukses Booking Ruangan ',
          //   icon: 'success',
          //   confirmButtonText: 'Close'
          // })
        }
      });
    }
  };

  const handleChangeRuang = (e) => {
    setRoomId(e.target.value);
  };

  const handleChangeTeacher = (e) => {
    setTeacherId(e.target.value);
  };

  const handleChangeInstrument = (e) => {
    setInstrumentId(e.target.value);
  };

  const handleChangeJenis = (e) => {
    setJenisKelas(e.target.value);
  };

  return (
    <Page title="Add Booking">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Add Booking
          </Typography>
          <Button variant="contained" component={RouterLink} to="/app/booking">
            Kembali
          </Button>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <FormControl fullWidth>
            <TextField
              id="outlined-select-currency ruang"
              select
              margin="normal"
              label="Ruang"
              onChange={handleChangeRuang}
            >
              <MenuItem value={"Ruang"}>- Ruangan -</MenuItem>
              {Array.isArray(rooms)
                ? rooms.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.nama_ruang}
                    </MenuItem>
                  ))
                : null}
            </TextField>

            <TextField
              id="outlined-select-currency teacher"
              select
              margin="normal"
              label="Teacher"
              onChange={handleChangeTeacher}
            >
              <MenuItem value={"Teacher"}>- Teacher -</MenuItem>
              {Array.isArray(teachers)
                ? teachers.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.nama_pengajar}
                    </MenuItem>
                  ))
                : null}
            </TextField>

            <TextField
              id="outlined-select-currency instrument"
              select
              margin="normal"
              label="Instrument"
              onChange={handleChangeInstrument}
            >
              <MenuItem value={"Instrument"}>- Instrument -</MenuItem>
              {Array.isArray(instruments)
                ? instruments.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.nama_instrument}
                    </MenuItem>
                  ))
                : null}
            </TextField>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={classDate}
                onChange={(newValue) => {
                  setClassDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} margin="normal" size="small" />}
              />
            </LocalizationProvider>
            <TextField
              required
              id="outlined-required"
              margin="normal"
              label="Cabang"
              name="cabang"
              onChange={(e) => {
                setCabang(e.target.value);
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="Jam Booking"
                ampm={false}
                margin="normal"
                value={tm_start}
                onChange={(newValue) => {
                  setTmStart(newValue);
                }}
                renderInput={(props) => <TextField {...props} margin="normal" />}
              />
            </LocalizationProvider>
            <TextField
              id="outlined-select-currency jenis"
              select
              margin="normal"
              label="Jenis Kelas"
              onChange={handleChangeJenis}
            >
              <MenuItem value={"Jenis Kelas"}>Jenis kelas</MenuItem>
              <MenuItem value={"Privat"}>Privat</MenuItem>
              <MenuItem value={"Group"}>Group</MenuItem>
            </TextField>
            <TextField
              required
              id="outlined-required"
              margin="normal"
              label="Durasi"
              name="durasi"
              onChange={(e) => {
                setDurasi(e.target.value);
              }}
            />
            <Button variant="contained" type="submit" onClick={handleSubmitCreate}>
              Submit
            </Button>
          </FormControl>
        </Stack>
      </Container>
    </Page>
  );
}
