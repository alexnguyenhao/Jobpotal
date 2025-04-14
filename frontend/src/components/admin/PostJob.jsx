import React, { useState } from 'react';
import NavBar from "@/components/shared/NavBar.jsx";
import { Label } from "@/components/ui/label.js";
import { Input } from "@/components/ui/input.js";
import { Textarea } from "@/components/ui/textarea.js"; // Giả sử bạn có component Textarea
import { Button } from "@/components/ui/button.js";
import {useSelector} from "react-redux";
import {Select} from "@radix-ui/react-select";
import {
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.js";
import axios from "axios";
import {JOB_API_END_POINT} from "@/utils/constant.js";
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";
import {Loader2} from "lucide-react"; // Giả sử bạn có component Button


const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {companies} = useSelector(store =>store.company)

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        setInput({...input,companyId: selectedCompany._id});
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log(input);
        try {
            setIsLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`,input,{
                headers:{
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs")
            }
        }catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }finally {
            setIsLoading(false)
        }

    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="container mx-auto px-4 py-10 pt-[80px]">
                <h1 className="text-3xl font-bold text-center mb-8">Post a New Job</h1>
                <form
                    onSubmit={submitHandler}
                    className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                                Job Title
                            </Label>
                            <Input
                                id="title"
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 rounded-md"
                                placeholder="e.g. Software Engineer"
                            />
                        </div>
                        <div>
                            <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                                Location
                            </Label>
                            <Input
                                id="location"
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 rounded-md"
                                placeholder="e.g. San Francisco, CA"
                            />
                        </div>
                        <div>
                            <Label htmlFor="salary" className="text-sm font-medium text-gray-700">
                                Salary
                            </Label>
                            <Input
                                id="salary"
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 rounded-md"
                                placeholder="e.g. $80,000 - $120,000"
                            />
                        </div>
                        <div>
                            <Label htmlFor="jobType" className="text-sm font-medium text-gray-700">
                                Job Type
                            </Label>
                            <Input
                                id="jobType"
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 rounded-md"
                                placeholder="e.g. Full-time, Remote"
                            />
                        </div>
                        <div>
                            <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                                Experience Level
                            </Label>
                            <Input
                                id="experience"
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 rounded-md"
                                placeholder="e.g. 3+ years"
                            />
                        </div>
                        <div>
                            <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                                Number of Positions
                            </Label>
                            <Input
                                id="position"
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 rounded-md"
                                placeholder="e.g. 2"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                Job Description
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 rounded-md"
                                rows={5}
                                placeholder="Describe the job responsibilities and qualifications..."
                            />
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="requirements" className="text-sm font-medium text-gray-700">
                                Requirements
                            </Label>
                            <Textarea
                                id="requirements"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 rounded-md"
                                rows={5}
                                placeholder="List the required skills and qualifications..."
                            />
                        </div>
                        {
                            companies.length > 0 &&(
                                <Select onValueChange={selectChangeHandler}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a company"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                companies.map((company) => {
                                                    return(<SelectItem value={company?.name?.toLowerCase()}>{company?.name}</SelectItem>)
                                                })
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )
                        }
                    </div>
                   <div>
                       {isLoading ? (
                           <Button disabled className="w-full my-4  text-white ">
                               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                               Please wait
                           </Button>
                       ) : (
                           <Button
                               type="submit"
                               className="w-full my-4 text-white  rounded-md py-2"
                           >
                               Post New Job
                           </Button>
                       )}
                       {
                           companies.length === 0 && <p className='text-xs text-red-600 font-bold text-center my-3'>*Please register company first, before posting jobs</p>
                       }
                   </div>
                </form>
            </div>
        </div>
    );
};

export default PostJob;