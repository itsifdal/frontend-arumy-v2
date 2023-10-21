/* eslint-disable camelcase */
// import { Link as RouterLink } from 'react-router-dom';
import React, { useState, useReducer, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import { format, parse } from "date-fns";

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

import useResponsive from "../hooks/useResponsive";
// components
import { studentFormReducer, initialStudentFormState, validateStudentForm } from "../utils/reducer/studentReducer";
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
import DateInputBasic from "../components/input/dateInputBasic";

// ----------------------------------------------------------------------
export default function Students() {
  const [id, setId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [stateModal, setStateModal] = useState("create");

  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);

  const [stateForm, dispatchStateForm] = useReducer(studentFormReducer, initialStudentFormState);

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  const isDesktop = useResponsive("up", "lg");

  // query
  const {
    data: students,
    refetch: studentsRefetch,
    isLoading: isLoadingStudents,
  } = useQuery([queryKey.students, cleanQuery(queryParam)], () =>
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/student${queryToString(queryParam)}`).then((res) => res.data)
  );

  const { refetch: studentRefetch, isLoading: isLoadingStudentDetail } = useQuery(
    [queryKey.students, "DETAIL"],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/student/${id}`).then((res) => res.data),
    {
      enabled: Boolean(id),
      onSuccess: (res) => {
        const entries = Object.entries(res);
        entries.forEach((student) => {
          dispatchStateForm({
            type: "change-field",
            name: student[0],
            value: student[1],
            isEnableValidate: true,
          });
        });
      },
    }
  );

  useEffect(() => {
    if (id) {
      studentRefetch();
    }
  }, [id, studentRefetch]);

  const submitAddStudent = useMutation((data) => axios.post(`${process.env.REACT_APP_BASE_URL}/api/student`, data));
  const submitUpdateStudent = useMutation((data) =>
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/student/${id}`, data)
  );
  const submitDeleteStudent = useMutation(() => axios.delete(`${process.env.REACT_APP_BASE_URL}/api/student/${id}`));

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
    const errors = validateStudentForm(stateForm.values);
    const hasError = Object.values(errors).some((value) => Boolean(value));
    if (!hasError) {
      if (stateModal === "update") {
        submitUpdateStudent.mutate(stateForm.values, {
          onSuccess: (response) => {
            onSuccessMutateStudent(response);
          },
          onError: (error) => {
            onErrorMutateStudent(error);
          },
        });
      } else {
        submitAddStudent.mutate(stateForm.values, {
          onSuccess: (response) => {
            onSuccessMutateStudent(response);
          },
          onError: (error) => {
            onErrorMutateStudent(error);
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
    setStudentName(e.target.getAttribute("data-label"));
    setOpenDel(true);
  };
  const handleCloseModalDelete = () => setOpenDel(false);
  const handleSubmitDelete = (e) => {
    e.preventDefault();
    submitDeleteStudent.mutate(
      {},
      {
        onSuccess: (response) => {
          onSuccessMutateStudent(response);
        },
        onError: (error) => {
          onErrorMutateStudent(error);
        },
      }
    );
  };

  function onSuccessMutateStudent(response) {
    studentsRefetch();
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

  function onErrorMutateStudent(error) {
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

  function updateSearchQuery(e) {
    if (e.key === "Enter") {
      setSearchParams({ [e.target.name]: e.target.value });
    }
  }

  return (
    <Page title="Student">
      <PageHeader
        title="Student"
        rightContent={
          <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModalCreate}>
            Add new Student
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
          <Grid container>
            <Grid item xs={6} sm={3} paddingBottom={2}>
              <InputBasic
                label="Nama Murid"
                name="q"
                onKeyDown={(e) => updateSearchQuery(e)}
                defaultValue={queryParam.q || ""}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        {!isLoadingStudents ? (
          <Box marginBottom={3}>
            <Scrollbar>
              <BasicTable
                header={["STUDENT NAME", "NOMOR VA", "TELEPON", "TANGGAL LAHIR", " "]}
                body={students.data.map((student) => [
                  student.nama_murid,
                  student.nomor_va,
                  student.telepon,
                  student.tgl_lahir && student.tgl_lahir !== "0000-00-00"
                    ? format(parse(student.tgl_lahir, "yyyy-MM-dd", new Date()), "dd-MM-yyyy")
                    : "-",
                  <Stack key={student.id} direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      data-id={student.id}
                      onClick={handleOpenModalUpdate}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      data-label={student.nama_murid}
                      data-id={student.id}
                      onClick={handleOpenModalDelete}
                    >
                      Delete
                    </Button>
                  </Stack>,
                ])}
              />
            </Scrollbar>
            <Pagination
              page={students.pagination.current_page}
              count={students.pagination.total_pages}
              shape="rounded"
              sx={[{ ul: { justifyContent: "center" } }]}
              renderItem={(item) => (
                <PaginationItem
                  component={RouterLink}
                  to={`/app/students${queryToString({
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
          open={open && !isLoadingStudentDetail}
          onClose={handleCloseModalCreate}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...modalStyle, maxWidth: 800 }}>
            <Box marginBottom={2}>
              <Typography id="modal-modal-title" variant="h4" component="h2" fontWeight={700} color={"#172560"}>
                {stateModal === "update" ? `Update Student #${id}` : "Create Student"}
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} paddingBottom={2}>
                <InputBasic
                  required
                  label="Nama Murid"
                  name="nama_murid"
                  value={stateForm.values.nama_murid}
                  error={Boolean(stateForm.errors.nama_murid)}
                  errorMessage={stateForm.errors.nama_murid}
                  onChange={(e) => {
                    onChangeInput(e);
                  }}
                />
              </Grid>
              <Grid item xs={6} paddingBottom={2}>
                <InputBasic
                  required
                  label="Nama Wali"
                  name="nama_wali"
                  value={stateForm.values.nama_wali}
                  error={Boolean(stateForm.errors.nama_wali)}
                  errorMessage={stateForm.errors.nama_wali}
                  onChange={(e) => {
                    onChangeInput(e);
                  }}
                />
              </Grid>
              <Grid item xs={6} paddingBottom={2}>
                <InputBasic
                  required
                  label="Nomor VA"
                  name="nomor_va"
                  value={stateForm.values.nomor_va}
                  error={Boolean(stateForm.errors.nomor_va)}
                  errorMessage={stateForm.errors.nomor_va}
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
              <Grid item xs={6} paddingBottom={2}>
                <DateInputBasic
                  label="Tanggal Lahir"
                  name="tgl_lahir"
                  value={stateForm.values.tgl_lahir}
                  error={Boolean(stateForm.errors.tgl_lahir)}
                  errorMessage={stateForm.errors.tgl_lahir}
                  onChange={(e) => {
                    onChangeInput(e);
                  }}
                />
              </Grid>
            </Grid>
            <LoadingButton
              loading={submitAddStudent.isLoading || submitUpdateStudent.isLoading}
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
              Delete {studentName} ?
            </Typography>
            <FormControl fullWidth>
              <LoadingButton
                loading={submitDeleteStudent.isLoading}
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
