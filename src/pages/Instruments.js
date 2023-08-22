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
import {
  instrumentFormReducer,
  initialInstrumentFormState,
  validateInstrumentForm,
} from "../utils/reducer/instrumentsReducer";
import Page from "../components/Page";
import Scrollbar from "../components/Scrollbar";
import Iconify from "../components/Iconify";
import PageHeader from "../components/PageHeader";
import BasicTable from "../components/BasicTable";
import InputBasic from "../components/input/inputBasic";
import { modalStyle } from "../constants/modalStyle";
import { queryKey } from "../constants/queryKey";

// ----------------------------------------------------------------------
export default function Instruments() {
  const [id, setId] = useState("");
  const [nama_instrument, setInstrumentName] = useState("");
  const [stateModal, setStateModal] = useState("create");

  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);

  const [stateForm, dispatchStateForm] = useReducer(instrumentFormReducer, initialInstrumentFormState);
  // query
  const {
    data: instruments,
    refetch: instrumentsRefetch,
    isLoading: isLoadingInstruments,
  } = useQuery([queryKey.instruments], () =>
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/instrument`).then((res) => res.data)
  );

  const submitAddInstrument = useMutation((data) =>
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/instrument`, data)
  );
  const submitUpdateInstrument = useMutation((data) =>
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/instrument/${id}`, data)
  );
  const submitDeleteInstrument = useMutation(() =>
    axios.delete(`${process.env.REACT_APP_BASE_URL}/api/instrument/${id}`)
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
    const errors = validateInstrumentForm(stateForm.values);
    const hasError = Object.values(errors).some((value) => Boolean(value));
    if (!hasError) {
      if (stateModal === "update") {
        submitUpdateInstrument.mutate(stateForm.values, {
          onSuccess: (response) => {
            onSuccessMutateInstrument(response);
          },
          onError: (error) => {
            onErrorMutateInstrument(error);
          },
        });
      } else {
        submitAddInstrument.mutate(stateForm.values, {
          onSuccess: (response) => {
            onSuccessMutateInstrument(response);
          },
          onError: (error) => {
            onErrorMutateInstrument(error);
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
      name: "nama_instrument",
      value: e.target.getAttribute("data-nama_instrument"),
    });
    setStateModal("update");
    setOpen(true);
  };

  const handleOpenModalDelete = (e) => {
    setId(e.target.getAttribute("data-id"));
    setInstrumentName(e.target.getAttribute("data-nama_instrument"));
    setOpenDel(true);
  };
  const handleCloseModalDelete = () => setOpenDel(false);
  const handleSubmitDelete = (e) => {
    e.preventDefault();
    submitDeleteInstrument.mutate(
      {},
      {
        onSuccess: (response) => {
          onSuccessMutateInstrument(response);
        },
        onError: (error) => {
          onErrorMutateInstrument(error);
        },
      }
    );
  };

  function onSuccessMutateInstrument(response) {
    instrumentsRefetch();
    setOpen(false);
    setOpenDel(false);
    toast.success(response.data.message, {
      position: "top-center",
      autoClose: 1000,
      theme: "colored",
    });
    dispatchStateForm({
      type: "reset-field",
    });
  }

  function onErrorMutateInstrument(error) {
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
    <Page title="Instrument">
      <PageHeader
        title="Instruments"
        rightContent={
          <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModalCreate}>
            Add new instrument
          </Button>
        }
      />
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        {!isLoadingInstruments ? (
          <Scrollbar>
            <BasicTable
              header={["INSTRUMENT NAME", " "]}
              body={instruments.map((room) => [
                room.nama_instrument,
                <Stack key={room.id} direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<Iconify icon="mdi:pencil" />}
                    data-id={room.id}
                    data-nama_instrument={room.nama_instrument}
                    onClick={handleOpenModalUpdate}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<Iconify icon="eva:trash-fill" />}
                    data-nama_instrument={room.nama_instrument}
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
                {stateModal === "update" ? "Update Instrument" : "Create Instrument"}
              </Typography>
            </Box>
            <Box paddingBottom={2}>
              <InputBasic
                required
                label="Nama Instrument"
                name="nama_instrument"
                value={stateForm.values.nama_instrument}
                error={Boolean(stateForm.errors.nama_instrument)}
                errorMessage={stateForm.errors.nama_instrument}
                onChange={(e) => {
                  onChangeInput(e);
                }}
              />
            </Box>
            <LoadingButton
              loading={submitAddInstrument.isLoading || submitUpdateInstrument.isLoading}
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
              Delete {nama_instrument} ?
            </Typography>
            <FormControl fullWidth>
              <LoadingButton
                loading={submitDeleteInstrument.isLoading}
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
