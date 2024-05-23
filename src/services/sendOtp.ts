import { SendOtpProps } from "@/types/user";
import axios from "axios";
import toast from "react-hot-toast";

const onSendOtp = async ({ setOtpSent, user }: SendOtpProps) => {
  try {
    const res = await axios.post("/api/users/send-otp", {
      username: user.username,
      email: user.email,
    });
    if (res.status === 200) {
      console.log("OTP sent :", res.data);
      const toastId = toast.success(res.data.message);
      setTimeout(() => {
        toast.remove(toastId);
      }, 1500);
      setOtpSent(true);
    }

    if (res.status === 202) {
      toast.error(res.data.error);
    }
  } catch (err: any) {
    console.log("OTP sending failed :", err.message);
    toast.error(err.message);
  }
};

export default onSendOtp;
