import axios from "axios";
import { useQuery } from "react-query";

import { queryKey } from "../../constants/queryKey";

export function useBranchQuery() {
  const { data, isLoading, isError, refetch } = useQuery([queryKey.branches], () =>
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/cabang`).then((res) => res.data)
  );
  return { refetch, data, isLoading, isError };
}