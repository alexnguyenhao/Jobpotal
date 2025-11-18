import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { careerGuideSchema } from "@/lib/CareerGuideSchema.js";
import useCareerGuide from "@/hooks/useCareerGuide";
import { categories } from "@/utils/constant.js";

// Shadcn UI Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Career Guide</CardTitle>
          <CardDescription>
            Write and publish a new career guide article for students.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="mt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* --- TITLE --- */}
            <div className="space-y-2">
              <Label>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="E.g., How to ace your technical interview..."
                {...form.register("title")}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            {/* --- EXCERPT (New) --- */}
            <div className="space-y-2">
              <Label>Excerpt / Summary (Optional)</Label>
              <Textarea
                placeholder="Brief summary of the article (max 300 chars). If left empty, it will be auto-generated."
                className="h-20"
                {...form.register("excerpt")}
              />
              {form.formState.errors.excerpt && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.excerpt.message}
                </p>
              )}
            </div>

            {/* --- THUMBNAIL --- */}
            <div className="space-y-2">
              <Label>Thumbnail URL</Label>
              <Input
                placeholder="https://example.com/image.jpg"
                {...form.register("thumbnail")}
              />
              {thumbnailValue && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                  <img
                    src={thumbnailValue}
                    alt="Preview"
                    onError={(e) => (e.target.style.display = "none")}
                    className="w-full max-w-md rounded-md border h-48 object-cover"
                  />
                </div>
              )}
            </div>

            {/* --- CATEGORY & TAGS (Grid Layout) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
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
                        <SelectValue placeholder="Select a category" />
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
                {form.formState.errors.category && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <Input
                  placeholder="e.g. career, interview, tips"
                  {...form.register("tags")}
                />
                <p className="text-xs text-gray-500">
                  Separate tags with commas.
                </p>
              </div>
            </div>

            {/* --- CONTENT --- */}
            <div className="space-y-2">
              <Label>
                Content <span className="text-red-500">*</span>
              </Label>

              <Controller
                name="content"
                control={form.control}
                render={({ field }) => {
                  const quillRef = useRef(null);
                  const editorRef = useRef(null);

                  useEffect(() => {
                    if (!editorRef.current) {
                      editorRef.current = new Quill(quillRef.current, {
                        theme: "snow",
                        placeholder: "Write your full article content here...",
                        modules: {
                          toolbar: [
                            [{ header: [1, 2, 3, false] }],
                            ["bold", "italic", "underline"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["link", "image"],
                            ["clean"],
                          ],
                        },
                      });

                      // Nếu đang edit → set HTML
                      if (field.value) {
                        editorRef.current.root.innerHTML = field.value;
                      }

                      // Lắng nghe thay đổi
                      editorRef.current.on("text-change", () => {
                        field.onChange(editorRef.current.root.innerHTML);
                      });
                    }
                  }, []);

                  return (
                    <div
                      ref={quillRef}
                      className="bg-white min-h-[250px] rounded-md"
                    ></div>
                  );
                }}
              />

              {form.formState.errors.content && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>

            {/* --- PUBLISH STATUS (Checkbox) --- */}
            <div className="flex items-center space-x-2 border p-4 rounded-md bg-slate-50">
              <Controller
                name="isPublished"
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    id="isPublished"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="isPublished"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Publish immediately
                </label>
                <p className="text-sm text-muted-foreground">
                  Uncheck to save as a <strong>Draft</strong>.
                </p>
              </div>
            </div>

            {/* --- SUBMIT BUTTON --- */}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {form.watch("isPublished") ? "Publish Guide" : "Save Draft"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerGuideCreate;
