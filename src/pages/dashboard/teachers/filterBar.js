import React, { useState } from "react";
import { Stack, Container, Box, Grid } from "@mui/material";
import { format, parse, isValid, lastDayOfMonth } from "date-fns";
import setDefaultOptions from "date-fns/setDefaultOptions";
import id from "date-fns/locale/id";
import { useSearchParams } from "react-router-dom";

import AutoCompleteBasic from "../../../components/input/autoCompleteBasic";
import DateInputBasic from "../../../components/input/dateInputBasic";
import SelectBasic from "../../../components/input/selectBasic";
import { urlSearchParamsToQuery } from "../../../utils/urlSearchParamsToQuery";
import { cleanQuery } from "../../../utils/cleanQuery";
import { useGetTeachers } from "../../teachers/query";
import { termDate } from "../../../constants/termDate";

const initFilter = {
  teacherId: 1,
  teacherLabel: "Adi Nugroho",
  dateFrom: format(new Date(), "yyyy-MM-01"),
  dateTo: format(lastDayOfMonth(new Date()), "yyyy-MM-dd"),
};

export default function DashboardTeachersFilterBar() {
  const [openTeacher, setOpenTeacher] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  setDefaultOptions({ locale: id });

  const defaultQueryBooking = cleanQuery({
    ...initFilter,
    ...queryParam,
  });

  const { data: teachers = [], isLoading: isLoadingTeachers } = useGetTeachers({
    queryParam: { perPage: 9999 },
    options: {
      select: (teachers) => teachers.data?.map((teacher) => ({ value: teacher.id, label: teacher.nama_pengajar })),
      enabled: openTeacher,
    },
  });

  const SubmitFilter = (filter) => {
    if (filter.term) {
      delete defaultQueryBooking.dateFrom;
      delete defaultQueryBooking.dateTo;
    }
    setSearchParams({ ...defaultQueryBooking, ...filter });
  };

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
        <Stack width={"100%"} direction={"row"} spacing={2}>
          <Grid container spacing={1} flexGrow={1}>
            <Grid item xs={3}>
              <AutoCompleteBasic
                label="Nama Pengajar"
                name="teacherId"
                open={openTeacher}
                onOpen={() => {
                  setOpenTeacher(true);
                }}
                onClose={() => {
                  setOpenTeacher(false);
                }}
                onChange={(_, newValue) => {
                  if (!newValue?.value) return;
                  SubmitFilter({
                    teacherId: newValue?.value || "",
                    teacherLabel: newValue?.label || "",
                  });
                }}
                options={teachers}
                loading={isLoadingTeachers}
                value={{
                  value: defaultQueryBooking.teacherId || "",
                  label: defaultQueryBooking.teacherLabel || "",
                }}
              />
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={2}>
              <DateInputBasic
                disableValidation
                id="dateFrom"
                name="dateFrom"
                label="Tanggal Awal"
                value={parse(defaultQueryBooking.dateFrom, "yyyy-MM-dd", new Date())}
                onChange={(e) => {
                  if (!isValid(e.target.value)) return;
                  SubmitFilter({ dateFrom: format(e.target.value, "yyyy-MM-dd") });
                }}
                maxDate={parse(defaultQueryBooking.dateTo, "yyyy-MM-dd", new Date())}
                disabled={!!defaultQueryBooking.term}
              />
            </Grid>
            <Grid item xs={2}>
              <DateInputBasic
                disableValidation
                id="dateTo"
                name="dateTo"
                label="Tanggal Akhir"
                value={parse(defaultQueryBooking.dateTo, "yyyy-MM-dd", new Date())}
                onChange={(e) => {
                  if (!isValid(e.target.value)) return;
                  SubmitFilter({ dateTo: format(e.target.value, "yyyy-MM-dd") });
                }}
                minDate={parse(defaultQueryBooking.dateFrom, "yyyy-MM-dd", new Date())}
                disabled={!!defaultQueryBooking.term}
              />
            </Grid>
            <Grid item xs={2}>
              <SelectBasic
                fullWidth
                id="termPlaceHolder"
                name="termPlaceHolder"
                defaultValue=""
                value={
                  defaultQueryBooking.term && defaultQueryBooking.termYear
                    ? `${defaultQueryBooking.term}-${defaultQueryBooking.termYear}`
                    : ""
                }
                onChange={(e) => {
                  if (e.target.value) {
                    const arrVal = e.target.value.split("-");
                    SubmitFilter({ term: arrVal[0], termYear: arrVal[1], dateFrom: "", dateTo: "" });
                  } else {
                    SubmitFilter({
                      term: "",
                      termYear: "",
                      dateFrom: format(new Date(), "yyyy-MM-01"),
                      dateTo: format(lastDayOfMonth(new Date()), "yyyy-MM-dd"),
                    });
                  }
                }}
                select
                label="term"
                options={[{ value: "", label: "Pilih Term" }, ...termDate]}
              />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
