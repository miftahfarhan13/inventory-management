import { getLocation } from '@/networks/libs/location';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

export default function SelectLocation({ ...rest }: SelectProps) {
  const firstRun = useRef(true);

  const [locations, setlocations] = useState([]);
  const fetchLocations = () => {
    const token = localStorage.getItem('token') || '';
    getLocation('false', token)
      .then((response) => {
        setlocations(response?.data?.result);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (firstRun.current && locations?.length === 0) {
      fetchLocations();
      firstRun.current = false;
    }
  }, []);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Lokasi</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Lokasi"
          {...rest}
        >
          <MenuItem>Pilih Lokasi</MenuItem>
          {locations?.map((location: any, index: number) => (
            <MenuItem key={index} value={location?.id}>
              {location?.name} - {location?.study_program?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
