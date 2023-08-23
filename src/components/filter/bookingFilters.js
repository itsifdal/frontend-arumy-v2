import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import { format, parse } from "date-fns";
import { Button, Stack, Grid } from "@mui/material";
import AutoCompleteBasic from "../input/autoCompleteBasic";
import DateInputBasic from "../input/dateInputBasic";
import NativeSelectBasic from "../input/nativeSelectBasic";
import { queryKey } from "../../constants/queryKey";
import { bookingStatus } from "../../constants/bookingStatus";
import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";

const initFilter = {
  status: "",
  roomId: "",
  roomLabel: "",
  tgl_kelas: "",
  studentId: "",
  teacherId: "",
};

export default function BookingFilters() {
  const [openRoom, setOpenRoom] = useState(false);
  const [filters, setFilters] = useState(initFilter);

  const [searchParams, setSearchParams] = useSearchParams();

  const { data: rooms = [], isLoading: isLoadingRooms } = useQuery(
    [queryKey.rooms],
    () => axios.get(`${process.env.REACT_APP_BASE_URL}/api/room`).then((res) => res.data),
    {
      select: (roomList) => roomList.map((room) => ({ value: room.id, label: room.nama_ruang })),
      enabled: openRoom,
    }
  );

  useEffect(() => {
    // use this for escape infinite loop
    setFilters(urlSearchParamsToQuery(searchParams));
  }, [searchParams]);

  const SubmitFilter = () => {
    setSearchParams(filters);
  };

  const ResetFilter = () => {
    setSearchParams(initFilter);
  };

  return (
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
              setFilters((prevState) => ({
                ...prevState,
                roomId: newValue?.value || "",
                roomLabel: newValue?.label || "",
              }));
            }}
            options={rooms}
            loading={isLoadingRooms}
            value={{ value: filters.roomId || "", label: filters.roomLabel || "" }}
          />
        </Grid>
        <Grid item xs={4}>
          <DateInputBasic
            disableValidation
            id="tgl_kelas"
            name="tgl_kelas"
            label="Date"
            value={parse(filters.tgl_kelas, "yyyy-MM-dd", new Date())}
            onChange={(e) => {
              setFilters((prevState) => ({ ...prevState, tgl_kelas: format(e.target.value, "yyyy-MM-dd") }));
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <NativeSelectBasic
            id="status"
            name="status"
            label="Class Status"
            value={filters.status}
            onChange={(e) => {
              setFilters((prevState) => ({ ...prevState, status: e }));
            }}
            options={bookingStatus}
          />
        </Grid>
      </Grid>
      <Stack spacing={1} direction={"row"} flexShrink={0} alignItems="flex-end">
        <Button variant="outlined" onClick={SubmitFilter} sx={{ height: "50px" }}>
          Filter
        </Button>
        <Button variant="outlined" onClick={ResetFilter} sx={{ height: "50px" }}>
          Reset
        </Button>
      </Stack>
    </Stack>
  );
}
