import { getCategories } from "@/networks/libs/category";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

export default function SelectCategory({ ...rest }: SelectProps) {
  const firstRun = useRef(true);

  const [categories, setcategories] = useState([]);
  const fetchcategories = () => {
    const token = localStorage.getItem("token") || "";
    getCategories("false", token)
      .then((response) => {
        setcategories(response?.data?.result);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (firstRun.current) {
      fetchcategories();
      firstRun.current = false;
    }
  }, []);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Kategori</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Kategori"
          {...rest}
        >
          <MenuItem>Pilih Kategori</MenuItem>
          {categories?.map((category: any) => (
            <MenuItem value={category?.id}>{category?.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
