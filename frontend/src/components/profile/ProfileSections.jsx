import React from "react";
import { Button } from "@/components/ui/button";
import ProfileSectionItem from "@/components/profile/ProfileSectionItem";
import { Plus, Edit3, ArrowRight } from "lucide-react";

const ProfileSections = ({ sections }) => {
  // 1. Định nghĩa các mục chỉ được phép có 1 Item
  const SINGLE_ITEM_SECTIONS = ["Professional Title", "Interests"];

  return (
    <div className="space-y-10">
      {sections.map((section, idx) => {
        const hasData = section.data && section.data.length > 0;

        // Kiểm tra xem section hiện tại có phải là dạng "Single Item" không
        const isSingleItem = SINGLE_ITEM_SECTIONS.includes(section.title);

        // Logic hiển thị nút Add/Manage ở góc phải:
        // - Nếu chưa có data: Luôn hiện nút Add.
        // - Nếu có data VÀ là Single Item: Hiện nút Edit (hoặc ẩn nút Add đi, ở đây mình để Edit cho tiện).
        // - Nếu có data VÀ là Multi Item: Hiện nút Manage.
        const showAddButton = !hasData || !isSingleItem;

        return (
          <div key={idx} id={`section-${idx}`} className="scroll-mt-20">
            {/* --- 1. SECTION HEADER --- */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-3">
                {/* Icon Box */}
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-[#6A38C2]">
                  <section.icon size={20} strokeWidth={2.5} />
                </div>

                {/* Title & Count */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 leading-none">
                    {section.title}
                  </h3>
                  {hasData && !isSingleItem && (
                    <p className="text-xs text-gray-400 font-medium mt-1">
                      {section.data.length}{" "}
                      {section.data.length > 1 ? "items" : "item"}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button (Top Right) */}
              <Button
                onClick={() => section.openSetter(true)}
                variant="ghost"
                size="sm"
                className="text-[#6A38C2] hover:text-[#6A38C2] hover:bg-purple-50 rounded-full font-medium"
              >
                {hasData ? (
                  <>
                    <Edit3 size={16} className="mr-2" />
                    {isSingleItem ? "Edit" : "Manage"}
                  </>
                ) : (
                  <>
                    <Plus size={16} className="mr-2" /> Add
                  </>
                )}
              </Button>
            </div>
            {hasData ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {isSingleItem ? (
                  <ProfileSectionItem
                    item={
                      typeof section.data === "string"
                        ? section.data
                        : Array.isArray(section.data)
                        ? section.data[0] ?? ""
                        : ""
                    }
                    type={section.title}
                  />
                ) : (
                  (Array.isArray(section.data) ? section.data : []).map(
                    (item, i) => (
                      <ProfileSectionItem
                        key={i}
                        item={item}
                        type={section.title}
                      />
                    )
                  )
                )}
                {!isSingleItem && (
                  <button
                    onClick={() => section.openSetter(true)}
                    className="group flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#6A38C2]/50 hover:bg-purple-50/30 transition-all duration-300 min-h-[140px]"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center text-gray-400 group-hover:text-[#6A38C2] shadow-sm mb-2 transition-colors">
                      <Plus size={20} />
                    </div>
                    <span className="text-sm font-semibold text-gray-500 group-hover:text-[#6A38C2]">
                      Add another {section.title}
                    </span>
                  </button>
                )}
              </div>
            ) : (
              /* --- 3. EMPTY STATE (Khi chưa có dữ liệu) --- */
              <div
                onClick={() => section.openSetter(true)}
                className="group cursor-pointer relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 p-8 hover:border-[#6A38C2]/40 hover:bg-white hover:shadow-sm transition-all duration-300"
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-full text-gray-400 group-hover:bg-purple-100 group-hover:text-[#6A38C2] transition-colors">
                      <section.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 group-hover:text-gray-900">
                        Add {section.title}
                      </h4>
                      <p className="text-sm text-gray-500 max-w-md">
                        {section.title === "Professional Title"
                          ? "Add your professional headline (e.g. Full Stack Developer)."
                          : `Showcase your ${section.title.toLowerCase()} to stand out.`}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 p-2 rounded-full text-gray-400 group-hover:border-[#6A38C2] group-hover:text-[#6A38C2] transition-all">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProfileSections;
