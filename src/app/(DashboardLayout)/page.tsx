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
import DashboardWadek from "./components/dashboard/DashboardWadek/DashboardWadek";
import DashboardKaur from "./components/dashboard/DashboardKaur/DashboardKaur";
import DashboardLaboran from "./components/dashboard/DashboardLaboran/DashboardLaboran";

const Dashboard = () => {
  const { me } = useIsAuth();
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        {me?.role === "admin-1" && <DashboardWadek />}
        {me?.role === "admin-2" && <DashboardKaur />}
        {me?.role === "user" && <DashboardLaboran />}

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
