import useGetPercentageRepairAsset from "@/utils/hooks/useGetPercentageRepairAsset";
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
import React, { useEffect, useState } from "react";

export default function PercentageRepairAsset({ year }: { year: string }) {
  const { data, isLoading } = useGetPercentageRepairAsset({ year });
  const [dataPercentages, setDataPercentages] = useState<Array<string>>();

  useEffect(() => {
    const results = Array<any>();

    data?.body?.map((body: any) => {
      let resultItem = Array<string>();

      body?.map((dat: any) => {
        if (typeof dat === "string") {
          resultItem?.push(dat);
        } else {
          const dataLength = dat?.length;
          const totalVendor = dat?.filter(
            (fil: any) => fil?.type === "Perbaikan Vendor"
          )?.length;
          const totalMandiri = dat?.filter(
            (fil: any) => fil?.type === "Perbaikan Mandiri"
          )?.length;

          const percentageVendor = Math.floor((totalVendor / dataLength) * 100);
          const percentageMandiri = Math.floor(
            (totalMandiri / dataLength) * 100
          );

          resultItem?.push(`${percentageVendor ? percentageVendor : 0}%`);
          resultItem?.push(`${percentageMandiri ? percentageMandiri : 0}%`);
        }
      });

      results?.push(resultItem);
    });

    setDataPercentages(results);
  }, [data]);

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
                  Perbandingan Perbaikan Aset oleh Vendor dan Mandiri
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
                            <TableCell
                              key={`${indexHeader}-header`}
                              colSpan={header ? 2 : 1}
                            >
                              <Typography
                                variant="subtitle2"
                                fontWeight={600}
                                textAlign="center"
                              >
                                {header}
                              </Typography>
                            </TableCell>
                          )
                        )}
                      </TableRow>
                      <TableRow>
                        <TableCell></TableCell>
                        {data?.headers
                          ?.filter((fil: any) => fil)
                          ?.map((header: any, indexHeader: number) => (
                            <>
                              <TableCell key={`${indexHeader}-header`}>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  Vendor
                                </Typography>
                              </TableCell>
                              <TableCell key={`${indexHeader}-header`}>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  Mandiri
                                </Typography>
                              </TableCell>
                            </>
                          ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataPercentages?.map((dat: any, index: number) => (
                        <TableRow key={`${index}-body`}>
                          {dat?.map((da: any) => (
                            <TableCell>
                              <Typography>{da}</Typography>
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
