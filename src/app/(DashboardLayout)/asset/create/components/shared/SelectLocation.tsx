import { getLocation } from "@/networks/libs/location";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

export default function SelectLocation({ ...rest }: SelectProps) {
  const firstRun = useRef(true);

  const [locations, setlocations] = useState([]);
  const fetchLocations = () => {
    const token = localStorage.getItem("token") || "";
    getLocation("false", token)
      .then((response) => {
        setlocations(response?.data?.result);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (firstRun.current) {
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
          {locations?.map((location: any) => (
            <MenuItem value={location?.id}>
              {location?.name} - {location?.study_program?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
