'use client';
import { Breadcrumbs, Skeleton, Stack, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useRef, useState } from 'react';
import { getAsset } from '@/networks/libs/asset';
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DetailAssetComponent from '../components/DetailAssetComponent';

const DetailAsset = () => {
  const { id } = useParams();
  const firstRun = useRef(true);
  const [asset, setAsset] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const fetchAsset = () => {
    const token = localStorage.getItem('token') || '';
    setIsLoading(true);
    getAsset(id.toString(), token)
      .then((response) => {
        setAsset(response?.data?.result);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (firstRun.current) {
      fetchAsset();
      firstRun.current = false;
    }
  }, []);

  const breadcrumbs = [
    <Link key="1" href="/asset">
      List Aset
    </Link>,
    <Typography key="2" color="text.primary">
      Detail Aset
    </Typography>
  ];

  return (
    <PageContainer title="Detail Aset" description="Detail Aset">
      <DashboardCard title="Detail Aset">
        <Stack direction="column" spacing={2}>
          <Breadcrumbs
            separator={<IconChevronRight fontSize="small" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>

          {isLoading ? (
            <>
              <Skeleton width="100%" height="400px" />
            </>
          ) : (
            <>
              <DetailAssetComponent asset={asset} />
            </>
          )}
        </Stack>
      </DashboardCard>
    </PageContainer>
  );
};

export default DetailAsset;
