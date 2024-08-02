import React, { useState } from "react";
import { Stack, Button, Pagination, PaginationItem } from "@mui/material";
import { useSearchParams, Link } from "react-router-dom";
import { format, parse } from "date-fns";

import Scrollbar from "../../components/Scrollbar";
import BasicTable from "../../components/BasicTable";
import { StudentDeleteModal } from "./deleteModal";
import { StudentFormModal } from "./formModal";
import { useGetStudents } from "./query";
import { onSuccessToast, onErrorToast } from "./callback";
import { queryToString } from "../../utils/queryToString";
import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";

export function StudentsList() {
  const [id, setId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [searchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  const {
    data: students,
    isLoading,
    isError,
    refetch: packetsRefetch,
  } = useGetStudents({
    queryParam: { ...queryParam },
  });

  const handleCloseModalUpdate = () => setIsOpenUpdateModal(false);
  const handleCloseModalDelete = () => setIsOpenDeleteModal(false);

  const onClickEdit = ({ updateId, updateName }) => {
    setId(updateId);
    setStudentName(updateName);
    setIsOpenUpdateModal(true);
  };

  const onClickDelete = ({ deleteId, deleteName }) => {
    setId(deleteId);
    setStudentName(deleteName);
    setIsOpenDeleteModal(true);
  };

  const onSuccessUpdate = () => {
    packetsRefetch();
    setIsOpenUpdateModal(false);
  };

  const onSuccessDelete = () => {
    packetsRefetch();
    setIsOpenDeleteModal(false);
  };

  if (isLoading) return <>Loading Data</>;
  if (isError) return <>Error Loading Data</>;

  return (
    <>
      <Scrollbar>
        <BasicTable
          header={["STUDENT NAME", "NOMOR VA", "TELEPON", "TANGGAL LAHIR", " "]}
          body={students.data.map((student) => [
            student.nama_murid,
            student.nomor_va,
            student.telepon,
            student.tgl_lahir && student.tgl_lahir !== "0000-00-00"
              ? format(parse(student.tgl_lahir, "yyyy-MM-dd", new Date()), "dd-MM-yyyy")
              : "-",
            <Stack key={student.id} direction="row" spacing={2}>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => onClickEdit({ updateId: student.id, updateName: student.nama_murid })}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => onClickDelete({ deleteId: student.id, deleteName: student.nama_murid })}
              >
                Delete
              </Button>
            </Stack>,
          ])}
        />
      </Scrollbar>

      <Pagination
        page={students.pagination.current_page}
        count={students.pagination.total_pages}
        shape="rounded"
        sx={[{ ul: { justifyContent: "center" } }]}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`/app/students${queryToString({
              ...queryParam,
              page: item.page === 1 ? null : item.page,
            })}`}
            {...item}
          />
        )}
      />

      <StudentFormModal
        open={isOpenUpdateModal}
        onClose={handleCloseModalUpdate}
        id={String(id)}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, onSuccessUpdate)}
        stateModal={"update"}
      />

      <StudentDeleteModal
        open={isOpenDeleteModal}
        onClose={handleCloseModalDelete}
        dataName={String(studentName)}
        id={String(id)}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, onSuccessDelete)}
      />
    </>
  );
}
