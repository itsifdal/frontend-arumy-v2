import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useQuery } from "react-query";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";

// material
import { Stack, Button, Container } from "@mui/material";

// components
import Page from "../../components/Page";
import Scrollbar from "../../components/Scrollbar";
import Iconify from "../../components/Iconify";
import PageHeader from "../../components/PageHeader";
import BasicTable from "../../components/BasicTable";
import { queryKey } from "../../constants/queryKey";
import BranchDeleteModal from "./deleteModal";
import BranchFormModal from "./formModal";

// ----------------------------------------------------------------------
export default function Branches() {
  const [id, setId] = useState("");
  const [branchName, setBranchName] = useState("");
  const [stateModal, setStateModal] = useState("create");
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  // query
  const {
    data: branches,
    refetch: branchesRefetch,
    isLoading: isLoadingBranches,
  } = useQuery([queryKey.branches], () =>
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/cabang`).then((res) => res.data)
  );

  //----
  const handleOpenModalCreate = () => setIsOpenCreateModal(true);

  const handleOpenModalUpdate = ({ updateId, updateName }) => {
    setId(updateId);
    setBranchName(updateName);
    setStateModal("update");
    setIsOpenCreateModal(true);
  };

  const handleOpenModalDelete = ({ deleteId, deleteName }) => {
    setId(deleteId);
    setBranchName(deleteName);
    setIsOpenDeleteModal(true);
  };

  function onSuccessMutateBranch(response) {
    branchesRefetch();
    setIsOpenCreateModal(false);
    setIsOpenDeleteModal(false);
    toast.success(response.data.message, {
      position: "top-center",
      autoClose: 5000,
      theme: "colored",
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

        <BranchFormModal
          open={isOpenCreateModal}
          onClose={() => {
            setStateModal("create");
            setIsOpenCreateModal(false);
          }}
          dataName={String(branchName)}
          id={String(id)}
          onError={(err) => onErrorMutateBranch(err)}
          onSuccess={(res) => onSuccessMutateBranch(res)}
          stateModal={stateModal}
        />

        <BranchDeleteModal
          open={isOpenDeleteModal}
          onClose={() => setIsOpenDeleteModal(false)}
          dataName={String(branchName)}
          id={String(id)}
          onError={(err) => onErrorMutateBranch(err)}
          onSuccess={(res) => onSuccessMutateBranch(res)}
        />
      </Container>
    </Page>
  );
}
