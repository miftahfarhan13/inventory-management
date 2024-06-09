import React from "react";
import { Select, MenuItem, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TotalAssetLab = () => {
  return (
    <DashboardCard title="Jumlah Aset Laboratorium">
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <DashboardCard title="Prodi S1 Teknik Industri"></DashboardCard>
        </Grid>
        <Grid item xs={12} lg={4}>
          <DashboardCard title="Prodi S1 Teknik Logistik"></DashboardCard>
        </Grid>
        <Grid item xs={12} lg={4}>
          <DashboardCard title="Prodi S1 Sistem Informasi"></DashboardCard>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default TotalAssetLab;
