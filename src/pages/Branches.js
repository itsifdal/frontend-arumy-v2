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
import { branchFormReducer, initialBranchFormState, validateBranchForm } from "../utils/reducer/branchesReducer";
import Page from "../components/Page";
import Scrollbar from "../components/Scrollbar";
import Iconify from "../components/Iconify";
import PageHeader from "../components/PageHeader";
import BasicTable from "../components/BasicTable";
import InputBasic from "../components/input/inputBasic";
import { modalStyle } from "../constants/modalStyle";
import { queryKey } from "../constants/queryKey";

// ----------------------------------------------------------------------
export default function Branches() {
  const [id, setId] = useState("");
  const [nama_cabang, setBranchName] = useState("");
  const [stateModal, setStateModal] = useState("create");

  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);

  const [stateForm, dispatchStateForm] = useReducer(branchFormReducer, initialBranchFormState);
  // query
  const {
    data: branches,
    refetch: branchesRefetch,
    isLoading: isLoadingBranches,
  } = useQuery([queryKey.branches], () =>
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/cabang`).then((res) => res.data)
  );

  const submitAddBranch = useMutation((data) => axios.post(`${process.env.REACT_APP_BASE_URL}/api/cabang`, data));
  const submitUpdateBranch = useMutation((data) =>
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/cabang/${id}`, data)
  );
  const submitDeleteBranch = useMutation(() => axios.delete(`${process.env.REACT_APP_BASE_URL}/api/cabang/${id}`));

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
    const errors = validateBranchForm(stateForm.values);
    const hasError = Object.values(errors).some((value) => Boolean(value));
    if (!hasError) {
      if (stateModal === "update") {
        submitUpdateBranch.mutate(stateForm.values, {
          onSuccess: (response) => {
            onSuccessMutateBranch(response);
          },
          onError: (error) => {
            onErrorMutateBranch(error);
          },
        });
      } else {
        submitAddBranch.mutate(stateForm.values, {
          onSuccess: (response) => {
            onSuccessMutateBranch(response);
          },
          onError: (error) => {
            onErrorMutateBranch(error);
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
      name: "lokasi_cabang",
      value: e.target.getAttribute("data-lokasi_cabang"),
    });
    dispatchStateForm({
      type: "change-field",
      name: "nama_cabang",
      value: e.target.getAttribute("data-nama_cabang"),
    });
    setStateModal("update");
    setOpen(true);
  };

  const handleOpenModalDelete = (e) => {
    setId(e.target.getAttribute("data-id"));
    setBranchName(e.target.getAttribute("data-nama_cabang"));
    setOpenDel(true);
  };
  const handleCloseModalDelete = () => setOpenDel(false);
  const handleSubmitDelete = (e) => {
    e.preventDefault();
    submitDeleteBranch.mutate(
      {},
      {
        onSuccess: (response) => {
          onSuccessMutateBranch(response);
        },
        onError: (error) => {
          onErrorMutateBranch(error);
        },
      }
    );
  };

  function onSuccessMutateBranch(response) {
    branchesRefetch();
    setOpen(false);
    setOpenDel(false);
    toast.success(response.data.message, {
      position: "top-center",
      autoClose: 5000,
      theme: "colored",
    });
    dispatchStateForm({
      type: "reset-field",
    });
  }

  function onErrorMutateBranch(error) {
    if (error) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan pada sistem.", {
        position: "top-center",
        autoClose: 5000,
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
    <Page title="Branch">
      <PageHeader
        title="Branches"
        rightContent={
          <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModalCreate}>
            Add new Branch
          </Button>
        }
      />
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        {!isLoadingBranches ? (
          <Scrollbar>
            <BasicTable
              header={["BRANCH NAME", " "]}
              body={branches.data.map((room) => [
                room.nama_cabang,
                <Stack key={room.id} direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<Iconify icon="mdi:pencil" />}
                    data-id={room.id}
                    data-lokasi_cabang={room.lokasi_cabang}
                    data-nama_cabang={room.nama_cabang}
                    onClick={handleOpenModalUpdate}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<Iconify icon="eva:trash-fill" />}
                    data-nama_cabang={room.nama_cabang}
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
              <Typography id="modal-modal-title" variant="h4" component="h2" fontWeight={700} color={"#172560"}>
                {stateModal === "update" ? `Update Branch #${id}` : "Create Branch"}
              </Typography>
            </Box>
            <Box paddingBottom={2}>
              <InputBasic
                required
                label="Nama Cabang"
                name="nama_cabang"
                value={stateForm.values.nama_cabang}
                error={Boolean(stateForm.errors.nama_cabang)}
                errorMessage={stateForm.errors.nama_cabang}
                onChange={(e) => {
                  onChangeInput(e);
                }}
              />
            </Box>
            <LoadingButton
              loading={submitAddBranch.isLoading || submitUpdateBranch.isLoading}
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
              Delete {nama_cabang} ?
            </Typography>
            <FormControl fullWidth>
              <LoadingButton
                loading={submitDeleteBranch.isLoading}
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
