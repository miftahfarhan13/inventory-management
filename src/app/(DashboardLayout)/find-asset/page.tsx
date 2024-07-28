'use client';
import { Box, Skeleton, Stack, TextField, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import { getAssetByUid } from '@/networks/libs/asset';
import { useRouter, useSearchParams } from 'next/navigation';
import DetailAssetComponent from '../asset/components/DetailAssetComponent';
import { IconX } from '@tabler/icons-react';
import { StyledIconButton } from '../asset/create/components/shared/StyledIconButton';
import SnackbarAlert from '../components/shared/SnackbarAlert';
import { ISnackbar } from '@/utils/interface/snackbar';

const Asset = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid');

  const [snackbar, setSnackbar] = useState<ISnackbar>({
    isOpen: false,
    message: '',
    severity: 'info'
  });
  const [assetUid, setAssetUid] = useState(uid);
  const [asset, setAsset] = useState<any>();

  const [isLoading, setIsLoading] = useState(false);
  const fetchAsset = (assetUid: string) => {
    const token = localStorage.getItem('token') || '';
    setIsLoading(true);
    getAssetByUid(assetUid, token)
      .then((response) => {
        const result = response?.data?.result;
        if (result) {
          setAsset(result);
        } else {
          setSnackbar({
            isOpen: true,
            message: 'Aset tidak ditemukan',
            severity: 'error'
          });
        }

        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (uid) {
      fetchAsset(uid);
      setAssetUid(uid);
    }
  }, [uid]);

  const handleClearSearch = () => {
    router.push('/find-asset');
    setAsset(null);
    setAssetUid('');
  };

  return (
    <PageContainer title="Cari Aset" description="Aset">
      <DashboardCard title="Cari Aset">
        <Stack direction="column" spacing={2} alignItems="center" width="100%">
          <SnackbarAlert
            message={snackbar.message}
            severity={snackbar.severity}
            open={snackbar.isOpen}
            onClose={() =>
              setSnackbar((prev) => {
                return {
                  ...prev,
                  isOpen: false
                };
              })
            }
          />
          <form
            style={{ width: '100%' }}
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();

              router.push(`/find-asset?uid=${assetUid}`);
            }}
          >
            <Stack
              direction="column"
              spacing={2}
              alignItems="center"
              width="100%"
            >
              <Typography fontWeight="700">
                Masukan UID atau Scan Tag RFID
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                width="100%"
              >
                <TextField
                  fullWidth
                  size="small"
                  label="Masukan UID atau Scan Tag RFID"
                  placeholder="Masukan UID atau Scan Tag RFID"
                  name="uid"
                  value={assetUid}
                  onChange={(event) => setAssetUid(event.target.value)}
                />

                <StyledIconButton
                  color="default"
                  variant="outlined"
                  size="small"
                  onClick={handleClearSearch}
                >
                  <IconX width="20" height="20" />
                </StyledIconButton>
              </Stack>
            </Stack>
          </form>

          <Box width="100%">
            {isLoading ? (
              <>
                <Skeleton width="100%" height="500px" />
              </>
            ) : (
              <>
                {asset && assetUid && <DetailAssetComponent asset={asset} />}
                {/* {!asset && assetUid && (
                  <Box bgcolor="#F2F6FA" p="10px" borderRadius="10px">
                    <Typography textAlign="center" fontWeight="700">
                      Aset tidak ditemukan
                    </Typography>
                  </Box>
                )} */}
              </>
            )}
          </Box>
        </Stack>
      </DashboardCard>
    </PageContainer>
  );
};

export default Asset;
