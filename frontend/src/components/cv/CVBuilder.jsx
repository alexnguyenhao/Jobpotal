import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useCV from "@/hooks/useCV";
import { useSelector, useDispatch } from "react-redux";
import { setSingleCV } from "@/redux/cvSlice";

import TopBar from "@/components/cv/builder/TopBar";
import Sidebar from "@/components/cv/builder/Sidebar";
import LivePreview from "@/components/cv/builder/LivePreview";

const CVBuilder = () => {
  const dispatch = useDispatch();
  const { singleCV } = useSelector((state) => state.cv);
  const { createCV, getCV, updateCV } = useCV();
  const [searchParams] = useSearchParams();

  const templateParam = searchParams.get("template");
  const cvId = searchParams.get("id");

  const [cvData, setCvData] = useState(null);

  /* =============================
        LOAD CV (new or from id)
  ============================= */
  useEffect(() => {
    if (cvId) {
      getCV(cvId);
    } else if (templateParam) {
      createCV(templateParam).then((newCV) => {
        if (newCV) {
          dispatch(setSingleCV(newCV));
          setCvData(newCV);
        }
      });
    }
  }, []);

  /* =============================
        SYNC REDUX → LOCAL STATE
  ============================= */
  useEffect(() => {
    if (singleCV) setCvData(singleCV);
  }, [singleCV]);

  /* =============================
        HANDLE INPUT CHANGE
  ============================= */
  const updateField = (path, value) => {
    const clone = { ...cvData };
    let ref = clone;

    const keys = path.split(".");
    keys.slice(0, -1).forEach((k) => (ref = ref[k]));
    ref[keys[keys.length - 1]] = value;

    setCvData(clone);
    updateCV(clone._id, clone); // autosave
  };

  /* =============================
        HANDLE TEMPLATE CHANGE
  ============================= */
  const handleTemplateChange = (newTemplate) => {
    const updated = { ...cvData, template: newTemplate };

    setCvData(updated); // đổi template realtime
    updateCV(updated._id, updated); // lưu backend
  };

  if (!cvData)
    return (
      <div className="p-10 text-center text-gray-500">
        Loading CV Builder...
      </div>
    );

  return (
    <div className="flex flex-col h-screen">
      <TopBar cvData={cvData} onTemplateChange={handleTemplateChange} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar cvData={cvData} updateField={updateField} />

        <LivePreview cvData={cvData} />
      </div>
    </div>
  );
};

export default CVBuilder;
