import React, { useEffect, useState } from "react";
import { Typography, Modal, FormControl, Box, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller } from "react-hook-form";
import PropTypes from "prop-types";

import { modalStyle } from "../../constants/modalStyle";
import { CustomTextField } from "../../components/input/inputBasic";
import CustomInputLabel from "../../components/input/inputLabel";
import AutoCompleteReactHook from "../../components/input/autoCompleteReactHook";
import CurrencyInputReactHook from "../../components/input/currencyInputReactHook";
import DateInputReactHook from "../../components/input/dateInputReactHook";
import SelectReactHook from "../../components/input/selectReactHook";
import { useGetRefund, useAddRefund, useUpdateRefund } from "./query";
import { useGetPackets } from "../packets/query";
import { useGetStudents } from "../students/query";
import { modelRefund } from "./utils";
import { termDate } from "../../constants/termDate";

export default function RefundFormModal({ open, onClose, stateModal, id, onSuccess, onError }) {
  const [user, setUser] = useState({ id: undefined, role: undefined });

  const {
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { errors },
    control,
  } = useForm();

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
          label: `${packet.nama_paket}${packet.description ? `, ${packet.description}` : ""}`,
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

  const submitAddRefund = useAddRefund();
  const submitUpdateRefund = useUpdateRefund({ id });

  const { refetch: refundRefetch, isLoading: isLoadingRefund } = useGetRefund({
    id,
    options: {
      enabled: open && stateModal === "update" && Boolean(id),
      onSuccess: (res) => {
        const { data } = res;
        if (data) {
          const modelData = {
            paketId: { value: data.paketId },
            studentId: { value: data.studentId },
            refund_amount: data.refund_amount,
            quota_privat: data.quota_privat || 0,
            quota_group: data.quota_group || 0,
            transfer_date: new Date(data.transfer_date),
            notes: data.notes,
            term: data.term ?? "",
            termYear: data.termYear ?? "",
            termPlaceholder: data.term && data.termYear ? `${data.term}-${data.termYear}` : "",
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
      refundRefetch();
    }
  }, [open, id, refundRefetch, stateModal]);

  const onSubmit = (data) => {
    // console.log("onSubmit", data);
    const modelData = modelRefund(data);
    if (stateModal === "update") {
      submitUpdateRefund.mutate(modelData, {
        onSuccess: (response) => {
          resetForm();
          onSuccess(response);
        },
        onError: (error) => {
          onError(error);
        },
      });
    } else {
      submitAddRefund.mutate(modelData, {
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

  if (isLoadingRefund) {
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
              {stateModal === "update" ? `Update Refund #${id}` : "Create Refund"}
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
                    setValue("refund_amount", val?.harga);
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
              <FormControl fullWidth error={!!errors.refund_amount}>
                <CustomInputLabel htmlFor="refund_amount">Jumlah Pembayaran*</CustomInputLabel>
                <CurrencyInputReactHook
                  name="refund_amount"
                  rules={{
                    required: "Jumlah refund wajib diisi",
                  }}
                  control={control}
                  helperText={errors.refund_amount?.message}
                  isError={!!errors.refund_amount}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth error={!!errors.quota_privat}>
                <CustomInputLabel htmlFor="quota_privat">Quota Private*</CustomInputLabel>
                <Controller
                  name="quota_privat"
                  control={control}
                  rules={{ required: "Quota private Wajib diisi" }}
                  render={({ field: { value = "", onChange } }) => (
                    <CustomTextField
                      value={value}
                      onChange={onChange}
                      helperText={errors.quota_privat?.message}
                      error={!!errors.quota_privat}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth error={!!errors.quota_group}>
                <CustomInputLabel htmlFor="quota_group">Quota Group*</CustomInputLabel>
                <Controller
                  name="quota_group"
                  control={control}
                  rules={{ required: "Quota group Wajib diisi" }}
                  render={({ field: { value = "", onChange } }) => (
                    <CustomTextField
                      value={value}
                      onChange={onChange}
                      helperText={errors.quota_group?.message}
                      error={!!errors.quota_group}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth error={!!errors.transfer_date}>
                <CustomInputLabel htmlFor="transfer_date">Tanggal Refund*</CustomInputLabel>
                <DateInputReactHook
                  name="transfer_date"
                  rules={{
                    required: "Tanggal refund wajib diisi",
                    validate: (value) => !!value.getDate() || "Format tanggal salah",
                  }}
                  control={control}
                  isError={!!errors.transfer_date}
                  helperText={errors.transfer_date?.message}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth error={!!errors.termPlaceholder}>
                <CustomInputLabel htmlFor="termPlaceholder">Term Kelas*</CustomInputLabel>
                <SelectReactHook
                  name="termPlaceholder"
                  rules={{
                    required: "Term kelas wajib diisi",
                  }}
                  control={control}
                  helperText={errors.termPlaceholder?.message}
                  isError={!!errors.termPlaceholder}
                  options={termDate}
                  onChangeCallback={(e) => {
                    if (e) {
                      const arrVal = e.split("-");
                      setValue("term", arrVal[0]);
                      setValue("termYear", arrVal[1]);
                    }
                  }}
                />
                <input type="hidden" {...register("term")} />
                <input type="hidden" {...register("termYear")} />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.notes}>
                <CustomInputLabel htmlFor="notes">Notes</CustomInputLabel>
                <CustomTextField
                  {...register("notes")}
                  helperText={errors.notes?.message}
                  error={!!errors.notes}
                  multiline
                  maxRows={4}
                />
              </FormControl>
            </Grid>
            <input type="hidden" {...register("userId")} value={user.id} />
          </Grid>
          <LoadingButton
            loading={submitAddRefund.isLoading || submitUpdateRefund.isLoading}
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

RefundFormModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  stateModal: PropTypes.string,
  id: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};
