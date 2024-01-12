const getLoggedInUser = async () => {
  const loggedInUser = await fetch("/api/users/getLoggedInUser");
  const user = await loggedInUser.json();
  if (Object.keys(user).length) return user;
  else return {};
};

export default getLoggedInUser;
