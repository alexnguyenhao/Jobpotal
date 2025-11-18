import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useCareerGuide from "@/hooks/useCareerGuide";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DOMPurify from "dompurify";

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
} from "lucide-react";
import { toast } from "sonner";

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
        // Đã xử lý toast lỗi bên trong hook, ở đây chỉ cần điều hướng
        return navigate("/admin/career-guides");
      }
      setGuide(data);
      setLoading(false);
    };
    load();
  }, [id]);

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
      // Toast success đã có trong hook
      navigate("/admin/career-guides");
    } else {
      setIsDeleting(false);
    }
  };

  // --- LOADING SKELETON ---
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-24" /> {/* Back button */}
          <Skeleton className="h-12 w-3/4" /> {/* Title */}
          <div className="flex gap-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" /> {/* Image */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!guide) return null;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 md:px-8 animate-in fade-in duration-500">
      {/* 1. TOP NAVIGATION & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/career-guides")}
          className="pl-0 hover:pl-2 transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>

        <div className="flex gap-3 w-full md:w-auto">
          <Button asChild variant="outline" className="flex-1 md:flex-none">
            <Link to={`/admin/career-guides/edit/${guide._id}`}>
              <Edit size={16} className="mr-2 text-blue-600" /> Edit Guide
            </Link>
          </Button>

          <Button
            variant="destructive"
            className="flex-1 md:flex-none"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              "Deleting..."
            ) : (
              <>
                <Trash2 size={16} className="mr-2" /> Delete
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. MAIN CONTENT (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Category */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge
                variant={guide.isPublished ? "default" : "secondary"}
                className={
                  guide.isPublished ? "bg-green-600 hover:bg-green-700" : ""
                }
              >
                {guide.isPublished ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Published
                  </>
                ) : (
                  <>
                    <FileText className="w-3 h-3 mr-1" /> Draft
                  </>
                )}
              </Badge>
              <Badge
                variant="outline"
                className="uppercase tracking-wide text-xs font-semibold"
              >
                {guide.category}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {guide.title}
            </h1>
          </div>

          {/* Meta Info Row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={guide.author?.profilePhoto} />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="font-medium text-gray-700">
                {guide.author?.fullName || "Unknown Author"}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar size={14} />{" "}
              {new Date(guide.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {guide.readingTime} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} /> {guide.views} views
            </span>
          </div>

          {/* Excerpt (Lead Paragraph) */}
          {guide.excerpt && (
            <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-primary italic text-gray-600">
              {guide.excerpt}
            </div>
          )}

          {/* Thumbnail Image */}
          {guide.thumbnail ? (
            <img
              src={guide.thumbnail}
              alt={guide.title}
              className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-sm border"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              No thumbnail provided
            </div>
          )}

          {/* HTML Content Body */}
          <Separator />
          <article
            className="
    prose prose-slate max-w-none lg:prose-lg
    prose-headings:font-semibold prose-a:text-blue-600
    prose-img:rounded-lg prose-img:shadow
    prose-pre:bg-gray-900 prose-pre:text-white
  "
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(guide.content),
            }}
          />

          {/* Footer Tags */}
          {guide.tags && guide.tags.length > 0 && (
            <div className="pt-6 border-t mt-8">
              <span className="text-sm font-semibold text-gray-500 mr-3">
                Tags:
              </span>
              <div className="inline-flex flex-wrap gap-2">
                {guide.tags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="hover:bg-slate-200 cursor-pointer"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. SIDEBAR (Right Column - Optional Info) */}
        <div className="space-y-6">
          {/* Quick Stats Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">Performance</h3>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {guide.views}
                  </div>
                  <div className="text-xs text-gray-500">Total Views</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-xs text-gray-500">SEO Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CareerGuideDetail;
