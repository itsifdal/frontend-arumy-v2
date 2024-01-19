import axios from "axios";
import { useQuery, useMutation } from "react-query";

import { queryKey } from "../../constants/queryKey";
import { fetchHeader } from "../../constants/fetchHeader";

export function useGetUsers(props) {
  const options = props?.options || {};
  const { data, isLoading, isError, refetch } = useQuery(
    [queryKey.users],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/user`, {
          headers: fetchHeader,
        })
        .then((res) => res.data),
    options
  );
  return { refetch, data, isLoading, isError };
}

export function useGetUser(props) {
  const id = props?.id;
  const options = props?.options || {};
  const { data, isLoading, isError, refetch } = useQuery(
    [queryKey.users, "DETAIL", id],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/user/${id}`, {
          headers: fetchHeader,
        })
        .then((res) => res.data),
    options
  );
  return { refetch, data, isLoading, isError };
}

export function useAddUser() {
  return useMutation((data) =>
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/user`, data, {
      headers: fetchHeader,
    })
  );
}

export function useUpdateUser({ id }) {
  return useMutation((data) =>
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/user/${id}`, data, {
      headers: fetchHeader,
    })
  );
}

export function useDeleteUser({ id }) {
  return useMutation(() =>
    axios.delete(`${process.env.REACT_APP_BASE_URL}/api/user/${id}`, {
      headers: fetchHeader,
    })
  );
}
