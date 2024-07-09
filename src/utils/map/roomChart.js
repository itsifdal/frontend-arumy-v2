import { parse } from "date-fns";

export function mapRoomChart(bookingList) {
  if (!bookingList) return [];
  return bookingList.map((booking) => [
    booking.room?.nama_ruang ?? "",
    `${JSON.parse(booking.user_group)
      .map((student) => student.nama_murid)
      .join(", ")} - ${booking.teacher?.nama_pengajar ?? ""}`,
    parse(booking.jam_booking, "HH:mm:ss", new Date()),
    parse(booking.selesai, "HH:mm:ss", new Date()),
  ]);
}
