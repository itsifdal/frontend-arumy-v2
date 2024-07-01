import React from "react";
// material
import { Container, Typography, Stack } from "@mui/material";
import Page from "../../../components/Page";
import PageHeader from "../../../components/PageHeader";
import DashboardNav from "../dashboardNav";
import DashboardStudentsFilter from "./filterBar";
import DashboardStudentsData from "./dataList";
import ExportButton from "./exportButton";

export default function DashboardStudents() {
  return (
    <Page title="Dashboard">
      <PageHeader title="Dashboard" rightContent={<DashboardNav active={"students"} />} />
      <DashboardStudentsFilter />
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <Stack justifyContent={"space-between"} direction={"row"} marginBottom={"20px"}>
          <Typography as="h1" fontWeight={"bold"} fontSize={"20px"}>
            Quota Summary
          </Typography>
          <ExportButton />
        </Stack>
        <DashboardStudentsData />
      </Container>
    </Page>
  );
}
