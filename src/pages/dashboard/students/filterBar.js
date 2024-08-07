import React from "react";
import { Container, Box, Typography, Grid } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { format, parse, isValid, sub } from "date-fns";
import setDefaultOptions from "date-fns/setDefaultOptions";
import id from "date-fns/locale/id";

import DateInputBasic from "../../../components/input/dateInputBasic";
import InputBasic from "../../../components/input/inputBasic";
import { useGetQuotaStudents } from "../../students/query";
import { fNumber } from "../../../utils/formatNumber";
import { urlSearchParamsToQuery } from "../../../utils/urlSearchParamsToQuery";
import { initQuery } from "./constant";
import SelectBasic from "../../../components/input/selectBasic";
import { termDate } from "../../../constants/termDate";
import { cleanQuery } from "../../../utils/cleanQuery";

export default function DashboardStudentsFilter() {
  setDefaultOptions({ locale: id });
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  delete queryParam.studentId;

  const defaultFilter = cleanQuery({ ...initQuery, ...queryParam });

  const { data: students = [] } = useGetQuotaStudents({
    queryParam: defaultFilter,
  });

  const pageInfo = students?.pagination
    ? `Halaman ${fNumber(students.pagination.current_page)} dari ${fNumber(
        students.pagination.total_pages
      )}; Ditemukan ${fNumber(students.pagination.total_records)} data`
    : "";

  const SubmitFilter = (filter) => {
    if (filter.term) {
      delete defaultFilter.dateFrom;
      delete defaultFilter.dateTo;
    }
    setSearchParams({ ...defaultFilter, ...filter });
  };

  function updateSearchQuery(e) {
    if (e.key === "Enter") {
      setSearchParams({ ...defaultFilter, [e.target.name]: e.target.value });
    }
  }

  return (
    <Box
      sx={{
        background: "#FFF",
        boxShadow: "0px 4px 20px 0px rgba(0, 0, 0, 0.05)",
        paddingY: "20px",
        zIndex: 2,
        position: "relative",
        borderTop: "1px solid #c3c3e1",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={1} flexGrow={1} alignItems={"center"}>
          <Grid item xs={4}>
            <Typography fontSize={"14px"}>{pageInfo}</Typography>
          </Grid>
          <Grid item xs={2}>
            <InputBasic
              label="Nama Murid"
              name="q"
              onKeyDown={(e) => updateSearchQuery(e)}
              defaultValue={queryParam.q || ""}
            />
          </Grid>
          <Grid item xs={2}>
            <DateInputBasic
              disableValidation
              id="dateFrom"
              name="dateFrom"
              label="Tanggal Awal"
              value={parse(defaultFilter.dateFrom, "yyyy-MM-dd", new Date())}
              onChange={(e) => {
                if (!isValid(e.target.value)) return false;
                return SubmitFilter({ dateFrom: format(e.target.value, "yyyy-MM-dd") });
              }}
              maxDate={parse(defaultFilter.dateTo, "yyyy-MM-dd", new Date())}
              disabled={!!defaultFilter.term}
            />
          </Grid>
          <Grid item xs={2}>
            <DateInputBasic
              disableValidation
              id="dateTo"
              name="dateTo"
              label="Tanggal Akhir"
              value={parse(defaultFilter.dateTo, "yyyy-MM-dd", new Date())}
              onChange={(e) => {
                if (!isValid(e.target.value)) return false;
                return SubmitFilter({ dateTo: format(e.target.value, "yyyy-MM-dd") });
              }}
              minDate={parse(defaultFilter.tglAwal, "yyyy-MM-dd", new Date())}
              disabled={!!defaultFilter.term}
            />
          </Grid>
          <Grid item xs={2}>
            <SelectBasic
              fullWidth
              id="termPlaceHolder"
              name="termPlaceHolder"
              defaultValue=""
              value={
                defaultFilter.term && defaultFilter.termYear ? `${defaultFilter.term}-${defaultFilter.termYear}` : ""
              }
              onChange={(e) => {
                if (e.target.value) {
                  const arrVal = e.target.value.split("-");
                  SubmitFilter({ term: arrVal[0], termYear: arrVal[1], dateFrom: "", dateTo: "" });
                } else {
                  SubmitFilter({
                    term: "",
                    termYear: "",
                    dateFrom: format(sub(new Date(), { months: 1 }), "yyyy-MM-dd"),
                    dateTo: format(new Date(), "yyyy-MM-dd"),
                  });
                }
              }}
              select
              label="term"
              options={[{ value: "", label: "Pilih Term" }, ...termDate]}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
