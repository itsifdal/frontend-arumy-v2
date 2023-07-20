import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
// material
import {
  Link,
  Table,
  Stack,
  Button,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  Paper,
  tableCellClasses,
  Typography,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// components
import Page from "../components/Page";
// sections
import PageHeader from "../components/PageHeader";

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const navigate = useNavigate();
  const [foundUser, setFoundUser] = useState();
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setFoundUser(foundUser);
    }
  }, []);

  if (!foundUser || foundUser === undefined) {
    navigate("/login", { replace: true });
  }

  const StyledTableCell = styled(TableCell)({
    [`&.${tableCellClasses.head}`]: {
      borderColor: "#c7c7e4",
      color: "#737DAA",
      textAlign: "left",
      paddingTop: 10,
      paddingBottom: 10,
    },
    [`&.${tableCellClasses.body}`]: {
      border: 0,
      textAlign: "left",
      paddingTop: 8,
      paddingBottom: 8,
    },
  });

  const StyledTableRow = styled(TableRow)({
    // hide last border
    "&:last-child td": {
      paddingBottom: 20,
    },
  });

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData("10.45-11.45", "Group", "Abigail Lin", "Piano", "Julia Utomo"),
    createData("10.45-11.45", "Group", "Abigail Lin", "Piano", "Julia Utomo"),
    createData("10.45-11.45", "Group", "Abigail Lin", "Piano", "Julia Utomo"),
    createData("10.45-11.45", "Group", "Abigail Lin", "Piano", "Julia Utomo"),
    createData("10.45-11.45", "Group", "Abigail Lin", "Piano", "Julia Utomo"),
  ];

  return (
    <Page title="Dashboard">
      <PageHeader
        title="Dashboard"
        rightContent={
          <Stack direction={"row"} spacing={2}>
            <Button variant="contained">ROOM</Button>
            <Button variant="outlined">TEACHER</Button>
          </Stack>
        }
      />
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        {Array.from(Array(4).keys()).map((index) => (
          <Box key={index}>
            <Typography marginBottom={2} fontWeight={"700"}>
              Ruangan {index + 1}
            </Typography>
            <TableContainer
              component={Paper}
              sx={{ boxShadow: "3px 4px 20px 0px rgba(0, 0, 0, 0.10)", background: "white" }}
            >
              <Table size="small" aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>WAKTU</StyledTableCell>
                    <StyledTableCell>JENIS KELAS</StyledTableCell>
                    <StyledTableCell>NAMA ANAK</StyledTableCell>
                    <StyledTableCell>INSTRUMENT</StyledTableCell>
                    <StyledTableCell>PENGAJAR</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <StyledTableRow key={row.name}>
                      <StyledTableCell>{row.name}</StyledTableCell>
                      <StyledTableCell>{row.calories}</StyledTableCell>
                      <StyledTableCell>{row.fat}</StyledTableCell>
                      <StyledTableCell>{row.carbs}</StyledTableCell>
                      <StyledTableCell>{row.protein}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack direction={"row"} justifyContent={"flex-end"} paddingY={2}>
              <Link href="/" sx={{ textDecoration: "none" }} fontSize={14}>
                See More ...
              </Link>
            </Stack>
          </Box>
        ))}
      </Container>
    </Page>
  );
}
