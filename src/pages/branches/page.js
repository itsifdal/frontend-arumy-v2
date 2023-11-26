import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "@mui/material";

import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import BranchDeleteModal from "./deleteModal";
import BranchFormModal from "./formModal";
import BranchList from "./dataList";
import BranchCreateButton from "./createButton";
import { useBranchQuery } from "./query";

// ----------------------------------------------------------------------
export default function Branches() {
  const [id, setId] = useState("");
  const [branchName, setBranchName] = useState("");
  const [stateModal, setStateModal] = useState("create");
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const { refetch: branchesRefetch } = useBranchQuery();

  const handleCloseModalUpdate = () => {
    setStateModal("create");
    setIsOpenCreateModal(false);
  };
  const handleCloseModalDelete = () => setIsOpenDeleteModal(false);

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
      <PageHeader title="Branches" rightContent={<BranchCreateButton />} />
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        <BranchList onClickEdit={handleOpenModalUpdate} onClickDelete={handleOpenModalDelete} />

        <BranchFormModal
          open={isOpenCreateModal}
          onClose={handleCloseModalUpdate}
          dataName={String(branchName)}
          id={String(id)}
          onError={(err) => onErrorMutateBranch(err)}
          onSuccess={(res) => onSuccessMutateBranch(res)}
          stateModal={stateModal}
        />

        <BranchDeleteModal
          open={isOpenDeleteModal}
          onClose={handleCloseModalDelete}
          dataName={String(branchName)}
          id={String(id)}
          onError={(err) => onErrorMutateBranch(err)}
          onSuccess={(res) => onSuccessMutateBranch(res)}
        />
      </Container>
    </Page>
  );
}
