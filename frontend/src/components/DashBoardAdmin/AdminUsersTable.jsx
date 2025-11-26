import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Edit2,
  MoreHorizontal,
  Search,
  Trash2,
  Mail,
  Phone,
} from "lucide-react";
import useAdminUsers from "@/hooks/adminhooks/useAdminUsers";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";

const AdminUsersTable = () => {
  const { users } = useSelector((store) => store.admin);

  const { deleteUser, updateStatusUser } = useAdminUsers();
  const [filterText, setFilterText] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();
  const toggleStatus = (status) => (status === "active" ? "banned" : "active");

  const filteredUsers = users?.filter((user) => {
    if (!filterText) return true;
    const s = filterText.toLowerCase();
    return (
      user?.fullName?.toLowerCase().includes(s) ||
      user?.email?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Users Management</h2>
          <p className="text-sm text-gray-500">
            Total users:
            <span className="font-medium text-gray-900"> {users.length}</span>
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers?.length <= 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-24 text-gray-500"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user._id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <Avatar className="h-10 w-10 border border-gray-200">
                      <AvatarImage src={user.profilePhoto} />
                      <AvatarFallback>{user.fullName?.[0]}</AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell
                    className="font-medium text-gray-900 cursor-pointer"
                    onClick={() => navigate(`/admin/users/${user._id}`)}
                  >
                    {user.fullName}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail size={14} /> {user.email}
                      </div>
                      {user.phoneNumber && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone size={12} /> {user.phoneNumber}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    {user.role === "recruiter" ? (
                      <Badge className="capitalize bg-black text-white">
                        Recruiter
                      </Badge>
                    ) : (
                      <Badge className="capitalize bg-[#6A38C2] text-white">
                        Student
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.status === "active" ? (
                      <Badge className="capitalize bg-green-500 text-white">
                        {user.status}
                      </Badge>
                    ) : (
                      <Badge className="capitalize bg-red-500 text-white">
                        {user.status}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>{user.createdAt?.split("T")[0]}</TableCell>

                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-32 p-0" align="end">
                        <div className="flex flex-col">
                          <div
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() =>
                              updateStatusUser(
                                user._id,
                                toggleStatus(user.status)
                              )
                            }
                          >
                            <Edit2 size={14} />
                            {user.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </div>

                          <div
                            className="flex items-center gap-2 p-2 hover:bg-red-50 text-red-600 cursor-pointer text-sm"
                            onClick={() => {
                              setSelectedUserId(user._id);
                              setOpen(true);
                            }}
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
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteUser(selectedUserId)}
        title="Confirm Delete"
        message="Are you sure you want to delete this user?"
      />
    </div>
  );
};

export default AdminUsersTable;
