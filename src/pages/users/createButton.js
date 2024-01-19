import React, { useState } from "react";
import { Button } from "@mui/material";

import Iconify from "../../components/Iconify";
import UserFormModal from "./formModal";
import { onSuccessToast, onErrorToast } from "./callback";
import { useGetUsers } from "./query";

const defaultQuery = { sort: "DESC", sort_by: "tgl_tagihan" };

export default function UserCreateButton() {
  const { refetch: usersRefetch } = useGetUsers({
    queryParam: { ...defaultQuery },
  });
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);

  const handleOpenModalCreate = () => setIsOpenCreateModal(true);
  const handleCloseModalCreate = () => {
    usersRefetch();
    setIsOpenCreateModal(false);
  };

  return (
    <>
      <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModalCreate}>
        Add new User
      </Button>

      <UserFormModal
        open={isOpenCreateModal}
        onClose={handleCloseModalCreate}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, handleCloseModalCreate)}
        stateModal={"create"}
      />
    </>
  );
}
