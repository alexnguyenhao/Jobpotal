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

export default function UpdateWorkExperienceDialog({ open, setOpen }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [experiences, setExperiences] = useState([]);

  // Khi mở dialog thì load dữ liệu từ redux user
  useEffect(() => {
    if (open) {
      setExperiences(
        user?.profile?.workExperience?.length > 0
          ? user.profile.workExperience
          : [
              {
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                description: "",
              },
            ]
      );
    }
  }, [open, user]);

  const handleChange = (index, field, value) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const removeExperience = (index) => {
    const updated = experiences.filter((_, i) => i !== index);
    setExperiences(updated);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        { workExperience: experiences },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user)); // cập nhật lại redux
        toast.success("Cập nhật Work Experience thành công!");
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
          <DialogTitle>Kinh nghiệm làm việc</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="border p-4 rounded-xl shadow-sm space-y-2 bg-gray-50"
            >
              <Input
                placeholder="Công ty"
                value={exp.company}
                onChange={(e) => handleChange(index, "company", e.target.value)}
              />
              <Input
                placeholder="Vị trí"
                value={exp.position}
                onChange={(e) =>
                  handleChange(index, "position", e.target.value)
                }
              />
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={exp.startDate}
                  onChange={(e) =>
                    handleChange(index, "startDate", e.target.value)
                  }
                />
                <Input
                  type="date"
                  value={exp.endDate}
                  onChange={(e) =>
                    handleChange(index, "endDate", e.target.value)
                  }
                />
              </div>
              <Textarea
                placeholder="Mô tả công việc"
                value={exp.description}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeExperience(index)}
                className="mt-2"
              >
                Xóa kinh nghiệm này
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={addExperience}>
            + Thêm kinh nghiệm
          </Button>
          <Button onClick={handleSubmit}>Lưu</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
