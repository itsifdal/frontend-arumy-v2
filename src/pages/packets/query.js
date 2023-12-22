import axios from "axios";
import { useQuery } from "react-query";

import { queryKey } from "../../constants/queryKey";

export function usePacketsQuery() {
  const { data, isLoading, isError, refetch } = useQuery([queryKey.packets], () =>
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/paket`, {
        headers: { "x-api-key": process.env.REACT_APP_API_KEY },
      })
      .then((res) => res.data)
  );
  return { refetch, data, isLoading, isError };
}

export function usePacketQuery({ id, options }) {
  const { data, isLoading, isError, refetch } = useQuery(
    [queryKey.packets, "DETAIL", id],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/paket/${id}`, {
          headers: { "x-api-key": process.env.REACT_APP_API_KEY },
        })
        .then((res) => res.data),
    options
  );
  return { refetch, data, isLoading, isError };
}
