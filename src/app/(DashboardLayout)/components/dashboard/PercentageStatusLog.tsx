import useGetPercentageStatus from "@/utils/hooks/useGetPercentageStatus";
import { calculatePercentage } from "@/utils/number";
import { Box, Card, Grid, Skeleton, Stack, Typography } from "@mui/material";
import moment from "moment";
import React from "react";

export default function PercentageStatusLog() {
  const currentYear = moment(new Date()).format("YYYY");
  const { data, isLoading } = useGetPercentageStatus();

  const percentageSuccessTw1 = calculatePercentage(
    data?.tw_1?.success,
    data?.tw_1?.all
  );

  const percentageFailedTw1 = calculatePercentage(
    data?.tw_1?.failed,
    data?.tw_1?.all
  );

  const percentageSuccessTw2 = calculatePercentage(
    data?.tw_2?.success,
    data?.tw_2?.all
  );

  const percentageFailedTw2 = calculatePercentage(
    data?.tw_2?.failed,
    data?.tw_2?.all
  );

  const percentageSuccessTw3 = calculatePercentage(
    data?.tw_3?.success,
    data?.tw_3?.all
  );

  const percentageFailedTw3 = calculatePercentage(
    data?.tw_3?.failed,
    data?.tw_3?.all
  );
  return (
    <>
      {isLoading ? (
        <>
          <Skeleton variant="rounded" width="100%" height={120} />
        </>
      ) : (
        <>
          <Stack direction="column" spacing={2}>
            <Typography alignSelf="center" fontWeight="700" fontSize="20px">
              Keberhasilan Perbaikan Aset Per {currentYear}
            </Typography>

            <Stack direction="row" spacing={2}>
              <Box flex="1">
                <Card style={{ padding: "10px" }}>
                  <Stack direction="column" spacing={2} alignItems="center">
                    <Typography fontWeight="600">Triwulan 1</Typography>

                    <Card
                      style={{
                        padding: "10px",
                        width: "100%",
                        background: "#71EF4541",
                        border: "1px solid #71EF45",
                        paddingBottom: "20px",
                      }}
                    >
                      <Stack direction="column" spacing={2} alignItems="center">
                        <Typography fontWeight="600">Setuju</Typography>
                        <Typography fontWeight="700" fontSize="30px">
                          {percentageSuccessTw1}%
                        </Typography>
                      </Stack>
                    </Card>

                    <Card
                      style={{
                        padding: "10px",
                        width: "100%",
                        backgroundColor: "#EF454541",
                        border: "1px solid #EF4545",
                        paddingBottom: "20px",
                      }}
                    >
                      <Stack direction="column" spacing={2} alignItems="center">
                        <Typography fontWeight="600">Tolak</Typography>
                        <Typography fontWeight="700" fontSize="30px">
                          {percentageFailedTw1}%
                        </Typography>
                      </Stack>
                    </Card>
                  </Stack>
                </Card>
              </Box>
              <Box flex="1">
                <Card style={{ padding: "10px" }}>
                  <Stack direction="column" spacing={2} alignItems="center">
                    <Typography fontWeight="600">Triwulan 2</Typography>

                    <Card
                      style={{
                        padding: "10px",
                        width: "100%",
                        background: "#71EF4541",
                        border: "1px solid #71EF45",
                        paddingBottom: "20px",
                      }}
                    >
                      <Stack direction="column" spacing={2} alignItems="center">
                        <Typography fontWeight="600">Setuju</Typography>
                        <Typography fontWeight="700" fontSize="30px">
                          {percentageSuccessTw2}%
                        </Typography>
                      </Stack>
                    </Card>

                    <Card
                      style={{
                        padding: "10px",
                        width: "100%",
                        backgroundColor: "#EF454541",
                        border: "1px solid #EF4545",
                        paddingBottom: "20px",
                      }}
                    >
                      <Stack direction="column" spacing={2} alignItems="center">
                        <Typography fontWeight="600">Tolak</Typography>
                        <Typography fontWeight="700" fontSize="30px">
                          {percentageFailedTw2}%
                        </Typography>
                      </Stack>
                    </Card>
                  </Stack>
                </Card>
              </Box>
              <Box flex="1">
                <Card style={{ padding: "10px" }}>
                  <Stack direction="column" spacing={2} alignItems="center">
                    <Typography fontWeight="600">Triwulan 3</Typography>

                    <Card
                      style={{
                        padding: "10px",
                        width: "100%",
                        background: "#71EF4541",
                        border: "1px solid #71EF45",
                        paddingBottom: "20px",
                      }}
                    >
                      <Stack direction="column" spacing={2} alignItems="center">
                        <Typography fontWeight="600">Setuju</Typography>
                        <Typography fontWeight="700" fontSize="30px">
                          {percentageSuccessTw3}%
                        </Typography>
                      </Stack>
                    </Card>

                    <Card
                      style={{
                        padding: "10px",
                        width: "100%",
                        backgroundColor: "#EF454541",
                        border: "1px solid #EF4545",
                        paddingBottom: "20px",
                      }}
                    >
                      <Stack direction="column" spacing={2} alignItems="center">
                        <Typography fontWeight="600">Tolak</Typography>
                        <Typography fontWeight="700" fontSize="30px">
                          {percentageFailedTw3}%
                        </Typography>
                      </Stack>
                    </Card>
                  </Stack>
                </Card>
              </Box>
            </Stack>
          </Stack>
        </>
      )}
    </>
  );
}
