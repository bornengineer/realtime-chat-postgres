import { ShareAppProps } from "@/types/user";
import axios from "axios";
import toast from "react-hot-toast";

const shareApp = async ({
  email,
  handleClose,
  url,
  inviter,
}: ShareAppProps) => {
  try {
    const res = await axios.post(`/api/users/share`, {
      email,
      url,
      inviter,
    });
    if (res.status === 200) {
      console.log("App shared on mail - shareApp :", res.data);
      const toastId = toast.success(res.data.message);
      setTimeout(() => {
        toast.remove(toastId);
      }, 1500);
      handleClose();
    }

    if (res.status === 202) {
      toast.error(res.data.error);
    }
  } catch (err: any) {
    console.log("App sharing failed - shareApp :", err.message);
    toast.error(err.message);
  }
};

export default shareApp;
