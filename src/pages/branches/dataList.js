import React, { useState } from "react";

import { Stack, Button } from "@mui/material";

import Scrollbar from "../../components/Scrollbar";
import BasicTable from "../../components/BasicTable";
import Iconify from "../../components/Iconify";
import BranchDeleteModal from "./deleteModal";
import BranchFormModal from "./formModal";
import { useGetBranchs } from "./query";
import { onSuccessToast, onErrorToast } from "./callback";

export default function BranchList() {
  const [id, setId] = useState("");
  const [branchName, setBranchName] = useState("");
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const { data: branches, isLoading, isError, refetch: branchesRefetch } = useGetBranchs();

  const handleCloseModalUpdate = () => setIsOpenUpdateModal(false);
  const handleCloseModalDelete = () => setIsOpenDeleteModal(false);

  const onClickEdit = ({ updateId, updateName }) => {
    setId(updateId);
    setBranchName(updateName);
    setIsOpenUpdateModal(true);
  };

  const onClickDelete = ({ deleteId, deleteName }) => {
    setId(deleteId);
    setBranchName(deleteName);
    setIsOpenDeleteModal(true);
  };

  const onSuccessUpdate = () => {
    branchesRefetch();
    setIsOpenUpdateModal(false);
  };

  const onSuccessDelete = () => {
    branchesRefetch();
    setIsOpenDeleteModal(false);
  };

  if (isLoading) return <>Loading Data</>;
  if (isError) return <>Error Loading Data</>;

  return (
    <>
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
                onClick={() => onClickEdit({ updateId: room.id, updateName: room.nama_cabang })}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<Iconify icon="eva:trash-fill" />}
                onClick={() => onClickDelete({ deleteId: room.id, deleteName: room.nama_cabang })}
              >
                Delete
              </Button>
            </Stack>,
          ])}
        />
      </Scrollbar>

      <BranchFormModal
        open={isOpenUpdateModal}
        onClose={handleCloseModalUpdate}
        dataName={String(branchName)}
        id={String(id)}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, onSuccessUpdate)}
        stateModal={"update"}
      />

      <BranchDeleteModal
        open={isOpenDeleteModal}
        onClose={handleCloseModalDelete}
        dataName={String(branchName)}
        id={String(id)}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, onSuccessDelete)}
      />
    </>
  );
}
