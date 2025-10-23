import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog.js";
import { Label } from "@/components/ui/label.js";
import { Input } from "@/components/ui/input.js";
import { Button } from "@/components/ui/button.js";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant.js";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice.js";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    address: user?.address || "",
    bio: user?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    file: user?.profile?.resume || null,
    careerObjective: user?.profile?.careerObjective || "",
  });

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(input).forEach((key) => {
      if (input[key]) formData.append(key, input[key]);
    });

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { "content-type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden rounded-xl">
        <DialogHeader className="sticky top-0 bg-white z-10 pb-3 border-b">
          <DialogTitle className="text-lg font-bold">
            Update Profile
          </DialogTitle>
          <DialogDescription>
            Edit your personal and professional information below.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Form */}
        <form
          onSubmit={submitHandler}
          className="overflow-y-auto max-h-[65vh] px-1"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                value={input.fullName}
                onChange={changeEventHandler}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={input.email}
                onChange={changeEventHandler}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="+1 234 567 890"
                value={input.phoneNumber}
                onChange={changeEventHandler}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Main St, New York"
                value={input.address}
                onChange={changeEventHandler}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                name="bio"
                placeholder="Short introduction about yourself"
                value={input.bio}
                onChange={changeEventHandler}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="careerObjective">Career Objective</Label>
              <Input
                id="careerObjective"
                name="careerObjective"
                placeholder="Your career objective"
                value={input.careerObjective}
                onChange={changeEventHandler}
              />
              <p className="text-xs text-gray-500">
                A brief statement about your professional goals
              </p>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                name="skills"
                placeholder="React, Node.js, MongoDB"
                value={input.skills}
                onChange={changeEventHandler}
              />
              <p className="text-xs text-gray-500">
                Separate skills with commas (,)
              </p>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="file">Resume</Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="application/pdf"
                onChange={fileChangeHandler}
              />
              {input.file && (
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {typeof input.file === "string"
                    ? input.file.split("/").pop()
                    : input.file.name}
                </p>
              )}
            </div>
          </div>

          {/* Sticky Footer */}
          <DialogFooter className="sticky bottom-0 bg-white pt-3 border-t">
            {loading ? (
              <Button className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Update Profile
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
