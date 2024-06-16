import useGetAllAssetLogSuccess from "@/utils/hooks/useGetAllAssetLogSuccess";
import { Box, Card, Skeleton, Stack, Typography } from "@mui/material";
import moment from "moment";
import React from "react";

export default function AverageSuccessLog() {
  const { data, isLoading } = useGetAllAssetLogSuccess();
  const currentYear = moment(new Date()).format("YYYY");

  const countTotalDay = () => {
    let total = 0;
    data?.map((item: any) => {
      const actualRepairFinish = moment(new Date(item?.actual_repair_end_date));
      const actualRepairStart = moment(
        new Date(item?.actual_repair_start_date)
      );
      const actualRepairDay = actualRepairFinish.diff(
        actualRepairStart,
        "days"
      );

      total += actualRepairDay;
    });

    return total;
  };

  const totalDay = countTotalDay();
  const totalData = data?.length;
  const countAverage = Math.floor(totalDay / totalData);

  return (
    <>
      {isLoading ? (
        <>
          <Skeleton variant="rounded" width="100%" height={120} />
        </>
      ) : (
        <>
          <Card>
            <Box p="40px">
              <Stack direction="column" spacing={4}>
                <Typography fontWeight="700" fontSize="16px">
                  Rata-rata Waktu Perbaikan Aset Laboratorium {currentYear}
                </Typography>

                <Typography fontWeight="700" fontSize="40px" color="primary">
                  {countAverage} Hari
                </Typography>
              </Stack>
            </Box>
          </Card>
        </>
      )}
    </>
  );
}
