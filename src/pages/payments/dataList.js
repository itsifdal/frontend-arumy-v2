import React, { useState } from "react";
import { Stack, Button, Pagination, PaginationItem } from "@mui/material";
import { format } from "date-fns";
import { NumericFormat } from "react-number-format";
import { useSearchParams, Link } from "react-router-dom";

import Scrollbar from "../../components/Scrollbar";
import BasicTable from "../../components/BasicTable";
import Iconify from "../../components/Iconify";
import { queryToString } from "../../utils/queryToString";
import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";
import PaymentDeleteModal from "./deleteModal";
import PaymentFormModal from "./formModal";
import { useGetPayments } from "./query";
import { onSuccessToast, onErrorToast } from "./callback";

const defaultQuery = { sort: "DESC", sort_by: "tgl_bayar" };

export default function PaymentList() {
  const [id, setId] = useState("");
  const [packetName, setPacketName] = useState("");
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [searchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  const {
    data: payments,
    isLoading,
    isError,
    refetch: paymentsRefetch,
  } = useGetPayments({
    options: {
      select: (res) => ({
        data: res.data.map((packet) => ({
          id: packet.id,
          studentName: packet.student?.nama_murid,
          paketName: packet.paket?.nama_paket,
          paymentDate: format(new Date(packet.tgl_bayar), "dd-MM-yyyy"),
          totalPaid: packet.jumlah_bayar,
          receiptNumber: packet.receipt_number,
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
    paymentsRefetch();
    setIsOpenUpdateModal(false);
  };

  const onSuccessDelete = () => {
    paymentsRefetch();
    setIsOpenDeleteModal(false);
  };

  if (isLoading) return <>Loading Data</>;
  if (isError) return <>Error Loading Data</>;

  return (
    <>
      <Scrollbar>
        <BasicTable
          header={["NAMA MURID", "NAMA PAKET", "TANGGAL BAYAR", "NOMOR INVOICE", "JUMLAH BAYAR", " "]}
          body={payments.data.map((payment) => [
            payment.studentName,
            payment.paketName,
            payment.paymentDate,
            payment.receiptNumber,
            <NumericFormat
              prefix={"Rp"}
              key={payment.id}
              displayType="text"
              value={payment.totalPaid}
              thousandSeparator="."
              decimalSeparator=","
            />,
            <Stack key={payment.id} direction="row" spacing={2}>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<Iconify icon="mdi:pencil" />}
                onClick={() => onClickEdit({ updateId: payment.id, updateName: payment.paketName })}
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
                    deleteId: payment.id,
                    deleteName: ` pembayaran ${payment.studentName} untuk kelas ${payment.paketName} pada tanggal ${payment.paymentDate}`,
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
        page={payments.pagination.currentPage}
        count={payments.pagination.totalPages}
        shape="rounded"
        sx={[{ ul: { justifyContent: "center" } }]}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`/app/payment${queryToString({ ...queryParam, page: item.page === 1 ? null : item.page })}`}
            {...item}
          />
        )}
      />

      <PaymentFormModal
        open={isOpenUpdateModal}
        onClose={handleCloseModalUpdate}
        id={String(id)}
        onError={(err) => onErrorToast(err)}
        onSuccess={(res) => onSuccessToast(res, onSuccessUpdate)}
        stateModal={"update"}
      />

      <PaymentDeleteModal
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
