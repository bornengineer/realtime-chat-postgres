"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import checkEmail from "@/utils/checkEmail";

type Fields = "email" | "password" | "username";
interface User {
  email: string;
  password: string;
  username: string;
}

const fields: Fields[] = ["username", "email", "password"];

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
    username: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [textFieldError, setTextFieldError] = useState("");

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.username.length > 0 &&
      user.password.length > 0
    )
      setButtonDisabled(false);
    else setButtonDisabled(true);

    if (!checkEmail(user.email) && user.email) {
      setTextFieldError("Please use a valid email");
      setButtonDisabled(true);
      return;
    } else {
      setTextFieldError("");
    }
  }, [user]);

  const onSignup = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/users/signup", user);
      if (res.status === 200) {
        console.log("Signup success :", res.data);
        setUser({
          email: "",
          password: "",
          username: "",
        });
        const toastId = toast.success(res.data.message);
        setTimeout(() => {
          toast.remove(toastId);
          router.push("/login");
        }, 1500);
      }

      if (res.status === 202) {
        toast.error(res.data.error);
      }
    } catch (err: any) {
      console.log("Signup failed :", err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !buttonDisabled) {
      event.preventDefault();
      onSignup();
    }
  };

  return (
    <>
      {/* TODO make this component generic */}
      <Toaster />
      <Stack
        sx={{
          border: "1px solid #7170704a",
          borderRadius: 3,
          background: "#FFF",
          px: 5,
          pt: 4,
          pb: 6,
        }}
      >
        <Typography fontWeight={"bold"} textAlign={"center"} variant="h5">
          Signup
        </Typography>
        <Divider sx={{ mt: 2, mb: 4 }} />
        <Stack sx={{ justifyContent: "center", gap: 2 }}>
          {fields.map((field: Fields, index) => (
            <Stack gap={0.5} key={index}>
              <TextField
                sx={{ textTransform: "capitalize" }}
                id={field}
                type={field}
                label={field}
                value={user[field]}
                onChange={(e) => setUser({ ...user, [field]: e.target.value })}
                onKeyDown={handleKeyDown}
                error={field === "email" && !!textFieldError}
                helperText={field === "email" && textFieldError}
                FormHelperTextProps={{
                  sx: {
                    textTransform: "none",
                    fontSize: "11px",
                  },
                }}
                placeholder={
                  field === "email"
                    ? "example@gmail.com"
                    : field === "username"
                    ? "johndoe"
                    : ""
                }
              />
            </Stack>
          ))}
          <Button
            variant="outlined"
            onClick={onSignup}
            sx={{ height: "50px" }}
            disabled={buttonDisabled || loading}
          >
            {loading ? "Processing..." : "Signup"}
          </Button>
        </Stack>
        <Stack direction={"row"} mt={3}>
          <Typography>Already Signed up?</Typography>&nbsp;
          <Link
            style={{ textDecoration: "none", color: "#1976d2" }}
            href="/login"
          >
            visit login page
          </Link>
        </Stack>
      </Stack>
    </>
  );
}
