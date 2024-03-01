import React from "react";
// material
import { Container, Typography } from "@mui/material";
// components
import Page from "../../../components/Page";
// sections
import PageHeader from "../../../components/PageHeader";
import DashboardNav from "../dashboardNav";

// ----------------------------------------------------------------------

export default function DashboardStudents() {
  return (
    <Page title="Dashboard">
      <PageHeader title="Dashboard" rightContent={<DashboardNav active={"students"} />} />
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <Typography as="h1" fontWeight={"bold"} fontSize={"20px"}>
          Title
        </Typography>
      </Container>
    </Page>
  );
}
