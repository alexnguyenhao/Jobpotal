import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const StyleEditor = ({ cvData, updateField }) => {
  const s = cvData.styleConfig || {};

  const fonts = [
    { label: "Sans Serif", value: "font-sans" },
    { label: "Serif", value: "font-serif" },
    { label: "Monospace", value: "font-mono" },
    { label: "Inter", value: "font-inter" },
    { label: "Roboto", value: "font-roboto" },
    { label: "Open Sans", value: "font-open-sans" },
    { label: "Lato", value: "font-lato" },
    { label: "Montserrat", value: "font-montserrat" },
    { label: "Poppins", value: "font-poppins" },
    { label: "Nunito", value: "font-nunito" },
    { label: "Raleway", value: "font-raleway" },
    { label: "Merriweather", value: "font-merriweather" },
    { label: "Times New Roman", value: "font-times-new-roman" },
  ];

  const fontSizes = [
    { label: "Small", value: "text-sm" },
    { label: "Normal", value: "text-base" },
    { label: "Large", value: "text-lg" },
  ];

  const spacingOptions = [
    { label: "Tight", value: "tight" },
    { label: "Normal", value: "normal" },
    { label: "Wide", value: "wide" },
  ];

  const shadows = [
    { label: "None", value: 0 },
    { label: "Light", value: 1 },
    { label: "Medium", value: 2 },
    { label: "Heavy", value: 3 },
  ];

  const themes = [
    "#4D6CFF",
    "#8A5DFF",
    "#1E293B",
    "#10B981",
    "#FF6B6B",
    "#2563EB",
    "#D946EF",
    "#F59E0B",
    "#14B8A6",
    "#EF4444",
    "#7C3AED",
    "#F97316",
  ];

  const textColors = [
    { label: "Black", value: "#000000" },
    { label: "Dark Gray", value: "#333333" },
    { label: "Gray", value: "#666666" },
    { label: "Light Gray", value: "#999999" },
    { label: "White", value: "#FFFFFF" },
    { label: "Red", value: "#FF0000" },
    { label: "Green", value: "#00FF00" },
    { label: "Blue", value: "#0000FF" },
    { label: "Yellow", value: "#FFFF00" },
    { label: "Cyan", value: "#00FFFF" },
    { label: "Magenta", value: "#FF00FF" },
    { label: "Orange", value: "#FFA500" },
    { label: "Purple", value: "#800080" },
    { label: "Brown", value: "#A52A2A" },
    { label: "Pink", value: "#FFC0CB" },
    { label: "Teal", value: "#008080" },
    { label: "Navy", value: "#000080" },
    { label: "Olive", value: "#808000" },
    { label: "Maroon", value: "#800000" },
    { label: "Silver", value: "#C0C0C0" },
    { label: "Gold", value: "#FFD700" },
    { label: "Coral", value: "#FF7F50" },
    { label: "Turquoise", value: "#40E0D0" },
  ];

  const bgColors = [
    { label: "White", value: "#FFFFFF" },
    { label: "Light Gray", value: "#D1D5DB" },
    { label: "Gray", value: "#9CA3AF" },
    { label: "Black", value: "#000000" },
    { label: "Light Red", value: "#FEE2E2" },
    { label: "Light Green", value: "#DCFCE7" },
    { label: "Light Blue", value: "#DBEAFE" },
    { label: "Light Yellow", value: "#FEF9C3" },
    { label: "Light Cyan", value: "#ECFEFF" },
    { label: "Light Purple", value: "#F5D0FE" },
    { label: "Peach", value: "#FFF1E0" },
    { label: "Sky Blue", value: "#E0F2FE" },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* FONT FAMILY */}
      <div>
        <h3 className="font-semibold mb-2">Font Family</h3>
        <Select
          value={s.fontFamily}
          onValueChange={(v) => updateField("styleConfig.fontFamily", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose font" />
          </SelectTrigger>
          <SelectContent>
            {fonts.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* FONT SIZE */}
      <div>
        <h3 className="font-semibold mb-2">Font Size</h3>
        <Select
          value={s.fontSizeClass}
          onValueChange={(v) => updateField("styleConfig.fontSizeClass", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Font size" />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map((fs) => (
              <SelectItem key={fs.value} value={fs.value}>
                {fs.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* PRIMARY COLOR */}
      <div>
        <h3 className="font-semibold mb-2">Primary Color</h3>
        <div className="flex flex-wrap gap-2">
          {themes.map((c) => (
            <button
              key={c}
              className="w-8 h-8 rounded-full border shadow hover:scale-110 transition"
              style={{ backgroundColor: c }}
              onClick={() => updateField("styleConfig.primaryColor", c)}
            />
          ))}
        </div>
      </div>

      {/* BACKGROUND COLOR */}
      <div>
        <h3 className="font-semibold mb-2">Background Color</h3>
        <Select
          value={s.backgroundColor}
          onValueChange={(v) => updateField("styleConfig.backgroundColor", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose background" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {bgColors.map((bc) => (
              <SelectItem key={bc.value} value={bc.value}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: bc.value }}
                  />
                  {bc.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* TEXT COLOR */}
      <div>
        <h3 className="font-semibold mb-2">Text Color</h3>
        <Select
          value={s.textColor}
          onValueChange={(v) => updateField("styleConfig.textColor", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose text color" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {textColors.map((tc) => (
              <SelectItem key={tc.value} value={tc.value}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: tc.value }}
                  />
                  {tc.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* BORDER RADIUS */}
      <div>
        <h3 className="font-semibold mb-2">Border Radius</h3>
        <input
          type="range"
          min={0}
          max={40}
          value={s.borderRadius}
          onChange={(e) =>
            updateField("styleConfig.borderRadius", Number(e.target.value))
          }
          className="w-full"
        />
        <p className="text-xs opacity-70">{s.borderRadius}px</p>
      </div>

      {/* SHADOW */}
      <div>
        <h3 className="font-semibold mb-2">Shadow</h3>
        <Select
          value={String(s.shadowLevel)}
          onValueChange={(v) =>
            updateField("styleConfig.shadowLevel", Number(v))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {shadows.map((sh) => (
              <SelectItem key={sh.value} value={String(sh.value)}>
                {sh.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* SPACING */}
      <div>
        <h3 className="font-semibold mb-2">Spacing</h3>
        <Select
          value={s.spacing}
          onValueChange={(v) => updateField("styleConfig.spacing", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {spacingOptions.map((sp) => (
              <SelectItem key={sp.value} value={sp.value}>
                {sp.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StyleEditor;
