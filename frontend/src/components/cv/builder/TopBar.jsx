import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCV from "@/hooks/useCV";
import StyleEditor from "./StyleEditor";
import PDFExport from "@/components/common/PDFExport";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icons
import {
  LayoutTemplate,
  Palette,
  Share2,
  Save,
  ArrowLeft,
  Globe,
  Lock,
  Copy,
  ChevronDown,
  FilePlus,
  Check,
} from "lucide-react";

const TopBar = ({ cvData, onTemplateChange, updateField }) => {
  const navigate = useNavigate();
  const { createCV, shareCV, unShareCV, updateCV } = useCV();
  const [templateOpen, setTemplateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!cvData) return null;

  // --- HANDLERS ---

  const handleCreateCopy = async () => {
    try {
      const newCV = await createCV({ template: cvData.template });
      if (newCV) {
        toast.success("Cloned new CV successfully!");
        navigate(`/cv/builder?id=${newCV._id}`);
      }
    } catch (error) {
      toast.error("Failed to clone CV");
    }
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      await updateCV(cvData._id, cvData);
      toast.success("CV saved successfully");
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublic = async () => {
    try {
      if (cvData.isPublic) {
        await unShareCV(cvData._id);
        updateField("isPublic", false);
        updateField("shareUrl", null);
        toast.success("CV is now private");
      } else {
        const url = await shareCV(cvData._id);
        if (url) {
          updateField("isPublic", true);
          updateField("shareUrl", url);
          toast.success("CV is now live!");
        }
      }
    } catch (error) {
      toast.error("Failed to change privacy settings");
    }
  };

  const handleCopyLink = () => {
    if (cvData.shareUrl) {
      navigator.clipboard.writeText(cvData.shareUrl);
      toast.success("Link copied to clipboard!");
    } else {
      handleTogglePublic(); // Auto publish if trying to share
    }
  };

  const templateList = [
    { value: "modern", label: "Modern Pro" },
    { value: "classic", label: "Classic Elegant" },
    { value: "creative", label: "Creative Premium" },
  ];

  return (
    <header className="w-full h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 px-4 md:px-6 flex items-center justify-between shadow-sm">
      {/* --- LEFT: INFO & NAVIGATION --- */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-900"
          onClick={() => navigate("/cv/home")}
        >
          <ArrowLeft size={20} />
        </Button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800 text-sm md:text-base truncate max-w-[150px] md:max-w-[200px]">
              {cvData.title || "Untitled CV"}
            </span>
            {cvData.isPublic ? (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 hover:bg-green-200 text-[10px] px-1.5 h-5"
              >
                <Globe size={10} className="mr-1" /> Public
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-gray-500 text-[10px] px-1.5 h-5"
              >
                <Lock size={10} className="mr-1" /> Private
              </Badge>
            )}
          </div>
          <span className="text-[10px] text-gray-400 hidden md:block">
            Last edited just now
          </span>
        </div>
      </div>

      {/* --- CENTER: DESIGN TOOLS --- */}
      <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center bg-gray-100/50 p-1 rounded-lg border border-gray-200">
        {/* Template Selector */}
        <Popover open={templateOpen} onOpenChange={setTemplateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-gray-700 gap-2"
            >
              <LayoutTemplate size={16} className="text-purple-600" />
              <span className="text-xs font-medium">Template</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="center">
            <p className="text-xs font-semibold text-gray-500 mb-2 px-2">
              Choose Layout
            </p>
            <Select
              value={cvData.template}
              onValueChange={(value) => {
                onTemplateChange(value);
                setTemplateOpen(false);
              }}
            >
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select template" />
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

        <Separator orientation="vertical" className="h-5 mx-1 bg-gray-300" />

        {/* Style Editor */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-gray-700 gap-2"
            >
              <Palette size={16} className="text-pink-600" />
              <span className="text-xs font-medium">Design</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="center" sideOffset={8}>
            <div className="p-4 border-b bg-gray-50">
              <h4 className="font-semibold text-sm">Customization</h4>
            </div>
            <div className="p-4 max-h-[400px] overflow-y-auto">
              <StyleEditor cvData={cvData} updateField={updateField} />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* --- RIGHT: ACTIONS --- */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Share Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 hidden sm:flex"
            >
              <Share2 size={16} />
              Share
              <ChevronDown size={12} className="text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Sharing Options</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleTogglePublic}
              className="cursor-pointer"
            >
              {cvData.isPublic ? (
                <>
                  <Lock size={16} className="mr-2 text-red-500" /> Make Private
                </>
              ) : (
                <>
                  <Globe size={16} className="mr-2 text-green-600" /> Publish to
                  Web
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleCopyLink}
              disabled={!cvData.isPublic}
              className="cursor-pointer"
            >
              <Copy size={16} className="mr-2" /> Copy Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile Share Icon Only */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={handleTogglePublic}
        >
          <Share2 size={18} />
        </Button>

        {/* PDF Export */}
        <PDFExport targetId="cv-print-area" filename={cvData.title} />

        {/* Main Save Button Group */}
        <div className="flex items-center">
          <Button
            onClick={handleUpdate}
            disabled={isSaving}
            className="bg-[#6A38C2] hover:bg-[#5a2ea6] text-white rounded-r-none border-r border-white/20"
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save size={18} className="mr-2" /> Save
              </>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#6A38C2] hover:bg-[#5a2ea6] text-white rounded-l-none px-2">
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleCreateCopy}
                className="cursor-pointer"
              >
                <FilePlus size={16} className="mr-2" /> Save as New Copy
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
