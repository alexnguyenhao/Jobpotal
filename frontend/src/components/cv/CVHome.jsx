import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wand2,
  FileText,
  LayoutTemplate,
  Download,
  Eye,
  Sparkles,
  Zap,
  ArrowRight,
} from "lucide-react";
import TemplatePreviewModal from "@/components/cv/TemplatePreviewModal";

// Assets
import modernThumbnail from "@/components/cv/assets/modern-thumbnail.jpg";
import classicThumbnail from "@/components/cv/assets/classic-thumbnail.jpg";
import creativeThumbnail from "@/components/cv/assets/creative-thumbnail.jpg";

// --- DATA CONSTANTS ---
const TEMPLATES = [
  {
    id: "modern",
    name: "Modern Professional",
    image: modernThumbnail,
    description: "Clean layout perfect for tech and corporate roles.",
    badge: "Most Popular",
  },
  {
    id: "creative",
    name: "Creative Designer",
    image: creativeThumbnail,
    description: "Bold colors and layout for creative industries.",
    badge: "New",
  },
  {
    id: "classic",
    name: "Traditional Classic",
    image: classicThumbnail,
    description: "Timeless structure suitable for academic and formal jobs.",
    badge: null,
  },
];

const FEATURES = [
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: "Instant Creation",
    desc: "Build your resume in minutes with our intuitive builder.",
  },
  {
    icon: <LayoutTemplate className="w-6 h-6 text-blue-500" />,
    title: "ATS-Friendly",
    desc: "Templates designed to pass Applicant Tracking Systems.",
  },
  {
    icon: <Download className="w-6 h-6 text-green-500" />,
    title: "Easy Export",
    desc: "Download high-quality PDFs with a single click.",
  },
];

const CVHome = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [openPreview, setOpenPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // --- HANDLERS ---
  const handleAction = (action) => {
    if (!isAuthenticated) {
      toast.error("Please login to create a CV");
      navigate("/login");
      return;
    }
    // Thực thi hành động (callback) nếu đã đăng nhập
    if (typeof action === "function") {
      action();
    }
  };

  const handlePreview = (templateId) => {
    setSelectedTemplate(templateId);
    setOpenPreview(true);
  };

  const handleUseTemplate = (templateId) => {
    handleAction(() => navigate(`/cv/builder?template=${templateId}`));
  };

  return (
    <div className="w-full min-h-screen bg-white font-sans">
      <section className="relative w-full bg-gradient-to-b from-purple-50 via-white to-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
          <Badge
            variant="outline"
            className="mb-6 px-4 py-1.5 text-sm border-purple-200 bg-white text-[#6A38C2] shadow-sm rounded-full"
          >
            ✨ The Ultimate AI Resume Builder
          </Badge>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
            Craft a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-blue-600">
              Winning CV
            </span>{" "}
            <br className="hidden md:block" />
            in Minutes.
          </h1>

          <p className="mt-6 text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Stand out from the crowd with professional templates designed by
            recruiters. Fast, easy, and effective.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Button
              size="lg"
              className="bg-[#6A38C2] hover:bg-[#582bb6] text-white font-bold px-8 h-14 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
              onClick={() =>
                handleAction(() => navigate("/cv/builder?template=modern"))
              }
            >
              <Wand2 className="w-5 h-5 mr-2" /> Create My CV Now
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="font-semibold px-8 h-14 rounded-full text-lg border-gray-300 hover:bg-gray-50"
              onClick={() => handleAction(() => navigate("/cv/list"))}
            >
              <FileText className="w-5 h-5 mr-2" /> My Documents
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="p-3 bg-white rounded-full shadow-sm mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pick a template designed for success
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Choose from our collection of ATS-friendly templates. Switch
              designs anytime without losing your data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-200 transition-all duration-300"
              >
                <div className="relative h-[400px] w-full bg-gray-100 overflow-hidden">
                  {template.badge && (
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-[#6A38C2] hover:bg-[#6A38C2] text-white">
                        {template.badge}
                      </Badge>
                    </div>
                  )}

                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <Button
                      onClick={() => handlePreview(template.id)}
                      variant="secondary"
                      className="rounded-full w-12 h-12 p-0"
                      title="Preview"
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={() => handleUseTemplate(template.id)}
                      className="bg-[#6A38C2] hover:bg-[#582bb6] rounded-full px-6"
                    >
                      Use Template
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {template.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {[
              {
                num: "01",
                title: "Choose a Template",
                desc: "Select a design that fits your industry.",
              },
              {
                num: "02",
                title: "Fill Your Details",
                desc: "Enter your experience and skills easily.",
              },
              {
                num: "03",
                title: "Download PDF",
                desc: "Export your perfect CV instantly.",
              },
            ].map((step, i) => (
              <div key={i} className="flex-1 text-center group">
                <div className="w-16 h-16 mx-auto bg-purple-50 text-[#6A38C2] rounded-full flex items-center justify-center text-2xl font-bold mb-6 group-hover:scale-110 transition-transform">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-black text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <Sparkles className="w-10 h-10 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to land your dream job?
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of professionals who have built their careers using
            our CV Builder.
          </p>

          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-100 font-bold px-10 h-14 rounded-full text-lg"
            onClick={() =>
              handleAction(() => navigate("/cv/builder?template=modern"))
            }
          >
            Start Building Now <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
      <TemplatePreviewModal
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        template={selectedTemplate}
      />
    </div>
  );
};

export default CVHome;
