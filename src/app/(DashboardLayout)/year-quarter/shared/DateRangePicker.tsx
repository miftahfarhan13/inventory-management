import React from "react";
import Box from "@mui/material/Box";
import { DateRangePicker } from "rsuite";
import "rsuite/DateRangePicker/styles/index.css";

function DatePickerRange({
  value,
  onChange,
  placeholder,
  allowedRangeStart,
  allowedRangeEnd,
  disabled,
}: {
  value: [Date, Date] | undefined;
  onChange: (event: any) => void;
  placeholder: string;
  allowedRangeStart?: string | Date;
  allowedRangeEnd?: string | Date;
  disabled?: boolean;
}) {
  const { allowedRange } = DateRangePicker;
  return (
    <Box>
      <DateRangePicker
        format="dd MMMM yyyy"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event)}
        size="lg"
        style={{ zIndex: "100", position: "relative", width: "100%" }}
        placement="auto"
        disabled={disabled}
        shouldDisableDate={allowedRange(
          allowedRangeStart || "",
          allowedRangeEnd || ""
        )}
        // shouldDisableDate={allowedRange("2024-01-01", "2024-12-31")}
      />
    </Box>
  );
}

export default DatePickerRange;
