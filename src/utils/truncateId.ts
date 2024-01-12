export default function truncateId(address: string) {
  if (!address) {
    return "Invalid address";
  }

  const firstFive = address.substring(0, 5);
  const lastFive = address.slice(-5);

  const finalString = `${firstFive}...${lastFive}`;

  return finalString;
}
