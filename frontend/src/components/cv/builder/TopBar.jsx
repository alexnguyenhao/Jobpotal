import { Button } from "@/components/ui/button";
import { Save, Download, LayoutTemplate, Share2 } from "lucide-react";
import useCV from "@/hooks/useCV";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const TopBar = ({ cvData, onTemplateChange }) => {
  if (!cvData) return null;

  const { createCV, shareCV } = useCV(); // <-- ĐÃ SỬA
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    createCV(cvData); // <-- ĐÃ SỬA
  };

  const handleShare = async () => {
    const url = await shareCV(cvData._id);
    if (url) {
      navigator.clipboard.writeText(url);
      alert("Share link copied!");
    }
  };

  const templateList = [
    { value: "modern", label: "Modern Pro" },
    { value: "classic", label: "Classic Elegant" },
    { value: "creative", label: "Creative Premium" },
  ];

  return (
    <div className="w-full h-16 bg-white border-b px-6 flex items-center justify-between">
      <p className="font-semibold text-lg">
        Editing: <span className="text-[#6A38C2]">{cvData.title}</span>
      </p>

      <div className="flex gap-3">
        {/* CHANGE TEMPLATE */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <LayoutTemplate size={18} /> Change Template
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-52 p-3">
            <p className="font-semibold text-sm mb-2">Select Template</p>

            <Select
              onValueChange={(value) => {
                onTemplateChange(value);
                setOpen(false);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose template" />
              </SelectTrigger>

              <SelectContent>
                {templateList.map((tpl) => (
                  <SelectItem key={tpl.value} value={tpl.value}>
                    {tpl.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PopoverContent>
        </Popover>

        <Button variant="outline" onClick={handleShare}>
          <Share2 size={18} /> Share
        </Button>

        <Button variant="outline" onClick={handleSave}>
          <Save size={18} /> Save
        </Button>

        <Button className="bg-[#6A38C2] text-white">
          <Download size={18} /> Export PDF
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
