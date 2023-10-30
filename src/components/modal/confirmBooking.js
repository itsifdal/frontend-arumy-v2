import React, { useEffect, useReducer } from "react";
import {
  Typography,
  Modal,
  Box,
  Grid,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Stack,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { differenceInMinutes, format, parse } from "date-fns";

import { modalStyle } from "../../constants/modalStyle";
import { queryKey } from "../../constants/queryKey";
import InputBasic from "../input/inputBasic";

import { bookingFormReducer, initialBookingFormState, validateBookingForm } from "../../utils/reducer/bookingReducer";

export default function ConfirmBooking({ open, onClose, id, callbackSuccess, callbackError }) {
  const [stateForm, dispatchStateForm] = useReducer(bookingFormReducer, initialBookingFormState);
  const queryClient = useQueryClient();

  const { refetch: bookingRefetch } = useQuery(
    [queryKey.bookings, "DETAIL"],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/booking/${id}`).then((res) => res.data),
    {
      enabled: Boolean(id),
      onSuccess: (res) => {
        const { data } = res;
        const modelData = {
          roomId: {
            value: data.roomId ?? "",
            label: data.room?.nama_ruang ?? "",
          },
          teacherId: {
            value: data.teacherId ?? "",
            label: data.teacher?.nama_pengajar ?? "",
          },
          user_group: JSON.parse(data.user_group)?.map((student) => ({ value: student.id, label: student.nama_murid })),
          instrumentId: {
            value: data.instrumentId ?? "",
            label: data.instrument?.nama_instrument ?? "",
          },
          tgl_kelas: parse(data.tgl_kelas, "yyyy-MM-dd", new Date()),
          cabang: data.cabang,
          jam_booking: parse(data.jam_booking, "HH:mm:ss", new Date()),
          jam_selesai_booking: parse(data.selesai, "HH:mm:ss", new Date()),
          jenis_kelas: data.jenis_kelas,
          durasi: Number(data.durasi),
          status: data.status,
        };
        const entries = Object.entries(modelData);
        entries.forEach((booking) => {
          dispatchStateForm({
            type: "change-field",
            name: booking[0],
            value: booking[1],
            isEnableValidate: true,
          });
        });
      },
    }
  );

  useEffect(() => {
    if (id) {
      bookingRefetch();
    }
  }, [id, bookingRefetch]);

  useEffect(() => {
    if (stateForm.values.jam_booking && stateForm.values.jam_selesai_booking) {
      const duration = differenceInMinutes(stateForm.values.jam_selesai_booking, stateForm.values.jam_booking);
      onChange({ target: { name: "durasi", value: duration } });
    }
  }, [stateForm.values.jam_booking, stateForm.values.jam_selesai_booking]);

  const submitUpdateBooking = useMutation((data) =>
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/booking/${id}`, data)
  );

  const handleCallbackMutate = {
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [queryKey.bookings] });
      callbackSuccess(response);
    },
    onError: (error) => {
      callbackError(error);
    },
  };

  const handleSubmitUpdate = () => {
    const errors = validateBookingForm(stateForm.values);
    const hasError = Object.values(errors).some((value) => Boolean(value));
    if (!hasError) {
      const data = {
        roomId: stateForm.values.roomId.value,
        teacherId: stateForm.values.teacherId.value,
        user_group: stateForm.values.user_group.map((student) => ({ id: student.value, nama_murid: student.label })),
        instrumentId: stateForm.values.instrumentId.value,
        tgl_kelas: format(stateForm.values.tgl_kelas, "yyyy-MM-dd"),
        cabang: stateForm.values.cabang,
        jam_booking: format(stateForm.values.jam_booking, "HH:mm"),
        jenis_kelas: stateForm.values.jenis_kelas,
        durasi: stateForm.values.durasi,
        status: stateForm.values.status,
      };

      submitUpdateBooking.mutate(data, handleCallbackMutate);
    } else {
      dispatchStateForm({
        type: "change-error",
        value: errors,
      });
    }
  };

  const onChange = (e) => {
    dispatchStateForm({
      type: "change-field",
      name: e.target.name,
      value: e.target.value,
      isEnableValidate: true,
    });
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={{ ...modalStyle, maxWidth: 800 }}>
        <Typography id="modal-modal-title" variant="h4" component="h2" marginBottom={2}>
          Confirm Class #{id}
        </Typography>
        <Grid container marginBottom={3}>
          <Grid item xs={12} paddingBottom={2}>
            <InputBasic
              required
              label="Durasi (dalam menit)"
              name="durasi"
              value={stateForm.values.durasi}
              error={Boolean(stateForm.errors.durasi)}
              errorMessage={stateForm.errors.durasi}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <InputLabel
                htmlFor="status-kelas"
                sx={{
                  position: "relative",
                  transform: "none",
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                STATUS KELAS
              </InputLabel>
              <RadioGroup
                row
                aria-labelledby="status-kelas"
                name="status"
                value={stateForm.values.status}
                onChange={onChange}
              >
                <FormControlLabel value="konfirmasi" control={<Radio />} label="Masuk" />
                <FormControlLabel value="batal" control={<Radio />} label="Hangus" />
                <FormControlLabel value="ijin" control={<Radio />} label="Ijin" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <Stack justifyContent={"flex-end"}>
          <LoadingButton
            variant="contained"
            type="submit"
            onClick={handleSubmitUpdate}
            loading={submitUpdateBooking.isLoading}
          >
            Submit
          </LoadingButton>
        </Stack>
      </Box>
    </Modal>
  );
}

ConfirmBooking.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  id: PropTypes.number,
  callbackSuccess: PropTypes.func,
  callbackError: PropTypes.func,
};
