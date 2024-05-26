"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IconButton, Stack, TextField, Tooltip } from "@mui/material";
import checkEmail from "@/utils/checkEmail";
import CopyToClipboardButton from "./CopyToClipboardButton";
import shareApp from "@/services/shareApp";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: "3rem 2rem",
  gap: 2,
};

export default function ShareModal({
  shareModal,
  handleClose,
  inviter,
}: {
  shareModal: boolean;
  handleClose: () => void;
  inviter: string;
}) {
  const [email, setEmail] = React.useState("");
  const [textFieldError, setTextFieldError] = React.useState("");

  React.useEffect(() => {
    if (!checkEmail(email) && email) {
      setTextFieldError("Please use a valid email");
      return;
    } else {
      setTextFieldError("");
    }
  }, [email]);

  return (
    <div>
      <Modal
        open={shareModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Stack sx={style}>
          <IconButton
            onClick={handleClose}
            sx={{
              width: "40px",
              height: "40px",
              position: "absolute",
              top: "15px",
              right: "15px",
            }}
          >
            &times;
          </IconButton>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Share with your friends
            </Typography>
          </Stack>
          <TextField
            label={"Email to share with"}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            error={!!textFieldError}
            helperText={textFieldError}
          />
          <Stack direction={"row"} justifyContent={"space-between"} gap={2}>
            <Button
              variant="contained"
              onClick={() =>
                shareApp({
                  email,
                  handleClose,
                  url: window.location.hostname,
                  inviter,
                })
              }
              fullWidth
            >
              Share
            </Button>
            <Tooltip title="Copy url to App">
              <IconButton
                sx={{
                  backgroundColor: "primary.main",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    color: "black",
                  },
                  color: "white",
                  width: "40px",
                  height: "40px",
                  fontSize: "18px",
                }}
              >
                <CopyToClipboardButton text={window.location.hostname} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Modal>
    </div>
  );
}
