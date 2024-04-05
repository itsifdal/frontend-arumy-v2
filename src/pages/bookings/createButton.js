import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useQueryClient } from "react-query";

import Iconify from "../../components/Iconify";
import { queryKey } from "../../constants/queryKey";
import { BookingFormModal } from "./formModal";
import { onErrorToast, onSuccessToast } from "./callback";

export const BookingCreateButton = () => {
  const queryClient = useQueryClient();
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [user, setUser] = useState({});

  const isUserAdmin = user.role === "Admin" || user.role === "Super Admin";

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const handleOpenModalCreate = () => setOpenModalCreate(true);
  const handleCloseModalCreate = () => {
    queryClient.invalidateQueries({ queryKey: [queryKey.payments] });
    setOpenModalCreate(false);
  };

  if (user && isUserAdmin) {
    return (
      <>
        <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModalCreate}>
          Add New Booking
        </Button>

        <BookingFormModal
          open={openModalCreate}
          onClose={handleCloseModalCreate}
          onError={(err) => onErrorToast(err)}
          onSuccess={(res) => onSuccessToast(res)}
          stateModal={"create"}
        />
      </>
    );
  }
  return null;
};
