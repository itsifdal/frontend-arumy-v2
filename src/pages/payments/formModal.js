import React, { useEffect, useState } from "react";
import { Typography, Modal, FormControl, Box, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

import { modalStyle } from "../../constants/modalStyle";
import { CustomTextField } from "../../components/input/inputBasic";
import CustomInputLabel from "../../components/input/inputLabel";
import AutoCompleteReactHook from "../../components/input/autoCompleteReactHook";
import { usePaymentQuery, useAddPayment, useUpdatePayment } from "./query";
import { usePacketsQuery } from "../packets/query";

PaymentFormModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  stateModal: PropTypes.string,
  dataName: PropTypes.string,
  id: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

export default function PaymentFormModal({ open, onClose, stateModal, id, onSuccess, onError }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { errors },
    control,
  } = useForm();

  const { data: packets = [], isLoading: isLoadingPackets } = usePacketsQuery({
    options: {
      enabled: open,
      select: (res) =>
        res.data.map((packet) => ({
          value: packet.id,
          label: packet.nama_paket,
          quota_privat: packet.quota_privat,
          quota_group: packet.quota_group,
        })),
    },
  });
  const [selectedPacket, setSelectedPacket] = useState([packets[0]]);

  const submitAddPayment = useAddPayment();
  const submitUpdatePayment = useUpdatePayment({ id });

  const { refetch: paymentRefetch, isLoading: isLoadingPayment } = usePaymentQuery({
    id,
    options: {
      enabled: Boolean(id),
      onSuccess: (res) => {
        const { data } = res;
        const modelData = {
          paketId: data.paketId,
          studentId: data.studentId,
          tgl_tagihan: data.tgl_tagihan,
          tgl_bayar: data.tgl_bayar,
          jumlah_bayar: data.jumlah_bayar,
          bayar_via: data.bayar_via,
          quota_privat: data.quota_privat,
          quota_group: data.quota_group,
        };
        const entries = Object.entries(modelData);
        entries.forEach((packet) => {
          setValue(packet[0], packet[1]);
        });
        setSelectedPacket(packets.filter((v) => v.value === data.paketId));
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
      paymentRefetch();
    }
  }, [open, id, paymentRefetch, stateModal]);

  const onSubmit = (data) => {
    if (stateModal === "update") {
      submitUpdatePayment.mutate(data, {
        onSuccess: (response) => {
          resetForm();
          onSuccess(response);
        },
        onError: (error) => {
          onError(error);
        },
      });
    } else {
      submitAddPayment.mutate(data, {
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

  if (isLoadingPayment)
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
              {stateModal === "update" ? `Update Payment #${id}` : "Create Payment"}
            </Typography>
          </Box>
          <Grid container spacing={2} marginBottom={2}>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.paketId}>
                <CustomInputLabel htmlFor="paketId">paketId*</CustomInputLabel>
                <AutoCompleteReactHook
                  name="paketId"
                  rules={{
                    required: "paketId Wajib diisi",
                  }}
                  control={control}
                  value={selectedPacket[0]}
                  options={packets}
                  loading={isLoadingPackets}
                  errors={errors}
                  onChangeCallback={(val) => {
                    setSelectedPacket([val]);
                    setValue("quota_privat", val.quota_privat);
                    setValue("quota_group", val.quota_group);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.studentId}>
                <CustomInputLabel htmlFor="studentId">studentId*</CustomInputLabel>
                <CustomTextField
                  {...register("studentId", { required: "studentId Wajib diisi" })}
                  helperText={errors.studentId?.message}
                  error={!!errors.studentId}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.tgl_tagihan}>
                <CustomInputLabel htmlFor="tgl_tagihan">tgl_tagihan*</CustomInputLabel>
                <CustomTextField
                  {...register("tgl_tagihan", { required: "tgl_tagihan Wajib diisi" })}
                  helperText={errors.tgl_tagihan?.message}
                  error={!!errors.tgl_tagihan}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.tgl_bayar}>
                <CustomInputLabel htmlFor="tgl_bayar">tgl_bayar*</CustomInputLabel>
                <CustomTextField
                  {...register("tgl_bayar", { required: "tgl_bayar Wajib diisi" })}
                  helperText={errors.tgl_bayar?.message}
                  error={!!errors.tgl_bayar}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.jumlah_bayar}>
                <CustomInputLabel htmlFor="jumlah_bayar">jumlah_bayar*</CustomInputLabel>
                <CustomTextField
                  {...register("jumlah_bayar", { required: "jumlah_bayar Wajib diisi" })}
                  helperText={errors.jumlah_bayar?.message}
                  error={!!errors.jumlah_bayar}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.bayar_via}>
                <CustomInputLabel htmlFor="bayar_via">bayar_via*</CustomInputLabel>
                <CustomTextField
                  {...register("bayar_via", { required: "bayar_via Wajib diisi" })}
                  helperText={errors.bayar_via?.message}
                  error={!!errors.bayar_via}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.quota_privat}>
                <CustomInputLabel htmlFor="quota_privat">quota_privat*</CustomInputLabel>
                <CustomTextField
                  {...register("quota_privat", { required: "quota_privat Wajib diisi" })}
                  helperText={errors.quota_privat?.message}
                  error={!!errors.quota_privat}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.quota_group}>
                <CustomInputLabel htmlFor="quota_group">quota_group*</CustomInputLabel>
                <CustomTextField
                  {...register("quota_group", { required: "quota_group Wajib diisi" })}
                  helperText={errors.quota_group?.message}
                  error={!!errors.quota_group}
                />
              </FormControl>
            </Grid>
          </Grid>
          <LoadingButton
            loading={submitAddPayment.isLoading || submitUpdatePayment.isLoading}
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
