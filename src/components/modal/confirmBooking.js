import React, { useEffect } from "react";
import { Typography, Modal, Box, Grid, FormControl, FormLabel, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import { useQueryClient } from "react-query";
import { useForm } from "react-hook-form";

import { useConfirmBooking, useGetBooking } from "../../pages/bookings/query";
import CustomInputLabel from "../input/inputLabel";
import { modalStyle } from "../../constants/modalStyle";
import { queryKey } from "../../constants/queryKey";
import { CustomTextField } from "../input/inputBasic";
import RadioGroupReactHook from "../input/radioGroupReactHook";

export default function ConfirmBooking({ open, onClose, id, onSuccess, onError, userId }) {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
    control,
    setValue,
  } = useForm();
  const queryClient = useQueryClient();

  const { refetch: bookingRefetch } = useGetBooking({
    id,
    options: {
      enabled: open && Boolean(id),
      onSuccess: (res) => {
        const { data } = res;
        if (data) {
          const modelData = {
            durasi: Number(data.durasi),
            status: data.status,
            notes: data.notes,
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
    if (open && id) {
      resetForm();
      bookingRefetch();
    }
  }, [id, bookingRefetch, resetForm, open]);

  const submitUpdateBooking = useConfirmBooking({ id });

  const onSubmit = (data) => {
    console.log("onSubmit", data);
    submitUpdateBooking.mutate(data, {
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: [queryKey.bookings] });
        resetForm();
        onSuccess(response);
      },
      onError: (error) => {
        onError(error);
      },
    });
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={{ ...modalStyle, maxWidth: 800 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography id="modal-modal-title" variant="h4" component="h2" marginBottom={2}>
            Confirm Class #{id}
          </Typography>
          <Grid container marginBottom={3}>
            <Grid item xs={12} paddingBottom={2}>
              <FormControl fullWidth error={!!errors.durasi}>
                <CustomInputLabel htmlFor="durasi">Durasi</CustomInputLabel>
                <CustomTextField
                  {...register("durasi", { required: "Durasi Wajib diisi" })}
                  helperText={errors.durasi?.message}
                  error={!!errors.durasi}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.status}>
                <FormLabel id="status">Status Kelas</FormLabel>
                <RadioGroupReactHook
                  name="status"
                  control={control}
                  rules={{ required: "Status booking wajib diisi" }}
                  options={[
                    { value: "konfirmasi", label: "Masuk" },
                    { value: "batal", label: "Hangus" },
                    { value: "ijin", label: "Ijin" },
                  ]}
                  helperText={errors.status?.message}
                  error={!!errors.status}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
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
          </Grid>
          <input type="hidden" {...register("userId")} value={userId} />
          <Stack justifyContent={"flex-end"}>
            <LoadingButton loading={submitUpdateBooking.isLoading} variant="contained" type="submit" fullWidth>
              Submit
            </LoadingButton>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}

ConfirmBooking.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  id: PropTypes.number,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  userId: PropTypes.number,
};
