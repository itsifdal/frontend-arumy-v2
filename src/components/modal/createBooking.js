import React, { useEffect, useState, useReducer } from "react";
import {
  Typography,
  Modal,
  Box,
  Grid,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import { differenceInMinutes, format, parse } from "date-fns";
import { toast } from "react-toastify";

import InputBasic from "../input/inputBasic";
import SelectBasic from "../input/selectBasic";
import DateInputBasic from "../input/dateInputBasic";
import { modalStyle } from "../../constants/modalStyle";
import { classType } from "../../constants/classType";
import { queryKey } from "../../constants/queryKey";
import TimeInputBasic from "../input/timeInputBasic";
import AutoCompleteBasic from "../input/autoCompleteBasic";

import { bookingFormReducer, initialBookingFormState, validateBookingForm } from "../../utils/reducer/bookingReducer";

export default function CreateBooking({ open, onClose, state, id, callbackSuccess, callbackError, userId }) {
  const [openStudent, setOpenStudent] = useState(false);
  const [openTeacher, setOpenTeacher] = useState(false);
  const [openRoom, setOpenRoom] = useState(false);
  const [openInstrument, setOpenInstrument] = useState(false);
  const [stateForm, dispatchStateForm] = useReducer(bookingFormReducer, initialBookingFormState);

  useEffect(() => {
    if (stateForm.values.jam_booking && stateForm.values.jam_selesai_booking) {
      const duration = differenceInMinutes(stateForm.values.jam_selesai_booking, stateForm.values.jam_booking);
      onChange({ target: { name: "durasi", value: duration } });
    }
  }, [stateForm.values.jam_booking, stateForm.values.jam_selesai_booking]);

  useEffect(() => {
    if (open) {
      dispatchStateForm({
        type: "reset-field",
      });
    }
  }, [open]);

  const { data: students = [], isLoading: isLoadingStudents } = useQuery(
    [queryKey.students],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/student?perPage=9999`).then((res) => res.data),
    {
      select: (students) => students.data?.map((student) => ({ value: student.id, label: student.nama_murid })),
      enabled: openStudent,
    }
  );

  const { data: teachers = [], isLoading: isLoadingTeachers } = useQuery(
    [queryKey.teachers],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/teacher?perPage=9999`).then((res) => res.data),
    {
      select: (teachers) => teachers.data?.map((teacher) => ({ value: teacher.id, label: teacher.nama_pengajar })),
      enabled: openTeacher,
    }
  );

  const { data: rooms = [], isLoading: isLoadingRooms } = useQuery(
    [queryKey.rooms],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/room`).then((res) => res.data),
    {
      select: (roomList) =>
        roomList.map((room) => ({ value: room.id, label: room.nama_ruang, branch: room.cabang?.nama_cabang })),
      enabled: openRoom,
    }
  );

  const { data: instruments = [], isLoading: isLoadingInstruments } = useQuery(
    [queryKey.instruments],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/instrument`).then((res) => res.data),
    {
      select: (instruments) =>
        instruments.map((instrument) => ({ value: instrument.id, label: instrument.nama_instrument })),
      enabled: true,
    }
  );

  const submitUpdateBooking = useMutation((data) =>
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/booking/${id}`, data)
  );

  const submitAddBooking = useMutation((data) => axios.post(`${process.env.REACT_APP_BASE_URL}/api/booking`, data));

  const handleCallbackMutate = ({ addAnother }) => ({
    onSuccess: (response) => {
      if (!addAnother) {
        callbackSuccess(response);
      } else {
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 1000,
          theme: "colored",
        });
      }
    },
    onError: (error) => {
      callbackError(error);
    },
  });

  const handleSubmitCreate = ({ addAnother = false }) => {
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
        status: state === "create" ? "pending" : stateForm.values.status,
        userId,
      };

      if (state === "update") {
        submitUpdateBooking.mutate(data, handleCallbackMutate({ addAnother }));
      } else {
        submitAddBooking.mutate(data, handleCallbackMutate({ addAnother }));
      }
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
          user_group: res.user_group?.map((student) => ({ value: student.id, label: student.nama_murid })) || [],
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
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-create-booking"
      aria-describedby="modal-for-create-booking"
    >
      <Box sx={{ ...modalStyle, maxWidth: 800 }}>
        <Box marginBottom={2}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {state === "update" ? "Update Student" : "Create Student"}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6} paddingBottom={2}>
            <SelectBasic
              required
              fullWidth
              id="jenis_kelas"
              name="jenis_kelas"
              defaultValue={classType[0].value}
              value={stateForm.values.jenis_kelas}
              error={Boolean(stateForm.errors.jenis_kelas)}
              errorMessage={stateForm.errors.jenis_kelas}
              onChange={(e) => {
                onChange({ target: { name: "user_group", value: [] } });
                onChange(e);
              }}
              select
              label="Class Type"
              options={classType}
            />
          </Grid>
          <Grid item xs={6} paddingBottom={2}>
            <DateInputBasic
              required
              label="Date"
              name="tgl_kelas"
              value={stateForm.values.tgl_kelas}
              error={Boolean(stateForm.errors.tgl_kelas)}
              errorMessage={stateForm.errors.tgl_kelas}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={6} paddingBottom={2}>
            <AutoCompleteBasic
              multiple
              required
              label="Student Name"
              name="user_group"
              ChipProps={{ size: "small" }}
              value={stateForm.values.user_group}
              error={Boolean(stateForm.errors.user_group)}
              errorMessage={stateForm.errors.user_group}
              options={students}
              loading={isLoadingStudents}
              open={openStudent}
              onOpen={() => {
                setOpenStudent(true);
              }}
              onClose={() => {
                setOpenStudent(false);
              }}
              onChange={(_, newValue) => {
                let values = newValue;
                // reset when class not group
                if (stateForm.values.jenis_kelas !== "group") {
                  values = values.slice(-1);
                }
                onChange({ target: { name: "user_group", value: values } });
              }}
            />
          </Grid>
          <Grid item xs={6} paddingBottom={2}>
            <AutoCompleteBasic
              required
              label="Teacher Name"
              name="teacherId"
              value={stateForm.values.teacherId}
              error={Boolean(stateForm.errors.teacherId)}
              errorMessage={stateForm.errors.teacherId}
              options={teachers}
              loading={isLoadingTeachers}
              open={openTeacher}
              onOpen={() => {
                setOpenTeacher(true);
              }}
              onClose={() => {
                setOpenTeacher(false);
              }}
              onChange={(_, newValue) => {
                onChange({ target: { name: "teacherId", value: newValue } });
              }}
            />
          </Grid>
          <Grid item xs={6} paddingBottom={2}>
            <AutoCompleteBasic
              required
              label="Rooms"
              name="roomId"
              value={stateForm.values.roomId}
              error={Boolean(stateForm.errors.roomId)}
              errorMessage={stateForm.errors.roomId}
              options={rooms}
              loading={isLoadingRooms}
              open={openRoom}
              onOpen={() => {
                setOpenRoom(true);
              }}
              onClose={() => {
                setOpenRoom(false);
              }}
              onChange={(_, newValue) => {
                onChange({ target: { name: "roomId", value: newValue } });
                onChange({
                  target: {
                    name: "cabang",
                    value: newValue ? rooms.find((room) => room.value === newValue.value).branch : "",
                  },
                });
              }}
            />
          </Grid>
          <Grid item xs={6} paddingBottom={2}>
            <InputBasic
              required
              label="Branch"
              name="cabang"
              disabled
              value={stateForm.values.cabang}
              error={Boolean(stateForm.errors.cabang)}
              errorMessage={stateForm.errors.cabang}
            />
          </Grid>
          <Grid item xs={6} paddingBottom={2}>
            <TimeInputBasic
              required
              label="Start"
              name="jam_booking"
              value={stateForm.values.jam_booking}
              error={Boolean(stateForm.errors.jam_booking)}
              errorMessage={stateForm.errors.jam_booking}
              minutesStep={5}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={6} paddingBottom={2}>
            <TimeInputBasic
              required
              label="End"
              name="jam_selesai_booking"
              value={stateForm.values.jam_selesai_booking}
              error={Boolean(stateForm.errors.jam_selesai_booking)}
              errorMessage={stateForm.errors.jam_selesai_booking}
              minTime={stateForm.values.jam_booking}
              minutesStep={5}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={6} paddingBottom={2}>
            <AutoCompleteBasic
              required
              label="Instrument"
              name="instrumentId"
              value={stateForm.values.instrumentId}
              error={Boolean(stateForm.errors.instrumentId)}
              errorMessage={stateForm.errors.instrumentId}
              options={instruments}
              loading={isLoadingInstruments}
              open={openInstrument}
              onOpen={() => {
                setOpenInstrument(true);
              }}
              onClose={() => {
                setOpenInstrument(false);
              }}
              onChange={(_, newValue) => {
                onChange({ target: { name: "instrumentId", value: newValue } });
              }}
            />
          </Grid>
          <Grid item xs={6} paddingBottom={2}>
            <InputBasic
              required
              label="Durasi"
              name="durasi"
              disabled
              value={stateForm.values.durasi}
              error={Boolean(stateForm.errors.durasi)}
              errorMessage={stateForm.errors.durasi}
            />
          </Grid>
          {state === "update" ? (
            <Grid item xs={12}>
              <FormControl>
                <FormLabel id="status-kelas">Status Kelas</FormLabel>
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
          ) : null}
        </Grid>
        <Stack direction={"row"} spacing={2}>
          <LoadingButton
            loading={submitAddBooking.isLoading || submitUpdateBooking.isLoading}
            variant="outlined"
            type="submit"
            fullWidth
            onClick={() => handleSubmitCreate({ addAnother: false })}
          >
            Save and Close
          </LoadingButton>
          {state !== "update" ? (
            <LoadingButton
              loading={submitAddBooking.isLoading || submitUpdateBooking.isLoading}
              variant="contained"
              type="submit"
              fullWidth
              onClick={() => handleSubmitCreate({ addAnother: true })}
            >
              Save and add another
            </LoadingButton>
          ) : null}
        </Stack>
      </Box>
    </Modal>
  );
}

CreateBooking.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  state: PropTypes.string,
  id: PropTypes.number,
  callbackSuccess: PropTypes.func,
  callbackError: PropTypes.func,
  userId: PropTypes.number,
};
