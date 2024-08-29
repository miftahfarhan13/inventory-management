import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import TotalRepairAsset from "./TotalRepairAsset";
import AverageRepairTime from "./AverageRepairTime";
import AssetRepairFund from "./AssetRepairFund";
import PercentageRepairAsset from "./PercentageRepairAsset";
import moment from "moment";
import SelectOnlyYear from "@/app/(DashboardLayout)/asset/create/components/shared/SelectOnlyYear";
import TotalGoodAsset from "./TotalGoodAsset";
import { useReactToPrint } from "react-to-print";
import { IconDownload } from "@tabler/icons-react";

export default function DashboardWadek() {
  const componentPdf = useRef();
  const currentYear = moment(new Date()).format("YYYY");
  const [year, setYear] = useState<any>(currentYear);

  const generatePDF = useReactToPrint({
    // @ts-ignore
    content: () => componentPdf.current,
    documentTitle: `Dashboard Wadek ${year}`,
  });
  return (
    <>
      <style type="text/css" media="print">
        {`
            @media print {
              .print-container {
                padding: 20px;
              }
            }
        `}
      </style>
      <Stack direction="column" spacing={4} width="100%">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography fontSize="20px" fontWeight="700">
              Dashboard
            </Typography>
            <IconButton color="primary" onClick={generatePDF}>
              <IconDownload size={16} />
            </IconButton>
          </Stack>
          <Box width={150}>
            <SelectOnlyYear
              value={year}
              onChange={(event: any) => setYear(event?.target?.value)}
            />
          </Box>
        </Stack>
        <Box className="print-container" ref={componentPdf}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <TotalGoodAsset year={year} />
            </Grid>
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
