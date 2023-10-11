/* eslint-disable camelcase */
// import { Link as RouterLink } from 'react-router-dom';
import { sentenceCase } from "change-case";
import React, { useState, useReducer, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// material
import { Button, Container, Typography, Modal, FormControl, Box, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// components
import { userFormReducer, initialUserFormState, validateUserForm } from "../utils/reducer/userReducer";
import Page from "../components/Page";
import Label from "../components/Label";
import Scrollbar from "../components/Scrollbar";
import Iconify from "../components/Iconify";
import PageHeader from "../components/PageHeader";
import BasicTable from "../components/BasicTable";
import InputBasic from "../components/input/inputBasic";
import SelectBasic from "../components/input/selectBasic";

import { queryKey } from "../constants/queryKey";
import { modalStyle } from "../constants/modalStyle";
import AutoCompleteBasic from "../components/input/autoCompleteBasic";

// ----------------------------------------------------------------------
export default function User() {
  //
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [stateModal, setStateModal] = useState("create");
  const [openTeacher, setOpenTeacher] = useState(false);

  const [stateForm, dispatchStateForm] = useReducer(userFormReducer, initialUserFormState);

  //
  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);

  const roleOptions = [
    { value: "Admin", label: "Admin" },
    { value: "Guru", label: "Guru" },
    { value: "Reguler", label: "Reguler" },
  ];

  // query
  const {
    data: users,
    refetch: usersRefetch,
    isLoading: isLoadingUsers,
  } = useQuery(
    [queryKey.users],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/user`).then((res) => res.data),
    {
      select: (userList) =>
        userList.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        })),
    }
  );

  const { data: teachers = [], isLoading: isLoadingTeachers } = useQuery(
    [queryKey.teachers],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/teacher?perPage=9999`).then((res) => res.data),
    {
      select: (teachers) => teachers.data.map((teacher) => ({ value: teacher.id, label: teacher.nama_pengajar })),
    }
  );

  const { refetch: userRefetch } = useQuery(
    [queryKey.users, "DETAIL"],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/${userId}`).then((res) => res.data),
    {
      enabled: Boolean(userId),
      onSuccess: (res) => {
        if (res) {
          const entries = Object.entries(res);
          entries.forEach((user) => {
            dispatchStateForm({
              type: "change-field",
              name: user[0],
              value: user[0] === "teacherId" ? teachers.find((teacher) => teacher.value === user[1]) : user[1],
              isEnableValidate: true,
            });
          });
        }
      },
    }
  );

  useEffect(() => {
    if (userId) {
      userRefetch();
    }
  }, [userId, userRefetch]);

  const submitDeleteUser = useMutation(() => {
    if (!userId) {
      return false;
    }
    return axios.delete(`${process.env.REACT_APP_BASE_URL}/api/user/${userId}`);
  });

  const submitAddUser = useMutation((data) => axios.post(`${process.env.REACT_APP_BASE_URL}/api/user`, data));
  const submitUpdateUser = useMutation((data) =>
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/user/${userId}`, data)
  );

  // Create
  const handleOpenModalCreate = () => setOpen(true);
  const handleCloseModalCreate = () => setOpen(false);
  const handleSubmitCreate = (e) => {
    e.preventDefault();
    const errors = validateUserForm(stateForm.values);
    const hasError = Object.values(errors).some((value) => Boolean(value));
    if (!hasError) {
      const remapData = { ...stateForm.values, teacherId: stateForm.values.teacherId?.value };
      if (stateModal === "update") {
        delete remapData.password;
        delete remapData.token;
        submitUpdateUser.mutate(remapData, {
          onSuccess: (response) => {
            onSuccessMutateUser(response);
          },
          onError: (error) => {
            onErrorMutateUser(error);
          },
        });
      } else {
        submitAddUser.mutate(remapData, {
          onSuccess: (response) => {
            onSuccessMutateUser(response);
          },
          onError: (error) => {
            onErrorMutateUser(error);
          },
        });
      }
    } else {
      dispatchStateForm({
        type: "change-error",
        value: errors,
      });
    }
  };

  // Delete
  const handleOpenModalDelete = (e) => {
    setUserId(e.target.getAttribute("data-id"));
    setName(e.target.getAttribute("data-name"));
    setOpenDel(true);
  };

  const handleCloseModalDelete = () => setOpenDel(false);

  const handleSubmitDelete = (e) => {
    e.preventDefault();
    submitDeleteUser.mutate(
      {},
      {
        onSuccess: (res) => {
          onSuccessMutateUser(res);
        },
        onError: (error) => {
          onErrorMutateUser(error);
        },
      }
    );
  };

  function onSuccessMutateUser(response) {
    usersRefetch();
    setOpen(false);
    setOpenDel(false);
    toast.success(response.data.message, {
      position: "top-center",
      autoClose: 1000,
      theme: "colored",
    });
    dispatchStateForm({
      type: "reset-field",
    });
  }

  function onErrorMutateUser(error) {
    if (error.response) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan pada sistem.", {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    }
  }

  function onChangeInput(e) {
    dispatchStateForm({
      type: "change-field",
      name: e.target.name,
      value: e.target.value,
      isEnableValidate: true,
    });
  }

  const handleOpenModalUpdate = async (e) => {
    await setUserId(e.target.getAttribute("data-id"));
    setStateModal("update");
    setOpen(true);
  };

  return (
    <Page title="Users">
      <PageHeader
        title="Users"
        rightContent={
          <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModalCreate}>
            Add New User
          </Button>
        }
      />
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        {!isLoadingUsers ? (
          <Scrollbar>
            <BasicTable
              header={["NAMA USER", "ROLE", "EMAIL", " "]}
              body={users.map((user, index) => [
                user.name,
                <Label key={index} variant="ghost" color={(user.role === "Admin" && "success") || "warning"}>
                  {sentenceCase(user.role)}
                </Label>,
                user.email,
                <Stack key={user.id} direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    data-id={user.id}
                    onClick={handleOpenModalUpdate}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    margin={2}
                    data-name={user.name}
                    data-id={user.id}
                    onClick={handleOpenModalDelete}
                  >
                    Delete
                  </Button>
                </Stack>,
              ])}
            />
          </Scrollbar>
        ) : null}

        <Modal
          open={open}
          onClose={handleCloseModalCreate}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...modalStyle, maxWidth: 900 }}>
            <Box width={"100%"} marginBottom={2}>
              <Typography id="modal-modal-title" variant="h4" component="h2" fontWeight={700} color={"#172560"}>
                {stateModal === "update" ? `Update user #${userId}` : "Invite new user"}
              </Typography>
              <Typography color={"#737DAA"} fontSize={18}>
                Enter details below
              </Typography>
            </Box>
            <Stack direction={"row"} flexWrap="wrap">
              <Box width={"50%"} paddingBottom={2} paddingRight={2}>
                <InputBasic
                  required
                  id="name"
                  label="Name"
                  name="name"
                  placeholder="Enter Name"
                  value={stateForm.values.name}
                  error={Boolean(stateForm.errors.name)}
                  errorMessage={stateForm.errors.name}
                  onChange={(e) => {
                    onChangeInput(e);
                  }}
                />
              </Box>
              <Box width={"50%"} paddingBottom={2} paddingRight={2}>
                <InputBasic
                  required
                  id="email"
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  value={stateForm.values.email}
                  error={Boolean(stateForm.errors.email)}
                  errorMessage={stateForm.errors.email}
                  onChange={(e) => {
                    onChangeInput(e);
                  }}
                />
              </Box>
              {stateModal !== "update" ? (
                <Box width={"50%"} paddingBottom={2} paddingRight={2}>
                  <InputBasic
                    required
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter Password"
                    value={stateForm.values.password}
                    error={Boolean(stateForm.errors.password)}
                    errorMessage={stateForm.errors.password}
                    onChange={(e) => {
                      onChangeInput(e);
                    }}
                  />
                </Box>
              ) : null}
              <Box width={"50%"} paddingBottom={2} paddingRight={2}>
                <SelectBasic
                  fullWidth
                  id="role"
                  name="role"
                  defaultValue="Reguler"
                  value={stateForm.values.role}
                  error={Boolean(stateForm.errors.role)}
                  errorMessage={stateForm.errors.role}
                  onChange={(e) => {
                    onChangeInput(e);
                  }}
                  select
                  label="Role"
                  options={roleOptions}
                />
              </Box>
              {stateForm.values.role === "Guru" ? (
                <Box width={"50%"} paddingBottom={2} paddingRight={2}>
                  <AutoCompleteBasic
                    label="Teacher Name"
                    name="teacherId"
                    value={stateForm.values.teacherId}
                    error={Boolean(stateForm.errors.teacherId)}
                    errorMessage={stateForm.errors.teacherId}
                    options={teachers}
                    loading={isLoadingTeachers}
                    open={teachers.length && openTeacher}
                    onOpen={() => {
                      setOpenTeacher(true);
                    }}
                    onClose={() => {
                      setOpenTeacher(false);
                    }}
                    onChange={(_, newValue) => {
                      onChangeInput({ target: { name: "teacherId", value: newValue } });
                    }}
                  />
                </Box>
              ) : null}
            </Stack>
            <LoadingButton
              variant="contained"
              color="warning"
              size="large"
              fullWidth
              type="submit"
              onClick={handleSubmitCreate}
              loading={submitAddUser.isLoading}
            >
              Save
            </LoadingButton>
          </Box>
        </Modal>

        <Modal
          open={openDel}
          onClose={handleCloseModalDelete}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...modalStyle, maxWidth: 400 }}>
            <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={5}>
              Delete {name} ?
            </Typography>
            <FormControl fullWidth>
              <Button variant="contained" type="submit" onClick={handleSubmitDelete}>
                Delete
              </Button>
            </FormControl>
          </Box>
        </Modal>
      </Container>
    </Page>
  );
}
