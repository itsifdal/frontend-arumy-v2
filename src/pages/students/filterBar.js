import { Container, Typography, Box, Grid } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import useResponsive from "../../hooks/useResponsive";
import { fNumber } from "../../utils/formatNumber";
import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";
import { useGetStudents } from "./query";
import InputBasic from "../../components/input/inputBasic";

export function StudentsFilterBar() {
  const isDesktop = useResponsive("up", "lg");
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  const { data: students } = useGetStudents({
    queryParam: { ...queryParam },
  });

  const pageInfo = students?.pagination
    ? `Halaman ${fNumber(students.pagination.current_page)} dari ${fNumber(
        students.pagination.total_pages
      )}; Ditemukan ${fNumber(students.pagination.total_records)} data`
    : "";

  function updateSearchQuery(e) {
    if (e.key === "Enter") {
      setSearchParams({ [e.target.name]: e.target.value });
    }
  }

  return (
    <Box
      sx={{
        background: "#FFF",
        boxShadow: "0px 4px 20px 0px rgba(0, 0, 0, 0.05)",
        paddingY: isDesktop ? "20px" : "5px",
        zIndex: 2,
        position: "relative",
        borderTop: "1px solid #c3c3e1",
      }}
    >
      <Container maxWidth="xl">
        <Grid container alignItems={"center"} width={"100%"}>
          <Grid item xs={6} sm={9}>
            <Typography fontSize={"14px"}>{pageInfo}</Typography>
          </Grid>
          <Grid item xs={6} sm={3} paddingBottom={2}>
            <InputBasic
              label="Nama Murid"
              name="q"
              onKeyDown={(e) => updateSearchQuery(e)}
              defaultValue={queryParam.q || ""}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
