import React, { useEffect, useState } from "react";
import { Typography, Modal, Box, Grid, Stack, FormControl, FormLabel, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import { useQueryClient } from "react-query";
import { parse, addMinutes, isValid } from "date-fns";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";

import CustomInputLabel from "../../components/input/inputLabel";
import { CustomTextField } from "../../components/input/inputBasic";
import { modalStyle } from "../../constants/modalStyle";
import { classType } from "../../constants/classType";
import { queryKey } from "../../constants/queryKey";
import TimeInputReactHook from "../../components/input/timeInputReactHook";
import SelectReactHook from "../../components/input/selectReactHook";
import DateInputReactHook from "../../components/input/dateInputReactHook";
import AutoCompleteReactHook from "../../components/input/autoCompleteReactHook";
import RadioGroupReactHook from "../../components/input/radioGroupReactHook";
import { useGetStudents } from "../students/query";
import { useGetTeachers } from "../teachers/query";
import { useGetRooms } from "../rooms/query";
import { useGetInstruments } from "../instruments/query";
import { useAddBooking, useUpdateBooking, useGetBooking } from "./query";
import { BookingDeleteModal } from "./deleteModal";
import { generateDuration, modelBooking } from "./utils";

export const BookingFormModal = ({ open, onClose, stateModal, id, onSuccess, onError }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
    watch,
    resetField,
  } = useForm({
    defaultValues: {
      jenis_kelas: classType[0].value,
      status: "pending",
    },
  });
  const watchClassType = watch("jenis_kelas");
  const watchTimeBooking = watch(["jam_booking", "jam_selesai_booking"]);
  const queryClient = useQueryClient();
  const [openDel, setOpenDel] = useState(false);

  const { data: students = [], isLoading: isLoadingStudents } = useGetStudents({
    queryParam: { perPage: 9999 },
    options: {
      select: (students) => students.data?.map((student) => ({ value: student.id, label: student.nama_murid })),
      enabled: open,
    },
  });

  const { data: teachers = [], isLoading: isLoadingTeachers } = useGetTeachers({
    queryParam: { perPage: 9999 },
    options: {
      select: (teachers) => teachers.data?.map((teacher) => ({ value: teacher.id, label: teacher.nama_pengajar })),
      enabled: open,
    },
  });

  const { data: rooms = [], isLoading: isLoadingRooms } = useGetRooms({
    options: {
      select: (roomList) =>
        roomList.map((room) => ({ value: room.id, label: room.nama_ruang, branch: room.cabang?.nama_cabang })),
      enabled: open,
    },
  });

  const { data: instruments = [], isLoading: isLoadingInstruments } = useGetInstruments({
    options: {
      select: (instruments) =>
        instruments.map((instrument) => ({ value: instrument.id, label: instrument.nama_instrument })),
      enabled: open,
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

  const handleSubmitCreate = ({ data, addAnother = false }) => {
    if (stateModal === "update") {
      submitUpdateBooking.mutate(data, handleCallbackMutate({ addAnother }));
    } else {
      submitAddBooking.mutate(data, handleCallbackMutate({ addAnother }));
    }
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
        entries.forEach((packet) => {
          setValue(packet[0], packet[1]);
        });
      },
    },
  });

  useEffect(() => {
    if (open && stateModal === "update" && id) {
      reset();
      bookingRefetch();
    }
  }, [open, id, bookingRefetch, stateModal, reset]);

  useEffect(() => {
    setValue("durasi", generateDuration(watchTimeBooking[0], watchTimeBooking[1]));
  }, [setValue, watchTimeBooking]);

  const handleOpenModalDelete = (e) => {
    e.preventDefault();
    setOpenDel(true);
  };
  const handleCloseModalDelete = () => setOpenDel(false);

  const onSubmit = (data) => {
    delete data.jam_selesai_booking;
    const modelData = modelBooking(data);
    handleSubmitCreate({ data: modelData, addAnother: false });
  };

  const onSubmitAnother = (data) => {
    delete data.jam_selesai_booking;
    const modelData = modelBooking(data);
    handleSubmitCreate({ data: modelData, addAnother: true });
  };

  if (isLoadingBookingRefetch) {
    return (
      <Modal
        open={open}
        onClose={() => {
          reset();
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
          <form>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} marginBottom={2}>
              <Typography id="modal-modal-title" variant="h4" component="h2" fontWeight={700} color={"#172560"}>
                {stateModal === "update" ? `Update Booking #${id}` : "Create Booking"}
              </Typography>
              {stateModal === "update" ? (
                <Button variant="contained" color="error" size="small" data-id={id} onClick={handleOpenModalDelete}>
                  Delete
                </Button>
              ) : null}
            </Box>
            <Grid container spacing={2}>
              {/* Jenis Kelas */}
              <Grid item xs={6} paddingBottom={2}>
                <FormControl fullWidth error={!!errors.jenis_kelas}>
                  <CustomInputLabel htmlFor="jenis_kelas">Jenis kelas*</CustomInputLabel>
                  <SelectReactHook
                    name="jenis_kelas"
                    rules={{
                      required: "Jenis kelas wajib diisi",
                    }}
                    control={control}
                    helperText={errors.jenis_kelas?.message}
                    isError={!!errors.jenis_kelas}
                    options={classType}
                    onChangeCallback={() => {
                      resetField("user_group");
                    }}
                  />
                </FormControl>
              </Grid>

              {/* Tanggal Kelas */}
              <Grid item xs={6} paddingBottom={2}>
                <FormControl fullWidth error={!!errors.tgl_kelas}>
                  <CustomInputLabel htmlFor="tgl_kelas">Tanggal kelas*</CustomInputLabel>
                  <DateInputReactHook
                    name="tgl_kelas"
                    rules={{
                      required: "Tanggal kelas wajib diisi",
                      validate: (value) => !!value.getDate() || "Format tanggal salah",
                    }}
                    control={control}
                    isError={!!errors.tgl_kelas}
                    helperText={errors.tgl_kelas?.message}
                  />
                </FormControl>
              </Grid>

              {/* Siswa */}
              <Grid item xs={6} paddingBottom={2}>
                <FormControl fullWidth error={!!errors.user_group}>
                  <CustomInputLabel htmlFor="user_group">Nama murid*</CustomInputLabel>
                  <AutoCompleteReactHook
                    multiple
                    name="user_group"
                    rules={{
                      required: "Nama murid wajib diisi",
                    }}
                    control={control}
                    options={students}
                    loading={isLoadingStudents}
                    isError={!!errors.user_group}
                    helperText={errors.user_group?.message}
                    onChangeCallback={(value) => {
                      let values = value;
                      // reset when class not group
                      if (watchClassType !== "group") {
                        values = values.slice(-1);
                      }
                      setValue("user_group", values);
                    }}
                  />
                </FormControl>
              </Grid>

              {/* Guru */}
              <Grid item xs={6} paddingBottom={2}>
                <FormControl fullWidth error={!!errors.teacherId}>
                  <CustomInputLabel htmlFor="teacherId">Nama Guru*</CustomInputLabel>
                  <AutoCompleteReactHook
                    name="teacherId"
                    rules={{
                      required: "Nama guru wajib diisi",
                    }}
                    control={control}
                    options={teachers}
                    loading={isLoadingTeachers}
                    isError={!!errors.teacherId}
                    helperText={errors.teacherId?.message}
                  />
                </FormControl>
              </Grid>

              {/* Ruang */}
              <Grid item xs={6} paddingBottom={2}>
                <FormControl fullWidth error={!!errors.roomId}>
                  <CustomInputLabel htmlFor="roomId">Nama ruang*</CustomInputLabel>
                  <AutoCompleteReactHook
                    name="roomId"
                    rules={{
                      required: "Nama ruang wajib diisi",
                    }}
                    control={control}
                    options={rooms}
                    loading={isLoadingRooms}
                    isError={!!errors.roomId}
                    helperText={errors.roomId?.message}
                    onChangeCallback={(newValue) => {
                      setValue("cabang", newValue?.branch || "");
                    }}
                  />
                </FormControl>
              </Grid>

              {/* Cabang */}
              <Grid item xs={6} paddingBottom={2}>
                <FormControl fullWidth error={!!errors.cabang}>
                  <CustomInputLabel htmlFor="cabang">Cabang</CustomInputLabel>
                  <Controller
                    name="cabang"
                    control={control}
                    rules={{ required: "Cabang Wajib diisi" }}
                    render={({ field: { value = "" } }) => (
                      <CustomTextField
                        disabled
                        value={value}
                        helperText={errors.cabang?.message}
                        error={!!errors.cabang}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Jam Booking */}
              <Grid item xs={6} paddingBottom={2}>
                <FormControl fullWidth error={!!errors.jam_booking}>
                  <CustomInputLabel htmlFor="jam_booking">Jam booking*</CustomInputLabel>
                  <TimeInputReactHook
                    name="jam_booking"
                    rules={{
                      required: "Jam booking wajib diisi",
                      validate: (value) => !!value.getTime() || "Format jam salah",
                    }}
                    control={control}
                    isError={!!errors.jam_booking}
                    helperText={errors.jam_booking?.message}
                    onChangeCallback={(val) => {
                      if (isValid(val)) {
                        setValue("jam_selesai_booking", addMinutes(val, 45));
                      } else {
                        resetField("durasi");
                      }
                    }}
                  />
                </FormControl>
              </Grid>

              {/* Jam Selesai */}
              <Grid item xs={6} paddingBottom={2}>
                <FormControl fullWidth error={!!errors.jam_selesai_booking}>
                  <CustomInputLabel htmlFor="jam_selesai_booking">Jam selesai*</CustomInputLabel>
                  <TimeInputReactHook
                    name="jam_selesai_booking"
                    rules={{
                      required: "Jam selesai booking wajib diisi",
                      validate: (value) => !!value.getTime() || "Format jam salah",
                    }}
                    control={control}
                    isError={!!errors.jam_selesai_booking}
                    helperText={errors.jam_selesai_booking?.message}
                    onChangeCallback={(val) => {
                      if (!isValid(val)) {
                        resetField("durasi");
                      }
                    }}
                  />
                </FormControl>
              </Grid>

              {/* Instrument */}
              <Grid item xs={6} paddingBottom={2}>
                <FormControl fullWidth error={!!errors.instrumentId}>
                  <CustomInputLabel htmlFor="instrumentId">Instrument*</CustomInputLabel>
                  <AutoCompleteReactHook
                    name="instrumentId"
                    rules={{
                      required: "Instrument wajib diisi",
                    }}
                    control={control}
                    options={instruments}
                    loading={isLoadingInstruments}
                    isError={!!errors.instrumentId}
                    helperText={errors.instrumentId?.message}
                  />
                </FormControl>
              </Grid>

              {/* Durasi */}
              <Grid item xs={6} paddingBottom={2}>
                <FormControl fullWidth error={!!errors.durasi}>
                  <CustomInputLabel htmlFor="durasi">Durasi</CustomInputLabel>
                  <Controller
                    name="durasi"
                    control={control}
                    rules={{ required: "Durasi tidak terhitung" }}
                    render={({ field: { value = "" } }) => (
                      <CustomTextField
                        disabled
                        value={value}
                        helperText={errors.durasi?.message}
                        error={!!errors.durasi}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Notes */}
              <Grid item xs={12} paddingBottom={2}>
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

              {/* Status Kelas */}
              {stateModal === "update" ? (
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.status}>
                    <FormLabel id="status">Status Kelas</FormLabel>
                    <RadioGroupReactHook
                      name="status"
                      control={control}
                      rules={{ required: "Status booking wajib diisi" }}
                      options={[
                        { value: "pending", label: "Pending" },
                        { value: "konfirmasi", label: "Masuk" },
                        { value: "batal", label: "Hangus" },
                        { value: "ijin", label: "Ijin" },
                      ]}
                      helperText={errors.status?.message}
                      error={!!errors.status}
                    />
                  </FormControl>
                </Grid>
              ) : null}
            </Grid>
          </form>
          <Stack direction={"row"} spacing={2}>
            <LoadingButton
              loading={submitAddBooking.isLoading || submitUpdateBooking.isLoading}
              variant="outlined"
              fullWidth
              onClick={handleSubmit(onSubmit)}
            >
              Save and Close
            </LoadingButton>
            {stateModal !== "update" ? (
              <LoadingButton
                loading={submitAddBooking.isLoading || submitUpdateBooking.isLoading}
                variant="contained"
                fullWidth
                onClick={handleSubmit(onSubmitAnother)}
              >
                Save and add another
              </LoadingButton>
            ) : null}
          </Stack>
        </Box>
      </Modal>

      {stateModal === "update" ? (
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
  stateModal: PropTypes.string,
  id: PropTypes.number,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  userId: PropTypes.number,
};
