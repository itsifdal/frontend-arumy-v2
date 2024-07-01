import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "@mui/material";

import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import BranchList from "./dataList";
import BranchCreateButton from "./createButton";

// ----------------------------------------------------------------------
export default function Branches() {
  return (
    <Page title="Branch">
      <PageHeader title="Branches" rightContent={<BranchCreateButton />} />
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        <BranchList />
      </Container>
    </Page>
  );
}
