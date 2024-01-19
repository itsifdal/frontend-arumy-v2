import React, { useEffect } from "react";
import { Typography, Modal, Box, Stack, FormControl } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

import { modalStyle } from "../../constants/modalStyle";
import CustomInputLabel from "../../components/input/inputLabel";
import { CustomTextField } from "../../components/input/inputBasic";
import SelectReactHook from "../../components/input/selectReactHook";
import AutoCompleteReactHook from "../../components/input/autoCompleteReactHook";
import { useGetTeachers } from "../teachers/query";
import { useAddUser, useUpdateUser, useGetUser } from "./query";

const roleOptions = [
  { value: "Super Admin", label: "Super Admin" },
  { value: "Admin", label: "Admin" },
  { value: "Guru", label: "Guru" },
  { value: "Reguler", label: "Reguler" },
];

export default function UserFormModal({ open, onClose, stateModal, id, onSuccess, onError }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { errors },
    control,
    watch,
  } = useForm();

  const { data: teachers = [], isLoading: isLoadingTeachers } = useGetTeachers({
    queryParam: { perPage: 9999 },
    options: {
      select: (teachers) => teachers.data.map((teacher) => ({ value: teacher.id, label: teacher.nama_pengajar })),
    },
  });

  const submitAddUser = useAddUser();
  const submitUpdateUser = useUpdateUser({ id });

  const { refetch: userRefetch, isLoading: isLoadingUser } = useGetUser({
    id,
    options: {
      enabled: Boolean(id),
      onSuccess: (res) => {
        const entries = Object.entries(res);
        entries.forEach((user) => {
          setValue(user[0], user[1]);
        });
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
      userRefetch();
    }
  }, [open, id, userRefetch, stateModal]);

  const onSubmit = (data) => {
    if (stateModal === "update") {
      delete data.password;
      delete data.token;
      submitUpdateUser.mutate(data, {
        onSuccess: (response) => {
          resetForm();
          onSuccess(response);
        },
        onError: (error) => {
          onError(error);
        },
      });
    } else {
      submitAddUser.mutate(data, {
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

  if (isLoadingUser) {
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
      <Box sx={{ ...modalStyle, maxWidth: 900 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box width={"100%"} marginBottom={2}>
            <Typography id="modal-modal-title" variant="h4" component="h2" fontWeight={700} color={"#172560"}>
              {stateModal === "update" ? `Update user #${id}` : "Invite new user"}
            </Typography>
            <Typography color={"#737DAA"} fontSize={18}>
              Enter details below
            </Typography>
          </Box>
          <Stack direction={"row"} flexWrap="wrap">
            <Box width={"50%"} paddingBottom={2} paddingRight={2}>
              <FormControl fullWidth error={!!errors.name}>
                <CustomInputLabel htmlFor="name">Name*</CustomInputLabel>
                <CustomTextField
                  {...register("name", { required: "Nama Wajib diisi" })}
                  helperText={errors.name?.message}
                  error={!!errors.name}
                />
              </FormControl>
            </Box>
            <Box width={"50%"} paddingBottom={2} paddingRight={2}>
              <FormControl fullWidth error={!!errors.email}>
                <CustomInputLabel htmlFor="email">Email*</CustomInputLabel>
                <CustomTextField
                  {...register("email", {
                    required: "Email Wajib diisi",
                    pattern: { value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, message: "Format Email salah" },
                  })}
                  helperText={errors.email?.message}
                  error={!!errors.email}
                />
              </FormControl>
            </Box>
            {stateModal !== "update" ? (
              <Box width={"50%"} paddingBottom={2} paddingRight={2}>
                <FormControl fullWidth error={!!errors.password}>
                  <CustomInputLabel htmlFor="password">Password*</CustomInputLabel>
                  <CustomTextField
                    {...register("password", { required: "Password Wajib diisi" })}
                    type="password"
                    helperText={errors.password?.message}
                    error={!!errors.password}
                  />
                </FormControl>
              </Box>
            ) : null}
            <Box width={"50%"} paddingBottom={2} paddingRight={2}>
              <FormControl fullWidth error={!!errors.role}>
                <CustomInputLabel htmlFor="role">Role*</CustomInputLabel>
                <SelectReactHook
                  name="role"
                  rules={{
                    required: "Role wajib dipilih",
                  }}
                  control={control}
                  helperText={errors.role?.message}
                  isError={!!errors.role}
                  options={roleOptions}
                />
              </FormControl>
            </Box>
            {watch("role") === "Guru" ? (
              <Box width={"50%"} paddingBottom={2} paddingRight={2}>
                <FormControl fullWidth error={!!errors.teacherId}>
                  <CustomInputLabel htmlFor="teacherId">Teacher Name*</CustomInputLabel>
                  <AutoCompleteReactHook
                    name="teacherId"
                    rules={{
                      required: "Nama Pengajar wajib diisi",
                    }}
                    control={control}
                    options={teachers}
                    loading={isLoadingTeachers}
                    isError={!!errors.teacherId}
                    helperText={errors.teacherId?.message}
                  />
                </FormControl>
              </Box>
            ) : null}
          </Stack>
          <LoadingButton
            loading={submitAddUser.isLoading || submitUpdateUser.isLoading}
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

UserFormModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  stateModal: PropTypes.string,
  dataName: PropTypes.string,
  id: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};
