import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  FileText,
  Wand,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import TemplatePreviewModal from "@/components/cv/TemplatePreviewModal";
import modernThumbnail from "@/components/cv/assets/modern-thumbnail.jpg";
import classicThumbnail from "@/components/cv/assets/classic-thumbnail.jpg";
import creativeThumbnail from "@/components/cv/assets/creative-thumbnail.jpg";
import { useState } from "react";

const CVHome = () => {
  const navigate = useNavigate();
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const previewTemplate = (template) => {
    setSelectedTemplate(template);
    setOpenPreview(true);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* ================= HERO SECTION ================= */}
      <section className="w-full bg-white py-20 border-b">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Build a professional CV in minutes
          </h1>

          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Create your CV in your own style or choose from beautiful templates.
            Easily edit, preview, and download as PDF with just one click.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <Button
              size="lg"
              className="bg-[#6A38C2] hover:bg-[#5d2ebb] text-white font-semibold px-8 py-6 text-lg"
              onClick={() => navigate("/cv/builder")}
            >
              <Wand className="w-5 h-5 mr-2" /> Create CV Now
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="font-semibold px-8 py-6 text-lg"
              onClick={() => navigate("/cv/list")}
            >
              <FileText className="w-5 h-5 mr-2" /> View Created CVs
            </Button>
          </div>
        </div>
      </section>

      {/* ================= TEMPLATE PREVIEW ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Professional CV Templates
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Modern Template */}
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
            <div
              onClick={() => previewTemplate("modern")}
              className="h-72 w-full rounded-lg overflow-hidden border cursor-pointer"
            >
              <img
                src={modernThumbnail}
                alt="Modern Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-center mt-4 text-gray-800 font-semibold text-lg">
              Modern CV
            </p>

            <Button
              className="w-full mt-3"
              onClick={() => navigate("/cv/builder?template=modern")}
            >
              Use this template
            </Button>
          </div>

          {/* Classic Template */}
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
            <div
              onClick={() => previewTemplate("classic")}
              className="h-72 w-full rounded-lg overflow-hidden border cursor-pointer"
            >
              <img
                src={classicThumbnail}
                alt="Classic Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-center mt-4 text-gray-800 font-semibold text-lg">
              Classic CV
            </p>

            <Button
              className="w-full mt-3"
              onClick={() => navigate("/cv/builder?template=classic")}
            >
              Use this template
            </Button>
          </div>

          {/* Creative Template */}
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
            <div
              onClick={() => previewTemplate("creative")}
              className="h-72 w-full rounded-lg overflow-hidden border cursor-pointer"
            >
              <img
                src={creativeThumbnail}
                alt="Creative Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-center mt-4 text-gray-800 font-semibold text-lg">
              Creative CV
            </p>

            <Button
              className="w-full mt-3"
              onClick={() => navigate("/cv/builder?template=creative")}
            >
              Use this template
            </Button>
          </div>
        </div>

        <div className="text-center mt-10">
          <Button
            className="px-8 py-6 bg-[#6A38C2] text-white font-semibold hover:bg-[#5d2ebb]"
            onClick={() => navigate("/cv/builder")}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Creating Your CV
          </Button>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Why Choose CV Builder?</h2>

            <p className="text-gray-600 text-lg mb-6">
              Our tool helps you create professional CVs quickly, with
              customizable templates suited for all industries.
            </p>

            <div className="space-y-3">
              {[
                "Easy to use – No design skills needed",
                "Various beautiful templates",
                "High-quality PDF export",
                "Store unlimited CVs",
                "Auto-fill from your existing profile",
              ].map((text, i) => (
                <p key={i} className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  {text}
                </p>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 h-80 rounded-lg shadow-inner flex items-center justify-center text-gray-400 text-xl">
            CV Feature Illustration
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to create your first CV?
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-10">
          Only a few minutes to create a beautiful, impressive, and professional
          CV.
        </p>

        <Button
          className="px-10 py-7 bg-[#6A38C2] text-white text-lg font-semibold hover:bg-[#5d2ebb]"
          onClick={() => navigate("/cv/builder")}
        >
          Create CV Now <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </section>

      {/* ================= TEMPLATE MODAL ================= */}
      <TemplatePreviewModal
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        template={selectedTemplate}
      />
    </div>
  );
};

export default CVHome;
