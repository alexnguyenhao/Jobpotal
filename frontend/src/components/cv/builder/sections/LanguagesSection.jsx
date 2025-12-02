import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LanguagesSection = ({ cvData, updateField }) => {
  const edit = (index, key, val) => {
    const cloned = cvData.languages.map((l) => ({ ...l }));
    cloned[index][key] = val;
    updateField("languages", cloned);
  };

  const add = () => {
    updateField("languages", [
      ...cvData.languages,
      { language: "", proficiency: "Basic" },
    ]);
  };

  const remove = (index) => {
    updateField(
      "languages",
      cvData.languages.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-4">
      {cvData.languages.map((l, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50"
        >
          <div className="flex-1">
            <Input
              placeholder="Language (e.g. English)"
              value={l.language}
              onChange={(e) => edit(i, "language", e.target.value)}
              className="bg-white"
            />
          </div>

          <div className="w-1/3 min-w-[140px]">
            <Select
              value={l.proficiency}
              onValueChange={(val) => edit(i, "proficiency", val)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Conversational">Conversational</SelectItem>
                <SelectItem value="Fluent">Fluent</SelectItem>
                <SelectItem value="Native">Native</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => remove(i)}
            className="text-red-500 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ))}

      <Button
        variant="ghost"
        onClick={add}
        className="text-[#6A38C2] hover:text-[#5b30a6] hover:bg-purple-50 p-0 h-auto font-medium"
      >
        + Add Language
      </Button>
    </div>
  );
};

export default LanguagesSection;
