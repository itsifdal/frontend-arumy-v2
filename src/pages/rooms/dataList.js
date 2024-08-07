import React, { useState } from "react";
import { Stack, Button } from "@mui/material";

import Scrollbar from "../../components/Scrollbar";
import BasicTable from "../../components/BasicTable";
import Iconify from "../../components/Iconify";
import { RoomDeleteModal } from "./deleteModal";
import { RoomFormModal } from "./formModal";
import { useGetRooms } from "./query";
import { onSuccessToast, onErrorToast } from "./callback";

export function RoomList() {
  const [id, setId] = useState("");
  const [packetName, setPacketName] = useState("");
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const { data: rooms, isLoading, isError, refetch: roomsRefetch } = useGetRooms();

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
    setIsOpenDeleteModal(true);
  };

  const onSuccessUpdate = () => {
    roomsRefetch();
    setIsOpenUpdateModal(false);
  };

  const onSuccessDelete = () => {
    roomsRefetch();
    setIsOpenDeleteModal(false);
  };

  if (isLoading) return <>Loading Data</>;
  if (isError) return <>Error Loading Data</>;

  return (
    <>
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
                onClick={() => onClickEdit({ updateId: room.id, updateName: room.nama_ruang })}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<Iconify icon="eva:trash-fill" />}
                onClick={() =>
                  onClickDelete({
                    deleteId: room.id,
                    deleteName: room.nama_ruang,
                  })
                }
              >
                Delete
              </Button>
            </Stack>,
          ])}
        />
      </Scrollbar>

      <RoomFormModal
        open={isOpenUpdateModal}
        onClose={handleCloseModalUpdate}
        id={String(id)}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, onSuccessUpdate)}
        stateModal={"update"}
      />

      <RoomDeleteModal
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
