import React, { useState, useEffect } from 'react';
import {Button} from "@/components/ui/button.js";
import {Search} from "lucide-react";

const HeroSection = () => {
    const [current, setCurrent] = useState(0);
    const messages = [
        "Connect opportunities, build your future!",
        "Solid Career – Bright Future",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % messages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-center pt-[30px]">
            <div className="flex flex-col gap-5 my-10">
        <span className="px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium">
          No. 1 Job Hunt Website
        </span>
                <h1 className="text-5xl font-bold">
                    Search, Apply & <br /> Get Your <span className="text-[#6A38C2]">Dream Job</span>
                </h1>
                <div className="relative overflow-hidden h-6">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${current * 100}%)` }}
                    >
                        {messages.map((message, index) => (
                            <p key={index} className="min-w-full whitespace-nowrap">
                                {message}
                            </p>
                        ))}
                    </div>
                </div>
                <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full gap-4 mx-auto'>
                    <input type="text" placeholder='Find your Drem jobs' className='outline-none border-none w-full'/>
                    <Button className='rounded-r-full bg-[#6A38C2]'>
                        <Search className='h-5 w-5 '/>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;