import React, { useEffect } from "react";
import { Typography, Modal, FormControl, Box, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

import { modalStyle } from "../../constants/modalStyle";
import { CustomTextField } from "../../components/input/inputBasic";
import CustomInputLabel from "../../components/input/inputLabel";
import { useGetTeacher, useAddTeacher, useUpdateTeacher } from "./query";

export function TeacherFormModal({ open, onClose, stateModal, id, onSuccess, onError }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { errors },
  } = useForm();

  const submitAddTeacher = useAddTeacher();
  const submitUpdateTeacher = useUpdateTeacher({ id });

  const { refetch: teacherRefetch, isLoading: isLoadingTeacher } = useGetTeacher({
    id,
    options: {
      enabled: Boolean(id),
      onSuccess: (res) => {
        const { data } = res;
        if (data) {
          const modelData = {
            nama_pengajar: data.nama_pengajar,
            telepon: data.telepon,
          };
          const entries = Object.entries(modelData);
          entries.forEach((teacher) => {
            setValue(teacher[0], teacher[1]);
          });
        }
      },
    },
  });

  useEffect(() => {
    if (!id) {
      resetForm();
    }
  }, [id, resetForm]);

  useEffect(() => {
    if (open && stateModal === "update" && id) {
      teacherRefetch();
    }
  }, [open, id, teacherRefetch, stateModal]);

  const onSubmit = (data) => {
    if (stateModal === "update") {
      submitUpdateTeacher.mutate(data, {
        onSuccess: (response) => {
          resetForm();
          onSuccess(response);
        },
        onError: (error) => {
          onError(error);
        },
      });
    } else {
      submitAddTeacher.mutate(data, {
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

  if (isLoadingTeacher)
    return (
      <Modal
        open={open}
        onClose={() => {
          resetForm();
          onClose();
        }}
      >
        <Box sx={{ ...modalStyle, maxWidth: 600 }}>
          <>Loading Data</>
        </Box>
      </Modal>
    );

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
      <Box sx={{ ...modalStyle, maxWidth: 800 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box marginBottom={2}>
            <Typography id="modal-modal-title" variant="h4" component="h2" fontWeight={700} color={"#172560"}>
              {stateModal === "update" ? `Update Teacher #${id}` : "Create Teacher"}
            </Typography>
          </Box>
          <Grid container spacing={2} marginBottom={2}>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.nama_pengajar}>
                <CustomInputLabel htmlFor="nama_pengajar">Nama Pengajar*</CustomInputLabel>
                <CustomTextField
                  {...register("nama_pengajar", { required: "Nama Pengajar Wajib diisi" })}
                  helperText={errors.nama_pengajar?.message}
                  error={!!errors.nama_pengajar}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.telepon}>
                <CustomInputLabel htmlFor="telepon">Telepon*</CustomInputLabel>
                <CustomTextField
                  {...register("telepon", { required: "Telepon Wajib diisi" })}
                  helperText={errors.telepon?.message}
                  error={!!errors.telepon}
                />
              </FormControl>
            </Grid>
          </Grid>
          <LoadingButton
            loading={submitAddTeacher.isLoading || submitUpdateTeacher.isLoading}
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

TeacherFormModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  stateModal: PropTypes.string,
  dataName: PropTypes.string,
  id: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};
