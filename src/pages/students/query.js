import axios from "axios";
import { useQuery, useMutation } from "react-query";

import { queryKey } from "../../constants/queryKey";
import { fetchHeader } from "../../constants/fetchHeader";
import { queryToString } from "../../utils/queryToString";

export function useStudentsQuery(props) {
  const options = props?.options || {};
  const queryParam = props?.queryParam || {};
  const { data, isLoading, isError, refetch } = useQuery(
    [queryKey.students],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/student${queryToString(queryParam)}`, {
          headers: fetchHeader,
        })
        .then((res) => res.data),
    options
  );
  return { refetch, data, isLoading, isError };
}

export function useStudentQuery({ id, options }) {
  const { data, isLoading, isError, refetch } = useQuery(
    [queryKey.students, "DETAIL", id],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/student/${id}`, {
          headers: fetchHeader,
        })
        .then((res) => res.data),
    options
  );
  return { refetch, data, isLoading, isError };
}

export function useAddStudent() {
  return useMutation((data) =>
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/student`, data, {
      headers: fetchHeader,
    })
  );
}

export function useUpdateStudent({ id }) {
  return useMutation((data) =>
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/student/${id}`, data, {
      headers: fetchHeader,
    })
  );
}

export function useDeleteStudent({ id }) {
  return useMutation(() =>
    axios.delete(`${process.env.REACT_APP_BASE_URL}/api/student/${id}`, {
      headers: fetchHeader,
    })
  );
}
