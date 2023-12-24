import axios from "axios";
import { useQuery, useMutation } from "react-query";

import { queryKey } from "../../constants/queryKey";
import { fetchHeader } from "../../constants/fetchHeader";

export function usePacketsQuery(props) {
  const options = props?.options || {};
  const { data, isLoading, isError, refetch } = useQuery(
    [queryKey.packets],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/paket`, {
          headers: fetchHeader,
        })
        .then((res) => res.data),
    options
  );
  return { refetch, data, isLoading, isError };
}

export function usePacketQuery({ id, options }) {
  const { data, isLoading, isError, refetch } = useQuery(
    [queryKey.packets, "DETAIL", id],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/paket/${id}`, {
          headers: fetchHeader,
        })
        .then((res) => res.data),
    options
  );
  return { refetch, data, isLoading, isError };
}

export function useAddPacket() {
  return useMutation((data) =>
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/paket`, data, {
      headers: fetchHeader,
    })
  );
}

export function useUpdatePacket({ id }) {
  return useMutation((data) =>
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/paket/${id}`, data, {
      headers: fetchHeader,
    })
  );
}
