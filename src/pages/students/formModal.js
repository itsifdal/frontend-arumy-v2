import React, { useEffect } from "react";
import { Typography, Modal, FormControl, Box, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { parse } from "date-fns";

import { modalStyle } from "../../constants/modalStyle";
import { CustomTextField } from "../../components/input/inputBasic";
import CustomInputLabel from "../../components/input/inputLabel";
import { useGetStudent, useAddStudent, useUpdateStudent } from "./query";
import DateInputReactHook from "../../components/input/dateInputReactHook";

StudentFormModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  stateModal: PropTypes.string,
  dataName: PropTypes.string,
  id: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

export function StudentFormModal({ open, onClose, stateModal, id, onSuccess, onError }) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset: resetForm,
    formState: { errors },
  } = useForm();

  const submitAddStudent = useAddStudent();
  const submitUpdateStudent = useUpdateStudent({ id });

  const { refetch: studentsRefetch, isLoading: isLoadingStudent } = useGetStudent({
    id,
    options: {
      enabled: Boolean(id),
      onSuccess: (res) => {
        if (res) {
          const modelData = {
            nama_murid: res.nama_murid,
            nama_wali: res.nama_wali,
            nomor_va: res.nomor_va,
            telepon: res.telepon,
            tgl_lahir: parse(res.tgl_lahir, "yyyy-MM-dd", new Date()),
          };
          const entries = Object.entries(modelData);
          entries.forEach((packet) => {
            setValue(packet[0], packet[1]);
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
      studentsRefetch();
    }
  }, [open, id, studentsRefetch, stateModal]);

  const onSubmit = (data) => {
    if (stateModal === "update") {
      submitUpdateStudent.mutate(data, {
        onSuccess: (response) => {
          resetForm();
          onSuccess(response);
        },
        onError: (error) => {
          onError(error);
        },
      });
    } else {
      submitAddStudent.mutate(data, {
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

  if (isLoadingStudent)
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
      <Box sx={{ ...modalStyle, maxWidth: 600 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box marginBottom={2}>
            <Typography id="modal-modal-title" variant="h4" component="h2" fontWeight={700} color={"#172560"}>
              {stateModal === "update" ? `Update Paket #${id}` : "Create Paket"}
            </Typography>
          </Box>
          <Grid container spacing={2} marginBottom={2}>
            <Grid item xs={6} paddingBottom={2}>
              <FormControl fullWidth error={!!errors.nama_murid}>
                <CustomInputLabel htmlFor="nama_murid">Nama Murid*</CustomInputLabel>
                <CustomTextField
                  {...register("nama_murid", { required: "Nama Murid Wajib diisi" })}
                  helperText={errors.nama_murid?.message}
                  error={!!errors.nama_murid}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6} paddingBottom={2}>
              <FormControl fullWidth error={!!errors.nama_wali}>
                <CustomInputLabel htmlFor="nama_wali">Nama Wali*</CustomInputLabel>
                <CustomTextField
                  {...register("nama_wali", { required: "Nama Wali Wajib diisi" })}
                  helperText={errors.nama_wali?.message}
                  error={!!errors.nama_wali}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6} paddingBottom={2}>
              <FormControl fullWidth error={!!errors.nomor_va}>
                <CustomInputLabel htmlFor="nomor_va">Nomor VA*</CustomInputLabel>
                <CustomTextField
                  {...register("nomor_va", { required: "Nomor VA Wajib diisi" })}
                  helperText={errors.nomor_va?.message}
                  error={!!errors.nomor_va}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6} paddingBottom={2}>
              <FormControl fullWidth error={!!errors.telepon}>
                <CustomInputLabel htmlFor="telepon">Telepon*</CustomInputLabel>
                <CustomTextField
                  {...register("telepon", { required: "Telepon Wajib diisi" })}
                  helperText={errors.telepon?.message}
                  error={!!errors.telepon}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6} paddingBottom={2}>
              <FormControl fullWidth error={!!errors.tgl_lahir}>
                <CustomInputLabel htmlFor="tgl_lahir">Tanggal lahir*</CustomInputLabel>
                <DateInputReactHook
                  name="tgl_lahir"
                  rules={{
                    required: "Tanggal lahir wajib diisi",
                    validate: (value) => !!value.getDate() || "Format tanggal salah",
                  }}
                  control={control}
                  isError={!!errors.tgl_lahir}
                  helperText={errors.tgl_lahir?.message}
                />
              </FormControl>
            </Grid>
          </Grid>
          <LoadingButton
            loading={submitAddStudent.isLoading || submitUpdateStudent.isLoading}
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
