/* eslint-disable camelcase */
// import { Link as RouterLink } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// material
import {
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
  Modal,
  FormControl,
  TextField,
  Box
} from '@mui/material';

// components
import axios from 'axios';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';

// Style box
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
// ----------------------------------------------------------------------
export default function Room() {

  const [rooms, setRooms]= useState('');
  const [id, setId]= useState('');
  const [lokasi_cabang, setlokasi_cabang]= useState('');
  const [nama_ruang, setRoomName]= useState('');

  const [open, setOpen]  = useState(false);
  const [openDel, setOpenDel]  = useState(false);
  const [openUpd, setOpenUpd]  = useState(false);

  // fetch api
  const getRoomData = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/api/room`).then((response) => {
      setRooms(response.data);
    });
  }

  useEffect(() => {
    getRoomData()
  }, [])

  //----
  const handleOpenModalCreate  = () => setOpen(true);
  const handleCloseModalCreate = () => setOpen(false);
  const handleSubmitCreate = (e) => {
    e.preventDefault();
    const data = {
      nama_ruang,lokasi_cabang
    }
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/room`, data).then((response) => {
      getRoomData()
      setOpen(false)
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    });
    
  }

  //
  const handleOpenModalUpdate  = (e) => {
    setId(e.target.getAttribute("data-id"))
    setlokasi_cabang(e.target.getAttribute("data-lokasi_cabang"))
    setRoomName(e.target.getAttribute("data-nama_ruang"))
    setOpenUpd(true);
  }
  const handleCloseModalUpdate = () => setOpenUpd(false);
  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    const data = {
      lokasi_cabang,nama_ruang
    }
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/room/${id}`, data).then((response)=> {
      getRoomData()
      setOpenUpd(false)
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    })
    
  }

  //
  const handleOpenModalDelete  = (e) => {
    setId(e.target.getAttribute("data-id"))
    setRoomName(e.target.getAttribute("data-nama_ruang"))
    setOpenDel(true);
  }
  const handleCloseModalDelete = () => setOpenDel(false);
  const handleSubmitDelete = (e) => {
    e.preventDefault();
    axios.delete(`${process.env.REACT_APP_BASE_URL}/api/room/${id}`).then((response)=> {
      getRoomData()
      setOpenDel(false)
      toast.warning(response.data.message, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    })
  }
  

  return (
    <React.Fragment key={rooms.room_id}>
    <Page title="Room">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Rooms
          </Typography>
          <Button variant="contained"  startIcon={<Iconify icon="eva:plus-fill"/>} onClick={handleOpenModalCreate}>
            New Room
          </Button>
        </Stack>
        <ToastContainer pauseOnFocusLoss={false}/>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ROOM NAME</TableCell>
                    <TableCell>DESCRIPTION</TableCell>
                    <TableCell>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(rooms)
                  ? rooms.map(room => ( 
                  <TableRow
                    hover
                    tabIndex={-1}
                    role="checkbox"
                    key={room.room_id}
                  >
                    <TableCell align="left" component="td" >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                          {room.nama_ruang} 
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="left" component="td" >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                          {room.lokasi_cabang} 
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="left">
                      <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="success" size="small" startIcon={<Iconify icon="eva:pencil-fill"/> } 
                          data-id={room.id}
                          data-lokasi_cabang={room.lokasi_cabang} 
                          data-nama_ruang={room.nama_ruang}
                          onClick={handleOpenModalUpdate}> 
                          Update
                        </Button>  
                        <Button variant="contained" color="error" size="small" startIcon={<Iconify icon="eva:trash-fill"/> } 
                          data-nama_ruang={room.nama_ruang} 
                          data-id={room.id}  
                          onClick={handleOpenModalDelete}> 
                          Delete
                        </Button> 
                      </Stack> 
                    </TableCell>
                  </TableRow>
                  )) : null} 
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
        <div>
          <Modal
            open={open}
            onClose={handleCloseModalCreate}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Create Room
              </Typography>
              <FormControl fullWidth >
                <TextField required id="outlined-required" margin="normal" label="Nama Ruang"  name="nama_ruang" value={nama_ruang} onChange={(e) => {setRoomName(e.target.value)}} />
                <TextField required id="outlined-required" margin="normal" label="Lokasi Cabang"  name="lokasi_cabang" value={lokasi_cabang} onChange={(e) => {setlokasi_cabang(e.target.value)}} />
                <Button variant="contained" type="submit" onClick={handleSubmitCreate}>Save</Button>
              </FormControl>
            </Box>
          </Modal>
        </div>
        <div>
          <Modal
            open={openUpd}
            onClose={handleCloseModalUpdate}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Update {nama_ruang}
              </Typography>
              <FormControl fullWidth >
                <TextField required id="outlined-required" margin="normal" label="Room Code"  name="lokasi_cabang" value={lokasi_cabang} onChange={(e) => {setlokasi_cabang(e.target.value)}} />
                <TextField required id="outlined-required" margin="normal" label="Room Name"  name="nama_ruang" value={nama_ruang} onChange={(e) => {setRoomName(e.target.value)}} />
                <Button variant="contained" type="submit" onClick={handleSubmitUpdate}>Update</Button>
              </FormControl>
            </Box>
          </Modal>
        </div>
        <div>
          <Modal
            open={openDel}
            onClose={handleCloseModalDelete}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={5}>
                Delete {nama_ruang} ?
              </Typography>
              <FormControl fullWidth >
                <Button variant="contained" type="submit" onClick={handleSubmitDelete}>Delete</Button>
              </FormControl>
            </Box>
          </Modal>
        </div>
      </Container>
    </Page>
    </React.Fragment>
  );
}
