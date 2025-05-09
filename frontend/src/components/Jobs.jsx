import React from 'react'
import NavBar from "@/components/shared/NavBar.jsx";
import FilterCard from "@/components/FilterCard.jsx";
import Job from "@/components/Job.jsx";
import {useSelector} from "react-redux";

 const Jobs  = () =>{
     const {allJobs} = useSelector(store =>store.job);
    return (
        <div>
            <NavBar/>
            <div className='max-w-7xl mx-auto my-20'>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard/>
                    </div>
                    {
                        allJobs.length <= 0 ? <span>Job not found</span>:(
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        allJobs.map((job) => (
                                            <div key={job?._id}>
                                                <Job job={job} />
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
 }
 export default Jobs