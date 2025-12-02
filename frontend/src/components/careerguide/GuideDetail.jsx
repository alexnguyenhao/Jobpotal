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
import { toast } from "sonner";

// Icons
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  Bookmark,
  CheckCircle2,
  Tag,
} from "lucide-react";

const StudentGuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchGuideDetail } = useCareerGuide();

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchGuideDetail(id);
        if (!data) {
          navigate("/career-guides"); // Đã kiểm tra: đường dẫn này đúng với router của bạn
        } else {
          setGuide(data);
        }
      } catch (error) {
        console.error("Error loading guide:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked ? "Removed from bookmarks" : "Added to bookmarks"
    );
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <Skeleton className="h-10 w-32" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="flex gap-4 items-center">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <div className="space-y-3 pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!guide) return null;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* --- STICKY NAVBAR --- */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-[#6A38C2] hover:bg-purple-50 rounded-full pl-2 pr-4 transition-colors group"
            onClick={() => navigate("/career-guides")}
          >
            <ArrowLeft
              size={18}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Back to Guides</span>
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full transition-colors hover:bg-gray-100 ${
                isBookmarked ? "text-[#6A38C2] bg-purple-50" : "text-gray-500"
              }`}
              onClick={handleBookmark}
            >
              <Bookmark
                size={20}
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-500 hover:bg-gray-100 hover:text-[#6A38C2] transition-colors"
              onClick={handleShare}
            >
              <Share2 size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <article className="max-w-3xl mx-auto px-6 mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge className="bg-purple-100 text-[#6A38C2] hover:bg-purple-200 border-none px-3 py-1 text-xs font-bold tracking-wide uppercase rounded-full cursor-pointer">
              {guide.category?.replace("-", " ")}
            </Badge>
            <span className="text-gray-300 text-sm">•</span>
            <span className="text-gray-500 text-sm font-medium flex items-center gap-1.5">
              <Calendar size={14} />{" "}
              {new Date(guide.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-8 tracking-tight">
            {guide.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarImage src={guide.author?.profilePhoto} />
                <AvatarFallback className="bg-purple-200 text-purple-700 font-bold">
                  {guide.author?.fullName?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  {guide.author?.fullName || "Unknown Author"}
                  <CheckCircle2
                    size={14}
                    className="text-blue-500"
                    fill="white"
                  />
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  Content Creator
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 text-sm text-gray-500 font-medium border-t sm:border-t-0 border-slate-200 pt-4 sm:pt-0">
              <span className="flex items-center gap-1.5">
                <Clock size={16} className="text-[#6A38C2]" />{" "}
                {guide.readingTime} min read
              </span>
              <div className="h-1 w-1 rounded-full bg-gray-300"></div>
              <span className="flex items-center gap-1.5">
                <Eye size={16} className="text-[#6A38C2]" /> {guide.views} views
              </span>
            </div>
          </div>
        </header>

        {guide.excerpt && (
          <div className="text-lg md:text-xl text-gray-600 italic leading-relaxed mb-10 pl-6 border-l-4 border-[#6A38C2] py-1">
            {guide.excerpt}
          </div>
        )}

        {guide.thumbnail && (
          <figure className="mb-12 group overflow-hidden rounded-2xl shadow-lg border border-gray-100">
            <img
              src={guide.thumbnail}
              alt={guide.title}
              className="w-full h-auto max-h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </figure>
        )}

        <div
          className="
            prose prose-lg prose-slate max-w-none 
            prose-headings:font-bold prose-headings:text-gray-900 
            prose-p:text-gray-700 prose-p:leading-8
            prose-a:text-[#6A38C2] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-md
            prose-blockquote:border-l-[#6A38C2] prose-blockquote:bg-purple-50/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-600
            prose-li:marker:text-[#6A38C2]
            prose-code:text-[#6A38C2] prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-code:font-normal
          "
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(guide.content),
          }}
        />

        <Separator className="my-12" />

        {guide.tags && guide.tags.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold uppercase tracking-wider text-sm">
              <Tag size={16} className="text-[#6A38C2]" /> Related Topics
            </div>
            <div className="flex flex-wrap gap-2">
              {guide.tags.map((tag, idx) => (
                <Link
                  to={`/career-guides?keyword=${encodeURIComponent(tag)}`}
                  key={idx}
                >
                  <Badge
                    variant="outline"
                    className="px-4 py-1.5 text-sm bg-slate-50 text-slate-600 border-slate-200 hover:border-[#6A38C2] hover:text-[#6A38C2] hover:bg-white cursor-pointer transition-all rounded-full font-medium"
                  >
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default StudentGuideDetail;
