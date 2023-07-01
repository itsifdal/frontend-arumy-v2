import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
// Moment Libs
import Moment from 'moment';
// material
import {
  Link,
  Badge,
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  Grid, 
  TextField,
  MenuItem,
  FormControl
} from '@mui/material';
// components
import axios from 'axios';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
// sections
import {
  AppWidgetSummary
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {

  const navigate = useNavigate();

  const [roomId, setRoomId]        = useState('');
  const [teacherId, setTeacherId]  = useState('');
  
  const [bookings, setBookings] = useState('');
  const [booking, setBooking]  = useState('1');
  const [user, setUser] = useState('1');
  const [room, setRoom] = useState('1');
  const [post, setPost] = useState('1');

  const [foundUser, setFoundUser] = useState()
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser  = JSON.parse(loggedInUser);
      setFoundUser(foundUser);
    }
  }, []);

  if(!foundUser || foundUser === undefined) {
    navigate('/login', { replace: true });
  }

  // const [data, setData] = useState([]);

  // fetch response from server
  // const getData = async () => {
  //   await axios.get(process.env.REACT_APP_BASE_URL, { withCredentials: true }).then((response) => {
  //     setData(response.data);
  //   });
  // }

  // fetch bookings
  const getBookingCount = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/api/dashboard/bookingCount`).then((response) => {
      setBooking(response.data);
    });
  }

  // fetch users
  const getUserCount = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/api/dashboard/userCount`).then((response) => {
      setUser(response.data);
    });
  }

  // fetch rooms
  const getRoomCount = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/api/dashboard/roomCount`).then((response) => {
      setRoom(response.data);
    });
  }

  // fetch posts
  const getPostCount = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/api/dashboard/postCount`).then((response) => {
      setPost(response.data);
    });
  }

  useEffect(() => {
    getBookingCount();
    getUserCount();
    getRoomCount();
    getPostCount();
  }, [])

  // ##TEACHER
  // Store Teacher Data
  const [teachers, setTeachers] = useState('');
  // Get Teacher Data
  useEffect(() => {
    /* axios.get(`${process.env.REACT_APP_BASE_URL}/api/teacher`).then((response) => {
        setTeachers(response.data);
    }); */
  }, []);

  // ##ROOM
  // Store Room Data
  const [rooms, setRooms] = useState('');
  // Get Room Data
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/room`).then((response) => {
        setRooms(response.data);
    });
  }, []);

  // GET DATA BOOKING BY FILTER PARAMETERS
  const getBookingByNewFilter = () => {
    const data = {
      teacherId, roomId
    }
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/booking/Newfilter/default`, data).then((response) => {
      setBookings(response.data);
    });
  }

  const SubmitFilter = () => { 
    getBookingByNewFilter()
  }

  // GET DATA BOOKING ALL
  const getBookingData = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/api/booking`).then((response) => {
      setBookings(response.data);
    });
  }

  const ResetFilter = () => { 
    getBookingData()
  }

  useEffect(() => {
    getBookingData()
  }, [])

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 10 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Booking Aktif" total={booking.data} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="User" total={user.data} color="info" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Ruangan" total={room.data} color="warning" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Report" total={post.data} color="error" />
          </Grid>
        </Grid>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}><></>
        </Stack>
        <FormControl sx={{ display: 'inline' }}>
          <TextField
            select
            id="demo-simple-select"
            size="small"
            label="Teacher"
            value={teacherId}
            onChange={(e) => {
              setTeacherId(e.target.value)
            }} 
            sx={{
              width: 150,
              mr:1
            }}
          >
            <MenuItem value={"Teacher"} >- Teacher -</MenuItem>
              {Array.isArray(teachers)
                ? teachers.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option?.nama_pengajar}
                </MenuItem>
              )) : null}
          </TextField>
          <TextField
            select
            id="demo-simple-select"
            size="small"
            label="Ruangan"
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value)
            }} 
            sx={{
              width: 150,
              mr:1
            }}
          >
            <MenuItem value={"Ruangan"} >- Ruang -</MenuItem>
              {Array.isArray(rooms)
                ? rooms.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.nama_ruang}
                </MenuItem>
              )) : null}
          </TextField>
          <Button variant="contained" size="small" sx={{ width: 30, ml: 1, mt: 1 }} type="submit" onClick={SubmitFilter}>Filter </Button>
          <Button variant="contained" size="small" sx={{ width: 30, ml: 1, mt: 1 }} type="submit" onClick={ResetFilter} >Reset </Button>
        </FormControl>
        <Card sx={{ mt: 5 }}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>RUANGAN</TableCell>
                    <TableCell>TEACHER</TableCell>
                    <TableCell>JENIS</TableCell>
                    <TableCell>DURASI</TableCell>
                    <TableCell>STATUS</TableCell>
                    <TableCell>TGL KELAS</TableCell>
                    <TableCell>JAM BOOKING</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(bookings.data)
                  ? bookings.data.map(booking => ( 
                  <TableRow
                    hover
                    tabIndex={-1}
                    role="checkbox"
                    key={booking.id}
                  >
                    <TableCell align="left" component="td" >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                          {booking.room.nama_ruang}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="left" component="td" >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                          {booking?.teacher?.nama_pengajar}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="" component="td">
                      {booking.jenis_kelas === 'group' ? (
                        <Badge badgeContent={booking.jenis_kelas} color="success" />
                      ):(
                        <Badge badgeContent={booking.jenis_kelas} color="primary" />
                      )}
                    </TableCell>
                    <TableCell align="">{booking.durasi} Menit </TableCell>
                    <TableCell align="">
                      {booking.status === 'pending' ? (
                        <Badge badgeContent={booking.status} color="warning" />
                      ): null}

                      {booking.status === 'cancel' ? (
                        <Badge badgeContent={booking.status} color="error" />
                      ) : null} 
                      
                      {booking.status === 'expired' ? (
                        <Badge badgeContent={booking.status} color="secondary" />
                      ) : null } 

                      {booking.status === 'confirmed' ? (
                        <Badge badgeContent={booking.status} color="success" />
                      ) : null}
                    </TableCell>
                    <TableCell align="left">{Moment(booking.tgl_kelas).format('DD MMMM, YYYY')}</TableCell>
                    <TableCell align="left">{booking.jam_booking}</TableCell>
                  </TableRow>
                  )) : null} 
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
}
