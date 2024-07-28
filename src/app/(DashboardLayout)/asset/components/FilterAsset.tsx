import {
  Box,
  Button,
  Checkbox,
  Popover,
  Stack,
  Typography
} from '@mui/material';
import { IconChevronDown } from '@tabler/icons-react';
import React, { useState } from 'react';
import SelectCategory from '../create/components/shared/SelectCategory';
import SelectLocation from '../create/components/shared/SelectLocation';
import SelectStudyProgram from '../../location/shared/SelectStudyProgram';
import DatePickerRange from '../../year-quarter/shared/DateRangePicker';
import moment from 'moment';
import SelectYear from '../create/components/shared/SelectYear';

export default function FilterAsset({
  onSaveFilter
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
  const id = open ? 'simple-popover' : undefined;

  const [selectedYear, setSelectedYear] = useState<any>(null);
  const [range, setRange] = React.useState<[Date, Date]>();
  const [categoryId, setCategoryId] = useState<number>();
  const [locationId, setLocationId] = useState<number>();
  const [studyProgramId, setStudyProgramId] = useState<number>();
  const [checkedAll, setCheckedAll] = React.useState(false);
  const [checkedMandiri, setCheckedMandiri] = React.useState(false);
  const [checkedVendor, setCheckedVendor] = React.useState(false);
  const [checkedBaik, setCheckedBaik] = React.useState(false);
  const [checkedTw1, setCheckedTw1] = React.useState(false);
  const [checkedTw2, setCheckedTw2] = React.useState(false);
  const [checkedTw3, setCheckedTw3] = React.useState(false);
  const [checkedTw4, setCheckedTw4] = React.useState(false);

  const handleSetRange = (startDate: string, endDate: string) => {
    if (selectedYear) {
      setRange([new Date(startDate), new Date(endDate)]);
    }
  };

  const handleChangeRange = (value: any) => {
    setRange(value);
    setCheckedTw1(false);
    setCheckedTw2(false);
    setCheckedTw3(false);
    setCheckedTw4(false);
  };

  const handleChangeTw1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRange(undefined);
    setCheckedTw1(event.target.checked);
    setCheckedTw2(false);
    setCheckedTw3(false);
    setCheckedTw4(false);

    const startDate = selectedYear?.start_tw_1;
    const endDate = selectedYear?.end_tw_1;
    handleSetRange(startDate, endDate);
  };

  const handleChangeTw2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRange(undefined);
    setCheckedTw1(false);
    setCheckedTw2(event.target.checked);
    setCheckedTw3(false);
    setCheckedTw4(false);

    const startDate = selectedYear?.start_tw_2;
    const endDate = selectedYear?.end_tw_2;
    handleSetRange(startDate, endDate);
  };

  const handleChangeTw3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRange(undefined);
    setCheckedTw1(false);
    setCheckedTw2(false);
    setCheckedTw3(event.target.checked);
    setCheckedTw4(false);

    const startDate = selectedYear?.start_tw_3;
    const endDate = selectedYear?.end_tw_3;
    handleSetRange(startDate, endDate);
  };

  const handleChangeTw4 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRange(undefined);
    setCheckedTw1(false);
    setCheckedTw2(false);
    setCheckedTw3(false);
    setCheckedTw4(event.target.checked);

    const startDate = selectedYear?.start_tw_4;
    const endDate = selectedYear?.end_tw_4;
    handleSetRange(startDate, endDate);
  };

  const handleChangeYear = (value: any) => {
    setSelectedYear(value);
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
      setCheckedBaik(true);
    } else {
      setCheckedAll(event.target.checked);
      setCheckedMandiri(false);
      setCheckedVendor(false);
      setCheckedBaik(false);
    }
  };

  const getAssetImprovementType = () => {
    let assetImprovementType = Array<any>();
    if (checkedAll) {
      assetImprovementType = ['Baik', 'Perbaikan Mandiri', 'Perbaikan Vendor'];
    } else {
      if (checkedMandiri) {
        assetImprovementType.push('Perbaikan Mandiri');
      }

      if (checkedVendor) {
        assetImprovementType.push('Perbaikan Vendor');
      }

      if (checkedBaik) {
        assetImprovementType.push('Baik');
      }
    }

    return assetImprovementType;
  };

  const onSave = () => {
    const dateRange = range ? range : [];
    const assetImprovementType = getAssetImprovementType();

    const filtersData = {
      location_id: locationId ? locationId : '',
      category_id: categoryId ? categoryId : '',
      study_program_id: studyProgramId ? studyProgramId : '',
      asset_improvement_type:
        assetImprovementType.length > 0 ? assetImprovementType : [],
      start_date: dateRange[0]
        ? moment(new Date(dateRange[0])).format('YYYY-MM-DD')
        : '',
      end_date: dateRange[1]
        ? moment(new Date(dateRange[1])).format('YYYY-MM-DD')
        : '',
      year: selectedYear?.year
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
          vertical: 'bottom',
          horizontal: 'left'
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

                  <Typography fontWeight="600">Tahun</Typography>

                  <SelectYear
                    value={selectedYear}
                    onChange={(event: any) =>
                      handleChangeYear(event.target.value)
                    }
                  />

                  <Stack direction="row" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Checkbox
                        checked={checkedTw1}
                        onChange={handleChangeTw1}
                        aria-label="Checkbox TW 1"
                        size="small"
                        style={{ padding: 0 }}
                        disabled={
                          !selectedYear?.start_tw_1 && !selectedYear?.end_tw_1
                        }
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
                        disabled={
                          !selectedYear?.start_tw_2 && !selectedYear?.end_tw_2
                        }
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
                        disabled={
                          !selectedYear?.start_tw_3 && !selectedYear?.end_tw_3
                        }
                      />
                      <Typography fontWeight="400">TW 3</Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Checkbox
                        checked={checkedTw4}
                        onChange={handleChangeTw4}
                        aria-label="TW 4"
                        size="small"
                        style={{ padding: 0 }}
                        disabled={
                          !selectedYear?.start_tw_4 && !selectedYear?.end_tw_4
                        }
                      />
                      <Typography fontWeight="400">TW 4</Typography>
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
                    <Typography fontWeight="600">Status Aset</Typography>

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
                        checked={checkedBaik}
                        onChange={(event) =>
                          setCheckedBaik(event.target.checked)
                        }
                        aria-label="Baik"
                        size="small"
                        style={{ padding: 0 }}
                      />
                      <Typography fontWeight="400">Baik</Typography>
                    </Stack>

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
