import React from 'react'
import {RadioGroup} from "@/components/ui/radio-group.js";
import {RadioGroupItem} from "@/components/ui/radio-group.js";
import {Label} from "@radix-ui/react-label";
const filterData =[
    {
        filterType:"Location",
        array:["HCM","Da Nang","Ha Noi","Binh Duong","Vung Tau"]
    },
    {
        filterType:"Industry",
        array:["Frontend Developer","Backend Developer","Full Stack Developer"],
    },
    {
        filterType:"Salary",
        array:["0-500$","500-1000$","1000-2000$"],
    }
]
const FilterCard =()=>{
    return (
        <div className='w-full bg-white rounded-md p-3'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3'/>
            <RadioGroup>
                {
                    filterData.map((data,index)=>(
                        <div>
                            <h1 className='font-bold text-lg'>{data.filterType}</h1>
                            {
                                data.array.map((item,index)=>{
                                    return (
                                        <div className='flex items-center space-x-2 my-2'>
                                            <RadioGroupItem value={item}/>
                                            <Label>{item}</Label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ))
                }
            </RadioGroup>
        </div>

    )
}
export default FilterCard;