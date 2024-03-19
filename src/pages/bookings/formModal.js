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
  Button,
  Radio,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import { useQueryClient } from "react-query";
import { differenceInMinutes, format, parse, addMinutes } from "date-fns";
import { toast } from "react-toastify";

import InputBasic from "../../components/input/inputBasic";
import SelectBasic from "../../components/input/selectBasic";
import DateInputBasic from "../../components/input/dateInputBasic";
import { modalStyle } from "../../constants/modalStyle";
import { classType } from "../../constants/classType";
import { queryKey } from "../../constants/queryKey";
import TimeInputBasic from "../../components/input/timeInputBasic";
import AutoCompleteBasic from "../../components/input/autoCompleteBasic";
import TextareaBasic from "../../components/input/textareaBasic";
import { bookingFormReducer, initialBookingFormState, validateBookingForm } from "../../utils/reducer/bookingReducer";
import { useGetStudents } from "../students/query";
import { useGetTeachers } from "../teachers/query";
import { useGetRooms } from "../rooms/query";
import { useGetInstruments } from "../instruments/query";
import { useAddBooking, useUpdateBooking, useGetBooking } from "./query";
import { BookingDeleteModal } from "./deleteModal";

export const BookingFormModal = ({ open, onClose, state, id, onSuccess, onError, userId }) => {
  const [openStudent, setOpenStudent] = useState(false);
  const [openTeacher, setOpenTeacher] = useState(false);
  const [openRoom, setOpenRoom] = useState(false);
  const [openInstrument, setOpenInstrument] = useState(false);
  const [stateForm, dispatchStateForm] = useReducer(bookingFormReducer, initialBookingFormState);
  const queryClient = useQueryClient();
  const [openDel, setOpenDel] = useState(false);

  const { data: students = [], isLoading: isLoadingStudents } = useGetStudents({
    queryParam: { perPage: 9999 },
    options: {
      select: (students) => students.data?.map((student) => ({ value: student.id, label: student.nama_murid })),
      enabled: openStudent,
    },
  });

  const { data: teachers = [], isLoading: isLoadingTeachers } = useGetTeachers({
    queryParam: { perPage: 9999 },
    options: {
      select: (teachers) => teachers.data?.map((teacher) => ({ value: teacher.id, label: teacher.nama_pengajar })),
      enabled: openTeacher,
    },
  });

  const { data: rooms = [], isLoading: isLoadingRooms } = useGetRooms({
    options: {
      select: (roomList) =>
        roomList.map((room) => ({ value: room.id, label: room.nama_ruang, branch: room.cabang?.nama_cabang })),
      enabled: openRoom,
    },
  });

  const { data: instruments = [], isLoading: isLoadingInstruments } = useGetInstruments({
    options: {
      select: (instruments) =>
        instruments.map((instrument) => ({ value: instrument.id, label: instrument.nama_instrument })),
      enabled: openInstrument,
    },
  });

  const submitUpdateBooking = useUpdateBooking({ id });
  const submitAddBooking = useAddBooking();

  const handleCallbackMutate = ({ addAnother }) => ({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [queryKey.bookings] });
      if (!addAnother) {
        onSuccess(response);
      } else {
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        });
      }
    },
    onError: (error) => {
      onError(error);
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
        notes: stateForm.values.notes,
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

  const { refetch: bookingRefetch, isLoading: isLoadingBookingRefetch } = useGetBooking({
    id,
    options: {
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
          user_group:
            JSON.parse(data.user_group)?.map((student) => ({ value: student.id, label: student.nama_murid })) || [],
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
          notes: data.notes,
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
    },
  });

  useEffect(() => {
    if (open && state === "update" && id) {
      dispatchStateForm({
        type: "reset-field",
      });
      bookingRefetch();
    }
  }, [open, id, bookingRefetch, state]);

  useEffect(() => {
    if (stateForm.values.jam_booking && stateForm.values.jam_selesai_booking) {
      const duration = differenceInMinutes(stateForm.values.jam_selesai_booking, stateForm.values.jam_booking);
      onChange({ target: { name: "durasi", value: duration } });
    }
  }, [stateForm.values.jam_booking, stateForm.values.jam_selesai_booking]);

  useEffect(() => {
    if (open && state === "create") {
      dispatchStateForm({
        type: "reset-field",
      });
    }
  }, [open, state]);

  const handleOpenModalDelete = (e) => {
    e.preventDefault();
    setOpenDel(true);
  };
  const handleCloseModalDelete = () => setOpenDel(false);

  if (isLoadingBookingRefetch) {
    return (
      <Modal
        open={open}
        onClose={() => {
          dispatchStateForm({
            type: "reset-field",
          });
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
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-create-booking"
        aria-describedby="modal-for-create-booking"
        disableEnforceFocus
      >
        <Box sx={{ ...modalStyle, maxWidth: 800 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} marginBottom={2}>
            <Typography id="modal-modal-title" variant="h4" component="h2" fontWeight={700} color={"#172560"}>
              {state === "update" ? `Update Booking #${id}` : "Create Booking"}
            </Typography>
            {state === "update" ? (
              <Button variant="contained" color="error" size="small" data-id={id} onClick={handleOpenModalDelete}>
                Delete
              </Button>
            ) : null}
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
                onChange={(e) => {
                  onChange(e);
                  // auto change jam_selesai_booking
                  dispatchStateForm({
                    type: "change-field",
                    name: "jam_selesai_booking",
                    value: addMinutes(e.target.value, 45),
                    isEnableValidate: false,
                  });
                }}
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
            <Grid item xs={12} paddingBottom={2}>
              <TextareaBasic
                label="Catatan"
                name="notes"
                id="notes"
                value={stateForm.values.notes}
                onChange={(e) => {
                  onChange(e);
                }}
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
                    <FormControlLabel value="konfirmasi" control={<Radio />} label="Masuk" />
                    <FormControlLabel value="batal" control={<Radio />} label="Hangus" />
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

      {state === "update" ? (
        <BookingDeleteModal
          open={openDel}
          onClose={handleCloseModalDelete}
          id={id}
          onSuccess={(response) => {
            setOpenDel(false);
            onSuccess(response);
          }}
          onError={(error) => {
            onError(error);
          }}
        />
      ) : null}
    </>
  );
};

BookingFormModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  state: PropTypes.string,
  id: PropTypes.number,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  userId: PropTypes.number,
};
