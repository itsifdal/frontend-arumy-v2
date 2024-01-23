import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "@mui/material";

import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import RefundList from "./dataList";
import RefundCreateButton from "./createButton";
/* import RefundFilterBar from "./filterBar"; */

// ----------------------------------------------------------------------
export default function Refunds() {
  return (
    <Page title="Refunds">
      <PageHeader title="Refunds" rightContent={<RefundCreateButton />} />
      {/* <RefundFilterBar /> */}
      <Container maxWidth="xl" sx={{ paddingY: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        <RefundList />
      </Container>
    </Page>
  );
}
