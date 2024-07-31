import useGetRepairFund from "@/utils/hooks/useGetRepairFund";
import { formatNumberToIndonesian } from "@/utils/number";
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
import React from "react";

export default function AssetRepairFund({ year }: { year: string }) {
  const { data, isLoading } = useGetRepairFund({ year });

  const getAverageRepairDay = (data: any) => {
    if (typeof data === "string") {
      return data;
    }

    const formatNumber = formatNumberToIndonesian(data);

    return formatNumber;
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
                  Total Dana Perbaikan Aset
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
