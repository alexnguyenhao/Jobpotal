import { Button } from "@/components/ui/button";
import { Save, LayoutTemplate, Share2 } from "lucide-react";
import useCV from "@/hooks/useCV";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import StyleEditor from "./StyleEditor";

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

import PDFExport from "@/components/common/PDFExport";
import { toast } from "sonner";

const TopBar = ({ cvData, onTemplateChange, updateField }) => {
  if (!cvData) return null;

  const { createCV, shareCV, unShareCV, updateCV } = useCV();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleCreate = () => {
    createCV({ template: cvData.template }).then((newCV) => {
      if (newCV) {
        navigate(`/cv/builder?id=${newCV._id}`);
      }
    });
  };

  const handleUpdate = () => {
    updateCV(cvData._id, cvData);
    toast.success("CV updated successfully");
  };

  const handleShare = async () => {
    const url = await shareCV(cvData._id);
    if (url) {
      navigator.clipboard.writeText(url);
      toast.success("Share link copied!");
    }
  };

  const handleTogglePublic = async () => {
    if (cvData.isPublic) {
      // Set Private
      await unShareCV(cvData._id);
      updateField("isPublic", false);
      updateField("shareUrl", null);
      toast.success("CV is now private");
    } else {
      // Set Public
      const url = await shareCV(cvData._id);
      if (url) {
        updateField("isPublic", true);
        updateField("shareUrl", url);
        navigator.clipboard.writeText(url);
        toast.success("Public link copied!");
      }
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

        {/* STYLE */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">🎨 Style</Button>
          </PopoverTrigger>

          <PopoverContent className="w-80 max-h-[420px] overflow-y-auto p-4">
            <p className="font-semibold mb-3">Customize Style</p>
            <StyleEditor cvData={cvData} updateField={updateField} />
          </PopoverContent>
        </Popover>

        {/* PUBLIC / PRIVATE */}
        <Button
          variant={cvData.isPublic ? "default" : "outline"}
          onClick={handleTogglePublic}
        >
          {cvData.isPublic ? "🔒 Set Private" : "🌍 Public CV"}
        </Button>

        <Button variant="outline" onClick={handleShare}>
          <Share2 size={18} /> Share
        </Button>

        <Button variant="outline" onClick={handleCreate}>
          <Save size={18} /> Create
        </Button>

        <Button variant="outline" onClick={handleUpdate}>
          <Save size={18} /> Update
        </Button>

        {/* PDF EXPORT */}
        <PDFExport targetId="cv-print-area" filename={cvData.title} />
      </div>
    </div>
  );
};

export default TopBar;
