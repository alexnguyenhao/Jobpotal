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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Edit2, MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector((store) => store.company);
  const [filterCompany, setFilterCompany] = useState([]);
  const navigate = useNavigate();

  // Lọc công ty dựa trên tìm kiếm
  useEffect(() => {
    const filteredCompany = companies?.filter((company) => {
      if (!searchCompanyByText) return true;
      return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
    }) || [];
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);

  // Empty state
  if (!filterCompany.length) {
    return (
        <div className="text-center py-10 text-gray-500 font-medium">
          No companies found
        </div>
    );
  }

  return (
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <Table>
          <TableCaption className="text-gray-500 text-sm mb-4">
            A list of your recent registered companies
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700 py-4">Logo</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">Name</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">Date</TableHead>
              <TableHead className="text-right font-semibold text-gray-700 py-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterCompany.map((company) => (
                <TableRow
                    key={company._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <TableCell className="py-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={company?.logo} alt={company?.name} />
                      <AvatarFallback className="bg-gray-100 text-gray-600">
                        {company?.name?.charAt(0) || 'C'}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="text-gray-800 py-3">{company?.name || 'N/A'}</TableCell>
                  <TableCell className="text-gray-800 py-3">
                    {company?.createdAt ? company.createdAt.split('T')[0] : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <Popover>
                      <PopoverTrigger>
                        <MoreHorizontal className="h-5 w-5 text-gray-500 hover:text-gray-800 cursor-pointer transition-colors" />
                      </PopoverTrigger>
                      <PopoverContent className="w-40 bg-white shadow-lg rounded-md border border-gray-200 p-2">
                        <div
                            onClick={() => company._id && navigate(`/admin/companies/${company._id}`)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm cursor-pointer transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-500" />
                          <span>Edit</span>
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

export default CompaniesTable;