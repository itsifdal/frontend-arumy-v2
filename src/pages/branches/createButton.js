import React, { useState } from "react";
import { Button } from "@mui/material";

import Iconify from "../../components/Iconify";
import BranchFormModal from "./formModal";
import { onSuccessToast, onErrorToast } from "./callback";
import { useBranchQuery } from "./query";

export default function BranchCreateButton() {
  const { refetch: branchesRefetch } = useBranchQuery();
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);

  const handleOpenModalCreate = () => setIsOpenCreateModal(true);
  const handleCloseModalUpdate = () => {
    branchesRefetch();
    setIsOpenCreateModal(false);
  };

  return (
    <>
      <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModalCreate}>
        Add new Branch
      </Button>

      <BranchFormModal
        open={isOpenCreateModal}
        onClose={handleCloseModalUpdate}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, handleCloseModalUpdate)}
        stateModal={"create"}
      />
    </>
  );
}
