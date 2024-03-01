import { useSearchParams } from "react-router-dom";
import React from "react";
import { format, parse } from "date-fns";
import setDefaultOptions from "date-fns/setDefaultOptions";
import randomColor from "randomcolor";
import id from "date-fns/locale/id";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
// material
import { Container, Typography } from "@mui/material";
// components
import Page from "../../../components/Page";
// sections
import PageHeader from "../../../components/PageHeader";
import { urlSearchParamsToQuery } from "../../../utils/urlSearchParamsToQuery";
import { cleanQuery } from "../../../utils/cleanQuery";
import DashboardTimelineFilter from "./filterBar";
import DashboardNav from "../dashboardNav";
import { useGetBookings } from "../../bookings/query";

const initFilter = {
  tgl_kelas: format(new Date(), "yyyy-MM-dd"),
  roomId: 21,
  roomLabel: "Online",
};

// ----------------------------------------------------------------------

export default function DashboardTimeline() {
  const [searchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);

  setDefaultOptions({ locale: id });

  const defaultQueryBooking = {
    ...initFilter,
    ...queryParam,
    perPage: 9999,
  };

  const { data: bookings = [], isLoading: isLoadingBookings } = useGetBookings({
    queryParam: cleanQuery(defaultQueryBooking),
    options: {
      select: (bookingList) =>
        bookingList.data.map((booking) => ({
          id: booking.id,
          title: `${JSON.parse(booking.user_group)
            .map((student) => student.nama_murid)
            .join(", ")} (${booking.teacher?.nama_pengajar})`,
          start: `${booking.tgl_kelas}T${booking.jam_booking}`,
          end: `${booking.tgl_kelas}T${booking.selesai}`,
          color: randomColor({
            luminosity: "dark",
          }),
          // date: "2020-07-30"
        })),
    },
  });

  return (
    <Page title="Dashboard">
      <PageHeader title="Dashboard" rightContent={<DashboardNav active={"rooms"} />} />
      <DashboardTimelineFilter />
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <Typography as="h1" fontWeight={"bold"} fontSize={"20px"}>
          {defaultQueryBooking.roomLabel || "Online"} -{" "}
          {format(parse(defaultQueryBooking.tgl_kelas, "yyyy-MM-dd", new Date()), "dd MMMM yyyy")}
        </Typography>
        {!isLoadingBookings ? (
          <FullCalendar
            plugins={[timeGridPlugin]}
            initialView="timeGridDay"
            headerToolbar={{ left: "", center: "", right: "" }}
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
            nowIndicator
            now={parse(defaultQueryBooking.tgl_kelas, "yyyy-MM-dd", new Date()) || new Date()}
            height="620px"
            locale={id}
            dayHeaders={false}
            slotLabelFormat={{
              hour: "numeric",
              minute: "2-digit",
              omitZeroMinute: false,
              meridiem: "short",
            }}
            events={bookings}
            allDaySlot={false}
          />
        ) : null}
      </Container>
    </Page>
  );
}
