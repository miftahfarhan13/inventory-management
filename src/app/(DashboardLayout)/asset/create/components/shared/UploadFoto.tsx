import React, { useEffect, useRef, useState } from "react";
import * as imageConversion from "image-conversion";
import { fetchImageUpload } from "@/networks/libs/file";
import { ISnackbar } from "@/utils/interface/snackbar";
import { Box, Button, Skeleton, Stack, styled } from "@mui/material";
import { IconCloudUpload, IconX } from "@tabler/icons-react";
import SnackbarAlert from "@/app/(DashboardLayout)/components/shared/SnackbarAlert";

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

function UploadFoto({
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
    if (
      new_file["type"] === "image/jpeg" ||
      new_file["type"] === "image/png" ||
      new_file["type"] === "image/jpg"
    ) {
      onUploadFile(new_file);
    } else {
      setSnackbar({
        isOpen: true,
        message:
          "Gagal mengupload foto. Format foto harus berupa jpeg, png, jpg.",
        severity: "error",
      });

      setIsLoading(false);
    }
  };

  const onUploadFile = async (file: any) => {
    const form = new FormData();
    form.append("file", file);

    await fetchImageUpload(localStorage.getItem("token") || "", form)
      .then((response) => {
        setIsLoading(false);
        setSnackbar({
          isOpen: true,
          message: "Berhasil mengupload foto!",
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
        <Box position="relative">
          <Box
            border="1px solid rgba(140, 140, 140, 0.2)"
            borderRadius="8px"
            padding="16px"
          >
            {isLoading ? (
              <Skeleton variant="rounded" width={300} height={200} />
            ) : (
              <img
                height={200}
                width={300}
                src={fileToUpload || "/images/default-image.jpeg"}
                alt="Foto Menu"
                style={{ objectFit: "contain" }}
              ></img>
            )}
          </Box>

          {fileToUpload && (
            <Box
              bgcolor="white"
              position="absolute"
              top={-10}
              right={-10}
              sx={{ boxShadow: "2", cursor: "pointer" }}
              width={30}
              height={30}
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="100%"
              onClick={() => setFileToUpload("")}
            >
              <IconX />
            </Box>
          )}
        </Box>

        {!fileToUpload && (
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
        )}
      </Stack>
    </Box>
  );
}

export default UploadFoto;
