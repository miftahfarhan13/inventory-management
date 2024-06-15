import SnackbarAlert from "@/app/(DashboardLayout)/components/shared/SnackbarAlert";
import { fetchUpdateAssetImprovementApproval } from "@/networks/libs/assetImprovements";
import { showAlertConfirmation } from "@/utils/function";
import { ISnackbar } from "@/utils/interface/snackbar";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ModalApprove({ id }: { id: number }) {
  const router = useRouter();
  const [approve, setApprove] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [snackbar, setSnackbar] = useState<ISnackbar>({
    isOpen: false,
    message: "",
    severity: "info",
  });

  const onUpdateStatus = async (status: string) => {
    setIsLoading(true);
    const token = localStorage.getItem("token") || "";
    await fetchUpdateAssetImprovementApproval(
      token,
      {
        status,
      },
      id.toString()
    )
      .then((response) => {
        setIsLoading(false);
        setSnackbar({
          isOpen: true,
          message: "Berhasil mengubah status Perbaikan Aset!",
          severity: "success",
        });
        router.refresh();
      })
      .catch((error) => {
        const message = error?.response?.data?.message
          ? error?.response?.data?.message
          : error?.message;
        setIsLoading(false);
        setSnackbar({
          isOpen: true,
          message: message,
          severity: "error",
        });
      });
  };

  const handleChangeApprove = (value: string) => {
    showAlertConfirmation(
      "Apakah anda yakin ingin mengubah status persetujuan?",
      (confirmed: any) => {
        if (confirmed) {
          setApprove(value);
          onUpdateStatus(value);
        } else {
          console.log("Canceled");
        }
      }
    );
  };

  return (
    <>
      <SnackbarAlert
        message={snackbar.message}
        severity={snackbar.severity}
        open={snackbar.isOpen}
        onClose={() =>
          setSnackbar((prev) => {
            return {
              ...prev,
              isOpen: false,
            };
          })
        }
      />
      <FormControl style={{ minWidth: "130px" }}>
        <InputLabel id="demo-simple-select-label" size="small">
          Persetujuan
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={approve}
          label="Persetujuan"
          size="small"
          onChange={(event) => handleChangeApprove(event.target.value)}
        >
          <MenuItem value="Sukses">Sukses</MenuItem>
          <MenuItem value="Gagal">Gagal</MenuItem>
        </Select>
      </FormControl>
    </>
  );
}
