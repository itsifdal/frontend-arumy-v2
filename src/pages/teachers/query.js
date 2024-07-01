import axios from "axios";
import { useQuery } from "react-query";

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
