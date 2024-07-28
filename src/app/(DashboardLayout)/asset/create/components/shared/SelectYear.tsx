import { getYearQuarter } from '@/networks/libs/yearQuarter';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

export default function SelectYear({
  value,
  onChange
}: {
  value: any;
  onChange: any;
}) {
  const firstRun = useRef(true);

  const [yearQuarter, setyearQuarter] = useState<any>();
  const fetchyearQuarter = () => {
    const token = localStorage.getItem('token') || '';
    getYearQuarter('false', token)
      .then((response) => {
        setyearQuarter(response?.data?.result);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (firstRun.current && !yearQuarter) {
      fetchyearQuarter();
      firstRun.current = false;
    }
  }, []);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Tahun</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Tahun"
          value={value}
          onChange={onChange}
        >
          <MenuItem>Pilih Tahun</MenuItem>
          {yearQuarter?.map((year: any, index: number) => (
            <MenuItem key={index} value={year}>
              {year?.year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
