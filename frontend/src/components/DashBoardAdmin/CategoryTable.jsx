import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import useGetAllCategories from "@/hooks/useGetAllCategoris";
import useCategoryAdmin from "@/hooks/adminhooks/useCategoryAdmin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Icons
import {
  Search,
  Loader2,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  Layers,
  LayoutGrid,
} from "lucide-react";

const CategoryTable = () => {
  useGetAllCategories();
  const { categories } = useSelector((state) => state.category);
  const { createCategory, updateCategory, deleteCategory, loading } =
    useCategoryAdmin();
  const [filterText, setFilterText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCategory(null);
    reset({ name: "", description: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setValue("name", category.name);
    setValue("description", category.description);
    setIsDialogOpen(true);
  };

  const onSubmit = async (data) => {
    let success = false;

    if (editingCategory) {
      success = await updateCategory(editingCategory._id, data);
    } else {
      success = await createCategory(data);
    }

    if (success) {
      setIsDialogOpen(false);
      reset();
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Job Categories
          </h1>
          <p className="text-sm text-gray-500">
            Manage job categories for better classification. Total:{" "}
            <span className="font-medium text-gray-900">
              {categories.length}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search category..."
              className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-all"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          <Button
            onClick={handleOpenAdd}
            className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white gap-2 shadow-md shadow-purple-100"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add New</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[50px] text-center">#</TableHead>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[150px]">Created At</TableHead>
              <TableHead className="text-right pr-6 w-[100px]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat, index) => (
                <TableRow
                  key={cat._id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="text-center text-gray-500 font-medium">
                    {index + 1}
                  </TableCell>

                  <TableCell className="font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-purple-50 rounded text-[#6A38C2]">
                        <LayoutGrid size={16} />
                      </div>
                      {cat.name}
                    </div>
                  </TableCell>

                  <TableCell className="text-gray-500 truncate max-w-[300px]">
                    {cat.description || (
                      <span className="italic text-gray-300">
                        No description
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="text-gray-500 text-sm">
                    {new Date(cat.createdAt).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-gray-900"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-1" align="end">
                        <div className="flex flex-col gap-1">
                          <div
                            onClick={() => handleOpenEdit(cat)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                          >
                            <Pencil size={14} className="text-blue-500" />
                            Edit
                          </div>

                          <div
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this category?"
                                )
                              ) {
                                deleteCategory(cat._id);
                              }
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                          >
                            <Trash2 size={14} />
                            Delete
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Layers className="h-6 w-6 text-gray-400" />
                    </div>
                    <p>No categories found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Design, Development..."
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <span className="text-xs text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Short description about this category..."
                className="resize-none h-24"
                {...register("description")}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#6A38C2] hover:bg-[#5b30a6]"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingCategory ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryTable;
