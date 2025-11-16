import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useCV from "@/hooks/useCV";
import { useSelector } from "react-redux";

import TopBar from "@/components/cv/builder/TopBar";
import Sidebar from "@/components/cv/builder/Sidebar";
import LivePreview from "@/components/cv/builder/LivePreview";

// Debounce function
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const CVBuilder = () => {
  const {
    meta,
    personalInfo,
    education,
    workExperience,
    skills,
    certifications,
    languages,
    achievements,
    projects,
    styleConfig,
  } = useSelector((state) => state.cv);

  const { createCV, getCV, updateCV } = useCV();

  const [searchParams] = useSearchParams();
  const templateParam = searchParams.get("template");
  const cvId = searchParams.get("id");

  const [cvData, setCvData] = useState(null);
  const hasInitialized = useRef(false);
  const debouncedUpdateCV = useMemo(
    () =>
      debounce((id, data) => {
        updateCV(id, data);
      }, 400),
    []
  );

  // Load CV or create CV only once
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (cvId) {
      getCV(cvId);
    } else if (templateParam) {
      createCV({ template: templateParam }).then((newCV) => {
        if (newCV) {
          getCV(newCV._id);
        }
      });
    }
  }, []);

  // Sync Redux -> Local cvData
  useEffect(() => {
    if (!meta._id) return;

    setCvData({
      _id: meta._id,
      title: meta.title,
      template: meta.template,
      isPublic: meta.isPublic,
      shareUrl: meta.shareUrl,
      createdAt: meta.createdAt,
      updatedAt: meta.updatedAt,
      user: meta.user,

      personalInfo,
      education,
      workExperience,
      skills,
      certifications,
      languages,
      achievements,
      projects,
      styleConfig,
    });
  }, [
    meta,
    personalInfo,
    education,
    workExperience,
    skills,
    certifications,
    languages,
    achievements,
    projects,
    styleConfig,
  ]);

  // 🔥 Update field with debounced save
  const updateField = (path, value) => {
    setCvData((prev) => {
      const updated = structuredClone(prev);

      if (!path.includes(".")) {
        updated[path] = value;
      } else {
        const keys = path.split(".");
        let ref = updated;

        keys.slice(0, -1).forEach((k) => {
          ref = ref[k];
        });

        ref[keys[keys.length - 1]] = value;
      }

      // 🔥 chỉ gọi API sau khi user dừng gõ 400ms
      debouncedUpdateCV(updated._id, updated);

      return updated;
    });
  };

  // Template change (không cần debounce)
  const handleTemplateChange = (newTemplate) => {
    const updated = { ...cvData, template: newTemplate };
    setCvData(updated);

    updateCV(updated._id, { template: newTemplate });
  };

  if (!cvData)
    return (
      <div className="p-10 text-center text-gray-500">
        Loading CV Builder...
      </div>
    );

  return (
    <div className="flex flex-col h-screen">
      <TopBar
        cvData={cvData}
        onTemplateChange={handleTemplateChange}
        updateField={updateField}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar cvData={cvData} updateField={updateField} />
        <LivePreview cvData={cvData} />
      </div>
    </div>
  );
};

export default CVBuilder;
