import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "@mui/material";

import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import PaymentList from "./dataList";
import PaymentCreateButton from "./createButton";

// ----------------------------------------------------------------------
export default function Payments() {
  return (
    <Page title="Paket">
      <PageHeader title="Paket" rightContent={<PaymentCreateButton />} />
      <Container maxWidth="xl" sx={{ paddingY: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        <PaymentList />
      </Container>
    </Page>
  );
}
