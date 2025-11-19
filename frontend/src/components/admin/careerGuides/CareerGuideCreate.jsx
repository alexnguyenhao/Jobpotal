import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { careerGuideSchema } from "@/lib/CareerGuideSchema.js";
import useCareerGuide from "@/hooks/useCareerGuide";
import { categories } from "@/utils/constant.js";

// Shadcn UI Components
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
import { Switch } from "@/components/ui/switch"; // Changed Checkbox to Switch for better UI
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Icons
import {
  Loader2,
  ArrowLeft,
  Save,
  Send,
  ImageIcon,
  FileText,
  Tag,
  LayoutGrid,
} from "lucide-react";

// Rich Text Editor
import Quill from "quill";
import "quill/dist/quill.snow.css";

const CareerGuideCreate = () => {
  const navigate = useNavigate();
  const { createGuide, loading } = useCareerGuide();

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

  // 2. Handle Submit
  const onSubmit = async (values) => {
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

    const res = await createGuide(payload);

    if (res) {
      navigate("/admin/career-guides");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* --- TOP NAVIGATION BAR --- */}
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
              <h1 className="text-lg font-semibold text-gray-900">
                Create Guide
              </h1>
              <p className="text-xs text-gray-500">New article for students</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              variant="outline"
              disabled={loading}
              onClick={() => form.setValue("isPublished", false)}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#6A38C2] hover:bg-[#5a2ea6]"
              onClick={() => form.setValue("isPublished", true)}
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Publish
            </Button>
          </div>
        </header>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* === LEFT COLUMN (CONTENT) === */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. MAIN WRITING AREA */}
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
                      placeholder="e.g., 10 Tips to Ace Your Technical Interview"
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
                    <Label>Content</Label>
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

              {/* 2. EXCERPT */}
              <Card className="border-none shadow-md">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-orange-600" /> Search
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <Label>Excerpt / Summary</Label>
                    <Textarea
                      placeholder="A short description shown in search results (SEO)..."
                      className="h-24 resize-none"
                      {...form.register("excerpt")}
                    />
                    <p className="text-xs text-gray-400 text-right">
                      {form.watch("excerpt")?.length || 0} / 300 characters
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* === RIGHT COLUMN (METADATA) === */}
            <div className="space-y-6">
              {/* 3. PUBLISH SETTINGS */}
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
                          ? "Visible to all students"
                          : "Only visible to admins"}
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

              {/* 4. ORGANIZATION */}
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
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
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
                      placeholder="interview, resume, tips"
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
                            className="text-xs font-normal"
                          >
                            {tag.trim()}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5. THUMBNAIL */}
              <Card className="border-none shadow-md">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-green-600" /> Thumbnail
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="aspect-video rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden relative group">
                    {thumbnailValue ? (
                      <img
                        src={thumbnailValue}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300?text=Invalid+URL";
                        }}
                      />
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <span className="text-xs text-gray-400">
                          No image provided
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      placeholder="https://..."
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

// --- ISOLATED QUILL COMPONENT FOR CLEANER CODE ---
const QuillEditor = ({ value, onChange }) => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current && quillRef.current) {
      editorRef.current = new Quill(quillRef.current, {
        theme: "snow",
        placeholder: "Write your insightful career guide here...",
        modules: {
          toolbar: [
            [{ header: [2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link"], // Removed 'image' for security/simplicity unless handled
            ["clean"],
          ],
        },
      });

      // Initial Value
      if (value) {
        editorRef.current.root.innerHTML = value;
      }

      // Change Handler
      editorRef.current.on("text-change", () => {
        onChange(editorRef.current.root.innerHTML);
      });
    }
  }, []);

  return <div ref={quillRef} className="bg-white min-h-[300px]" />;
};

export default CareerGuideCreate;
