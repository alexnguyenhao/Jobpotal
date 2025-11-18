import React from "react";
import { cn } from "@/lib/utils"; // Sử dụng utility cn của Shadcn (nếu có) để merge class tốt hơn

const GlassCard = ({
  title,
  icon: Icon,
  children,
  className,
  headerAction,
}) => {
  return (
    <div
      className={cn(
        "bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300",
        className // Cho phép ghi đè hoặc thêm class từ bên ngoài
      )}
    >
      {/* Header */}
      {(title || headerAction) && (
        <div className="flex items-center justify-between mb-6">
          {title && (
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="p-2 bg-purple-50 rounded-lg text-[#6A38C2]">
                  <Icon size={20} />
                </div>
              )}
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            </div>
          )}

          {/* Khu vực cho nút bấm phụ (VD: Edit, Add) */}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      {/* Content */}
      <div>{children}</div>
    </div>
  );
};

// Fallback nếu bạn chưa có hàm cn
// function cn(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

export default GlassCard;
