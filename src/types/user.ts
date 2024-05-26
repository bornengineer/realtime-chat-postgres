export enum EmailType {
  VERIFY = "verify",
  PASSWORD_RESET = "password-reset",
}

export type Fields = "email" | "password" | "username";

export interface User {
  email: string;
  password: string;
  username: string;
}

export interface LoggedInUser {
  email: string;
  username: string;
  id: string;
  isAdmin?: boolean;
}

export interface Room {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  creatorId: string;
}

export interface OnSignupProps {
  setLoading: (loading: boolean) => void;
  setUser: (user: User) => void;
  user: User;
  router: any;
}

export interface SendOtpProps {
  setOtpSent: (otpSent: boolean) => void;
  user: User;
}

export interface OnVerifyEmailProps {
  setOtpVerified: (otpVerified: boolean) => void;
  otp: string;
}

export interface ShareAppProps {
  email: string;
  handleClose: () => void;
  url: string;
  inviter: string;
}
