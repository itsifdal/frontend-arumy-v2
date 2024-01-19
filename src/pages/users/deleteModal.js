import React from "react";
import { Typography, Modal, FormControl, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";

import { modalStyle } from "../../constants/modalStyle";
import { useDeleteUser } from "./query";

UserDeleteModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dataName: PropTypes.string,
  id: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

export default function UserDeleteModal({ open, onClose, dataName, id, onSuccess, onError }) {
  const submitDeleteUser = useDeleteUser({ id });

  const handleSubmitDelete = (e) => {
    e.preventDefault();
    submitDeleteUser.mutate(
      {},
      {
        onSuccess: (response) => {
          onSuccess(response);
        },
        onError: (error) => {
          onError(error);
        },
      }
    );
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={{ ...modalStyle, maxWidth: 400 }}>
        <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={5}>
          Delete {dataName} ?
        </Typography>
        <FormControl fullWidth>
          <LoadingButton
            loading={submitDeleteUser.isLoading}
            variant="contained"
            type="submit"
            onClick={handleSubmitDelete}
          >
            Delete
          </LoadingButton>
        </FormControl>
      </Box>
    </Modal>
  );
}
