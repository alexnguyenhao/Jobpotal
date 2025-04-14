import React from 'react'
import NavBar from "@/components/shared/NavBar.jsx";
import Job from "@/components/Job.jsx";

const randomJobs =[1,2,3,4,5,6,7,8,9];
const Browse = ()=>{
    return (
        <div>
            <NavBar/>
           <div className='max-w-7xl mx-auto my-10 p-3'>
               <h1 className='font-bold text-xl my-10'>Search Results ({randomJobs.length})</h1>
               <div className='grid grid-cols-3 gap-4'>
                   {
                       randomJobs.map((item,index) =>{
                           return(
                               <Job/>
                           )
                       })
                   }
               </div>
           </div>
        </div>
    )
}
export default Browse