import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { USER_API_END_POINT } from "@/utils/constant";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

export default function UpdateProjectsDialog({ open, setOpen }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [projects, setProjects] = useState([]);

  // Khi mở dialog thì load dữ liệu từ redux user
  useEffect(() => {
    if (open) {
      setProjects(
        user?.profile?.projects?.length > 0
          ? user.profile.projects
          : [
              {
                title: "",
                description: "",
                link: "",
                technologies: [],
              },
            ]
      );
    }
  }, [open, user]);

  // Cập nhật giá trị
  const handleChange = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  // Thêm project mới
  const addProject = () => {
    setProjects([
      ...projects,
      {
        title: "",
        description: "",
        link: "",
        technologies: [],
      },
    ]);
  };

  // Xóa project
  const removeProject = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
  };

  // Cập nhật technologies (chuỗi → mảng)
  const handleTechnologiesChange = (index, value) => {
    const updated = [...projects];
    updated[index].technologies = value
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    setProjects(updated);
  };

  // Gửi request lên server
  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        { projects },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user)); // cập nhật lại redux
        toast.success("Cập nhật Projects thành công!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Dự án cá nhân / học tập</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {projects.map((proj, index) => (
            <div
              key={index}
              className="border p-4 rounded-xl shadow-sm space-y-2 bg-gray-50"
            >
              <Input
                placeholder="Tên dự án"
                value={proj.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
              />
              <Textarea
                placeholder="Mô tả ngắn gọn về dự án"
                value={proj.description}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
              />
              <Input
                placeholder="Liên kết (GitHub, Behance, Drive...)"
                value={proj.link}
                onChange={(e) => handleChange(index, "link", e.target.value)}
              />
              <Input
                placeholder="Công nghệ / công cụ (phân tách bằng dấu phẩy)"
                value={proj.technologies?.join(", ") || ""}
                onChange={(e) =>
                  handleTechnologiesChange(index, e.target.value)
                }
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeProject(index)}
                className="mt-2"
              >
                Xóa dự án này
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={addProject}>
            + Thêm dự án
          </Button>
          <Button onClick={handleSubmit}>Lưu</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
