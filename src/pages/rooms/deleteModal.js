import React from "react";
import { Typography, Modal, FormControl, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";

import { modalStyle } from "../../constants/modalStyle";
import { useDeleteRoom } from "./query";

export function RoomDeleteModal({ open, onClose, dataName, id, onSuccess, onError }) {
  const submitDeleteRoom = useDeleteRoom({ id });

  const handleSubmitDelete = (e) => {
    e.preventDefault();
    submitDeleteRoom.mutate(
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
            loading={submitDeleteRoom.isLoading}
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

RoomDeleteModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dataName: PropTypes.string,
  id: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};
