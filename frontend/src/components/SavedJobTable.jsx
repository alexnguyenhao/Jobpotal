import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import useSavedJobs from "@/hooks/useSavedJobs.jsx";
import { Link } from "react-router-dom";
import { Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const SavedJobTable = () => {
  const { savedJobs, fetchSavedJobs, unsaveJob } = useSavedJobs();
  const { loading } = useSelector((store) => store.job);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500 text-sm">
        Loading saved jobs...
      </div>
    );

  if (!savedJobs || savedJobs.length === 0)
    return (
      <div className="text-center py-10 text-gray-500 italic">
        You haven’t saved any jobs yet ❤️
      </div>
    );

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white/60 backdrop-blur-sm">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableCell className="font-semibold text-gray-700">#</TableCell>
            <TableCell className="font-semibold text-gray-700">
              Job Title
            </TableCell>
            <TableCell className="font-semibold text-gray-700">
              Company
            </TableCell>
            <TableCell className="font-semibold text-gray-700">
              Location
            </TableCell>
            <TableCell className="font-semibold text-gray-700 text-center">
              Action
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {savedJobs.map((job, index) => (
            <TableRow key={job._id} className="hover:bg-gray-50 transition">
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Link
                  to={`/description/${job._id}`}
                  className="text-[#6a38c2] font-medium hover:underline flex items-center gap-1"
                >
                  {job.title}
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </TableCell>
              <TableCell>{job.company?.name || "—"}</TableCell>
              <TableCell>{job.location?.province || "—"}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => unsaveJob(job._id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SavedJobTable;
