import { Container, Typography, Box, Grid } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import useResponsive from "../../hooks/useResponsive";
import { fNumber } from "../../utils/formatNumber";
import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";
import { usePaymentsQuery } from "./query";

const defaultQuery = { sort: "DESC", sort_by: "tgl_tagihan" };

export default function PaymentFilterBar() {
  const isDesktop = useResponsive("up", "lg");
  const [searchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  const { data: payments } = usePaymentsQuery({
    queryParam: { ...defaultQuery, ...queryParam },
  });

  const pageInfo = payments?.pagination
    ? `Halaman ${fNumber(payments.pagination.currentPage)} dari ${fNumber(
        payments.pagination.totalPages
      )}; Ditemukan ${fNumber(payments.pagination.totalRecord)} data`
    : "";

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
        </Grid>
      </Container>
    </Box>
  );
}