import axios from "axios";
import { useQuery, useMutation } from "react-query";

import { queryKey } from "../../constants/queryKey";
import { fetchHeader } from "../../constants/fetchHeader";
import { cleanQuery } from "../../utils/cleanQuery";
import { queryToString } from "../../utils/queryToString";

export function useGetPayments(props) {
  const options = props?.options || {};
  const queryParam = props?.queryParam || {};
  const { data, isLoading, isError, refetch } = useQuery(
    [
      queryKey.payments,
      cleanQuery({
        ...queryParam,
      }),
    ],
    () =>
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/api/payment${queryToString({
            ...queryParam,
          })}`,
          {
            headers: fetchHeader,
          }
        )
        .then((res) => res.data),
    options
  );
  return { refetch, data, isLoading, isError };
}

export function useGetPayment({ id, options }) {
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

export function useAddPayment() {
  return useMutation((data) =>
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/payment`, data, {
      headers: fetchHeader,
    })
  );
}

export function useUpdatePayment({ id }) {
  return useMutation((data) =>
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/payment/${id}`, data, {
      headers: fetchHeader,
    })
  );
}

export function useDeletePayment({ id }) {
  return useMutation(() =>
    axios.delete(`${process.env.REACT_APP_BASE_URL}/api/payment/${id}`, {
      headers: fetchHeader,
    })
  );
}
