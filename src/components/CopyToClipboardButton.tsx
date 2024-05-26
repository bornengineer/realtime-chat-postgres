import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import { IconButton, Stack, SxProps } from "@mui/material";
import { useState } from "react";

const CopyToClipboardButton = ({
  text,
  customCss = {},
}: {
  text: string;
  customCss?: SxProps;
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard:", text);
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 500);
      })
      .catch((err) => {
        console.error("Unable to copy text to clipboard", err);
      });
  };

  return (
    <IconButton sx={customCss} onClick={!isCopied ? handleCopyClick : () => {}}>
      {!isCopied ? (
        <ContentCopyIcon style={{ fontSize: "13px", cursor: "pointer" }} />
      ) : (
        <LibraryAddCheckIcon style={{ fontSize: "13px", cursor: "pointer" }} />
      )}
    </IconButton>
  );
};

export default CopyToClipboardButton;
