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
  CheckCircle2,
  Users,
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
    color: "bg-blue-500",
  },
  {
    id: "creative",
    name: "Creative Designer",
    image: creativeThumbnail,
    description: "Bold colors and layout for creative industries.",
    badge: "New",
    color: "bg-purple-500",
  },
  {
    id: "classic",
    name: "Traditional Classic",
    image: classicThumbnail,
    description: "Timeless structure suitable for academic and formal jobs.",
    badge: null,
    color: "bg-slate-500",
  },
];

const FEATURES = [
  {
    icon: <Zap className="w-6 h-6 text-amber-500" />,
    title: "Instant Creation",
    desc: "Build your resume in minutes with our intuitive builder.",
    bg: "bg-amber-50",
  },
  {
    icon: <LayoutTemplate className="w-6 h-6 text-blue-500" />,
    title: "ATS-Friendly",
    desc: "Templates designed to pass Applicant Tracking Systems.",
    bg: "bg-blue-50",
  },
  {
    icon: <Download className="w-6 h-6 text-emerald-500" />,
    title: "Easy Export",
    desc: "Download high-quality PDFs with a single click.",
    bg: "bg-emerald-50",
  },
];

const STATS = [
  { label: "CVs Created", value: "10,000+", icon: FileText },
  { label: "Active Users", value: "5,000+", icon: Users },
  { label: "Job Success", value: "92%", icon: CheckCircle2 },
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
    if (typeof action === "function") action();
  };

  const handlePreview = (templateId) => {
    setSelectedTemplate(templateId);
    setOpenPreview(true);
  };

  const handleUseTemplate = (templateId) => {
    handleAction(() => navigate(`/cv/builder?template=${templateId}`));
  };

  return (
    <div className="w-full min-h-screen bg-white font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* --- HERO SECTION --- */}
      <section className="relative w-full pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-40 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
          <Badge
            variant="secondary"
            className="mb-8 px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm border border-purple-100 text-[#6A38C2] shadow-sm rounded-full hover:bg-white"
          >
            ✨ The Ultimate AI Resume Builder
          </Badge>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8 drop-shadow-sm">
            Craft a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-blue-600">
              Winning CV
            </span>{" "}
            <br className="hidden md:block" />
            in Minutes.
          </h1>

          <p className="mt-6 text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Stand out from the crowd with professional templates designed by
            recruiters. Fast, easy, and completely free to try.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Button
              size="lg"
              className="bg-[#6A38C2] hover:bg-[#582bb6] text-white font-bold px-8 h-14 rounded-full text-lg shadow-lg shadow-purple-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              onClick={() =>
                handleAction(() => navigate("/cv/builder?template=modern"))
              }
            >
              <Wand2 className="w-5 h-5 mr-2" /> Create My CV Now
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="font-semibold px-8 h-14 rounded-full text-lg border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all"
              onClick={() => handleAction(() => navigate("/cv/list"))}
            >
              <FileText className="w-5 h-5 mr-2" /> My Documents
            </Button>
          </div>

          {/* Mini Stats */}
          <div className="mt-16 pt-8 border-t border-slate-100 grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            {STATS.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <p className="text-2xl md:text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                  <stat.icon className="w-3 h-3" /> {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="group flex flex-col items-start p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`p-3.5 rounded-2xl mb-5 ${feature.bg}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TEMPLATES SECTION --- */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Designed for Success
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              Choose from our collection of ATS-friendly templates. Switch
              designs anytime without losing your data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-[380px] w-full bg-slate-100 overflow-hidden">
                  {template.badge && (
                    <div className="absolute top-4 left-4 z-20">
                      <Badge
                        className={`${
                          template.color || "bg-[#6A38C2]"
                        } text-white border-0 shadow-lg`}
                      >
                        {template.badge}
                      </Badge>
                    </div>
                  )}

                  <img
                    src={template.image}
                    alt={template.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 backdrop-blur-[2px]">
                    <Button
                      onClick={() => handleUseTemplate(template.id)}
                      className="bg-white text-black hover:bg-slate-100 hover:scale-105 rounded-full px-8 h-12 font-bold transition-all"
                    >
                      Use This Template
                    </Button>
                    <Button
                      onClick={() => handlePreview(template.id)}
                      variant="ghost"
                      className="text-white hover:text-white hover:bg-white/20 rounded-full"
                    >
                      <Eye className="w-4 h-4 mr-2" /> Preview Design
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 bg-white border-t border-slate-100 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#6A38C2] transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-900">
            How it works
          </h2>

          <div className="relative flex flex-col md:flex-row justify-between items-start gap-8">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent border-t border-dashed border-slate-300 z-0"></div>

            {[
              {
                num: "1",
                title: "Choose Template",
                desc: "Select a professional design.",
                icon: LayoutTemplate,
              },
              {
                num: "2",
                title: "Enter Details",
                desc: "Fill in your skills & history.",
                icon: FileText,
              },
              {
                num: "3",
                title: "Export PDF",
                desc: "Download and apply instantly.",
                icon: Download,
              },
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex-1 text-center group">
                <div className="w-16 h-16 mx-auto bg-white border-2 border-[#6A38C2]/20 text-[#6A38C2] rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-sm group-hover:border-[#6A38C2] group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-200 transition-all duration-300">
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm max-w-[200px] mx-auto">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-[#0F0F12] text-white text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-purple-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-50%] right-[-20%] w-[800px] h-[800px] bg-blue-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative max-w-3xl mx-auto px-6 z-10">
          <Sparkles className="w-10 h-10 text-yellow-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to land your dream job?
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of professionals who have built their careers using
            our CV Builder.
          </p>

          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-100 hover:scale-105 font-bold px-10 h-14 rounded-full text-lg shadow-2xl transition-all duration-300"
            onClick={() =>
              handleAction(() => navigate("/cv/builder?template=modern"))
            }
          >
            Start Building Now <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="mt-6 text-sm text-slate-500">
            No credit card required • Free to start
          </p>
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
