import React, { useState } from "react";
import { Stack, Button, Pagination, PaginationItem } from "@mui/material";
import { NumericFormat } from "react-number-format";
import { useSearchParams, Link } from "react-router-dom";

import Scrollbar from "../../components/Scrollbar";
import BasicTable from "../../components/BasicTable";
import Iconify from "../../components/Iconify";
import { queryToString } from "../../utils/queryToString";
import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";
import RefundDeleteModal from "./deleteModal";
import RefundFormModal from "./formModal";
import { useGetRefunds } from "./query";
import { onSuccessToast, onErrorToast } from "./callback";

const defaultQuery = {};

export default function RefundList() {
  const [id, setId] = useState("");
  const [packetName, setPacketName] = useState("");
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [searchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  const {
    data: refunds,
    isLoading,
    isError,
    refetch: packetsRefetch,
  } = useGetRefunds({
    options: {
      select: (res) => ({
        data: res.data.map((refund) => ({
          id: refund.id,
          studentName: refund.student?.nama_murid,
          packetName: refund.paket?.nama_paket,
          totalRefund: refund.refund_amount,
          quotaPrivate: refund.quota_privat,
          quotaGroup: refund.quota_group,
        })),
        pagination: res.pagination,
      }),
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
  if (refunds.data.length === 0) return <>No Data Found</>;

  return (
    <>
      <Scrollbar>
        <BasicTable
          header={["NAMA MURID", "NAMA PAKET", "QUOTA PRIVATE", "QUOTA GROUP", "TOTAL", " "]}
          body={refunds.data.map((refund) => [
            refund.studentName,
            refund.packetName,
            refund.quotaPrivate,
            refund.quotaGroup,
            <NumericFormat
              prefix={"Rp"}
              key={refund.id}
              displayType="text"
              value={refund.totalRefund}
              thousandSeparator="."
              decimalSeparator=","
            />,
            <Stack key={refund.id} direction="row" spacing={2}>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<Iconify icon="mdi:pencil" />}
                onClick={() => onClickEdit({ updateId: refund.id, updateName: refund.paketName })}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<Iconify icon="eva:trash-fill" />}
                onClick={() =>
                  onClickDelete({
                    deleteId: refund.id,
                    deleteName: ` pembayaran ${refund.studentName} untuk kelas ${refund.paketName} pada tanggal ${refund.paymentDate}`,
                  })
                }
              >
                Delete
              </Button>
            </Stack>,
          ])}
        />
      </Scrollbar>

      <Pagination
        page={refunds.pagination.currentPage}
        count={refunds.pagination.totalPages}
        shape="rounded"
        sx={[{ ul: { justifyContent: "center" } }]}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`/app/refund${queryToString({ ...queryParam, page: item.page === 1 ? null : item.page })}`}
            {...item}
          />
        )}
      />

      <RefundFormModal
        open={isOpenUpdateModal}
        onClose={handleCloseModalUpdate}
        id={String(id)}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, onSuccessUpdate)}
        stateModal={"update"}
      />

      <RefundDeleteModal
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
