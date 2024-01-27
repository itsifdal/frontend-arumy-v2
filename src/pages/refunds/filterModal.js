import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Button, Stack, Drawer, IconButton, Box } from "@mui/material";

import useResponsive from "../../hooks/useResponsive";
import AutoCompleteBasic from "../../components/input/autoCompleteBasic";
import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";
import Iconify from "../../components/Iconify";
import { useGetStudents } from "../students/query";
import { useGetPackets } from "../packets/query";

const initFilter = {
  paketId: "",
  paketLabel: "",
  studentId: "",
  studentLabel: "",
};

export default function RefundFilters() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(initFilter);
  const filterString = useMemo(() => [filters.studentLabel, filters.paketLabel], [filters]);
  const isDesktop = useResponsive("up", "lg");

  useEffect(() => {
    // use this for escape infinite loop
    setFilters(urlSearchParamsToQuery(searchParams));
  }, [searchParams]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setOpenDrawer(open);
  };

  const ResetFilter = () => {
    if (toggleDrawer) toggleDrawer(false);
    setSearchParams();
  };

  return (
    <>
      <Stack direction={"row"} width={isDesktop ? "auto" : "100%"} justifyContent={"flex-end"} alignSelf={"stretch"}>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="mdi:filter-outline" />}
          onClick={toggleDrawer(true)}
          sx={{ lineHeight: 1.2, ...(!isDesktop && { width: "100%" }) }}
        >
          {filterString.filter((element) => element !== undefined).length
            ? `${filterString.filter((element) => element !== undefined).join(", ")}`
            : "Filter"}
        </Button>
        {filterString.filter((element) => element !== undefined).length ? (
          <IconButton aria-label="clear" onClick={ResetFilter}>
            <Iconify icon="ic:round-close" sx={{ width: "20px", height: "20px" }} />
          </IconButton>
        ) : null}
      </Stack>
      <Drawer anchor={"right"} open={openDrawer} onClose={toggleDrawer(false)}>
        <Stack padding={2} gap={1} paddingRight={4} direction={"row"} alignItems={"flex-start"}>
          <IconButton aria-label="back" onClick={toggleDrawer(false)}>
            <Iconify icon="ph:arrow-left-bold" sx={{ width: "20px", height: "20px" }} />
          </IconButton>
          <Box paddingTop={1}>
            <BookingFilterForm toggleDrawer={toggleDrawer()} />
          </Box>
        </Stack>
      </Drawer>
    </>
  );
}

function BookingFilterForm({ toggleDrawer }) {
  const [openStudent, setOpenStudent] = useState(false);
  const [openPacket, setOpenPacket] = useState(false);
  const [filters, setFilters] = useState(initFilter);
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: students = [], isLoading: isLoadingStudents } = useGetStudents({
    queryParam: { perPage: 9999 },
    options: {
      enabled: openStudent,
      select: (res) =>
        res.data.map((packet) => ({
          value: packet.id,
          label: packet.nama_murid,
        })),
    },
  });

  const { data: packets = [], isLoading: isLoadingPackets } = useGetPackets({
    queryParam: { perPage: 9999 },
    options: {
      enabled: openPacket,
      select: (res) =>
        res.data.map((packet) => ({
          value: packet.id,
          label: `${packet.nama_paket}${packet.description && `, ${packet.description}`}`,
        })),
    },
  });

  useEffect(() => {
    // use this for escape infinite loop
    setFilters(urlSearchParamsToQuery(searchParams));
  }, [searchParams]);

  const SubmitFilter = () => {
    if (toggleDrawer) toggleDrawer(false);
    setSearchParams({ ...filters, page: 1 });
  };

  const ResetFilter = () => {
    if (toggleDrawer) toggleDrawer(false);
    setSearchParams();
  };

  return (
    <Stack width={"100%"} minWidth={["90vw", "50vw", "40vw"]} direction={"column"} gap={2}>
      <AutoCompleteBasic
        label="Nama Murid"
        name="studentId"
        open={openStudent}
        onOpen={() => {
          setOpenStudent(true);
        }}
        onClose={() => {
          setOpenStudent(false);
        }}
        onChange={(_, newValue) => {
          setFilters((prevState) => ({
            ...prevState,
            studentId: newValue?.value || "",
            studentLabel: newValue?.label || "",
          }));
        }}
        options={students}
        loading={isLoadingStudents}
        value={{ value: filters.studentId || "", label: filters.studentLabel || "" }}
      />
      <AutoCompleteBasic
        label="Nama Paket"
        name="paketId"
        open={openPacket}
        onOpen={() => {
          setOpenPacket(true);
        }}
        onClose={() => {
          setOpenPacket(false);
        }}
        onChange={(_, newValue) => {
          setFilters((prevState) => ({
            ...prevState,
            paketId: newValue?.value || "",
            paketLabel: newValue?.label || "",
          }));
        }}
        options={packets}
        loading={isLoadingPackets}
        value={{ value: filters.paketId || "", label: filters.paketLabel || "" }}
      />
      <Stack spacing={1} direction={"row"} flexShrink={0} alignItems="flex-end" width={"100%"}>
        <Button
          variant="contained"
          onClick={SubmitFilter}
          sx={{
            height: "50px",
            width: "100%",
          }}
        >
          Filter
        </Button>
        <Button
          variant="outlined"
          onClick={ResetFilter}
          sx={{
            height: "50px",
            width: "100%",
          }}
        >
          Reset
        </Button>
      </Stack>
    </Stack>
  );
}

BookingFilterForm.propTypes = {
  toggleDrawer: PropTypes.func,
};
