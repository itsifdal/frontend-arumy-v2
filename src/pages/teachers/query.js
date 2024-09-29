import axios from "axios";
import { useQuery, useMutation } from "react-query";

import { queryKey } from "../../constants/queryKey";
import { fetchHeader } from "../../constants/fetchHeader";
import { cleanQuery } from "../../utils/cleanQuery";
import { queryToString } from "../../utils/queryToString";

export function useGetTeachers(props) {
  const options = props?.options || {};
  const queryParam = props?.queryParam || {};
  const { data, isLoading, isError, refetch } = useQuery(
    [
      queryKey.teachers,
      cleanQuery({
        ...queryParam,
      }),
    ],
    () =>
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/api/teacher${queryToString({
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

export function useGetTeacher({ id, options }) {
  const { data, isLoading, isError, refetch } = useQuery(
    [queryKey.teachers, "DETAIL", id],
    () =>
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/teacher/${id}`, {
          headers: fetchHeader,
        })
        .then((res) => res.data),
    options
  );
  return { refetch, data, isLoading, isError };
}

export function useAddTeacher() {
  return useMutation((data) =>
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/teacher`, data, {
      headers: fetchHeader,
    })
  );
}

export function useUpdateTeacher({ id }) {
  return useMutation((data) =>
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/teacher/${id}`, data, {
      headers: fetchHeader,
    })
  );
}

export function useDeleteTeacher({ id }) {
  return useMutation(() =>
    axios.delete(`${process.env.REACT_APP_BASE_URL}/api/teacher/${id}`, {
      headers: fetchHeader,
    })
  );
}

/* 
  status=<status>&dateFrom=<>&dateTo=<>&term=2&termYear=2024
*/
export function useGetTeacherHour({ id, options, queryParam }) {
  const { data, isLoading, isError, refetch } = useQuery(
    [
      queryKey.teachers,
      "HOUR",
      id,
      cleanQuery({
        ...queryParam,
      }),
    ],
    () =>
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/api/teacher/teachHour/${id}${queryToString({
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
