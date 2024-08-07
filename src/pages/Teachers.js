/* eslint-disable camelcase */
// import { Link as RouterLink } from 'react-router-dom';
import React, { useState, useReducer, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import { useSearchParams, Link as RouterLink } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

// material
import {
  Stack,
  Button,
  Container,
  Typography,
  Modal,
  FormControl,
  Box,
  Grid,
  Pagination,
  PaginationItem,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

// components
import { teacherFormReducer, initialTeacherFormState, validateTeacherForm } from "../utils/reducer/teacherReducer";
import Page from "../components/Page";
import Scrollbar from "../components/Scrollbar";
import Iconify from "../components/Iconify";
import PageHeader from "../components/PageHeader";
import BasicTable from "../components/BasicTable";
import InputBasic from "../components/input/inputBasic";
import { modalStyle } from "../constants/modalStyle";
import { queryKey } from "../constants/queryKey";
import { urlSearchParamsToQuery } from "../utils/urlSearchParamsToQuery";
import { cleanQuery } from "../utils/cleanQuery";
import { queryToString } from "../utils/queryToString";
import { fetchHeader } from "../constants/fetchHeader";
import useResponsive from "../hooks/useResponsive";
import { fNumber } from "../utils/formatNumber";

// ----------------------------------------------------------------------
export default function Teachers() {
  const [id, setId] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [stateModal, setStateModal] = useState("create");

  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);

  const [stateForm, dispatchStateForm] = useReducer(teacherFormReducer, initialTeacherFormState);

  const [searchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  const isDesktop = useResponsive("up", "lg");

  // query
  const {
    data: teachers,
    refetch: teachersRefetch,
    isLoading: isLoadingTeachers,
  } = useQuery([queryKey.teachers, cleanQuery(queryParam)], () =>
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/teacher${queryToString(queryParam)}`, {
        headers: fetchHeader,
      })
      .then((res) => res.data)
  );

  const pageInfo = teachers?.pagination
    ? `Halaman ${fNumber(teachers.pagination.current_page)} dari ${fNumber(
        teachers.pagination.total_pages
      )}; Ditemukan ${fNumber(teachers.pagination.total_records)} data`
    : "";

  const { refetch: teacherRefetch } = useQuery(
    [queryKey.teachers, "DETAIL"],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/teacher/${id}`, {
          headers: fetchHeader,
        })
        .then((res) => res.data),
    {
      enabled: Boolean(id),
      onSuccess: (res) => {
        if (res.data) {
          const entries = Object.entries(res.data);
          entries.forEach((student) => {
            dispatchStateForm({
              type: "change-field",
              name: student[0],
              value: student[1],
              isEnableValidate: true,
            });
          });
        }
      },
    }
  );

  useEffect(() => {
    if (id) {
      teacherRefetch();
    }
  }, [id, teacherRefetch]);

  const submitAddTeacher = useMutation((data) =>
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/teacher`, data, {
      headers: fetchHeader,
    })
  );
  const submitUpdateTeacher = useMutation((data) =>
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/teacher/${id}`, data, {
      headers: fetchHeader,
    })
  );
  const submitDeleteTeacher = useMutation(() =>
    axios.delete(`${process.env.REACT_APP_BASE_URL}/api/teacher/${id}`, {
      headers: fetchHeader,
    })
  );

  //----
  const handleOpenModalCreate = () => setOpen(true);
  const handleCloseModalCreate = () => {
    dispatchStateForm({
      type: "reset-field",
    });
    setStateModal("create");
    setOpen(false);
  };

  const handleSubmitCreate = (e) => {
    e.preventDefault();
    const errors = validateTeacherForm(stateForm.values);
    const hasError = Object.values(errors).some((value) => Boolean(value));
    if (!hasError) {
      if (stateModal === "update") {
        submitUpdateTeacher.mutate(stateForm.values, {
          onSuccess: (response) => {
            onSuccessMutateTeacher(response);
          },
          onError: (error) => {
            onErrorMutateTeacher(error);
          },
        });
      } else {
        submitAddTeacher.mutate(stateForm.values, {
          onSuccess: (response) => {
            onSuccessMutateTeacher(response);
          },
          onError: (error) => {
            onErrorMutateTeacher(error);
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

  const handleOpenModalUpdate = (e) => {
    setId(e.target.getAttribute("data-id"));
    setStateModal("update");
    setOpen(true);
  };

  const handleOpenModalDelete = (e) => {
    setId(e.target.getAttribute("data-id"));
    setTeacherName(e.target.getAttribute("data-label"));
    setOpenDel(true);
  };
  const handleCloseModalDelete = () => setOpenDel(false);
  const handleSubmitDelete = (e) => {
    e.preventDefault();
    submitDeleteTeacher.mutate(
      {},
      {
        onSuccess: (response) => {
          onSuccessMutateTeacher(response);
        },
        onError: (error) => {
          onErrorMutateTeacher(error);
        },
      }
    );
  };

  function onSuccessMutateTeacher(response) {
    teachersRefetch();
    setOpen(false);
    setOpenDel(false);
    toast.success(response.data.message, {
      position: "top-center",
      autoClose: 5000,
      theme: "colored",
    });
    dispatchStateForm({
      type: "reset-field",
    });
  }

  function onErrorMutateTeacher(error) {
    if (error) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan pada sistem.", {
        position: "top-center",
        autoClose: 5000,
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

  return (
    <Page title="Teachers">
      <PageHeader
        title="Teachers"
        rightContent={
          <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModalCreate}>
            Add new Teacher
          </Button>
        }
      />
      <Box
        sx={{
          background: "#FFF",
          boxShadow: "0px 4px 20px 0px rgba(0, 0, 0, 0.05)",
          paddingY: isDesktop ? "20px" : "5px",
          zIndex: 2,
          position: "relative",
          borderTop: "1px solid #c3c3e1",
        }}
      >
        <Container maxWidth="xl">
          <Grid container alignItems={"center"} width={"100%"}>
            <Grid item xs={6} sm={9}>
              <Typography fontSize={"14px"}>{pageInfo}</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        {!isLoadingTeachers ? (
          <Box marginBottom={3}>
            <Scrollbar>
              <BasicTable
                header={["TEACHER NAME", "TELEPON", " "]}
                body={teachers.data.map((teacher) => [
                  teacher.nama_pengajar,
                  teacher.telepon,
                  <Stack key={teacher.id} direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      data-id={teacher.id}
                      onClick={handleOpenModalUpdate}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      data-label={teacher.nama_pengajar}
                      data-id={teacher.id}
                      onClick={handleOpenModalDelete}
                    >
                      Delete
                    </Button>
                  </Stack>,
                ])}
              />
            </Scrollbar>
            <Pagination
              page={teachers.pagination.current_page}
              count={teachers.pagination.total_pages}
              shape="rounded"
              sx={[{ ul: { justifyContent: "center" } }]}
              renderItem={(item) => (
                <PaginationItem
                  component={RouterLink}
                  to={`/app/teachers${queryToString({
                    ...queryParam,
                    page: item.page === 1 ? null : item.page,
                  })}`}
                  {...item}
                />
              )}
            />
          </Box>
        ) : null}

        <Modal
          open={open}
          onClose={handleCloseModalCreate}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...modalStyle, maxWidth: 800 }}>
            <Box marginBottom={2}>
              <Typography id="modal-modal-title" variant="h4" component="h2" fontWeight={700} color={"#172560"}>
                {stateModal === "update" ? `Update Teacher #${id}` : "Create Teacher"}
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} paddingBottom={2}>
                <InputBasic
                  required
                  label="Nama Pengajar"
                  name="nama_pengajar"
                  value={stateForm.values.nama_pengajar}
                  error={Boolean(stateForm.errors.nama_pengajar)}
                  errorMessage={stateForm.errors.nama_pengajar}
                  onChange={(e) => {
                    onChangeInput(e);
                  }}
                />
              </Grid>
              <Grid item xs={6} paddingBottom={2}>
                <InputBasic
                  required
                  label="Telepon"
                  name="telepon"
                  value={stateForm.values.telepon}
                  error={Boolean(stateForm.errors.telepon)}
                  errorMessage={stateForm.errors.telepon}
                  onChange={(e) => {
                    onChangeInput(e);
                  }}
                />
              </Grid>
            </Grid>
            <LoadingButton
              loading={submitAddTeacher.isLoading || submitUpdateTeacher.isLoading}
              variant="contained"
              type="submit"
              fullWidth
              onClick={handleSubmitCreate}
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
              Delete {teacherName} ?
            </Typography>
            <FormControl fullWidth>
              <LoadingButton
                loading={submitDeleteTeacher.isLoading}
                variant="contained"
                type="submit"
                onClick={handleSubmitDelete}
              >
                Delete
              </LoadingButton>
            </FormControl>
          </Box>
        </Modal>
      </Container>
    </Page>
  );
}
