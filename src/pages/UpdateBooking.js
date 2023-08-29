/* eslint-disable camelcase */
// ----------------------------------------------------------------------
import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
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

// ----------------------------------------------------------------------
export default function Booking() {
  const navigate = useNavigate();

  const { id } = useParams();

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

  // Get Booking Data by ID
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/booking/${id}`).then((response) => {
      setRoomId(response.data[0].roomId);
      setTeacherId(response.data[0].teacherId);
      setInstrumentId(response.data[0].instrumentId);
      setClassDate(response.data[0].tgl_kelas);
      setCabang(response.data[0].cabang);
      setTmStart(response.data[0].jam_booking);
      setJenisKelas(response.data[0].jenis_kelas);
      setDurasi(response.data[0].durasi);
    });
  }, [id]);

  const [roomId, setRoomId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [instrumentId, setInstrumentId] = useState("");
  const [classDate, setClassDate] = useState("");
  const [cabang, setCabang] = useState("");
  const [tm_start, setTmStart] = useState(null);
  const [jenis_kelas, setJenisKelas] = useState("");
  const [durasi, setDurasi] = useState("");

  const tmstr = Moment(tm_start, "HH:mm").format("HH:mm");

  const momentObj = Moment(classDate);
  const formattedDate = momentObj.format("YYYY-MM-DD");

  console.log(tm_start);

  const handleSubmitUpdate = (e) => {
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
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/booking/${id}`, data).then(() => {
      navigate(`/app/booking`);
    });
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
            Update Booking
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
              value={roomId}
              onChange={handleChangeRuang}
            >
              <MenuItem value={"Ruang"}>- Ruangan -</MenuItem>
              {Array.isArray(rooms)
                ? rooms.map((option) => (
                    <MenuItem key={option.id} value={option.id} selected={option.id === roomId}>
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
              value={teacherId}
              onChange={handleChangeTeacher}
            >
              <MenuItem value={"Teacher"}>- Teacher -</MenuItem>
              {Array.isArray(teachers)
                ? teachers.map((option) => (
                    <MenuItem key={option.id} value={option.id} selected={option.id === teacherId}>
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
              value={instrumentId}
              onChange={handleChangeInstrument}
            >
              <MenuItem value={"Instrument"}>- Instrument -</MenuItem>
              {Array.isArray(instruments)
                ? instruments.map((option) => (
                    <MenuItem key={option.id} value={option.id} elected={option.id === instrumentId}>
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
              value={cabang}
              onChange={(e) => {
                setCabang(e.target.value);
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="Jam Booking"
                ampm={false}
                format="HH:mm:ss"
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
              value={jenis_kelas}
              onChange={handleChangeJenis}
            >
              <MenuItem value={"Jenis Kelas"}>Jenis kelas</MenuItem>
              <MenuItem value={"privat"}>Privat</MenuItem>
              <MenuItem value={"group"}>Group</MenuItem>
            </TextField>
            <TextField
              required
              id="outlined-required"
              margin="normal"
              label="Durasi"
              name="durasi"
              value={durasi}
              onChange={(e) => {
                setDurasi(e.target.value);
              }}
            />
            <Button variant="contained" type="submit" onClick={handleSubmitUpdate}>
              Submit
            </Button>
          </FormControl>
        </Stack>
      </Container>
    </Page>
  );
}
