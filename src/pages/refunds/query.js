import axios from "axios";
import { useQuery, useMutation } from "react-query";

import { queryKey } from "../../constants/queryKey";
import { fetchHeader } from "../../constants/fetchHeader";
import { cleanQuery } from "../../utils/cleanQuery";
import { queryToString } from "../../utils/queryToString";

export function useGetRefunds(props) {
  console.log(fetchHeader);
  const options = props?.options || {};
  const queryParam = props?.queryParam || {};
  const { data, isLoading, isError, refetch } = useQuery(
    [
      queryKey.refunds,
      cleanQuery({
        ...queryParam,
      }),
    ],
    () =>
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/api/refund${queryToString({
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

export function useGetRefund({ id, options }) {
  const { data, isLoading, isError, refetch } = useQuery(
    [queryKey.refunds, "DETAIL", id],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/refund/${id}`, {
          headers: fetchHeader,
        })
        .then((res) => res.data),
    options
  );
  return { refetch, data, isLoading, isError };
}

export function useAddRefund() {
  return useMutation((data) =>
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/refund`, data, {
      headers: fetchHeader,
    })
  );
}

export function useUpdateRefund({ id }) {
  return useMutation((data) =>
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/refund/${id}`, data, {
      headers: fetchHeader,
    })
  );
}

export function useDeleteRefund({ id }) {
  return useMutation(() =>
    axios.delete(`${process.env.REACT_APP_BASE_URL}/api/refund/${id}`, {
      headers: fetchHeader,
    })
  );
}
