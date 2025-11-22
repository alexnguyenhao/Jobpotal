export const formatLocation = (loc) => {
  if (!loc) return "Remote";
  if (typeof loc === "string") return loc;
  return loc.province || loc.address || "Remote";
};