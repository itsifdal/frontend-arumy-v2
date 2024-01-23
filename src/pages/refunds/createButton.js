import React, { useState } from "react";
import { Button } from "@mui/material";

import Iconify from "../../components/Iconify";
import RefundFormModal from "./formModal";
import { onSuccessToast, onErrorToast } from "./callback";
import { useGetRefunds } from "./query";

const defaultQuery = { sort: "DESC", sort_by: "tgl_tagihan" };

export default function RefundCreateButton() {
  const { refetch: refundsRefetch } = useGetRefunds({
    queryParam: { ...defaultQuery },
  });
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);

  const handleOpenModalCreate = () => setIsOpenCreateModal(true);
  const handleCloseModalCreate = () => {
    refundsRefetch();
    setIsOpenCreateModal(false);
  };

  return (
    <>
      <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModalCreate}>
        Add new Refund
      </Button>

      <RefundFormModal
        open={isOpenCreateModal}
        onClose={handleCloseModalCreate}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, handleCloseModalCreate)}
        stateModal={"create"}
      />
    </>
  );
}
