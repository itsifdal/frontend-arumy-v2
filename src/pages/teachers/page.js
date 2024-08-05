import React from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// material
import { Container } from "@mui/material";

// components
import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import { TeacherCreateButton } from "./createButton";
import { TeacherFilterBar } from "./filterBar";
import { TeacherList } from "./dataList";

// ----------------------------------------------------------------------
export default function Teachers() {
  return (
    <Page title="Teachers">
      <PageHeader title="Teachers" rightContent={<TeacherCreateButton />} />
      <TeacherFilterBar />
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        <TeacherList />
      </Container>
    </Page>
  );
}
