import useGetRepairTimeAsset from "@/utils/hooks/useGetRepairTimeAsset";
import {
  Box,
  Card,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import React from "react";

export default function AverageRepairTime({ year }: { year: string }) {
  const { data, isLoading } = useGetRepairTimeAsset({ year });

  const getAverageRepairDay = (data: any) => {
    if (typeof data === "string") {
      return data;
    }

    let day = 0;
    const filteredData = data?.filter(
      (fil: any) => fil?.actual_repair_end_date && fil?.actual_repair_start_date
    );

    filteredData?.map((dat: any) => {
      const actualRepairFinish = moment(new Date(dat?.actual_repair_end_date));
      const actualRepairStart = moment(new Date(dat?.actual_repair_start_date));
      const actualRepairDay = actualRepairFinish.diff(
        actualRepairStart,
        "days"
      );
      day += actualRepairDay;
    });

    if (day === 0) {
      return "0 Hari";
    }

    const average = day / filteredData?.length;

    return `${average} Hari`;
  };
  return (
    <>
      {isLoading ? (
        <>
          <Skeleton variant="rounded" width="100%" height={200} />
        </>
      ) : (
        <>
          <Card sx={{ height: "100%" }}>
            <Box p="20px" pr="40px">
              <Stack direction="column" spacing={2}>
                <Typography fontWeight="700" fontSize="20px">
                  Rata-Rata Waktu Perbaikan Aset
                </Typography>

                <TableContainer
                  sx={{
                    overflow: "auto",
                    maxWidth: "calc(100vw - 100px)",
                  }}
                >
                  <Table aria-label="simple table" size="small">
                    <TableHead>
                      <TableRow>
                        {data?.headers?.map(
                          (header: any, indexHeader: number) => (
                            <TableCell key={`${indexHeader}-header`}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {header}
                              </Typography>
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.body?.map((dat: any, index: number) => (
                        <TableRow key={`${index}-body`}>
                          {dat?.map((da: any) => (
                            <TableCell>
                              <Typography>{getAverageRepairDay(da)}</Typography>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </Box>
          </Card>
        </>
      )}
    </>
  );
}
