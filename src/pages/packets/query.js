import axios from "axios";
import { useQuery, useMutation } from "react-query";

import { queryKey } from "../../constants/queryKey";
import { fetchHeader } from "../../constants/fetchHeader";
import { cleanQuery } from "../../utils/cleanQuery";
import { queryToString } from "../../utils/queryToString";

export function useGetPackets(props) {
  const options = props?.options || {};
  const queryParam = props?.queryParam || {};
  const { data, isLoading, isError, refetch } = useQuery(
    [
      queryKey.packets,
      cleanQuery({
        ...queryParam,
      }),
    ],
    () =>
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/api/paket${queryToString({
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

export function useGetPacket({ id, options }) {
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

export function useDeletePacket({ id }) {
  return useMutation(() =>
    axios.delete(`${process.env.REACT_APP_BASE_URL}/api/paket/${id}`, {
      headers: fetchHeader,
    })
  );
}
