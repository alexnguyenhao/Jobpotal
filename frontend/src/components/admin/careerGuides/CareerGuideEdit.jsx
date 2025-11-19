import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { careerGuideSchema } from "@/lib/CareerGuideSchema.js";
import useCareerGuide from "@/hooks/useCareerGuide";
import { categories } from "@/utils/constant.js";

// --- UI COMPONENTS ---
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Icons
import {
  Loader2,
  ArrowLeft,
  Save,
  FileText,
  LayoutGrid,
  Tag,
  ImageIcon,
  PenLine,
} from "lucide-react";

// --- QUILL EDITOR ---
import Quill from "quill";
import "quill/dist/quill.snow.css";

// --- REUSABLE QUILL COMPONENT ---
const QuillEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    if (!editorRef.current || quillInstance.current) return;

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Write your full article content here...",
      modules: {
        toolbar: [
          [{ header: [2, 3, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
      },
    });

    quillInstance.current = quill;

    // Set initial value
    if (value) {
      quill.root.innerHTML = value;
    }

    quill.on("text-change", () => {
      onChange(quill.root.innerHTML);
    });
  }, []);

  return <div ref={editorRef} className="bg-white min-h-[400px] rounded-md" />;
};

// --- MAIN COMPONENT ---
const CareerGuideEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchMyGuideById, updateGuide } = useCareerGuide();
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Setup Form
  const form = useForm({
    resolver: zodResolver(careerGuideSchema),
    defaultValues: {
      title: "",
      thumbnail: "",
      excerpt: "",
      category: "job-search",
      tags: "",
      content: "",
      isPublished: true,
    },
  });

  const thumbnailValue = form.watch("thumbnail");
  const isPublished = form.watch("isPublished");

  // 2. Load Data & Fill Form
  useEffect(() => {
    const loadGuide = async () => {
      const data = await fetchMyGuideById(id);

      if (!data) {
        return navigate("/admin/career-guides");
      }

      form.reset({
        title: data.title || "",
        thumbnail: data.thumbnail || "",
        excerpt: data.excerpt || "",
        category: data.category || "job-search",
        tags: data.tags ? data.tags.join(", ") : "",
        content: data.content || "",
        isPublished: data.isPublished,
      });

      setLoadingData(false);
    };
    loadGuide();
  }, [id, fetchMyGuideById, form, navigate]);

  // 3. Handle Submit
  const onSubmit = async (values) => {
    setIsSubmitting(true);

    const formattedTags = values.tags
      ? values.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const payload = {
      ...values,
      tags: formattedTags,
      excerpt: values.excerpt?.trim() || undefined,
    };

    const res = await updateGuide(id, payload);

    if (res) {
      navigate("/admin/career-guides");
    }
    setIsSubmitting(false);
  };

  // --- LOADING STATE ---
  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-8 space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <Skeleton className="h-[500px] w-full rounded-xl" />
          </div>
          <div className="col-span-1 space-y-6">
            <Skeleton className="h-60 w-full rounded-xl" />
            <Skeleton className="h-60 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* --- STICKY HEADER --- */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100"
              onClick={() => navigate("/admin/career-guides")}
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                Edit Guide
                <Badge
                  variant="outline"
                  className="font-normal text-xs text-gray-500"
                >
                  ID: {id.slice(-4)}
                </Badge>
              </h1>
              <p className="text-xs text-gray-500">Update article content</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => form.setValue("isPublished", false)}
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#6A38C2] hover:bg-[#5a2ea6]"
              onClick={() => form.setValue("isPublished", true)}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <PenLine className="w-4 h-4 mr-2" />
              )}
              Update & Publish
            </Button>
          </div>
        </header>

        {/* --- MAIN GRID --- */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* === LEFT COLUMN (Content) === */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. Title & Content */}
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" /> Article
                    Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Title</Label>
                    <Input
                      placeholder="Enter article title..."
                      className="text-lg font-medium py-6"
                      {...form.register("title")}
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Body</Label>
                    <div className="border rounded-md focus-within:ring-2 focus-within:ring-ring overflow-hidden">
                      <Controller
                        name="content"
                        control={form.control}
                        render={({ field }) => (
                          <QuillEditor
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                    {form.formState.errors.content && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.content.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 2. Excerpt */}
              <Card className="border-none shadow-md">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-orange-600" /> SEO /
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <Label>Excerpt</Label>
                    <Textarea
                      placeholder="Brief summary for search results..."
                      className="h-24 resize-none"
                      {...form.register("excerpt")}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* === RIGHT COLUMN (Metadata) === */}
            <div className="space-y-6">
              {/* 3. Visibility */}
              <Card className="border-none shadow-md">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                  <CardTitle className="text-base">Visibility</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        {isPublished ? "Published" : "Draft"}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {isPublished
                          ? "Visible to public"
                          : "Hidden from public"}
                      </p>
                    </div>
                    <Controller
                      name="isPublished"
                      control={form.control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 4. Organization */}
              <Card className="border-none shadow-md">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-600" /> Organization
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Controller
                      name="category"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <Input
                      placeholder="career, tips, resume"
                      {...form.register("tags")}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form
                        .watch("tags")
                        ?.split(",")
                        .filter(Boolean)
                        .map((tag, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs font-normal bg-gray-100"
                          >
                            {tag.trim()}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5. Thumbnail */}
              <Card className="border-none shadow-md">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-green-600" /> Thumbnail
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="aspect-video rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden">
                    {thumbnailValue ? (
                      <img
                        src={thumbnailValue}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/300?text=Error")
                        }
                      />
                    ) : (
                      <div className="text-center p-4 text-gray-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <span className="text-xs">No image provided</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...form.register("thumbnail")}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CareerGuideEdit;
