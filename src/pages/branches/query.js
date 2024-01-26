import axios from "axios";
import { useQuery, useMutation } from "react-query";

import { queryKey } from "../../constants/queryKey";
import { fetchHeader } from "../../constants/fetchHeader";

export function useGetBranchs() {
  const { data, isLoading, isError, refetch } = useQuery([queryKey.branches], () =>
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/cabang`, {
        headers: fetchHeader,
      })
      .then((res) => res.data)
  );
  return { refetch, data, isLoading, isError };
}

export function useAddBranch() {
  return useMutation((data) =>
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/cabang`, data, {
      headers: fetchHeader,
    })
  );
}

export function useUpdateBranch({ id }) {
  return useMutation((data) =>
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/cabang/${id}`, data, {
      headers: fetchHeader,
    })
  );
}

export function useDeleteBranch({ id }) {
  return useMutation(() =>
    axios.delete(`${process.env.REACT_APP_BASE_URL}/api/cabang/${id}`, {
      headers: fetchHeader,
    })
  );
}
