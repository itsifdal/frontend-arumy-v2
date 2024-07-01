import { useState } from "react";
import { Button } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { downloadExcel } from "react-export-table-to-excel";

import { initQuery } from "./constant";
import { urlSearchParamsToQuery } from "../../../utils/urlSearchParamsToQuery";
import { useGetQuotaStudents } from "../../students/query";

export default function ExportButton() {
  const [startDownload, setStartDownload] = useState(false);

  const [searchParams] = useSearchParams();
  const queryParam = { ...initQuery, ...urlSearchParamsToQuery(searchParams), page: 1, perPage: 9999 };
  delete queryParam.studentId;

  const { isLoading } = useGetQuotaStudents({
    queryParam,
    options: {
      enabled: startDownload,
      onSuccess: (res) => {
        const exportedQuotaSummary = res.data.map((summary) => ({
          "Nama Murid": summary.studentName,
          "Quota Private": summary.privateQuotaTotal || 0,
          "Quota Group": summary.groupQuotaTotal || 0,
          "Taken Private": summary.privateQuotaUsed || 0,
          "Taken Group": summary.groupQuotaUsed || 0,
          "Remaining Private": summary.privateQuotaLeft || 0,
          "Remaining Group": summary.groupQuotaLeft || 0,
        }));
        const sheet =
          queryParam.term && queryParam.termYear
            ? `${queryParam.term}-${queryParam.termYear}`
            : `${queryParam.dateFrom}-${queryParam.dateTo}`;
        const fileName = `Quota-${sheet}`;
        downloadExcel({
          fileName,
          sheet,
          tablePayload: {
            header: Object.keys(exportedQuotaSummary[0]),
            body: exportedQuotaSummary,
          },
        });

        setStartDownload(false);
      },
    },
  });

  const handleDownloadExcel = () => {
    setStartDownload(true);
  };

  return (
    <Button onClick={handleDownloadExcel} variant="contained" disabled={isLoading}>
      {isLoading ? "Loading..." : "Export Excel"}
    </Button>
  );
}
