import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Edit2, Eye, MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
    const [filterJobs, setFilterJobs] = useState([]);
    const navigate = useNavigate();

    // Lọc công việc dựa trên tìm kiếm
    useEffect(() => {
        const filteredJobs = allAdminJobs?.filter((job) => {
            if (!searchJobByText) return true;
            const searchText = searchJobByText.toLowerCase();
            return (
                job?.title?.toLowerCase().includes(searchText) ||
                job?.company?.name?.toLowerCase().includes(searchText)
            );
        }) || [];
        setFilterJobs(filteredJobs);
    }, [allAdminJobs, searchJobByText]);

    // Empty state
    if (!filterJobs.length) {
        return (
            <div className="text-center py-10 text-gray-500 font-medium">
                No jobs found
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
            <Table>
                <TableCaption className="text-gray-500 text-sm mb-4">
                    A list of your recent posted jobs
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700 py-4">Company Name</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">Role</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">Date</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700 py-4">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs.map((job) => (
                        <TableRow
                            key={job._id}
                            className="hover:bg-gray-50 transition-colors duration-200"
                        >
                            <TableCell className="text-gray-800 py-3">
                                {job?.company?.name || 'N/A'}
                            </TableCell>
                            <TableCell className="text-gray-800 py-3">{job?.title || 'N/A'}</TableCell>
                            <TableCell className="text-gray-800 py-3">
                                {job?.createdAt ? job.createdAt.split('T')[0] : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right py-3">
                                <Popover>
                                    <PopoverTrigger>
                                        <MoreHorizontal className="h-5 w-5 text-gray-500 hover:text-gray-800 cursor-pointer transition-colors" />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-40 bg-white shadow-lg rounded-md border border-gray-200 p-2">
                                        <div
                                            onClick={() => job._id && navigate(`/admin/jobs/${job._id}`)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm cursor-pointer transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4 text-gray-500" />
                                            <span>Edit</span>
                                        </div>
                                        <div
                                            onClick={() => job._id && navigate(`/admin/jobs/${job._id}/applicants`)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm cursor-pointer transition-colors mt-1"
                                        >
                                            <Eye className="w-4 h-4 text-gray-500" />
                                            <span>Applicants</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminJobsTable;