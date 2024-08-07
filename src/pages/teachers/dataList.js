import React, { useState } from "react";
import { Stack, Button, Pagination, PaginationItem } from "@mui/material";
import { useSearchParams, Link } from "react-router-dom";

import Scrollbar from "../../components/Scrollbar";
import BasicTable from "../../components/BasicTable";
import Iconify from "../../components/Iconify";
import { TeacherDeleteModal } from "./deleteModal";
import { TeacherFormModal } from "./formModal";
import { useGetTeachers } from "./query";
import { onSuccessToast, onErrorToast } from "./callback";
import { queryToString } from "../../utils/queryToString";
import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";

export function TeacherList() {
  const [id, setId] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [searchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  const {
    data: teachers,
    isLoading,
    isError,
    refetch: teachersRefetch,
  } = useGetTeachers({
    queryParam: { ...queryParam },
  });

  const handleCloseModalUpdate = () => setIsOpenUpdateModal(false);
  const handleCloseModalDelete = () => setIsOpenDeleteModal(false);

  const onClickEdit = ({ updateId, updateName }) => {
    setId(updateId);
    setTeacherName(updateName);
    setIsOpenUpdateModal(true);
  };

  const onClickDelete = ({ deleteId, deleteName }) => {
    setId(deleteId);
    setTeacherName(deleteName);
    setIsOpenDeleteModal(true);
  };

  const onSuccessUpdate = () => {
    teachersRefetch();
    setIsOpenUpdateModal(false);
  };

  const onSuccessDelete = () => {
    teachersRefetch();
    setIsOpenDeleteModal(false);
  };

  if (isLoading) return <>Loading Data</>;
  if (isError) return <>Error Loading Data</>;

  return (
    <>
      <Scrollbar>
        <BasicTable
          header={["TEACHER NAME", "TELEPON", " "]}
          body={teachers.data.map((teacher) => [
            teacher.nama_pengajar,
            teacher.telepon,
            <Stack key={teacher.id} direction="row" spacing={2}>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<Iconify icon="mdi:pencil" />}
                onClick={() => onClickEdit({ updateId: teacher.id, updateName: teacher.nama_pengajar })}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<Iconify icon="eva:trash-fill" />}
                onClick={() => onClickDelete({ deleteId: teacher.id, deleteName: teacher.nama_pengajar })}
              >
                Delete
              </Button>
            </Stack>,
          ])}
        />
      </Scrollbar>

      <Pagination
        page={teachers.pagination.current_page}
        count={teachers.pagination.total_pages}
        shape="rounded"
        sx={[{ ul: { justifyContent: "center" } }]}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`/app/teachers${queryToString({ ...queryParam, page: item.page === 1 ? null : item.page })}`}
            {...item}
          />
        )}
      />

      <TeacherFormModal
        open={isOpenUpdateModal}
        onClose={handleCloseModalUpdate}
        id={String(id)}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, onSuccessUpdate)}
        stateModal={"update"}
      />

      <TeacherDeleteModal
        open={isOpenDeleteModal}
        onClose={handleCloseModalDelete}
        dataName={String(teacherName)}
        id={String(id)}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, onSuccessDelete)}
      />
    </>
  );
}
