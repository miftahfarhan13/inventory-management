"use client";
import { Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
// import SalesOverview from "@/app/(DashboardLayout)/components/dashboard/SalesOverview";
// import YearlyBreakup from "@/app/(DashboardLayout)/components/dashboard/YearlyBreakup";
// import RecentTransactions from "@/app/(DashboardLayout)/components/dashboard/RecentTransactions";
// import ProductPerformance from "@/app/(DashboardLayout)/components/dashboard/ProductPerformance";
// import Blog from "@/app/(DashboardLayout)/components/dashboard/Blog";
// import MonthlyEarnings from "@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings";
import useIsAuth from "@/utils/hooks/isAuth";
// import TotalAssetLab from "./components/dashboard/TotalAssetLab";
import TotalAsset from "./components/dashboard/TotalAsset";
import AverageSuccessLog from "./components/dashboard/AverageSuccessLog";
import TotalImprovementPrice from "./components/dashboard/TotalImprovementPrice";
import PercentageStatusLog from "./components/dashboard/PercentageStatusLog";
import DashboardWadek from "./components/dashboard/DashboardWadek/DashboardWadek";

const Dashboard = () => {
  const { me } = useIsAuth();
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        {me?.role === "admin-1" && <DashboardWadek />}
        {/* <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <TotalAsset />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Stack direction="column" spacing={4}>
              <AverageSuccessLog />
              <TotalImprovementPrice />
              <PercentageStatusLog />
            </Stack>
          </Grid>
        </Grid> */}
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
