import React, {
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useState,
} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useCV from "@/hooks/useCV";
import { updateLocalCVState, updateMeta, clearCVState } from "@/redux/cvSlice";
import TopBar from "@/components/cv/builder/TopBar";
import Sidebar from "@/components/cv/builder/Sidebar";
import LivePreview from "@/components/cv/builder/LivePreview";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const CVBuilder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook điều hướng
  const { createCV, getCV, updateCV } = useCV();
  const [searchParams] = useSearchParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const cvState = useSelector((state) => state.cv);

  // Gom nhóm dữ liệu từ Redux để truyền xuống các component con
  const cvData = useMemo(
    () => ({
      ...cvState.meta,
      personalInfo: cvState.personalInfo,
      education: cvState.education,
      workExperience: cvState.workExperience,
      skills: cvState.skills,
      certifications: cvState.certifications,
      languages: cvState.languages,
      achievements: cvState.achievements,
      projects: cvState.projects,
      operations: cvState.operations,
      interests: cvState.interests,
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
      cvState.operations,
      cvState.interests,
      cvState.styleConfig,
    ]
  );

  const hasInitialized = useRef(false);
  const isSaving = useRef(false);

  // Hàm save auto (debounce 800ms)
  const debouncedSave = useMemo(
    () =>
      debounce((id, data) => {
        isSaving.current = true;
        updateCV(id, data).finally(() => {
          isSaving.current = false;
        });
      }, 800),
    []
  );

  // --- 1. KHỞI TẠO DỮ LIỆU ---
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
  useEffect(() => {
    if (cvState.meta?._id && cvState.meta?.type === "upload") {
      toast.info("This is an uploaded file. Redirecting to viewer...");
      navigate(`/cv/view/${cvState.meta._id}`);
    }
  }, [cvState.meta, navigate]);
  const updateField = useCallback(
    (path, value) => {
      dispatch(updateLocalCVState({ path, value }));
      if (cvData._id) {
        const dataToSave = JSON.parse(JSON.stringify(cvData));
        const keys = path.split(".");
        let ref = dataToSave;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!ref[keys[i]]) ref[keys[i]] = {};
          ref = ref[keys[i]];
        }
        ref[keys[keys.length - 1]] = value;

        debouncedSave(cvData._id, dataToSave);
      }
    },
    [cvData, dispatch, debouncedSave]
  );

  const handleTemplateChange = (newTemplate) => {
    dispatch(updateMeta({ template: newTemplate }));
    if (cvData._id) {
      updateCV(cvData._id, { ...cvData, template: newTemplate });
      toast.success("Template updated!");
    }
  };

  // --- RENDER LOADING ---
  if (cvState.loading || !cvData._id) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 text-gray-500">
        <Loader2 className="h-10 w-10 animate-spin text-[#6A38C2] mb-2" />
        <p>Preparing your CV workspace...</p>
      </div>
    );
  }

  // --- RENDER GIAO DIỆN CHÍNH ---
  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <TopBar
        cvData={cvData}
        onTemplateChange={handleTemplateChange}
        updateField={updateField}
        isSaving={isSaving.current}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar bên trái */}
        <div
          className={`bg-white border-r border-gray-200 h-full overflow-y-auto z-10 shadow-lg transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? "w-[80px]" : "w-full md:w-[400px] lg:w-[450px]"
          }`}
        >
          <Sidebar
            cvData={cvData}
            updateField={updateField}
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* Live Preview bên phải */}
        <div className="flex-1 h-full bg-gray-100 overflow-y-auto p-4 md:p-8 flex justify-center">
          <LivePreview cvData={cvData} />
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;
