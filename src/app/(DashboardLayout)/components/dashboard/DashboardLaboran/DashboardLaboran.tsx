import { Box, Grid, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import moment from "moment";
import SelectOnlyYear from "@/app/(DashboardLayout)/asset/create/components/shared/SelectOnlyYear";
import ListClosestRepairSchedule from "./ListClosestRepairSchedule";
import ListCurrentStatusRepair from "./ListCurrentStatusRepair";

export default function DashboardLaboran() {
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
          <ListClosestRepairSchedule year={year} />
        </Box>
        <Box width="100%">
          <ListCurrentStatusRepair year={year} />
        </Box>
      </Stack>
    </>
  );
}
