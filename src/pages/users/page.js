import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "@mui/material";

import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import UserList from "./dataList";
import UserCreateButton from "./createButton";

// ----------------------------------------------------------------------
export default function User() {
  return (
    <Page title="Users">
      <PageHeader title="Users" rightContent={<UserCreateButton />} />
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        <UserList />
      </Container>
    </Page>
  );
}
