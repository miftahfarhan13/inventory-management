import useGetTotalPriceImprovement from "@/utils/hooks/useGetTotalPriceImprovement";
import { formatRupiah } from "@/utils/number";
import { Box, Card, Grid, Skeleton, Stack, Typography } from "@mui/material";
import moment from "moment";
import React from "react";

export default function TotalImprovementPrice() {
  const currentYear = moment(new Date()).format("YYYY");
  const { data, isLoading } = useGetTotalPriceImprovement();
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
                  Total Anggaran Perbaikan Seluruh Aset Per {currentYear}
                </Typography>

                <Grid container>
                  <Grid item xs={12} lg={4}>
                    <Stack direction="column" spacing={2} alignItems="center">
                      <Typography fontWeight="600">Triwulan 1</Typography>
                      <Typography
                        fontWeight="700"
                        fontSize="24px"
                        color="primary"
                      >
                        {formatRupiah(data?.tw_1)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <Stack direction="column" spacing={2} alignItems="center">
                      <Typography fontWeight="600">Triwulan 2</Typography>
                      <Typography
                        fontWeight="700"
                        fontSize="24px"
                        color="primary"
                      >
                        {formatRupiah(data?.tw_2)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <Stack direction="column" spacing={2} alignItems="center">
                      <Typography fontWeight="600">Triwulan 2</Typography>
                      <Typography
                        fontWeight="700"
                        fontSize="24px"
                        color="primary"
                      >
                        {formatRupiah(data?.tw_3)}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Box>
          </Card>
        </>
      )}
    </>
  );
}
