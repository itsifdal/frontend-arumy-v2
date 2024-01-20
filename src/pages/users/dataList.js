import React, { useState } from "react";
import { Stack, Button } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { sentenceCase } from "change-case";

import Label from "../../components/Label";
import Scrollbar from "../../components/Scrollbar";
import BasicTable from "../../components/BasicTable";
import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";
import UserDeleteModal from "./deleteModal";
import UserFormModal from "./formModal";
import { useGetUsers } from "./query";
import { onSuccessToast, onErrorToast } from "./callback";

const defaultQuery = { sort: "DESC", sort_by: "tgl_tagihan" };

export default function UserList() {
  const [id, setId] = useState("");
  const [packetName, setPacketName] = useState("");
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [searchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  const {
    data: users,
    isLoading,
    isError,
    refetch: packetsRefetch,
  } = useGetUsers({
    options: {
      select: (userList) =>
        userList.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        })),
    },
    queryParam: { ...defaultQuery, ...queryParam },
  });

  const handleCloseModalUpdate = () => setIsOpenUpdateModal(false);
  const handleCloseModalDelete = () => setIsOpenDeleteModal(false);

  const onClickEdit = ({ updateId, updateName }) => {
    setId(updateId);
    setPacketName(updateName);
    setIsOpenUpdateModal(true);
  };

  const onClickDelete = ({ deleteId, deleteName }) => {
    setId(deleteId);
    setPacketName(deleteName);
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
          header={["NAMA USER", "ROLE", "EMAIL", " "]}
          body={users.map((user, index) => [
            user.name,
            <Label
              key={index}
              variant="ghost"
              color={((user.role === "Admin" || user.role === "Super Admin") && "success") || "warning"}
            >
              {sentenceCase(user.role)}
            </Label>,
            user.email,
            <Stack key={user.id} direction="row" spacing={2}>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => onClickEdit({ updateId: user.id, updateName: user.name })}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                margin={2}
                data-name={user.name}
                data-id={user.id}
                onClick={() =>
                  onClickDelete({
                    deleteId: user.id,
                    deleteName: user.name,
                  })
                }
              >
                Delete
              </Button>
            </Stack>,
          ])}
        />
      </Scrollbar>

      <UserFormModal
        open={isOpenUpdateModal}
        onClose={handleCloseModalUpdate}
        id={String(id)}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, onSuccessUpdate)}
        stateModal={"update"}
      />

      <UserDeleteModal
        open={isOpenDeleteModal}
        onClose={handleCloseModalDelete}
        dataName={String(packetName)}
        id={String(id)}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, onSuccessDelete)}
      />
    </>
  );
}
