import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { IconChevronDown } from '@tabler/icons-react';
import React, { useState } from 'react';
import moment from 'moment';
import DatePickerRange from '@/app/(DashboardLayout)/year-quarter/shared/DateRangePicker';
import SelectCategory from '@/app/(DashboardLayout)/asset/create/components/shared/SelectCategory';
import SelectLocation from '@/app/(DashboardLayout)/asset/create/components/shared/SelectLocation';
import SelectStudyProgram from '@/app/(DashboardLayout)/location/shared/SelectStudyProgram';
import { numberInputOnWheelPreventChange } from '@/utils/number';
import SelectYear from '@/app/(DashboardLayout)/asset/create/components/shared/SelectYear';

export default function FilterAssetLog({
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
  const [type, setType] = useState<string>();

  const [checkedAll, setCheckedAll] = React.useState(false);
  const [checkedSuccess, setcheckedSuccess] = React.useState(false);
  const [checkedFailed, setcheckedFailed] = React.useState(false);
  const [checkedWaiting, setcheckedWaiting] = React.useState(false);

  const [checkedTw1, setCheckedTw1] = React.useState(false);
  const [checkedTw2, setCheckedTw2] = React.useState(false);
  const [checkedTw3, setCheckedTw3] = React.useState(false);
  const [checkedTw4, setCheckedTw4] = React.useState(false);

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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
      setcheckedSuccess(true);
      setcheckedFailed(true);
      setcheckedWaiting(true);
    } else {
      setCheckedAll(event.target.checked);
      setcheckedSuccess(false);
      setcheckedFailed(false);
      setcheckedWaiting(false);
    }
  };

  const getStatus = () => {
    let status = Array<any>();
    if (checkedAll) {
      status = ['Menunggu Persetujuan', 'Setuju', 'Tolak'];
    } else {
      if (checkedWaiting) {
        status.push('Menunggu Persetujuan');
      }

      if (checkedSuccess) {
        status.push('Setuju');
      }

      if (checkedFailed) {
        status.push('Tolak');
      }
    }

    return status;
  };

  const onSave = () => {
    const dateRange = range ? range : [];
    const status = getStatus();

    const filtersData = {
      location_id: locationId ? locationId : '',
      category_id: categoryId ? categoryId : '',
      study_program_id: studyProgramId ? studyProgramId : '',
      status: status.length > 0 ? status : [],
      start_date: dateRange[0]
        ? moment(new Date(dateRange[0])).format('YYYY-MM-DD')
        : '',
      end_date: dateRange[1]
        ? moment(new Date(dateRange[1])).format('YYYY-MM-DD')
        : '',
      type: type ? type : '',
      price_start: minPrice ? minPrice : '',
      price_end: maxPrice ? maxPrice : ''
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
                minWidth="300px"
                maxWidth="300px"
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

              <Stack direction="column" spacing={2}>
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
                      <Typography fontWeight="600">Status</Typography>

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
                          checked={checkedWaiting}
                          onChange={(event) =>
                            setcheckedWaiting(event.target.checked)
                          }
                          aria-label="Checkbox Menunggu Persetujuan"
                          size="small"
                          style={{ padding: 0 }}
                        />
                        <Typography fontWeight="400">
                          Menunggu Persetujuan
                        </Typography>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Checkbox
                          checked={checkedSuccess}
                          onChange={(event) =>
                            setcheckedSuccess(event.target.checked)
                          }
                          aria-label="Checkbox Setuju"
                          size="small"
                          style={{ padding: 0 }}
                        />
                        <Typography fontWeight="400">Setuju</Typography>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Checkbox
                          checked={checkedFailed}
                          onChange={(event) =>
                            setcheckedFailed(event.target.checked)
                          }
                          aria-label="Checkbox Tolak"
                          size="small"
                          style={{ padding: 0 }}
                        />
                        <Typography fontWeight="400">Tolak</Typography>
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
                      <Typography fontWeight="600">Rentang Biaya</Typography>
                    </Stack>

                    <Stack direction="column" spacing={2}>
                      <TextField
                        type="number"
                        fullWidth
                        placeholder="Min Biaya Perbaikan"
                        required
                        InputProps={{
                          startAdornment: <Typography mr={1}>Rp</Typography>
                        }}
                        onWheel={numberInputOnWheelPreventChange}
                        value={minPrice}
                        onChange={(event) => setMinPrice(event.target.value)}
                      />
                      <TextField
                        type="number"
                        fullWidth
                        placeholder="Max Biaya Perbaikan"
                        required
                        InputProps={{
                          startAdornment: <Typography mr={1}>Rp</Typography>
                        }}
                        onWheel={numberInputOnWheelPreventChange}
                        value={maxPrice}
                        onChange={(event) => setMaxPrice(event.target.value)}
                      />
                    </Stack>
                  </Stack>
                </Box>
              </Stack>

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

                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Jenis Perbaikan
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Jenis Perbaikan"
                      name="type"
                      required
                      value={type}
                      onChange={(event) => setType(event.target.value)}
                    >
                      <MenuItem>Pilih Jenis Perbaikan</MenuItem>
                      <MenuItem value="Baik">Baik</MenuItem>
                      <MenuItem value="Perbaikan Mandiri">
                        Perbaikan Mandiri
                      </MenuItem>
                      <MenuItem value="Perbaikan Vendor">
                        Perbaikan Vendor
                      </MenuItem>
                    </Select>
                  </FormControl>
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
