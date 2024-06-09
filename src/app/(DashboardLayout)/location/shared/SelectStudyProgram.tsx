import { getStudyProgram } from "@/networks/libs/studyProgram";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

export default function SelectStudyProgram({ ...rest }: SelectProps) {
  const firstRun = useRef(true);

  const [studyPrograms, setStudyPrograms] = useState([]);
  const fetchstudyProgram = () => {
    const token = localStorage.getItem("token") || "";
    getStudyProgram("false", token)
      .then((response) => {
        setStudyPrograms(response?.data?.result);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (firstRun.current) {
      fetchstudyProgram();
      firstRun.current = false;
    }
  }, []);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Program Studi</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Program Studi"
          {...rest}
        >
          {studyPrograms?.map((program: any) => (
            <MenuItem value={program?.id}>{program?.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
