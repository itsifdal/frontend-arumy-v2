import React from "react";
import { ToastContainer } from "react-toastify";
import { Container } from "@mui/material";

import "react-toastify/dist/ReactToastify.css";

import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import { BookingDataList } from "./dataList";
import { BookingFilterBar } from "./filterBar";
import { BookingCreateButton } from "./createButton";

// ----------------------------------------------------------------------
export default function Booking() {
  return (
    <Page title="Booking">
      <PageHeader title="Bookings" rightContent={<BookingCreateButton />} />
      <BookingFilterBar />
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        <BookingDataList />
      </Container>
    </Page>
  );
}
