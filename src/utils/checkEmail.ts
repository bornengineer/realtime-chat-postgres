export default function checkEmail(email: string) {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  if (RegExp(emailRegex).exec(email)) {
    return true;
  } else return false;
}
