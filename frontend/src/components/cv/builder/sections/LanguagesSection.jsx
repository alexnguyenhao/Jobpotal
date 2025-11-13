import { Input } from "@/components/ui/input";

const LanguagesSection = ({ cvData, updateField }) => {
  const edit = (i, key, v) => {
    const arr = [...cvData.languages];
    arr[i][key] = v;
    updateField("languages", arr);
  };

  const add = () =>
    updateField("languages", [
      ...cvData.languages,
      { language: "", proficiency: "" },
    ]);

  const remove = (i) =>
    updateField(
      "languages",
      cvData.languages.filter((_, idx) => idx !== i)
    );

  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold mb-3">Languages</h3>

      {cvData.languages.map((l, i) => (
        <div key={i} className="mb-4 p-3 border rounded-lg bg-gray-50">
          <Input
            className="mb-2"
            placeholder="Language"
            value={l.language}
            onChange={(e) => edit(i, "language", e.target.value)}
          />

          <Input
            placeholder="Level (Basic, Fluent...)"
            value={l.proficiency}
            onChange={(e) => edit(i, "proficiency", e.target.value)}
          />

          <button
            className="text-red-600 text-sm mt-2"
            onClick={() => remove(i)}
          >
            Delete
          </button>
        </div>
      ))}

      <button className="text-[#6A38C2]" onClick={add}>
        + Add Language
      </button>
    </div>
  );
};

export default LanguagesSection;
