import React, { useState } from "react";

import { Stack, Button } from "@mui/material";

import Scrollbar from "../../components/Scrollbar";
import BasicTable from "../../components/BasicTable";
import Iconify from "../../components/Iconify";
import { InstrumentDeleteModal } from "./deleteModal";
import { InstrumentFormModal } from "./formModal";
import { useGetInstruments } from "./query";
import { onSuccessToast, onErrorToast } from "./callback";

export function InstrumentList() {
  const [id, setId] = useState("");
  const [instrumentName, setInstrumentName] = useState("");
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const { data: instruments, isLoading, isError, refetch: instrumentsRefetch } = useGetInstruments();

  const handleCloseModalUpdate = () => setIsOpenUpdateModal(false);
  const handleCloseModalDelete = () => setIsOpenDeleteModal(false);

  const onClickEdit = ({ updateId, updateName }) => {
    setId(updateId);
    setInstrumentName(updateName);
    setIsOpenUpdateModal(true);
  };

  const onClickDelete = ({ deleteId, deleteName }) => {
    setId(deleteId);
    setInstrumentName(deleteName);
    setIsOpenDeleteModal(true);
  };

  const onSuccessUpdate = () => {
    instrumentsRefetch();
    setIsOpenUpdateModal(false);
  };

  const onSuccessDelete = () => {
    instrumentsRefetch();
    setIsOpenDeleteModal(false);
  };

  if (isLoading) return <>Loading Data</>;
  if (isError) return <>Error Loading Data</>;

  return (
    <>
      <Scrollbar>
        <BasicTable
          header={["INSTRUMENT NAME", " "]}
          body={instruments.map((instrument) => [
            instrument.nama_instrument,
            <Stack key={instrument.id} direction="row" spacing={2}>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<Iconify icon="mdi:pencil" />}
                onClick={() => onClickEdit({ updateId: instrument.id, updateName: instrument.nama_instrument })}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<Iconify icon="eva:trash-fill" />}
                onClick={() => onClickDelete({ deleteId: instrument.id, deleteName: instrument.nama_instrument })}
              >
                Delete
              </Button>
            </Stack>,
          ])}
        />
      </Scrollbar>

      <InstrumentFormModal
        open={isOpenUpdateModal}
        onClose={handleCloseModalUpdate}
        dataName={String(instrumentName)}
        id={String(id)}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, onSuccessUpdate)}
        stateModal={"update"}
      />

      <InstrumentDeleteModal
        open={isOpenDeleteModal}
        onClose={handleCloseModalDelete}
        dataName={String(instrumentName)}
        id={String(id)}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, onSuccessDelete)}
      />
    </>
  );
}
