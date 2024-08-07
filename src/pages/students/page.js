import React from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { Container } from "@mui/material";

import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import { StudentsFilterBar } from "./filterBar";
import { StudentCreateButton } from "./createButton";
import { StudentsList } from "./dataList";

// ----------------------------------------------------------------------
export default function Students() {
  return (
    <Page title="Student">
      <PageHeader title="Student" rightContent={<StudentCreateButton />} />
      <StudentsFilterBar />
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        <StudentsList />
      </Container>
    </Page>
  );
}
