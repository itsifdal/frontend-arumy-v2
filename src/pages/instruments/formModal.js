import React, { useEffect } from "react";
import { Typography, Modal, FormControl, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

import { modalStyle } from "../../constants/modalStyle";
import { CustomTextField } from "../../components/input/inputBasic";
import CustomInputLabel from "../../components/input/inputLabel";
import { useAddInstrument, useUpdateInstrument } from "./query";

InstrumentFormModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  stateModal: PropTypes.string,
  dataName: PropTypes.string,
  id: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

export function InstrumentFormModal({ open, onClose, stateModal, id, dataName, onSuccess, onError }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { errors },
  } = useForm();

  const submitAddInstrument = useAddInstrument();
  const submitUpdateInstrument = useUpdateInstrument({ id });

  useEffect(() => {
    if (dataName) {
      setValue("nama_instrument", dataName);
    } else {
      resetForm();
    }
  }, [dataName, resetForm, setValue]);

  const onSubmit = (data) => {
    if (stateModal === "update") {
      submitUpdateInstrument.mutate(data, {
        onSuccess: (response) => {
          resetForm();
          onSuccess(response);
        },
        onError: (error) => {
          onError(error);
        },
      });
    } else {
      submitAddInstrument.mutate(data, {
        onSuccess: (response) => {
          resetForm();
          onSuccess(response);
        },
        onError: (error) => {
          onError(error);
        },
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        resetForm();
        onClose();
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...modalStyle, maxWidth: 400 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box marginBottom={2}>
            <Typography id="modal-modal-title" variant="h4" component="h2" fontWeight={700} color={"#172560"}>
              {stateModal === "update" ? `Update Instrument #${id}` : "Create Instrument"}
            </Typography>
          </Box>
          <Box paddingBottom={2}>
            <FormControl fullWidth error={!!errors.nama_instrument}>
              <CustomInputLabel htmlFor="nama_instrument">Nama Instrument*</CustomInputLabel>
              <CustomTextField
                {...register("nama_instrument", { required: "Nama Instrument Wajib diisi" })}
                helperText={errors.nama_instrument?.message}
                error={!!errors.nama_instrument}
              />
            </FormControl>
          </Box>
          <LoadingButton
            loading={submitAddInstrument.isLoading || submitUpdateInstrument.isLoading}
            variant="contained"
            type="submit"
            fullWidth
          >
            Save
          </LoadingButton>
        </form>
      </Box>
    </Modal>
  );
}
