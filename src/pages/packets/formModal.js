import React, { useEffect } from "react";
import { Typography, Modal, FormControl, Box, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

import { modalStyle } from "../../constants/modalStyle";
import { CustomTextField } from "../../components/input/inputBasic";
import CustomInputLabel from "../../components/input/inputLabel";
import { usePacketQuery, useAddPacket, useUpdatePacket } from "./query";

PacketFormModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  stateModal: PropTypes.string,
  dataName: PropTypes.string,
  id: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

export default function PacketFormModal({ open, onClose, stateModal, id, onSuccess, onError }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { errors },
  } = useForm();

  const submitAddPacket = useAddPacket();
  const submitUpdatePacket = useUpdatePacket({ id });

  const { refetch: packetsRefetch, isLoading: isLoadingPacket } = usePacketQuery({
    id,
    options: {
      enabled: Boolean(id),
      onSuccess: (res) => {
        const { data } = res;
        const modelData = {
          nama_paket: data.nama_paket,
          harga: data.harga,
          quota_privat: data.quota_privat,
          quota_group: data.quota_group,
          description: data.description,
        };
        const entries = Object.entries(modelData);
        entries.forEach((packet) => {
          setValue(packet[0], packet[1]);
        });
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
      packetsRefetch();
    }
  }, [open, id, packetsRefetch, stateModal]);

  const onSubmit = (data) => {
    if (stateModal === "update") {
      submitUpdatePacket.mutate(data, {
        onSuccess: (response) => {
          resetForm();
          onSuccess(response);
        },
        onError: (error) => {
          onError(error);
        },
      });
    } else {
      submitAddPacket.mutate(data, {
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

  if (isLoadingPacket)
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
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.nama_paket}>
                <CustomInputLabel htmlFor="nama_paket">Nama Paket*</CustomInputLabel>
                <CustomTextField
                  {...register("nama_paket", { required: "Nama Paket Wajib diisi" })}
                  helperText={errors.nama_paket?.message}
                  error={!!errors.nama_paket}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <CustomInputLabel htmlFor="harga">Harga</CustomInputLabel>
                <CustomTextField {...register("harga")} />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <CustomInputLabel htmlFor="quota_privat">Quota Private</CustomInputLabel>
                <CustomTextField {...register("quota_privat")} />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <CustomInputLabel htmlFor="quota_group">Quota Group</CustomInputLabel>
                <CustomTextField {...register("quota_group")} />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <CustomInputLabel htmlFor="description">Deskripsi</CustomInputLabel>
                <CustomTextField {...register("description")} multiline maxRows={4} />
              </FormControl>
            </Grid>
          </Grid>
          <LoadingButton
            loading={submitAddPacket.isLoading || submitUpdatePacket.isLoading}
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
