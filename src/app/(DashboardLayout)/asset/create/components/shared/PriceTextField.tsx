import React from "react";
import {
  TextField,
  Typography,
  InputAdornment,
  TextFieldProps,
} from "@mui/material";

interface NumberFormatCustomProps {
  inputRef: (instance: HTMLInputElement | null) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

const NumberFormatCustom = React.forwardRef<
  HTMLInputElement,
  NumberFormatCustomProps
>(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const formattedValue = value.replace(/\D/g, ""); // Remove non-numeric characters
    onChange({
      target: {
        name: props.name,
        value: formattedValue,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <input
      {...other}
      ref={ref}
      onChange={handleChange}
      type="text"
      inputMode="numeric"
      pattern="\d*"
    />
  );
});

const PriceTextField: React.FC<TextFieldProps> = (props) => {
  return (
    <TextField
      fullWidth
      placeholder="Nilai Pembelian"
      required
      InputProps={{
        startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
        inputComponent: NumberFormatCustom as any,
      }}
      {...props}
    />
  );
};

export default PriceTextField;
