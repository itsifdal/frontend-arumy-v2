import axios from "axios";
import { useQuery, useMutation } from "react-query";

import { queryKey } from "../../constants/queryKey";
import { fetchHeader } from "../../constants/fetchHeader";
import { queryToString } from "../../utils/queryToString";

export function useGetBookings(props) {
  const options = props?.options || {};
  const queryParam = props?.queryParam || {};
  const { data, isLoading, isError, refetch } = useQuery(
    [queryKey.bookings, queryParam],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/booking${queryToString(queryParam)}`, {
          headers: fetchHeader,
        })
        .then((res) => res.data),
    options
  );
  return { refetch, data, isLoading, isError };
}

export function useGetBooking({ id, options }) {
  const { data, isLoading, isError, refetch } = useQuery(
    [queryKey.bookings, "DETAIL", id],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/booking/${id}`, {
          headers: fetchHeader,
        })
        .then((res) => res.data),
    options
  );
  return { refetch, data, isLoading, isError };
}

export function useAddBooking() {
  return useMutation((data) =>
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/booking`, data, {
      headers: fetchHeader,
    })
  );
}

export function useUpdateBooking({ id }) {
  return useMutation((data) =>
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/booking/${id}`, data, {
      headers: fetchHeader,
    })
  );
}

export function useDeleteBooking({ id }) {
  return useMutation(() =>
    axios.delete(`${process.env.REACT_APP_BASE_URL}/api/booking/${id}`, {
      headers: fetchHeader,
    })
  );
}
