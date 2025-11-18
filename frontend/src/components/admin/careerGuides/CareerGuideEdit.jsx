import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { careerGuideSchema } from "@/lib/CareerGuideSchema.js"; // Nhớ check đường dẫn schema
import useCareerGuide from "@/hooks/useCareerGuide";
import { categories } from "@/utils/constant.js";

// --- UI COMPONENTS ---
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
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// --- QUILL EDITOR ---
import Quill from "quill";
import "quill/dist/quill.snow.css";

// --- COMPONENT QUILL EDITOR RIÊNG (Tái sử dụng từ trang Create) ---
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
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
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

  return <div ref={editorRef} className="bg-white min-h-[300px] rounded-md" />;
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

  // 2. Load Data & Fill Form
  useEffect(() => {
    const loadGuide = async () => {
      const data = await fetchMyGuideById(id);

      if (!data) {
        // Toast error đã có trong hook
        return navigate("/admin/career-guides");
      }

      // Reset form với dữ liệu lấy về
      form.reset({
        title: data.title || "",
        thumbnail: data.thumbnail || "",
        excerpt: data.excerpt || "",
        category: data.category || "job-search",
        tags: data.tags ? data.tags.join(", ") : "", // Chuyển mảng thành chuỗi
        content: data.content || "",
        isPublished: data.isPublished,
      });

      setLoadingData(false);
    };
    loadGuide();
  }, [id, fetchMyGuideById, form, navigate]);

  const thumbnailValue = form.watch("thumbnail");

  // 3. Handle Submit
  const onSubmit = async (values) => {
    setIsSubmitting(true);

    // Format lại tags từ chuỗi sang mảng
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
      // Điều hướng về trang chi tiết hoặc danh sách
      navigate("/admin/career-guides");
    }
    setIsSubmitting(false);
  };

  // --- LOADING SKELETON ---
  if (loadingData) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in duration-500">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-4 pl-0 hover:pl-2 transition-all"
        onClick={() => navigate("/admin/career-guides")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Career Guide</CardTitle>
          <CardDescription>
            Update your article content and settings.
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
              <Input placeholder="Guide title..." {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            {/* --- EXCERPT --- */}
            <div className="space-y-2">
              <Label>Excerpt / Summary</Label>
              <Textarea
                placeholder="Brief summary..."
                className="h-20"
                {...form.register("excerpt")}
              />
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

            {/* --- CATEGORY & TAGS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
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
                  placeholder="tag1, tag2 (comma separated)"
                  {...form.register("tags")}
                />
              </div>
            </div>

            {/* --- CONTENT (QUILL EDITOR) --- */}
            <div className="space-y-2">
              <Label>
                Content <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="content"
                control={form.control}
                render={({ field }) => (
                  <QuillEditor value={field.value} onChange={field.onChange} />
                )}
              />
              {form.formState.errors.content && (
                <p className="text-sm text-red-500 mt-2">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>

            {/* --- PUBLISH STATUS --- */}
            <div className="flex items-center space-x-2 border p-4 rounded-md bg-slate-50 mt-8">
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
                  className="text-sm font-medium cursor-pointer"
                >
                  Publish immediately
                </label>
                <p className="text-sm text-muted-foreground">
                  Uncheck to switch back to <strong>Draft</strong> mode.
                </p>
              </div>
            </div>

            {/* --- SUBMIT BUTTON --- */}
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerGuideEdit;
