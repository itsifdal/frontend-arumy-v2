/* eslint-disable camelcase */
// import { Link as RouterLink } from 'react-router-dom';
import React, { useState, useReducer } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useQuery, useMutation } from "react-query";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";

// material
import { Stack, Button, Container, Typography, Modal, FormControl, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// components
import { roomFormReducer, initialRoomFormState, validateRoomForm } from "../utils/reducer/roomReducer";
import Page from "../components/Page";
import Scrollbar from "../components/Scrollbar";
import Iconify from "../components/Iconify";
import PageHeader from "../components/PageHeader";
import BasicTable from "../components/BasicTable";
import InputBasic from "../components/input/inputBasic";
import { modalStyle } from "../constants/modalStyle";
import { queryKey } from "../constants/queryKey";
import SelectBasic from "../components/input/selectBasic";

// ----------------------------------------------------------------------
export default function Room() {
  const [id, setId] = useState("");
  const [nama_ruang, setRoomName] = useState("");
  const [stateModal, setStateModal] = useState("create");

  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);

  const [stateForm, dispatchStateForm] = useReducer(roomFormReducer, initialRoomFormState);
  // query
  const {
    data: rooms,
    refetch: roomsRefetch,
    isLoading: isLoadingRooms,
  } = useQuery([queryKey.rooms], () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/room`).then((res) => res.data));

  const submitAddRoom = useMutation((data) => axios.post(`${process.env.REACT_APP_BASE_URL}/api/room`, data));
  const submitUpdateRoom = useMutation((data) => axios.put(`${process.env.REACT_APP_BASE_URL}/api/room/${id}`, data));
  const submitDeleteRoom = useMutation(() => axios.delete(`${process.env.REACT_APP_BASE_URL}/api/room/${id}`));

  const { data: branches = [{ value: "", label: "" }] } = useQuery(
    [queryKey.branches],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/cabang`).then((res) => res.data),
    {
      select: (branches) => branches.data.map((branch) => ({ value: branch.id, label: branch.nama_cabang })),
    }
  );

  //----
  const handleOpenModalCreate = () => setOpen(true);
  const handleCloseModalCreate = () => {
    dispatchStateForm({
      type: "reset-field",
    });
    setStateModal("create");
    setOpen(false);
  };

  const handleSubmitCreate = (e) => {
    e.preventDefault();
    const errors = validateRoomForm(stateForm.values);
    const hasError = Object.values(errors).some((value) => Boolean(value));
    if (!hasError) {
      if (stateModal === "update") {
        submitUpdateRoom.mutate(stateForm.values, {
          onSuccess: (response) => {
            onSuccessMutateRoom(response);
          },
          onError: (error) => {
            onErrorMutateRoom(error);
          },
        });
      } else {
        submitAddRoom.mutate(stateForm.values, {
          onSuccess: (response) => {
            onSuccessMutateRoom(response);
          },
          onError: (error) => {
            onErrorMutateRoom(error);
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

  const handleOpenModalUpdate = (e) => {
    setId(e.target.getAttribute("data-id"));
    dispatchStateForm({
      type: "change-field",
      name: "cabangId",
      value: e.target.getAttribute("data-cabangId"),
    });
    dispatchStateForm({
      type: "change-field",
      name: "nama_ruang",
      value: e.target.getAttribute("data-nama_ruang"),
    });
    setStateModal("update");
    setOpen(true);
  };

  const handleOpenModalDelete = (e) => {
    setId(e.target.getAttribute("data-id"));
    setRoomName(e.target.getAttribute("data-nama_ruang"));
    setOpenDel(true);
  };
  const handleCloseModalDelete = () => setOpenDel(false);
  const handleSubmitDelete = (e) => {
    e.preventDefault();
    submitDeleteRoom.mutate(
      {},
      {
        onSuccess: (response) => {
          onSuccessMutateRoom(response);
        },
        onError: (error) => {
          onErrorMutateRoom(error);
        },
      }
    );
  };

  function onSuccessMutateRoom(response) {
    roomsRefetch();
    setOpen(false);
    setOpenDel(false);
    setStateModal("create");
    toast.success(response.data.message, {
      position: "top-center",
      autoClose: 1000,
      theme: "colored",
    });
    dispatchStateForm({
      type: "reset-field",
    });
  }

  function onErrorMutateRoom(error) {
    if (error.response) {
      toast.error(error.response, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    }
  }

  function onChangeInput(e) {
    dispatchStateForm({
      type: "change-field",
      name: e.target.name,
      value: e.target.value,
      isEnableValidate: true,
    });
  }

  return (
    <Page title="Room">
      <PageHeader
        title="Rooms"
        rightContent={
          <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModalCreate}>
            Add new Room
          </Button>
        }
      />
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        {!isLoadingRooms ? (
          <Scrollbar>
            <BasicTable
              header={["ROOM NAME", "CABANG", " "]}
              body={rooms.map((room) => [
                room.nama_ruang,
                room.cabang?.nama_cabang,
                <Stack key={room.id} direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<Iconify icon="mdi:pencil" />}
                    data-id={room.id}
                    data-cabangId={room.cabangId}
                    data-nama_ruang={room.nama_ruang}
                    onClick={handleOpenModalUpdate}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<Iconify icon="eva:trash-fill" />}
                    data-nama_ruang={room.nama_ruang}
                    data-id={room.id}
                    onClick={handleOpenModalDelete}
                  >
                    Delete
                  </Button>
                </Stack>,
              ])}
            />
          </Scrollbar>
        ) : null}

        <Modal
          open={open}
          onClose={handleCloseModalCreate}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...modalStyle, maxWidth: 400 }}>
            <Box marginBottom={2}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {stateModal === "update" ? "Update Room" : "Create Room"}
              </Typography>
            </Box>
            <Box paddingBottom={2}>
              <InputBasic
                required
                label="Nama Ruang"
                name="nama_ruang"
                value={stateForm.values.nama_ruang}
                error={Boolean(stateForm.errors.nama_ruang)}
                errorMessage={stateForm.errors.nama_ruang}
                onChange={(e) => {
                  onChangeInput(e);
                }}
              />
            </Box>
            <Box paddingBottom={2}>
              <SelectBasic
                required
                fullWidth
                id="cabangId"
                name="cabangId"
                defaultValue={branches[0].value}
                value={stateForm.values.cabangId}
                error={Boolean(stateForm.errors.cabangId)}
                errorMessage={stateForm.errors.cabangId}
                onChange={(e) => {
                  onChangeInput(e);
                }}
                select
                label="Cabang"
                options={branches}
              />
            </Box>
            <LoadingButton
              loading={submitAddRoom.isLoading || submitUpdateRoom.isLoading}
              variant="contained"
              type="submit"
              fullWidth
              onClick={handleSubmitCreate}
            >
              Save
            </LoadingButton>
          </Box>
        </Modal>

        <Modal
          open={openDel}
          onClose={handleCloseModalDelete}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...modalStyle, maxWidth: 400 }}>
            <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={5}>
              Delete {nama_ruang} ?
            </Typography>
            <FormControl fullWidth>
              <LoadingButton
                loading={submitDeleteRoom.isLoading}
                variant="contained"
                type="submit"
                onClick={handleSubmitDelete}
              >
                Delete
              </LoadingButton>
            </FormControl>
          </Box>
        </Modal>
      </Container>
    </Page>
  );
}
