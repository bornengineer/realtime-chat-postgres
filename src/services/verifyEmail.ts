import { OnVerifyEmailProps } from "@/types/user";
import axios from "axios";
import toast from "react-hot-toast";

const onVerifyEmail = async ({ setOtpVerified, otp }: OnVerifyEmailProps) => {
  try {
    const res = await axios.post("/api/users/verify-email", { otp });
    if (res.status === 200) {
      console.log("OTP Verified :", res.data);
      const toastId = toast.success(res.data.message);
      setTimeout(() => {
        toast.remove(toastId);
      }, 1500);
      setOtpVerified(true);
    }

    if (res.status === 202) {
      toast.error(res.data.error);
    }
  } catch (err: any) {
    console.log("OTP verification failed :", err.message);
    toast.error(err.message);
  }
};

export default onVerifyEmail;
