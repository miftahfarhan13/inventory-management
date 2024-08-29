import { Box, Card, Skeleton, Stack, Typography } from "@mui/material";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useGetTotalGoodAsset from "@/utils/hooks/useGetTotalGoodAsset";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TotalGoodAssetProps {
  year: string;
}

export default function TotalGoodAsset({ year }: TotalGoodAssetProps) {
  const { data, isLoading } = useGetTotalGoodAsset({ year });

  return (
    <>
      {isLoading ? (
        <Skeleton variant="rounded" width="100%" height={200} />
      ) : (
        <Card sx={{ height: "100%" }}>
          <Box p="20px" pr="40px">
            <Stack direction="column" spacing={2}>
              <Typography fontWeight="700" fontSize="20px">
                Grafik Jumlah Aset Kondisi Baik
              </Typography>

              <Box height={300}>
                {data?.datasets && (
                  <Bar
                    data={{
                      labels: data.labels,
                      datasets: data.datasets,
                    }}
                  />
                )}
              </Box>
            </Stack>
          </Box>
        </Card>
      )}
    </>
  );
}
