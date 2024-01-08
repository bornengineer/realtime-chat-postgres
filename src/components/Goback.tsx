import Link from "next/link";
import React from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Button, Typography } from "@mui/material";

const Goback = (props: { text: string }) => {
  return (
    <Link href="/">
      <Button
        variant="outlined"
        sx={{
          py: 1.5,
          ml: -1.5,
          transform: "scale(0.8)",
          borderRadius: "8px",
        }}
        startIcon={<ArrowBackIosNewIcon fontSize="small" />}
      >
        <Typography variant="body2" fontWeight={"bold"} textTransform={"none"}>
          {props.text}
        </Typography>
      </Button>
    </Link>
  );
};

export default Goback;
