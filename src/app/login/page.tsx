"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Button, Divider, Stack, TextField, Typography } from "@mui/material";

type Fields = "email" | "password";
interface User {
  email: string;
  password: string;
}

const fields: Fields[] = ["email", "password"];

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0)
      setButtonDisabled(false);
    else setButtonDisabled(true);
  }, [user]);

  const onLogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post("api/users/login", user);
      if (res.status === 200) {
        const toastId = toast.success(res.data.message);
        console.log("Login success :", res.data);
        setUser({
          email: "",
          password: "",
        });
        setTimeout(() => {
          toast.remove(toastId);
          router.push("/");
        }, 1500);
      }
    } catch (err: any) {
      console.log("Login failed :", err.message);
      toast.error(err.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !buttonDisabled) {
      event.preventDefault();
      onLogin();
    }
  };

  return (
    <>
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
          Login
        </Typography>
        <Divider sx={{ mt: 2, mb: 4 }} />
        <Stack sx={{ justifyContent: "center", gap: 2 }}>
          {fields.map((field: Fields, index) => (
            <Stack gap={0.5} key={index}>
              <TextField
                sx={{ textTransform: "capitalize" }}
                id={field}
                type={field}
                label={field === "email" ? `Username / ${field}` : field}
                value={user[field]}
                onChange={(e) => setUser({ ...user, [field]: e.target.value })}
                placeholder={field === "email" ? "Type username or email" : ""}
                onKeyDown={handleKeyDown}
                FormHelperTextProps={{
                  sx: {
                    textTransform: "none",
                    fontSize: "11px",
                  },
                }}
              />
            </Stack>
          ))}
          <Button
            variant="outlined"
            onClick={onLogin}
            sx={{ height: "50px" }}
            disabled={buttonDisabled || loading}
          >
            {loading ? "Processing..." : "Login"}
          </Button>
        </Stack>
        <Stack direction={"row"} mt={3}>
          <Typography>New user?</Typography>&nbsp;
          <Link
            style={{ textDecoration: "none", color: "#1976d2" }}
            href="/signup"
          >
            visit signup page
          </Link>
        </Stack>
      </Stack>
    </>
  );
}
