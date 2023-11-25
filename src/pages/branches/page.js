import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import { useForm } from "react-hook-form";

import "react-toastify/dist/ReactToastify.css";

// material
import { Stack, Button, Container, Typography, Modal, FormControl, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// components
import Page from "../../components/Page";
import Scrollbar from "../../components/Scrollbar";
import Iconify from "../../components/Iconify";
import PageHeader from "../../components/PageHeader";
import BasicTable from "../../components/BasicTable";
import { CustomTextField } from "../../components/input/inputBasic";
import CustomInputLabel from "../../components/input/inputLabel";
import { modalStyle } from "../../constants/modalStyle";
import { queryKey } from "../../constants/queryKey";
import BranchDeleteModal from "./deleteModal";

// ----------------------------------------------------------------------
export default function Branches() {
  const [id, setId] = useState("");
  const [branchName, setBranchName] = useState("");
  const [stateModal, setStateModal] = useState("create");
  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);
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

  const {
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    if (stateModal === "update") {
      submitUpdateBranch.mutate(data, {
        onSuccess: (response) => {
          onSuccessMutateBranch(response);
        },
        onError: (error) => {
          onErrorMutateBranch(error);
        },
      });
    } else {
      submitAddBranch.mutate(data, {
        onSuccess: (response) => {
          onSuccessMutateBranch(response);
        },
        onError: (error) => {
          onErrorMutateBranch(error);
        },
      });
    }
  };
  //----
  const handleOpenModalCreate = () => setOpen(true);
  const handleCloseModalCreate = () => {
    resetForm();
    setStateModal("create");
    setOpen(false);
  };

  const handleOpenModalUpdate = ({ updateId, updateName }) => {
    setId(updateId);
    setValue("nama_cabang", updateName);
    setStateModal("update");
    setOpen(true);
  };

  const handleOpenModalDelete = ({ deleteId, deleteName }) => {
    setId(deleteId);
    setBranchName(deleteName);
    setOpenDel(true);
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
    resetForm();
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
                    onClick={() => handleOpenModalUpdate({ updateId: room.id, updateName: room.nama_cabang })}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<Iconify icon="eva:trash-fill" />}
                    onClick={() => handleOpenModalDelete({ deleteId: room.id, deleteName: room.nama_cabang })}
                  >
                    Delete {room.id}
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box marginBottom={2}>
                <Typography id="modal-modal-title" variant="h4" component="h2" fontWeight={700} color={"#172560"}>
                  {stateModal === "update" ? `Update Branch #${id}` : "Create Branch"}
                </Typography>
              </Box>
              <Box paddingBottom={2}>
                <FormControl fullWidth error={!!errors.nama_cabang}>
                  <CustomInputLabel htmlFor="nama_cabang">Nama Cabang*</CustomInputLabel>
                  <CustomTextField
                    {...register("nama_cabang", { required: "Nama Cabang Wajib diisi" })}
                    helperText={errors.nama_cabang?.message}
                    error={!!errors.nama_cabang}
                  />
                </FormControl>
              </Box>
              <LoadingButton
                loading={submitAddBranch.isLoading || submitUpdateBranch.isLoading}
                variant="contained"
                type="submit"
                fullWidth
              >
                Save
              </LoadingButton>
            </form>
          </Box>
        </Modal>

        <BranchDeleteModal
          open={openDel}
          onClose={() => setOpenDel(false)}
          dataName={String(branchName)}
          id={String(id)}
          onError={(err) => onErrorMutateBranch(err)}
          onSuccess={(res) => onSuccessMutateBranch(res)}
        />
      </Container>
    </Page>
  );
}
