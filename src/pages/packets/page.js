import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "@mui/material";

import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import PacketList from "./dataList";
import PacketCreateButton from "./createButton";
import PeacketFilterBar from "./filterBar";

// ----------------------------------------------------------------------
export default function Packets() {
  return (
    <Page title="Paket">
      <PageHeader title="Paket" rightContent={<PacketCreateButton />} />
      <PeacketFilterBar />
      <Container maxWidth="xl" sx={{ paddingY: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        <PacketList />
      </Container>
    </Page>
  );
}
