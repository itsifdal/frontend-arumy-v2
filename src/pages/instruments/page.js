// import { Link as RouterLink } from 'react-router-dom';
import React from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// material
import { Container } from "@mui/material";

import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import { InstrumentList } from "./dataList";
import { InstrumentCreateButton } from "./createButton";

// ----------------------------------------------------------------------
export default function Instruments() {
  return (
    <Page title="Instrument">
      <PageHeader title="Instruments" rightContent={<InstrumentCreateButton />} />
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        <InstrumentList />
      </Container>
    </Page>
  );
}
