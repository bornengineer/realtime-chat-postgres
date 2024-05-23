"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import checkEmail from "@/utils/checkEmail";
import OTPInput from "react-otp-input";
import onSignup from "@/services/signup";
import { Fields, User } from "@/types/user";
import onSendOtp from "@/services/sendOtp";
import onVerifyEmail from "@/services/verifyEmail";

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
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [otp, setOtp] = useState("");

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !buttonDisabled) {
      event.preventDefault();
      onSignup({ setLoading, setUser, user, router });
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
              {index === fields.length - 2 && (
                <>
                  {" "}
                  <Button
                    variant="contained"
                    disabled={
                      !(checkEmail(user.email) && user.email) || otpSent
                    }
                    onClick={() => onSendOtp({ setOtpSent, user })}
                  >
                    {otpSent ? "OTP Sent" : "Send OTP"}
                  </Button>
                  <Stack
                    p="14px"
                    gap="1rem"
                    mt={"1rem"}
                    border="1px solid #00000030"
                    borderRadius={"3px"}
                    sx={{ backgroundColor: "#f3f3f3" }}
                  >
                    <Typography color={"#00000080"}>
                      Enter OTP sent to your email
                    </Typography>
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      renderSeparator={<span style={{ width: "8px" }}></span>}
                      renderInput={(props) => <input {...props} />}
                      inputType="tel"
                      inputStyle={{
                        border: "1px solid #CFD3DB",
                        borderRadius: "8px",
                        width: "40px",
                        height: "40px",
                        fontSize: "14px",
                        color: "#000",
                        fontWeight: "400",
                        caretColor: "blue",
                      }}
                    />
                    <Button
                      variant="contained"
                      disabled={otp.length < 6 || otpVerified}
                      onClick={() => onVerifyEmail({ setOtpVerified, otp })}
                    >
                      {otpVerified ? "Email Verified" : "Verify"}
                    </Button>
                  </Stack>
                </>
              )}
            </Stack>
          ))}

          <Button
            variant="outlined"
            onClick={() => onSignup({ setLoading, setUser, user, router })}
            sx={{ height: "50px" }}
            disabled={buttonDisabled || loading || !otpVerified}
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
