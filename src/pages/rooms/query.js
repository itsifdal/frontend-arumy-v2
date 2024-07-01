import axios from "axios";
import { useQuery, useMutation } from "react-query";

import { queryKey } from "../../constants/queryKey";
import { fetchHeader } from "../../constants/fetchHeader";

export function useGetRooms(props) {
  const options = props?.options || {};
  const { data, isLoading, isError, refetch } = useQuery(
    [queryKey.rooms],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/room`, {
          headers: fetchHeader,
        })
        .then((res) => res.data),
    options
  );
  return { refetch, data, isLoading, isError };
}

export function useAddRooms() {
  return useMutation((data) =>
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/room`, data, {
      headers: fetchHeader,
    })
  );
}

export function useUpdateRooms({ id }) {
  return useMutation((data) =>
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/room/${id}`, data, {
      headers: fetchHeader,
    })
  );
}

export function useDeleteRooms({ id }) {
  return useMutation(() =>
    axios.delete(`${process.env.REACT_APP_BASE_URL}/api/room/${id}`, {
      headers: fetchHeader,
    })
  );
}

export function invalidateRooms(queryClient) {
  return queryClient.invalidateQueries({ queryKey: [queryKey.rooms] });
}
