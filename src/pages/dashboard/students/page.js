import React from "react";
// material
import { Container, Typography } from "@mui/material";
import Page from "../../../components/Page";
import PageHeader from "../../../components/PageHeader";
import DashboardNav from "../dashboardNav";
import DashboardStudentsFilter from "./filterBar";
import DashboardStudentsData from "./dataList";

export default function DashboardStudents() {
  return (
    <Page title="Dashboard">
      <PageHeader title="Dashboard" rightContent={<DashboardNav active={"students"} />} />
      <DashboardStudentsFilter />
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <Typography as="h1" fontWeight={"bold"} fontSize={"20px"} marginBottom={"20px"}>
          Quota Summary
        </Typography>
        <DashboardStudentsData />
      </Container>
    </Page>
  );
}
