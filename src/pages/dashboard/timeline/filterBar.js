import { useSearchParams } from "react-router-dom";
import React, { useState } from "react";
import { Stack, Container, Box, Grid } from "@mui/material";
import { format, parse, isValid } from "date-fns";
import setDefaultOptions from "date-fns/setDefaultOptions";
import id from "date-fns/locale/id";
import { useQueryClient } from "react-query";

import DateInputBasic from "../../../components/input/dateInputBasic";
import AutoCompleteBasic from "../../../components/input/autoCompleteBasic";
import { useGetRooms, invalidateRooms } from "../../rooms/query";
import { urlSearchParamsToQuery } from "../../../utils/urlSearchParamsToQuery";
import { cleanQuery } from "../../../utils/cleanQuery";

const initFilter = {
  tgl_kelas: format(new Date(), "yyyy-MM-dd"),
  roomId: 21,
  roomLabel: "Online",
};

export default function DashboardTimelineFilter() {
  const [openRoom, setOpenRoom] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const queryParam = urlSearchParamsToQuery(searchParams);
  setDefaultOptions({ locale: id });

  const defaultQueryBooking = cleanQuery({
    ...initFilter,
    ...queryParam,
  });

  const { data: rooms = [], isLoading: isLoadingRooms } = useGetRooms({
    options: {
      select: (roomList) => roomList.map((room) => ({ value: room.id, label: room.nama_ruang })),
      enabled: openRoom,
    },
  });

  const SubmitFilter = (filter) => {
    setSearchParams({ ...defaultQueryBooking, ...filter });
    invalidateRooms(queryClient);
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
            <Grid item xs={4}>
              <AutoCompleteBasic
                label="Ruang Kelas"
                name="roomId"
                open={openRoom}
                onOpen={() => {
                  setOpenRoom(true);
                }}
                onClose={() => {
                  setOpenRoom(false);
                }}
                onChange={(_, newValue) => {
                  if (!newValue?.value) return;
                  SubmitFilter({
                    roomId: newValue?.value || "",
                    roomLabel: newValue?.label || "",
                  });
                }}
                options={rooms}
                loading={isLoadingRooms}
                value={{
                  value: defaultQueryBooking.roomId || "",
                  label: defaultQueryBooking.roomLabel || "",
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <DateInputBasic
                disableValidation
                id="tgl_kelas"
                name="tgl_kelas"
                label="Date"
                value={parse(defaultQueryBooking.tgl_kelas, "yyyy-MM-dd", new Date())}
                onChange={(e) => {
                  if (!isValid(e.target.value)) return false;
                  return SubmitFilter({ tgl_kelas: format(e.target.value, "yyyy-MM-dd") });
                }}
              />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
