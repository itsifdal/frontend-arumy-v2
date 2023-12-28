import React, { useState } from "react";
import { Stack, Button } from "@mui/material";
import { format } from "date-fns";
import { NumericFormat } from "react-number-format";

import Scrollbar from "../../components/Scrollbar";
import BasicTable from "../../components/BasicTable";
import Iconify from "../../components/Iconify";
import PaymentDeleteModal from "./deleteModal";
import PaymentFormModal from "./formModal";
import { usePaymentsQuery } from "./query";
import { onSuccessToast, onErrorToast } from "./callback";

export default function PaymentList() {
  const [id, setId] = useState("");
  const [packetName, setPacketName] = useState("");
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const {
    data: payments,
    isLoading,
    isError,
    refetch: packetsRefetch,
  } = usePaymentsQuery({
    options: {
      select: (res) =>
        res.data.map((packet) => ({
          id: packet.id,
          studentName: packet.student?.nama_murid,
          paketName: packet.paket?.nama_paket,
          paymentDate: format(new Date(packet.tgl_tagihan), "dd-MM-yyyy"),
          totalPaid: packet.jumlah_bayar,
        })),
    },
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
    console.log("deleteName ", deleteName);
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
          header={["NAMA MURID", "NAMA PAKET", "TANGGAL TAGIHAN", "JUMLAH BAYAR", " "]}
          body={payments.map((payment) => [
            payment.studentName,
            payment.paketName,
            payment.paymentDate,
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
