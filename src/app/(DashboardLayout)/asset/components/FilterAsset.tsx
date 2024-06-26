import {
  Box,
  Button,
  Checkbox,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { IconChevronDown } from "@tabler/icons-react";
import React, { useState } from "react";
import SelectCategory from "../create/components/shared/SelectCategory";
import SelectLocation from "../create/components/shared/SelectLocation";
import SelectStudyProgram from "../../location/shared/SelectStudyProgram";
import DatePickerRange from "../../year-quarter/shared/DateRangePicker";
import moment from "moment";

export default function FilterAsset({
  onSaveFilter,
}: {
  onSaveFilter: (value: any) => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [range, setRange] = React.useState<[Date, Date]>();
  const [categoryId, setCategoryId] = useState<number>();
  const [locationId, setLocationId] = useState<number>();
  const [studyProgramId, setStudyProgramId] = useState<number>();
  const [checkedAll, setCheckedAll] = React.useState(false);
  const [checkedMandiri, setCheckedMandiri] = React.useState(false);
  const [checkedVendor, setCheckedVendor] = React.useState(false);
  const [checkedPeremajaan, setCheckedPeremajaan] = React.useState(false);
  const [checkedTw1, setCheckedTw1] = React.useState(false);
  const [checkedTw2, setCheckedTw2] = React.useState(false);
  const [checkedTw3, setCheckedTw3] = React.useState(false);

  const handleChangeRange = (value: any) => {
    setRange(value);
    setCheckedTw1(false);
    setCheckedTw2(false);
    setCheckedTw3(false);
  };

  const handleChangeTw1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRange(undefined);
    setCheckedTw1(event.target.checked);
    setCheckedTw2(false);
    setCheckedTw3(false);
  };

  const handleChangeTw2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRange(undefined);
    setCheckedTw1(false);
    setCheckedTw2(event.target.checked);
    setCheckedTw3(false);
  };

  const handleChangeTw3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRange(undefined);
    setCheckedTw1(false);
    setCheckedTw2(false);
    setCheckedTw3(event.target.checked);
  };

  const handleChangeCategoryId = (value: any) => {
    setCategoryId(parseInt(value));
  };

  const handleChangeLocationId = (value: any) => {
    setLocationId(parseInt(value));
  };

  const handleChangeStudyProgramId = (value: any) => {
    setStudyProgramId(parseInt(value));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setCheckedAll(event.target.checked);
      setCheckedMandiri(true);
      setCheckedVendor(true);
      setCheckedPeremajaan(true);
    } else {
      setCheckedAll(event.target.checked);
      setCheckedMandiri(false);
      setCheckedVendor(false);
      setCheckedPeremajaan(false);
    }
  };

  const onSave = () => {
    const dateRange = range ? range : [];
    let assetImprovementType = Array<any>();
    if (checkedAll) {
      assetImprovementType = [
        "Perbaikan Mandiri",
        "Perbaikan Vendor",
        "Peremajaan",
      ];
    } else {
      if (checkedMandiri) {
        assetImprovementType.push("Perbaikan Mandiri");
      }

      if (checkedVendor) {
        assetImprovementType.push("Perbaikan Vendor");
      }

      if (checkedPeremajaan) {
        assetImprovementType.push("Peremajaan");
      }
    }

    const filtersData = {
      location_id: locationId ? locationId : "",
      category_id: categoryId ? categoryId : "",
      study_program_id: studyProgramId ? studyProgramId : "",
      asset_improvement_type:
        assetImprovementType.length > 0 ? assetImprovementType : [],
      is_tw_1: checkedTw1 ? checkedTw1 : "",
      is_tw_2: checkedTw2 ? checkedTw2 : "",
      is_tw_3: checkedTw3 ? checkedTw3 : "",
      start_date: dateRange[0]
        ? moment(new Date(dateRange[0])).format("YYYY-MM-DD")
        : "",
      end_date: dateRange[1]
        ? moment(new Date(dateRange[1])).format("YYYY-MM-DD")
        : "",
    };

    onSaveFilter(filtersData);
    handleClose();
  };

  return (
    <div>
      <Button
        aria-describedby={id}
        variant="outlined"
        onClick={handleClick}
        endIcon={<IconChevronDown size="16" />}
      >
        Filter
      </Button>
      <Popover
        style={{ zIndex: 5 }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box p="20px">
          <Stack direction="column" spacing={2}>
            <Typography fontWeight="700">Filter</Typography>

            <Stack direction="row" spacing={2}>
              <Box
                borderRadius="10px"
                padding="10px"
                border="2px solid #AEAEAE"
                minWidth="200px"
              >
                <Stack direction="column" spacing={2}>
                  <Typography fontWeight="600">Waktu Cek</Typography>

                  <DatePickerRange
                    value={range}
                    onChange={(value) => handleChangeRange(value)}
                    placeholder="Rentang Waktu"
                  />

                  <Stack direction="row" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Checkbox
                        checked={checkedTw1}
                        onChange={handleChangeTw1}
                        aria-label="Checkbox TW 1"
                        size="small"
                        style={{ padding: 0 }}
                      />
                      <Typography fontWeight="400">TW 1</Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Checkbox
                        checked={checkedTw2}
                        onChange={handleChangeTw2}
                        aria-label="Checkbox TW 2"
                        size="small"
                        style={{ padding: 0 }}
                      />
                      <Typography fontWeight="400">TW 2</Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Checkbox
                        checked={checkedTw3}
                        onChange={handleChangeTw3}
                        aria-label="TW 3"
                        size="small"
                        style={{ padding: 0 }}
                      />
                      <Typography fontWeight="400">TW 3</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>

              <Box
                borderRadius="10px"
                padding="10px"
                border="2px solid #AEAEAE"
                minWidth="200px"
              >
                <Stack direction="column" spacing={2}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography fontWeight="600">Kondisi Aset</Typography>

                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Typography fontWeight="400">All</Typography>
                      <Checkbox
                        checked={checkedAll}
                        onChange={handleChange}
                        aria-label="Checkbox All"
                        size="small"
                        style={{ padding: 0 }}
                      />
                    </Stack>
                  </Stack>

                  <Stack direction="column" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Checkbox
                        checked={checkedMandiri}
                        onChange={(event) =>
                          setCheckedMandiri(event.target.checked)
                        }
                        aria-label="Checkbox Perbaikan Mandiri"
                        size="small"
                        style={{ padding: 0 }}
                      />
                      <Typography fontWeight="400">
                        Perbaikan Mandiri
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Checkbox
                        checked={checkedVendor}
                        onChange={(event) =>
                          setCheckedVendor(event.target.checked)
                        }
                        aria-label="Checkbox Vendor"
                        size="small"
                        style={{ padding: 0 }}
                      />
                      <Typography fontWeight="400">Perbaikan Vendor</Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Checkbox
                        checked={checkedPeremajaan}
                        onChange={(event) =>
                          setCheckedPeremajaan(event.target.checked)
                        }
                        aria-label="Peremajaan"
                        size="small"
                        style={{ padding: 0 }}
                      />
                      <Typography fontWeight="400">Peremajaan</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>

              <Box
                borderRadius="10px"
                padding="10px"
                border="2px solid #AEAEAE"
                minWidth="200px"
              >
                <Stack direction="column" spacing={2}>
                  <Typography fontWeight="600">Karakteristik</Typography>

                  <SelectCategory
                    value={categoryId}
                    onChange={(event) =>
                      handleChangeCategoryId(event.target.value)
                    }
                  />

                  <SelectLocation
                    value={locationId}
                    onChange={(event) =>
                      handleChangeLocationId(event.target.value)
                    }
                  />

                  <SelectStudyProgram
                    value={studyProgramId}
                    onChange={(event) =>
                      handleChangeStudyProgramId(event.target.value)
                    }
                  />
                </Stack>
              </Box>
            </Stack>

            <Box alignSelf="end">
              <Button variant="contained" onClick={onSave}>
                Simpan & Cari
              </Button>
            </Box>
          </Stack>
        </Box>
      </Popover>
    </div>
  );
}
