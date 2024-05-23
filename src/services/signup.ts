import { OnSignupProps } from "@/types/user";
import axios from "axios";
import toast from "react-hot-toast";

const onSignup = async ({
  setLoading,
  setUser,
  user,
  router,
}: OnSignupProps) => {
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

export default onSignup;
