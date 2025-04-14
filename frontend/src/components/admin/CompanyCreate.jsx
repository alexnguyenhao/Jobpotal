import React, {useState} from 'react'
import NavBar from "@/components/shared/NavBar.jsx";
import {Label} from "@/components/ui/label.js";
import {Input} from "@/components/ui/input.js";
import {Button} from "@/components/ui/button.js";
import { useNavigate} from "react-router-dom";
import axios from "axios";
import {COMPANY_API_END_POINT} from "@/utils/constant.js";
import {toast} from "sonner";
import {useDispatch} from "react-redux";
import {setSingleCompany} from "@/redux/companySlice.js";

const CompanyCreate = () =>{
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState();
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, {companyName},{
                headers: {"Content-Type": "application/json"
                },
                withCredentials: true
            });
            if (res?.data?.success){
                dispatch(setSingleCompany(res.data.company));
               toast.success(res.data.message);
               const companyId = res?.data?.company?._id;
               console.log(companyId);
               navigate(`/admin/companies/${companyId}`);
            }
        }
        catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    return(
        <div>
            <NavBar/>
            <div className='max-w-4xl mx-auto my-10 pt-[70px]'>
                <div className='my-10'>
                    <h1 className='font-bold text-2xl'>Your company name</h1>
                    <p className='text-gray-500'>what would you like to give your company name ? you can change this later.</p>
                </div>
                <Label>Company Name</Label>
                <Input type="text" className='my-2' placeholder="JobHunt, Microsoft etc." onChange={(e)=>setCompanyName((e.target.value))}/>
                <div className='flex items-center gap-2 my-10'>
                    <Button variant="outline" onClick={()=>navigate("/admin/companies")}>Cancel</Button>
                    <Button onClick={registerNewCompany}>Continues</Button>
                </div>
            </div>
        </div>
    )
}
export default CompanyCreate;