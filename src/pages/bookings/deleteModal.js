import React from "react";
import { Typography, Modal, Box, FormControl } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import { useMutation } from "react-query";
import axios from "axios";

import { modalStyle } from "../../constants/modalStyle";
import { fetchHeader } from "../../constants/fetchHeader";

export const BookingDeleteModal = ({ open, onClose, id, onSuccess, onError }) => {
  const submitDeleteBooking = useMutation(() =>
    axios.delete(`${process.env.REACT_APP_BASE_URL}/api/booking/${id}`, {
      headers: fetchHeader,
    })
  );

  const handleSubmitDelete = (e) => {
    e.preventDefault();
    submitDeleteBooking.mutate(
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
          Delete booking #{id} ?
        </Typography>
        <FormControl fullWidth>
          <LoadingButton variant="contained" type="submit" onClick={handleSubmitDelete}>
            Delete
          </LoadingButton>
        </FormControl>
      </Box>
    </Modal>
  );
};

BookingDeleteModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  id: PropTypes.number,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};
