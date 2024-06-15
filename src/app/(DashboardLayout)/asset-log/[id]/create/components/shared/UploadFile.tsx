import React, { useEffect, useRef, useState } from "react";
import * as imageConversion from "image-conversion";
import { fetchImageFile } from "@/networks/libs/file";
import { ISnackbar } from "@/utils/interface/snackbar";
import {
  Box,
  Button,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { IconCloudUpload, IconX } from "@tabler/icons-react";
import SnackbarAlert from "@/app/(DashboardLayout)/components/shared/SnackbarAlert";
import { truncate } from "@/utils/string";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function UploadFile({
  url,
  onChangeValue,
}: {
  url: string;
  onChangeValue: (value: string) => void;
}) {
  const fileUpload = useRef(null);
  const [fileToUpload, setFileToUpload] = useState(url);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<ISnackbar>({
    isOpen: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    if (url) {
      setFileToUpload(url);
    }
  }, [url]);

  const uploadProfilePic = async () => {
    setIsLoading(true);
    // @ts-ignore
    const file = fileUpload.current.files[0];
    const convert = await imageConversion.compressAccurately(file, 500);
    const new_file = new File([convert], file.name, { type: convert.type });
    onUploadFile(new_file);
  };

  const onUploadFile = async (file: any) => {
    const form = new FormData();
    form.append("file", file);

    await fetchImageFile(localStorage.getItem("token") || "", form)
      .then((response) => {
        setIsLoading(false);
        setSnackbar({
          isOpen: true,
          message: "Berhasil mengupload file!",
          severity: "success",
        });

        setFileToUpload(response.data.result);
        onChangeValue(response.data.result);
        // onFinishUploadFile(response.data)
      })
      .catch((error) => {
        setIsLoading(false);
        const message = error?.response?.data?.message
          ? error?.response?.data?.message
          : error?.message;
        setSnackbar({
          isOpen: true,
          message: message,
          severity: "error",
        });
      });
  };

  return (
    <Box width="100%">
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
      <Stack direction="column" alignItems="center" spacing={1}>
        {fileToUpload ? (
          <>
            <Box
              border="1px solid rgba(140, 140, 140, 0.2)"
              borderRadius="8px"
              padding="16px"
              width="100%"
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <a href={url} target="_blank">
                  <Typography>{truncate(url, 28)}</Typography>
                </a>
                {fileToUpload && (
                  <Box
                    bgcolor="white"
                    sx={{ boxShadow: "2", cursor: "pointer" }}
                    width={20}
                    height={20}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="100%"
                    onClick={() => setFileToUpload("")}
                  >
                    <IconX size={14} />
                  </Box>
                )}
              </Stack>
            </Box>
          </>
        ) : (
          <>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<IconCloudUpload />}
            >
              Upload file
              <VisuallyHiddenInput
                onChange={() => uploadProfilePic()}
                ref={fileUpload}
                type="file"
              />
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
}

export default UploadFile;
