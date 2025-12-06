export const formatLocation = (loc) => {
  if (!loc) return "Remote";
  if (typeof loc === "string") return loc; // Nếu backend trả thẳng string

  // 👉 Thêm ward vào destructuring
  const { address, ward, district, province } = loc;

  const parts = [
    address?.trim(),
    ward?.trim(), // 👉 Thêm ward vào mảng hiển thị
    district?.trim(),
    province?.trim(),
  ].filter(Boolean); // Loại bỏ phần rỗng/null/undefined

  return parts.length ? parts.join(", ") : "Remote";
};
