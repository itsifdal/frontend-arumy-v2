import React, { useState } from "react";
import { Typography, Modal, Box, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import { useQuery } from "react-query";
import axios from "axios";

import InputBasic from "../input/inputBasic";
import SelectBasic from "../input/selectBasic";
import DateInputBasic from "../input/dateInputBasic";
import AutoCompleteInputBasic from "../input/autoCompleteInputBasic";
import { modalStyle } from "../../constants/modalStyle";
import { classType } from "../../constants/classType";
import { branch } from "../../constants/branch";
import { queryKey } from "../../constants/queryKey";

export default function CreateBooking({
  open,
  onClose,
  state,
  stateForm,
  onChange,
  mutateCreate,
  mutateUpdate,
  onSubmit,
}) {
  const [openStudent, setOpenStudent] = useState(false);
  const [openTeacher, setOpenTeacher] = useState(false);
  const [openRoom, setOpenRoom] = useState(false);

  const { data: students = [], isLoading: isLoadingStudents } = useQuery(
    [queryKey.students],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/student`).then((res) => res.data),
    {
      select: (students) => students.map((student) => ({ value: student.id, label: student.nama_murid })),
      enabled: openStudent,
    }
  );

  const { data: teachers = [], isLoading: isLoadingTeachers } = useQuery(
    [queryKey.teachers],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/teacher`).then((res) => res.data),
    {
      select: (teachers) => teachers.map((teacher) => ({ value: teacher.id, label: teacher.nama_pengajar })),
      enabled: openTeacher,
    }
  );

  const { data: rooms = [], isLoading: isLoadingRooms } = useQuery(
    [queryKey.rooms],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/room`).then((res) => res.data),
    {
      select: (teachers) => teachers.map((teacher) => ({ value: teacher.id, label: teacher.nama_ruang })),
      enabled: openRoom,
    }
  );

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={{ ...modalStyle, maxWidth: 800 }}>
        <Box marginBottom={2}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {state === "update" ? "Update Student" : "Create Student"}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} paddingBottom={2}>
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
            <AutoCompleteInputBasic
              multiple
              required
              label="Student Name"
              name="user_group"
              ChipProps={{ size: "small" }}
              value={stateForm.values.user_group}
              error={Boolean(stateForm.errors.user_group)}
              errorMessage={stateForm.errors.user_group}
              onChange={(e, value) => {
                onChange(e, value);
              }}
              options={students}
              loading={isLoadingStudents}
              open={openStudent}
              onOpen={() => {
                setOpenStudent(true);
              }}
              onClose={() => {
                setOpenStudent(false);
              }}
            />
          </Grid>
          <Grid item xs={6} paddingBottom={2}>
            <SelectBasic
              required
              fullWidth
              label="Branch"
              name="cabang"
              value={stateForm.values.cabang}
              error={Boolean(stateForm.errors.cabang)}
              errorMessage={stateForm.errors.cabang}
              onChange={(e) => {
                onChange(e);
              }}
              select
              defaultValue={branch[0].value}
              options={branch}
            />
          </Grid>
          <Grid item xs={6} paddingBottom={2}>
            <AutoCompleteInputBasic
              required
              label="Teacher Name"
              name="teacherId"
              value={stateForm.values.teacherId}
              error={Boolean(stateForm.errors.teacherId)}
              errorMessage={stateForm.errors.teacherId}
              onChange={(e, value) => {
                onChange(e, value);
              }}
              options={teachers}
              loading={isLoadingTeachers}
              open={openTeacher}
              onOpen={() => {
                setOpenTeacher(true);
              }}
              onClose={() => {
                setOpenTeacher(false);
              }}
            />
          </Grid>
          <Grid item xs={6} paddingBottom={2}>
            <AutoCompleteInputBasic
              required
              label="Rooms"
              name="roomId"
              value={stateForm.values.roomId}
              error={Boolean(stateForm.errors.roomId)}
              errorMessage={stateForm.errors.roomId}
              onChange={(e, value) => {
                onChange(e, value);
              }}
              options={rooms}
              loading={isLoadingRooms}
              open={openRoom}
              onOpen={() => {
                setOpenRoom(true);
              }}
              onClose={() => {
                setOpenRoom(false);
              }}
            />
          </Grid>
          <Grid item xs={6} paddingBottom={2}>
            <InputBasic
              required
              label="Jam Booking"
              name="jam_booking"
              value={stateForm.values.jam_booking}
              error={Boolean(stateForm.errors.jam_booking)}
              errorMessage={stateForm.errors.jam_booking}
              onChange={(e) => {
                onChange(e);
              }}
            />
          </Grid>
          <Grid item xs={6} paddingBottom={2}>
            <InputBasic
              required
              label="Instrument"
              name="instrumentId"
              value={stateForm.values.instrumentId}
              error={Boolean(stateForm.errors.instrumentId)}
              errorMessage={stateForm.errors.instrumentId}
              onChange={(e) => {
                onChange(e);
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
              onChange={(e) => {
                onChange(e);
              }}
            />
          </Grid>
        </Grid>
        <LoadingButton
          loading={mutateCreate.isLoading || mutateUpdate.isLoading}
          variant="contained"
          type="submit"
          fullWidth
          onClick={() => onSubmit}
        >
          Save
        </LoadingButton>
      </Box>
    </Modal>
  );
}

CreateBooking.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  state: PropTypes.string,
  stateForm: PropTypes.any,
  onChange: PropTypes.func,
  mutateCreate: PropTypes.any,
  mutateUpdate: PropTypes.any,
  onSubmit: PropTypes.func,
};
