import React, { useEffect } from "react";
import { Typography, Modal, FormControl, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

import { modalStyle } from "../../constants/modalStyle";
import { CustomTextField } from "../../components/input/inputBasic";
import CustomInputLabel from "../../components/input/inputLabel";
import { useAddBranch, useUpdateBranch } from "./query";

BranchFormModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  stateModal: PropTypes.string,
  dataName: PropTypes.string,
  id: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

export default function BranchFormModal({ open, onClose, stateModal, id, dataName, onSuccess, onError }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { errors },
  } = useForm();

  const submitAddBranch = useAddBranch();
  const submitUpdateBranch = useUpdateBranch({ id });

  useEffect(() => {
    if (dataName) {
      setValue("nama_cabang", dataName);
    } else {
      resetForm();
    }
  }, [dataName, resetForm, setValue]);

  const onSubmit = (data) => {
    if (stateModal === "update") {
      submitUpdateBranch.mutate(data, {
        onSuccess: (response) => {
          resetForm();
          onSuccess(response);
        },
        onError: (error) => {
          onError(error);
        },
      });
    } else {
      submitAddBranch.mutate(data, {
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
              {stateModal === "update" ? `Update Branch #${id}` : "Create Branch"}
            </Typography>
          </Box>
          <Box paddingBottom={2}>
            <FormControl fullWidth error={!!errors.nama_cabang}>
              <CustomInputLabel htmlFor="nama_cabang">Nama Cabang*</CustomInputLabel>
              <CustomTextField
                {...register("nama_cabang", { required: "Nama Cabang Wajib diisi" })}
                helperText={errors.nama_cabang?.message}
                error={!!errors.nama_cabang}
              />
            </FormControl>
          </Box>
          <LoadingButton
            loading={submitAddBranch.isLoading || submitUpdateBranch.isLoading}
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
