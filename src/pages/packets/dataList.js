import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import { Stack, Button, Pagination, PaginationItem } from "@mui/material";
import { useSearchParams, Link } from "react-router-dom";

import Scrollbar from "../../components/Scrollbar";
import BasicTable from "../../components/BasicTable";
import Iconify from "../../components/Iconify";
import PacketDeleteModal from "./deleteModal";
import PacketFormModal from "./formModal";
import { useGetPackets } from "./query";
import { onSuccessToast, onErrorToast } from "./callback";
import { queryToString } from "../../utils/queryToString";
import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";

export default function PacketList() {
  const [id, setId] = useState("");
  const [packetName, setPacketName] = useState("");
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [searchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  const {
    data: packets,
    isLoading,
    isError,
    refetch: packetsRefetch,
  } = useGetPackets({
    queryParam: { ...queryParam },
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
          header={["NAMA PAKET", "HARGA", "QUOTA PRIVATE", "QUOTA GROUP", " "]}
          body={packets.data.map((packet) => [
            packet.nama_paket,
            <NumericFormat
              prefix={"Rp"}
              key={packet.id}
              displayType="text"
              value={packet.harga}
              thousandSeparator="."
              decimalSeparator=","
            />,
            packet.quota_privat,
            packet.quota_group,
            <Stack key={packet.id} direction="row" spacing={2}>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<Iconify icon="mdi:pencil" />}
                onClick={() => onClickEdit({ updateId: packet.id, updateName: packet.nama_paket })}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<Iconify icon="eva:trash-fill" />}
                onClick={() => onClickDelete({ deleteId: packet.id, deleteName: packet.nama_paket })}
              >
                Delete
              </Button>
            </Stack>,
          ])}
        />
      </Scrollbar>

      <Pagination
        page={packets.pagination.current_page}
        count={packets.pagination.total_pages}
        shape="rounded"
        sx={[{ ul: { justifyContent: "center" } }]}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`/app/packet${queryToString({ ...queryParam, page: item.page === 1 ? null : item.page })}`}
            {...item}
          />
        )}
      />

      <PacketFormModal
        open={isOpenUpdateModal}
        onClose={handleCloseModalUpdate}
        id={String(id)}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, onSuccessUpdate)}
        stateModal={"update"}
      />

      <PacketDeleteModal
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
