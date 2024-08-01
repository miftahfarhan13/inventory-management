import { Box, Card, Skeleton, Stack, Typography } from "@mui/material";
import React from "react";
import useGetTotalAssetByCategory from "@/utils/hooks/useGetTotalAssetByCategory";
import PieChart from "./PieChart";

interface TotalRepairAssetProps {
  year: string;
}

export default function TotalAssetStatusByCategory({
  year,
}: TotalRepairAssetProps) {
  const { data, isLoading } = useGetTotalAssetByCategory({ year });

  return (
    <>
      {isLoading ? (
        <Skeleton variant="rounded" width="100%" height={200} />
      ) : (
        <Card sx={{ height: "100%" }}>
          <Box p="20px" pr="40px">
            <Stack direction="column" spacing={4}>
              <Typography fontWeight="700" fontSize="20px">
                Perbandingan Aset Baik dan Sedang Diperbaiki
              </Typography>

              <Stack
                width="100%"
                alignSelf="center"
                direction="row"
                alignItems="center"
                spacing={4}
                overflow="auto"
                justifyContent="space-evenly"
              >
                {data?.map((category: any) => (
                  <Stack direction="column" spacing={2} alignItems="center">
                    <Typography fontWeight="700">
                      {category?.category}
                    </Typography>

                    {category?.data?.labels && category?.data?.datasets && (
                      <Box>
                        <PieChart
                          labels={category?.data?.labels || []}
                          datasets={category?.data?.datasets || []}
                        />
                      </Box>
                    )}
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Box>
        </Card>
      )}
    </>
  );
}
