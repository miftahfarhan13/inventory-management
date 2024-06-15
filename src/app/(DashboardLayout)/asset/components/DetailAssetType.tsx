import {
  Button,
  Chip,
  IconButton,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { IconEye } from "@tabler/icons-react";
import React from "react";

export default function DetailAssetType({
  assetImprovements,
}: {
  assetImprovements: any;
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

  function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number
  ) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];

  return (
    <div>
      <IconButton
        color="inherit"
        aria-label="menu"
        aria-describedby={id}
        onClick={handleClick}
      >
        <IconEye width="20" height="20" />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Waktu Cek</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assetImprovements?.map((improve: any, index: number) => (
              <TableRow
                key={index + 1}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="right">
                  <Chip
                    sx={{
                      px: "4px",
                      backgroundColor:
                        improve?.type === "Baik"
                          ? "success.main"
                          : "error.main",
                      color: "#fff",
                    }}
                    size="small"
                    label={improve?.type}
                  ></Chip>
                </TableCell>
                <TableCell align="right">
                  {improve?.actual_repair_end_date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Popover>
    </div>
  );
}
