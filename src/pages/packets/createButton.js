import React, { useState } from "react";
import { Button } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import Iconify from "../../components/Iconify";
import PacketFormModal from "./formModal";
import { onSuccessToast, onErrorToast } from "./callback";
import { usePacketsQuery } from "./query";
import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";

export default function PacketCreateButton() {
  const [searchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  const { refetch: packetsRefetch } = usePacketsQuery({
    queryParam: { ...queryParam },
  });
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
