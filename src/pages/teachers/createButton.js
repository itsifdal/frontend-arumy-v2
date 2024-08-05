import React, { useState } from "react";
import { Button } from "@mui/material";
import { useQueryClient } from "react-query";

import Iconify from "../../components/Iconify";
import { TeacherFormModal } from "./formModal";
import { onSuccessToast, onErrorToast } from "./callback";
import { queryKey } from "../../constants/queryKey";

export function TeacherCreateButton() {
  const queryClient = useQueryClient();
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);

  const handleOpenModalCreate = () => setIsOpenCreateModal(true);
  const handleCloseModalCreate = () => {
    queryClient.invalidateQueries({ queryKey: [queryKey.teachers] });
    setIsOpenCreateModal(false);
  };

  return (
    <>
      <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModalCreate}>
        Add new Teacher
      </Button>

      <TeacherFormModal
        open={isOpenCreateModal}
        onClose={handleCloseModalCreate}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, handleCloseModalCreate)}
        stateModal={"create"}
      />
    </>
  );
}
