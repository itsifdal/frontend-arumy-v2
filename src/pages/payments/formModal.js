import React, { useEffect, useState } from "react";
import { Typography, Modal, FormControl, Box, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller } from "react-hook-form";
import PropTypes from "prop-types";

import { modalStyle } from "../../constants/modalStyle";
import { CustomTextField } from "../../components/input/inputBasic";
import CustomInputLabel from "../../components/input/inputLabel";
import AutoCompleteReactHook from "../../components/input/autoCompleteReactHook";
import DateInputReactHook from "../../components/input/dateInputReactHook";
import CurrencyInputReactHook from "../../components/input/currencyInputReactHook";
import SelectReactHook from "../../components/input/selectReactHook";
import CheckBoxReactHook from "../../components/input/checkBoxReactHook";
import { useGetPayment, useAddPayment, useUpdatePayment } from "./query";
import { useGetPackets } from "../packets/query";
import { useGetStudents } from "../students/query";

const paymentVia = [
  { value: "VA", label: "Virtual Account" },
  { value: "TRANSFER", label: "Transfer Bank" },
  { value: "CASH", label: "Tunai" },
  { value: "PAPER", label: "Paper" },
];

export default function PaymentFormModal({ open, onClose, stateModal, id, onSuccess, onError }) {
  const [user, setUser] = useState({ id: undefined, role: undefined });

  const {
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      bayar_via: paymentVia[0].value,
    },
  });

  // localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const { data: packets = [], isLoading: isLoadingPackets } = useGetPackets({
    options: {
      enabled: open,
      select: (res) =>
        res.data.map((packet) => ({
          value: packet.id,
          label: `${packet.nama_paket}${packet.description && `, ${packet.description}`}`,
          quota_privat: packet.quota_privat || 0,
          quota_group: packet.quota_group || 0,
          harga: packet.harga || 0,
        })),
    },
    queryParam: { perPage: 99999 },
  });

  const { data: students = [], isLoading: isLoadingStudents } = useGetStudents({
    queryParam: { perPage: 9999 },
    options: {
      enabled: open,
      select: (res) =>
        res.data.map((packet) => ({
          value: packet.id,
          label: packet.nama_murid,
        })),
    },
  });

  const submitAddPayment = useAddPayment();
  const submitUpdatePayment = useUpdatePayment({ id });

  const { refetch: paymentRefetch, isLoading: isLoadingPayment } = useGetPayment({
    id,
    options: {
      enabled: Boolean(id),
      onSuccess: (res) => {
        const { data } = res;
        if (data) {
          const modelData = {
            paketId: data.paketId,
            studentId: data.studentId,
            tgl_bayar: data.tgl_bayar,
            jumlah_bayar: data.jumlah_bayar,
            bayar_via: data.bayar_via,
            quota_privat: data.quota_privat || 0,
            quota_group: data.quota_group || 0,
            receipt_number: data.receipt_number,
            confirmed_status: data.confirmed_status,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, open]);

  useEffect(() => {
    if (open && stateModal === "update" && id) {
      paymentRefetch();
    }
  }, [open, id, paymentRefetch, stateModal]);

  const onSubmit = (data) => {
    // console.log("onSubmit", data);
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

  if (isLoadingPayment) {
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
  }

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
                <CustomInputLabel htmlFor="paketId">Nama Paket*</CustomInputLabel>
                <AutoCompleteReactHook
                  name="paketId"
                  rules={{
                    required: "Nama paket wajib diisi",
                  }}
                  control={control}
                  options={packets}
                  loading={isLoadingPackets}
                  isError={!!errors.paketId}
                  helperText={errors.paketId?.message}
                  onChangeCallback={(val) => {
                    setValue("quota_privat", val?.quota_privat);
                    setValue("quota_group", val?.quota_group);
                    setValue("jumlah_bayar", val?.harga);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.studentId}>
                <CustomInputLabel htmlFor="studentId">Nama Murid*</CustomInputLabel>
                <AutoCompleteReactHook
                  name="studentId"
                  rules={{
                    required: "Nama murid wajib diisi",
                  }}
                  control={control}
                  options={students}
                  loading={isLoadingStudents}
                  isError={!!errors.studentId}
                  helperText={errors.studentId?.message}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.tgl_bayar}>
                <CustomInputLabel htmlFor="tgl_bayar">Tanggal Bayar*</CustomInputLabel>
                <DateInputReactHook
                  name="tgl_bayar"
                  rules={{
                    required: "Tanggal bayar wajib diisi",
                  }}
                  control={control}
                  isError={!!errors.tgl_bayar}
                  helperText={errors.tgl_bayar?.message}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.jumlah_bayar}>
                <CustomInputLabel htmlFor="jumlah_bayar">Jumlah Pembayaran*</CustomInputLabel>
                <CurrencyInputReactHook
                  name="jumlah_bayar"
                  rules={{
                    required: "Jumlah pembayaran wajib diisi",
                  }}
                  control={control}
                  helperText={errors.jumlah_bayar?.message}
                  isError={!!errors.jumlah_bayar}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.quota_privat}>
                <CustomInputLabel htmlFor="quota_privat">Quota Private*</CustomInputLabel>
                <Controller
                  name="quota_privat"
                  control={control}
                  rules={{ required: "Quota private Wajib diisi" }}
                  render={({ field: { value = "", onChange } }) => (
                    <CustomTextField
                      disabled
                      value={value}
                      onChange={onChange}
                      helperText={errors.quota_privat?.message}
                      error={!!errors.quota_privat}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.quota_group}>
                <CustomInputLabel htmlFor="quota_group">Quota Group*</CustomInputLabel>
                <Controller
                  name="quota_group"
                  control={control}
                  rules={{ required: "Quota group Wajib diisi" }}
                  render={({ field: { value = "", onChange } }) => (
                    <CustomTextField
                      disabled
                      value={value}
                      onChange={onChange}
                      helperText={errors.quota_group?.message}
                      error={!!errors.quota_group}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.bayar_via}>
                <CustomInputLabel htmlFor="bayar_via">Pembayaran Via*</CustomInputLabel>
                <SelectReactHook
                  name="bayar_via"
                  rules={{
                    required: "Bayar via wajib diisi",
                  }}
                  control={control}
                  helperText={errors.bayar_via?.message}
                  isError={!!errors.bayar_via}
                  options={paymentVia}
                />
              </FormControl>
            </Grid>
            {user.role === "Super Admin" ? (
              <>
                <Grid item xs={6}>
                  <FormControl fullWidth error={!!errors.receipt_number}>
                    <CustomInputLabel htmlFor="receipt_number">Receipt Number</CustomInputLabel>
                    <CustomTextField
                      {...register("receipt_number")}
                      helperText={errors.receipt_number?.message}
                      error={!!errors.receipt_number}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth error={!!errors.confirmed_status}>
                    <CheckBoxReactHook name="confirmed_status" control={control} label={"Confirmed"} />
                  </FormControl>
                </Grid>
              </>
            ) : null}
            <input type="hidden" {...register("userId")} value={user.id} />
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

PaymentFormModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  stateModal: PropTypes.string,
  id: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};
