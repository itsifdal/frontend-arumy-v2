import React, { useState } from "react";

import { Stack, Button } from "@mui/material";

import Scrollbar from "../../components/Scrollbar";
import BasicTable from "../../components/BasicTable";
import Iconify from "../../components/Iconify";
import PacketDeleteModal from "./deleteModal";
import PacketFormModal from "./formModal";
import { usePacketsQuery } from "./query";
import { onSuccessToast, onErrorToast } from "./callback";

export default function PacketList() {
  const [id, setId] = useState("");
  const [packetName, setPacketName] = useState("");
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const { data: packets, isLoading, isError, refetch: packetsRefetch } = usePacketsQuery();

  const handleCloseModalUpdate = () => setIsOpenUpdateModal(false);
  const handleCloseModalDelete = () => setIsOpenDeleteModal(false);

  const onClickEdit = ({ updateId, updateName }) => {
    setId(updateId);
    setPacketName(updateName);
    setIsOpenUpdateModal(true);
  };

  const onClickDelete = ({ deleteId, deleteName }) => {
    setId(deleteId);
    setPacketName(deleteName);
    console.log("deleteName ", deleteName);
    setIsOpenDeleteModal(true);
  };

  const onSuccessUpdate = () => {
    packetsRefetch();
    setIsOpenUpdateModal(false);
  };

  const onSuccessDelete = () => {
    packetsRefetch();
    setIsOpenDeleteModal(false);
  };

  if (isLoading) return <>Loading Data</>;
  if (isError) return <>Error Loading Data</>;

  return (
    <>
      <Scrollbar>
        <BasicTable
          header={["NAMA PAKET", " "]}
          body={packets.data.map((packet) => [
            packet.nama_paket,
            packet.harga,
            packet.quota_privat,
            packet.quota_group,
            <Stack key={packet.id} direction="row" spacing={2}>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<Iconify icon="mdi:pencil" />}
                onClick={() => onClickEdit({ updateId: packet.id, updateName: packet.nama_paket })}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<Iconify icon="eva:trash-fill" />}
                onClick={() => onClickDelete({ deleteId: packet.id, deleteName: packet.nama_paket })}
              >
                Delete
              </Button>
            </Stack>,
          ])}
        />
      </Scrollbar>

      <PacketFormModal
        open={isOpenUpdateModal}
        onClose={handleCloseModalUpdate}
        id={String(id)}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, onSuccessUpdate)}
        stateModal={"update"}
      />

      <PacketDeleteModal
        open={isOpenDeleteModal}
        onClose={handleCloseModalDelete}
        dataName={String(packetName)}
        id={String(id)}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, onSuccessDelete)}
      />
    </>
  );
}
