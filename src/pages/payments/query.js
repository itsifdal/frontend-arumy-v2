import axios from "axios";
import { useQuery } from "react-query";

import { queryKey } from "../../constants/queryKey";
import { fetchHeader } from "../../constants/fetchHeader";

export function usePaymentsQuery() {
  const { data, isLoading, isError, refetch } = useQuery([queryKey.payments], () =>
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/payment`, {
        headers: fetchHeader,
      })
      .then((res) => res.data)
  );
  return { refetch, data, isLoading, isError };
}

export function usePaymentQuery({ id, options }) {
  const { data, isLoading, isError, refetch } = useQuery(
    [queryKey.payments, "DETAIL", id],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/payment/${id}`, {
          headers: fetchHeader,
        })
        .then((res) => res.data),
    options
  );
  return { refetch, data, isLoading, isError };
}
