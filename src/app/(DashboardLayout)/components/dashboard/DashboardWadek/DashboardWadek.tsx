import { Box, Grid, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import TotalRepairAsset from "./TotalRepairAsset";
import AverageRepairTime from "./AverageRepairTime";
import AssetRepairFund from "./AssetRepairFund";
import PercentageRepairAsset from "./PercentageRepairAsset";
import moment from "moment";
import SelectOnlyYear from "@/app/(DashboardLayout)/asset/create/components/shared/SelectOnlyYear";

export default function DashboardWadek() {
  const currentYear = moment(new Date()).format("YYYY");
  const [year, setYear] = useState<any>(currentYear);
  return (
    <>
      <Stack direction="column" spacing={4} width="100%">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography fontSize="20px" fontWeight="700">
            Dashboard
          </Typography>
          <Box width={150}>
            <SelectOnlyYear
              value={year}
              onChange={(event: any) => setYear(event?.target?.value)}
            />
          </Box>
        </Stack>
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <TotalRepairAsset year={year} />
            </Grid>
            <Grid item xs={12} lg={6}>
              <AverageRepairTime year={year} />
            </Grid>
            <Grid item xs={12} lg={6}>
              <AssetRepairFund year={year} />
            </Grid>
            <Grid item xs={12} lg={6}>
              <PercentageRepairAsset year={year} />
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </>
  );
}
