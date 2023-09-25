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
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import { differenceInMinutes, format, parse } from "date-fns";

import { modalStyle } from "../../constants/modalStyle";
import { queryKey } from "../../constants/queryKey";
import InputBasic from "../input/inputBasic";

import { bookingFormReducer, initialBookingFormState, validateBookingForm } from "../../utils/reducer/bookingReducer";

export default function ConfirmBooking({ open, onClose, id, callbackSuccess, callbackError }) {
  const [stateForm, dispatchStateForm] = useReducer(bookingFormReducer, initialBookingFormState);

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

  const { refetch: bookingRefetch } = useQuery(
    [queryKey.bookings, "DETAIL"],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/booking/${id}`).then((res) => res.data),
    {
      enabled: Boolean(id),
      onSuccess: (res) => {
        const modelData = {
          roomId: {
            value: res.roomId ?? "",
            label: res.room.nama_ruang ?? "",
          },
          teacherId: {
            value: res.teacherId ?? "",
            label: res.teacher.nama_pengajar ?? "",
          },
          user_group: res.user_group?.map((student) => ({ value: student.id, label: student.nama_murid })),
          instrumentId: {
            value: res.instrumentId ?? "",
            label: res.instrument.nama_instrument ?? "",
          },
          tgl_kelas: parse(res.tgl_kelas, "yyyy-MM-dd", new Date()),
          cabang: res.cabang,
          jam_booking: parse(res.jam_booking, "HH:mm:ss", new Date()),
          jam_selesai_booking: parse(res.selesai, "HH:mm:ss", new Date()),
          jenis_kelas: res.jenis_kelas,
          durasi: Number(res.durasi),
          status: res.status,
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

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={{ ...modalStyle, maxWidth: 800 }}>
        <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={2}>
          Confirm Class
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
                <FormControlLabel value="pending" control={<Radio />} label="Pending" />
                <FormControlLabel value="konfirmasi" control={<Radio />} label="Konfirmasi" />
                <FormControlLabel value="batal" control={<Radio />} label="Batal" />
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
