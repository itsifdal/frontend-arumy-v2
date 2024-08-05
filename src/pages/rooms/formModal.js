import React, { useEffect } from "react";
import { Typography, Modal, FormControl, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

import { modalStyle } from "../../constants/modalStyle";
import { CustomTextField } from "../../components/input/inputBasic";
import CustomInputLabel from "../../components/input/inputLabel";
import AutoCompleteReactHook from "../../components/input/autoCompleteReactHook";
import { useGetRoom, useAddRoom, useUpdateRoom } from "./query";
import { useGetBranchs } from "../branches/query";
import { modelRoom } from "./utils";

export function RoomFormModal({ open, onClose, stateModal, id, onSuccess, onError }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { errors },
    control,
  } = useForm();

  const { data: branches = [], isLoading: isLoadingBranches } = useGetBranchs({
    queryParam: { perPage: 9999 },
    options: {
      enabled: open,
      select: (res) =>
        res.data.map((branch) => ({
          value: branch.id,
          label: branch.nama_cabang,
        })),
    },
  });

  const submitAddRoom = useAddRoom();
  const submitUpdateRoom = useUpdateRoom({ id });

  const { refetch: roomRefetch, isLoading: isLoadingRoom } = useGetRoom({
    id,
    options: {
      enabled: open && stateModal === "update" && Boolean(id),
      onSuccess: (res) => {
        if (res) {
          const modelData = {
            nama_ruang: res.nama_ruang,
            cabangId: {
              value: res.cabangId ?? "",
              label: branches.find((branch) => branch.value === res.cabangId)?.label ?? "",
            },
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
      roomRefetch();
    }
  }, [open, id, roomRefetch, stateModal]);

  const onSubmit = (data) => {
    const modalData = modelRoom(data);
    if (stateModal === "update") {
      submitUpdateRoom.mutate(modalData, {
        onSuccess: (response) => {
          resetForm();
          onSuccess(response);
        },
        onError: (error) => {
          onError(error);
        },
      });
    } else {
      submitAddRoom.mutate(modalData, {
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

  if (isLoadingRoom || isLoadingBranches) {
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
      <Box sx={{ ...modalStyle, maxWidth: 400 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box marginBottom={2}>
            <Typography id="modal-modal-title" variant="h4" component="h2" fontWeight={700} color={"#172560"}>
              {stateModal === "update" ? `Update Room #${id}` : "Create Room"}
            </Typography>
          </Box>
          <Box paddingBottom={2}>
            <FormControl fullWidth error={!!errors.nama_ruang}>
              <CustomInputLabel htmlFor="nama_ruang">Nama Ruang*</CustomInputLabel>
              <CustomTextField
                {...register("nama_ruang", { required: "Nama Ruang Wajib diisi" })}
                helperText={errors.nama_ruang?.message}
                error={!!errors.nama_ruang}
              />
            </FormControl>
          </Box>
          <Box paddingBottom={2}>
            <FormControl fullWidth error={!!errors.cabangId}>
              <CustomInputLabel htmlFor="cabangId">Cabang*</CustomInputLabel>
              <AutoCompleteReactHook
                name="cabangId"
                rules={{
                  required: "Cabang wajib diisi",
                }}
                control={control}
                options={branches}
                loading={isLoadingBranches}
                isError={!!errors.cabangId}
                helperText={errors.cabangId?.message}
              />
            </FormControl>
          </Box>
          <LoadingButton
            loading={submitAddRoom.isLoading || submitUpdateRoom.isLoading}
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

RoomFormModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  stateModal: PropTypes.string,
  id: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};
