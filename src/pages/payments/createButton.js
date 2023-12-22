import React, { useState } from "react";
import { Button } from "@mui/material";

import Iconify from "../../components/Iconify";
import PaymentFormModal from "./formModal";
import { onSuccessToast, onErrorToast } from "./callback";
import { usePaymentsQuery } from "./query";

export default function PaymentCreateButton() {
  const { refetch: paymentsRefetch } = usePaymentsQuery();
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);

  const handleOpenModalCreate = () => setIsOpenCreateModal(true);
  const handleCloseModalCreate = () => {
    paymentsRefetch();
    setIsOpenCreateModal(false);
  };

  return (
    <>
      <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModalCreate}>
        Add new Payment
      </Button>

      <PaymentFormModal
        open={isOpenCreateModal}
        onClose={handleCloseModalCreate}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, handleCloseModalCreate)}
        stateModal={"create"}
      />
    </>
  );
}
