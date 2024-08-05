import React from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// material
import { Container } from "@mui/material";

// components
import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import { RoomList } from "./dataList";
import { RoomCreateButton } from "./createButton";

// ----------------------------------------------------------------------
export default function Room() {
  return (
    <Page title="Room">
      <PageHeader title="Rooms" rightContent={<RoomCreateButton />} />
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        <RoomList />
      </Container>
    </Page>
  );
}
