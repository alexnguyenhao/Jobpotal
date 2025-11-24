import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { careerGuideSchema } from "@/lib/CareerGuideSchema.js";
import useCareerGuide from "@/hooks/useCareerGuide";
import { categories } from "@/utils/constant.js";

// --- UI COMPONENTS ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import {
  Loader2,
  ArrowLeft,
  ImageIcon,
} from "lucide-react";

// --- QUILL EDITOR ---
import Quill from "quill";
import "quill/dist/quill.snow.css";

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
      isPublished: false,
    },
  });

  const thumbnailValue = form.watch("thumbnail");

  // 2. Load Data
  useEffect(() => {
    const loadGuide = async () => {
      const data = await fetchMyGuideById(id);

      if (!data) {
        return navigate("/recruiter/career-guides");
      }

      form.reset({
        title: data.title || "",
        thumbnail: data.thumbnail || "",
        excerpt: data.excerpt || "",
        category: data.category || "job-search",
        tags: data.tags ? data.tags.join(", ") : "",
        content: data.content || "",
        isPublished: data.isPublished || false,
      });

      setLoadingData(false);
    };
    loadGuide();
  }, [id]);

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
      navigate("/recruiter/career-guides");
    }
    setIsSubmitting(false);
  };

  // --- LOADING STATE ---
  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-10 px-4 md:px-8">
         <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-4 items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            <div className="bg-white rounded-2xl p-8 space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-60 w-full" />
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* --- HEADER --- */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate("/recruiter/career-guides")}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              Edit Guide
              <Badge variant="outline" className="text-gray-500 font-normal text-xs px-2 py-0.5 h-6">
                ID: {id.slice(-4)}
              </Badge>
            </h1>
            <p className="text-sm text-gray-500">
              Update article content and settings.
            </p>
          </div>
        </div>

        {/* --- MAIN FORM CONTAINER --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="p-8 space-y-8">
                
                {/* --- 1. ARTICLE DETAILS --- */}
                <Section title="Article Details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>
                            Title <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 10 Tips for Interview"
                              className="text-lg font-medium"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                  {c.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Excerpt (SEO Description)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="A short summary shown in search results..."
                              className="min-h-[80px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Section>

                {/* --- 2. CONTENT (QUILL) --- */}
                <Section title="Content">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                           <div className="border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                            <QuillEditor
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Section>

                {/* --- 3. MEDIA & TAGS --- */}
                <Section title="Media & Tags">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col md:flex-row gap-6">
                       {/* Preview */}
                       <div className="w-full md:w-1/3 shrink-0">
                          <FormLabel className="block mb-2">Thumbnail Preview</FormLabel>
                          <div className="aspect-video rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden relative">
                            {thumbnailValue ? (
                              <img
                                src={thumbnailValue}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/300?text=Invalid+URL";
                                }}
                              />
                            ) : (
                              <div className="text-center p-4">
                                <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <span className="text-xs text-gray-400">No image</span>
                              </div>
                            )}
                          </div>
                       </div>

                       {/* Inputs */}
                       <div className="flex-1 space-y-4">
                          <FormField
                            control={form.control}
                            name="thumbnail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Thumbnail URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tags (Comma separated)</FormLabel>
                                <FormControl>
                                  <Input placeholder="career, tips, resume" {...field} />
                                </FormControl>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {field.value?.split(",").filter(Boolean).map((tag, i) => (
                                    <Badge key={i} variant="secondary" className="font-normal bg-gray-100 text-gray-700 hover:bg-gray-200">
                                      {tag.trim()}
                                    </Badge>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                       </div>
                    </div>
                  </div>
                </Section>

                {/* --- 4. SETTINGS --- */}
                <Section title="Settings" isLast>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="isPublished"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-white">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Publish Status</FormLabel>
                            <div className="text-sm text-gray-500">
                              {field.value ? (
                                <span className="text-green-600 font-medium flex items-center gap-1">● Published</span>
                              ) : (
                                <span className="text-amber-600 font-medium flex items-center gap-1">● Draft</span>
                              )}
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </Section>
              </div>

              {/* --- FOOTER ACTION --- */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/recruiter/career-guides")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#6A38C2] hover:bg-[#5a2ea6] text-white min-w-[150px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
const Section = ({ title, children, isLast }) => (
  <div className={`${!isLast ? "border-b border-gray-100 pb-8" : ""}`}>
    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
      {title}
    </h3>
    {children}
  </div>
);

// Quill Editor Component
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

    if (value) {
      quill.root.innerHTML = value;
    }

    quill.on("text-change", () => {
      onChange(quill.root.innerHTML);
    });
  }, []); // Empty dependency to init once

  return <div ref={editorRef} className="bg-white min-h-[400px]" />;
};

export default CareerGuideEdit;