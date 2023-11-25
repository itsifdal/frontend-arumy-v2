import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import PropTypes from "prop-types";

import { Stack, Button } from "@mui/material";

import Scrollbar from "../../components/Scrollbar";
import BasicTable from "../../components/BasicTable";
import Iconify from "../../components/Iconify";
import { queryKey } from "../../constants/queryKey";

BranchList.propTypes = {
  onClickEdit: PropTypes.func,
  onClickDelete: PropTypes.func,
};

export default function BranchList({ onClickEdit, onClickDelete }) {
  const {
    data: branches,
    isLoading,
    isError,
  } = useQuery([queryKey.branches], () =>
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/cabang`).then((res) => res.data)
  );

  if (isLoading) return <>Loading Data</>;
  if (isError) return <>Error Loading Data</>;

  return (
    <Scrollbar>
      <BasicTable
        header={["BRANCH NAME", " "]}
        body={branches.data.map((room) => [
          room.nama_cabang,
          <Stack key={room.id} direction="row" spacing={2}>
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<Iconify icon="mdi:pencil" />}
              onClick={() => onClickEdit({ updateId: room.id, updateName: room.nama_cabang })}
            >
              Update
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<Iconify icon="eva:trash-fill" />}
              onClick={() => onClickDelete({ deleteId: room.id, deleteName: room.nama_cabang })}
            >
              Delete
            </Button>
          </Stack>,
        ])}
      />
    </Scrollbar>
  );
}
