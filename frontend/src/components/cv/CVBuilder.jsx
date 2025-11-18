import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useCV from "@/hooks/useCV";

// Redux Actions
import { updateLocalCVState, updateMeta, clearCVState } from "@/redux/cvSlice";

// Components
import TopBar from "@/components/cv/builder/TopBar";
import Sidebar from "@/components/cv/builder/Sidebar";
import LivePreview from "@/components/cv/builder/LivePreview";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Debounce helper
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const CVBuilder = () => {
  const dispatch = useDispatch();
  const { createCV, getCV, updateCV } = useCV();
  const [searchParams] = useSearchParams();

  const cvState = useSelector((state) => state.cv);
  const cvData = useMemo(
    () => ({
      ...cvState.meta, // _id, title, template...
      personalInfo: cvState.personalInfo,
      education: cvState.education,
      workExperience: cvState.workExperience,
      skills: cvState.skills,
      certifications: cvState.certifications,
      languages: cvState.languages,
      achievements: cvState.achievements,
      projects: cvState.projects,
      styleConfig: cvState.styleConfig,
    }),
    [
      cvState.meta,
      cvState.personalInfo,
      cvState.education,
      cvState.workExperience,
      cvState.skills,
      cvState.certifications,
      cvState.languages,
      cvState.achievements,
      cvState.projects,
      cvState.styleConfig,
    ]
  );

  const hasInitialized = useRef(false);
  const isSaving = useRef(false);
  const debouncedSave = useMemo(
    () =>
      debounce((id, data) => {
        isSaving.current = true;
        updateCV(id, data).finally(() => {
          isSaving.current = false;
        });
      }, 800), // Delay 800ms
    []
  );
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const templateParam = searchParams.get("template");
    const cvId = searchParams.get("id");

    const init = async () => {
      if (cvId) {
        await getCV(cvId);
      } else if (templateParam) {
        const newCV = await createCV({ template: templateParam });
        if (newCV?._id) {
          await getCV(newCV._id);
        }
      }
    };

    init();
    return () => {
      dispatch(clearCVState());
    };
  }, []);
  const updateField = useCallback(
    (path, value) => {
      dispatch(updateLocalCVState({ path, value }));

      if (cvData._id) {
        const dataToSave = JSON.parse(JSON.stringify(cvData));

        // Helper set value by path (vd: personalInfo.fullName)
        const keys = path.split(".");
        let ref = dataToSave;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!ref[keys[i]]) ref[keys[i]] = {};
          ref = ref[keys[i]];
        }
        ref[keys[keys.length - 1]] = value;

        // Gọi debounce save
        debouncedSave(cvData._id, dataToSave);
      }
    },
    [cvData, dispatch, debouncedSave]
  );

  // 6. Đổi Template
  const handleTemplateChange = (newTemplate) => {
    // Update UI
    dispatch(updateMeta({ template: newTemplate }));

    // Gọi API ngay lập tức (không cần debounce)
    if (cvData._id) {
      updateCV(cvData._id, { ...cvData, template: newTemplate });
      toast.success("Template updated!");
    }
  };

  // --- RENDER ---

  // Show loading khi chưa có ID
  if (cvState.loading || !cvData._id) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 text-gray-500">
        <Loader2 className="h-10 w-10 animate-spin text-[#6A38C2] mb-2" />
        <p>Preparing your CV workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Top Navigation & Tools */}
      <TopBar
        cvData={cvData}
        onTemplateChange={handleTemplateChange}
        updateField={updateField}
        isSaving={isSaving.current} // Truyền trạng thái save để hiển thị icon loading nhỏ
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Form nhập liệu */}
        <div className="w-full md:w-[400px] lg:w-[450px] bg-white border-r border-gray-200 h-full overflow-y-auto z-10 shadow-lg">
          <Sidebar cvData={cvData} updateField={updateField} />
        </div>

        {/* Live Preview Area */}
        <div className="flex-1 h-full bg-gray-100 overflow-y-auto p-4 md:p-8 flex justify-center">
          <LivePreview cvData={cvData} />
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;
