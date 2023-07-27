import React from "react";
import { Typography, Modal, Box, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";

import InputBasic from "../input/inputBasic";
import SelectBasic from "../input/selectBasic";
import DateInputBasic from "../input/dateInputBasic";
import { modalStyle } from "../../constants/modalStyle";
import { classType } from "../../constants/classType";

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
              fullWidth
              id="jenis_kelas"
              name="jenis_kelas"
              defaultValue="private"
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
            <InputBasic
              required
              label="Student Name"
              name="user_group"
              value={stateForm.values.user_group}
              error={Boolean(stateForm.errors.user_group)}
              errorMessage={stateForm.errors.user_group}
              onChange={(e) => {
                onChange(e);
              }}
            />
          </Grid>
          <Grid item xs={6} paddingBottom={2}>
            <InputBasic
              required
              label="Branch"
              name="cabang"
              value={stateForm.values.cabang}
              error={Boolean(stateForm.errors.cabang)}
              errorMessage={stateForm.errors.cabang}
              onChange={(e) => {
                onChange(e);
              }}
            />
          </Grid>
          <Grid item xs={6} paddingBottom={2}>
            <InputBasic
              required
              label="Teacher Name"
              name="teacherId"
              value={stateForm.values.teacherId}
              error={Boolean(stateForm.errors.teacherId)}
              errorMessage={stateForm.errors.teacherId}
              onChange={(e) => {
                onChange(e);
              }}
            />
          </Grid>
          <Grid item xs={6} paddingBottom={2}>
            <InputBasic
              required
              label="Rooms"
              name="roomId"
              value={stateForm.values.roomId}
              error={Boolean(stateForm.errors.roomId)}
              errorMessage={stateForm.errors.roomId}
              onChange={(e) => {
                onChange(e);
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
