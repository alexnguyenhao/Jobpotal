import React from 'react'
import {Button} from "@/components/ui/button.js";
import {Bookmark} from "lucide-react";
import {Avatar, AvatarImage} from "@/components/ui/avatar.js";
import {Badge} from "@/components/ui/badge.js";
import {useNavigate} from "react-router-dom";
 const Jobs = ({job}) => {
     const navigate = useNavigate();
     const daysAgoFunction =(mongodbTime) =>{
         const createAt = new Date(mongodbTime);
         const currentAt = new Date();
         const timeDifference = currentAt - createAt;
         return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
     }
     console.log(job?.company?.name)
    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-500'>{daysAgoFunction(job?.createdAt)===0 ? "Today":`${daysAgoFunction(job?.createdAt)} days ago`}</p>
            <Button variant="outline" className='rounded-full' size="icon"><Bookmark/></Button>
            </div>
            <div className='flex items-center gap-2 my-2'>
                <Button className='p-6' variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo}/>
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>{job?.location}</p>
                </div>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className='text-blue-700 font-bold' variant="ghost">{job?.position}</Badge>
                <Badge className='text-[#F83002] font-bold' variant="ghost">{job?.jobType}</Badge>
                <Badge className='text-[#7209B7] font-bold' variant="ghost">{job?.salary}</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button variant="outline" onClick={()=>navigate(`/description/${job?._id}`)} >Details</Button>
                <Button className='bg-[#7209B7]'>Save for Later</Button>
            </div>
        </div>
    )
 }
 export default Jobs