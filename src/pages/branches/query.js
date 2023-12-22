import axios from "axios";
import { useQuery } from "react-query";

import { queryKey } from "../../constants/queryKey";
import { fetchHeader } from "../../constants/fetchHeader";

export function useBranchQuery() {
  const { data, isLoading, isError, refetch } = useQuery([queryKey.branches], () =>
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/cabang`, {
        headers: fetchHeader,
      })
      .then((res) => res.data)
  );
  return { refetch, data, isLoading, isError };
}
