import useGetTotalAssetByStudyProgram from "@/utils/hooks/useGetTotalAssetByStudyProgram";
import { Box, Card, Grid, Skeleton, Stack, Typography } from "@mui/material";
import React from "react";

export default function TotalAsset() {
  const { data, isLoading } = useGetTotalAssetByStudyProgram();
  const totalData = data?.length;
  const grid = totalData === 1 ? 12 : totalData === 2 ? 6 : 4;
  return (
    <>
      {isLoading ? (
        <>
          <Skeleton variant="rounded" width="100%" height={200} />
        </>
      ) : (
        <>
          <Card>
            <Box p="20px" pr="40px">
              <Stack direction="column" spacing={2}>
                <Typography fontWeight="700" fontSize="20px">
                  Jumlah Aset Laboratorium
                </Typography>

                <Grid container spacing={2} alignSelf="center">
                  {data?.map((item: any) => (
                    <Grid item xs={12} lg={grid}>
                      <Stack direction="column" spacing={2}>
                        <Card>
                          <Stack padding="40px" direction="column" spacing={4}>
                            <Typography fontWeight="600" fontSize="18px">
                              {item?.name}
                            </Typography>
                            <Typography
                              fontWeight="700"
                              fontSize="40px"
                              color="primary"
                            >
                              {item?.count_asset}
                            </Typography>
                          </Stack>
                        </Card>

                        <Box>
                          <Stack direction="column" spacing={2}>
                            <Typography fontWeight="700">
                              Jumlah Aset Dalam Ruangan
                            </Typography>
                            <Stack
                              direction="row"
                              alignItems="center"
                              flexWrap="wrap"
                            >
                              {item?.locations?.map((location: any) => (
                                <Box
                                  p="10px"
                                  border="1px solid"
                                  borderRadius="10px"
                                  mb="10px"
                                  mr="10px"
                                >
                                  <Typography>
                                    <b>{location?.name}</b>:{" "}
                                    {location?.count_asset_location}
                                  </Typography>
                                </Box>
                              ))}
                            </Stack>
                          </Stack>
                        </Box>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Box>
          </Card>
        </>
      )}
    </>
  );
}
