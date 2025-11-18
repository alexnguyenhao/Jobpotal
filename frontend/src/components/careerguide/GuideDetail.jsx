import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useCareerGuide from "@/hooks/useCareerGuide";
import DOMPurify from "dompurify";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

// Icons
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  Bookmark,
} from "lucide-react";

const StudentGuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchGuideDetail } = useCareerGuide();

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchGuideDetail(id);
      if (!data) {
        navigate("/career-guides");
      } else {
        setGuide(data);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-12 w-3/4" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (!guide) return null;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Navbar Sticky */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-[#6A38C2] hover:bg-purple-50 rounded-full"
            onClick={() => navigate("/career-guides")}
          >
            <ArrowLeft size={18} className="mr-2" /> Back
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100 hover:text-[#6A38C2]"
            >
              <Bookmark size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100 hover:text-[#6A38C2]"
            >
              <Share2 size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-3xl mx-auto px-6 mt-10 animate-in fade-in duration-500">
        {/* Header */}
        <header className="mb-10 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
            <Badge className="bg-purple-100 text-[#6A38C2] hover:bg-purple-200 border-none px-3 py-1 text-xs font-bold tracking-wide uppercase rounded-full">
              {guide.category?.replace("-", " ")}
            </Badge>
            <span className="text-gray-300 text-sm">•</span>
            <span className="text-gray-500 text-sm font-medium flex items-center gap-1">
              <Calendar size={14} />{" "}
              {new Date(guide.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-8">
            {guide.title}
          </h1>

          {/* Author Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarImage src={guide.author?.profilePhoto} />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">
                  {guide.author?.fullName || "Unknown Author"}
                </p>
                <p className="text-xs text-gray-500">Content Creator</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock size={16} className="text-[#6A38C2]" />{" "}
                {guide.readingTime} min read
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={16} className="text-[#6A38C2]" /> {guide.views} views
              </span>
            </div>
          </div>
        </header>

        {/* Excerpt */}
        {guide.excerpt && (
          <div className="text-lg md:text-xl text-gray-600 italic leading-relaxed mb-10 pl-6 border-l-4 border-[#6A38C2]">
            {guide.excerpt}
          </div>
        )}

        {/* Image */}
        {guide.thumbnail && (
          <figure className="mb-12">
            <img
              src={guide.thumbnail}
              alt={guide.title}
              className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-lg"
            />
          </figure>
        )}

        {/* Content Body */}
        <div
          className="prose prose-lg prose-slate max-w-none 
            prose-headings:font-bold prose-headings:text-gray-900 
            prose-p:text-gray-700 prose-p:leading-8
            prose-a:text-[#6A38C2] prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-md
            prose-blockquote:border-l-[#6A38C2] prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(guide.content),
          }}
        />

        <Separator className="my-12" />

        {/* Tags Footer */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
            Related Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {guide.tags?.map((tag, idx) => (
              <Link to={`/career-guide?keyword=${tag}`} key={idx}>
                <Badge
                  variant="outline"
                  className="px-4 py-1.5 text-sm bg-gray-50 text-gray-600 border-gray-200 hover:border-[#6A38C2] hover:text-[#6A38C2] cursor-pointer transition-all rounded-full"
                >
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default StudentGuideDetail;
