/* eslint-disable camelcase */
// import { Link as RouterLink } from 'react-router-dom';
import { sentenceCase } from "change-case";
import React, { useState, useReducer } from "react";
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

import { modalStyle } from "../constant/modalStyle";

// ----------------------------------------------------------------------
export default function User() {
  //
  const [id, setUserId] = useState("");
  const [name, setName] = useState("");

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
  } = useQuery(["USERS"], () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/user`).then((res) => res.data), {
    select: (userList) =>
      userList.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })),
  });

  const submitDeleteUser = useMutation(() => {
    if (!id) {
      return false;
    }
    return axios.delete(`${process.env.REACT_APP_BASE_URL}/api/user/${id}`);
  });

  const submitAddUser = useMutation((data) => axios.post(`${process.env.REACT_APP_BASE_URL}/api/user`, data));

  // Create
  const handleOpenModalCreate = () => setOpen(true);
  const handleCloseModalCreate = () => setOpen(false);
  const handleSubmitCreate = (e) => {
    e.preventDefault();
    const errors = validateUserForm(stateForm.values);
    const hasError = Object.values(errors).some((value) => Boolean(value));
    if (!hasError) {
      submitAddUser.mutate(stateForm.values, {
        onSuccess: (response) => {
          usersRefetch();
          setOpen(false);
          toast.success(response.data.message, {
            position: "top-center",
            autoClose: 1000,
            theme: "colored",
          });
          dispatchStateForm({
            type: "reset-field",
          });
        },
        onError: (error) => {
          if (error.response) {
            toast.error(error.response, {
              position: "top-center",
              autoClose: 1000,
              theme: "colored",
            });
          }
        },
      });
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
          usersRefetch();
          setOpenDel(false);
          toast.warning(res.data.message, {
            position: "top-center",
            autoClose: 1000,
            theme: "colored",
          });
        },
        onError: (error) => {
          if (error.response) {
            toast.error(error.response, {
              position: "top-center",
              autoClose: 1000,
              theme: "colored",
            });
          }
        },
      }
    );
  };

  function onChangeInput(e) {
    dispatchStateForm({
      type: "change-field",
      name: e.target.name,
      value: e.target.value,
      isEnableValidate: true,
    });
  }

  return (
    <Page title="Users">
      <PageHeader
        title="Users"
        rightContent={
          <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModalCreate}>
            Add new User
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
                <Button
                  key={index}
                  variant="contained"
                  color="error"
                  size="small"
                  margin={2}
                  data-name={user.name}
                  data-id={user.id}
                  onClick={handleOpenModalDelete}
                >
                  Delete
                </Button>,
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
              <Typography id="modal-modal-title" variant="h3" component="h2" fontWeight={700} color={"#172560"}>
                Invite new user
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
