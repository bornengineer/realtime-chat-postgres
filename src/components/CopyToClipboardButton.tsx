import ContentCopyIcon from "@mui/icons-material/ContentCopy";
const CopyToClipboardButton = (props: { text: string }) => {
  const { text } = props;
  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard:", text);
      })
      .catch((err) => {
        console.error("Unable to copy text to clipboard", err);
      });
  };

  return (
    <ContentCopyIcon
      style={{ fontSize: "16px", cursor: "pointer" }}
      onClick={handleCopyClick}
    />
  );
};

export default CopyToClipboardButton;
