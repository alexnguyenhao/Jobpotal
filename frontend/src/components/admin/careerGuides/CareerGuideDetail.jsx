import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useCareerGuide from "@/hooks/useCareerGuide";
import DOMPurify from "dompurify";
import { toast } from "sonner";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Icons
import {
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Share2,
  User,
  Tag,
  Loader2,
  AlertCircle,
} from "lucide-react";

// --- HELPER COMPONENTS ---
const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
    <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
      <Icon size={20} className={colorClass.replace("bg-", "text-")} />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const CareerGuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchMyGuideById, deleteGuide } = useCareerGuide();

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await fetchMyGuideById(id);
      if (!data) {
        return navigate("/admin/career-guides");
      }
      setGuide(data);
      setLoading(false);
    };
    load();
  }, [id, fetchMyGuideById, navigate]);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this guide? This action cannot be undone."
      )
    )
      return;

    setIsDeleting(true);
    const ok = await deleteGuide(id);

    if (ok) {
      navigate("/admin/career-guides");
    } else {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500 bg-gray-50/50">
        <Loader2 className="h-10 w-10 animate-spin text-[#6A38C2]" />
        <p className="font-medium text-sm">Loading Article...</p>
      </div>
    );
  }

  if (!guide) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* --- STICKY HEADER --- */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100"
            onClick={() => navigate("/admin/career-guides")}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Guide Details
              {guide.isPublished ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 text-[10px] px-2 py-0.5 h-5 shadow-none">
                  Published
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-2 py-0.5 h-5"
                >
                  Draft
                </Badge>
              )}
            </h1>
            <p className="text-xs text-gray-500">Manage your content</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handleShare}
            className="hidden sm:flex text-gray-600"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            className="hidden sm:flex"
            onClick={() => navigate(`/admin/career-guides/edit/${guide._id}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Guide
          </Button>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
            className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 shadow-none"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Delete
          </Button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-5xl mx-auto mt-8 px-4 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN (Article Content) - 8 Cols */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Article Header Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              {/* Category & Date */}
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-purple-100 text-[#6A38C2] hover:bg-purple-200 border-0 px-3 py-1 text-sm">
                  {guide.category}
                </Badge>
                <div className="flex items-center text-gray-400 text-sm gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />{" "}
                    {new Date(guide.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {guide.readingTime} min read
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
                {guide.title}
              </h1>

              {/* Author */}
              <div className="flex items-center gap-3 mb-6">
                <Avatar className="h-10 w-10 border border-gray-200">
                  <AvatarImage src={guide.author?.profilePhoto} />
                  <AvatarFallback className="bg-gray-100 text-gray-600">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {guide.author?.fullName || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">Content Creator</p>
                </div>
              </div>

              {/* Thumbnail */}
              <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden border border-gray-100 mb-8">
                {guide.thumbnail ? (
                  <img
                    src={guide.thumbnail}
                    alt={guide.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 flex-col gap-2">
                    <FileText size={40} />
                    <span>No Cover Image</span>
                  </div>
                )}
              </div>

              {/* Excerpt */}
              {guide.excerpt && (
                <div className="bg-purple-50 border-l-4 border-[#6A38C2] p-5 rounded-r-lg mb-8">
                  <p className="text-gray-700 italic font-medium text-lg leading-relaxed">
                    "{guide.excerpt}"
                  </p>
                </div>
              )}

              {/* Main Content (Rich Text) */}
              <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-[#6A38C2] prose-img:rounded-xl">
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(guide.content),
                  }}
                />
              </div>

              {/* Tags */}
              {guide.tags && guide.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-3 text-gray-500 text-sm font-medium">
                    <Tag size={16} /> Related Tags:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {guide.tags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-gray-600 border-gray-300 hover:bg-gray-50"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (Sidebar) - 4 Cols */}
          <div className="lg:col-span-4 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 gap-4">
              <StatCard
                icon={Eye}
                label="Total Views"
                value={guide.views.toLocaleString()}
                colorClass="bg-blue-500"
              />
              {/* Example: Add more stats if available like Likes/Shares */}
            </div>

            {/* Quick Details Card */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <AlertCircle size={18} className="text-[#6A38C2]" />
                  About this Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Status</span>
                  <Badge
                    variant={guide.isPublished ? "default" : "secondary"}
                    className={guide.isPublished ? "bg-green-600" : ""}
                  >
                    {guide.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Created</span>
                  <span className="font-medium text-gray-900">
                    {new Date(guide.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Updated</span>
                  <span className="font-medium text-gray-900">
                    {new Date(guide.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-[#6A38C2] capitalize">
                    {guide.category.replace("-", " ")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Author Mini Profile (Optional) */}
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={guide.author?.profilePhoto} />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-gray-900">Author</p>
                  <p className="text-sm text-gray-600">
                    {guide.author?.fullName || "Administrator"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {guide.author?.email}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={() =>
                  navigate(`/admin/career-guides/edit/${guide._id}`)
                }
              >
                <Edit size={16} className="mr-2" /> Update Content
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGuideDetail;
