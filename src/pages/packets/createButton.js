import React, { useState } from "react";
import { Button } from "@mui/material";

import Iconify from "../../components/Iconify";
import PacketFormModal from "./formModal";
import { onSuccessToast, onErrorToast } from "./callback";
import { usePacketsQuery } from "./query";

export default function PacketCreateButton() {
  const { refetch: packetsRefetch } = usePacketsQuery();
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);

  const handleOpenModalCreate = () => setIsOpenCreateModal(true);
  const handleCloseModalCreate = () => {
    packetsRefetch();
    setIsOpenCreateModal(false);
  };

  return (
    <>
      <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModalCreate}>
        Add new Paket
      </Button>

      <PacketFormModal
        open={isOpenCreateModal}
        onClose={handleCloseModalCreate}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, handleCloseModalCreate)}
        stateModal={"create"}
      />
    </>
  );
}