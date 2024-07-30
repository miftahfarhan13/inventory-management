import { getLinks } from '@/networks/libs/links';
import {
  Box,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import LinkItem from './LinkItem';

export default function Links() {
  const firstRun = useRef(true);

  const [links, setLinks] = useState<Array<any>>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchLinks = () => {
    const token = localStorage.getItem('token') || '';
    setIsLoading(true);
    getLinks(token)
      .then((response) => {
        setLinks(response?.data?.result);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (firstRun.current) {
      fetchLinks();
      firstRun.current = false;
    }
  }, []);
  return (
    <>
      {isLoading ? (
        <>
          <Skeleton width="100%" height="200px" />
        </>
      ) : (
        <>
          <Stack direction="column" spacing={1}>
            {links?.map((link: any) => (
              <LinkItem link={link} />
            ))}
          </Stack>
        </>
      )}
    </>
  );
}
