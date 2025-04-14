import {createSlice} from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs:[],
        allAdminJobs:[],
        singleJob:null,
        loading: false,
        searchJobByText:"",
        allAppliedJobs:[],

    },
    reducers: {
        setAllJobs(state, action) {
            state.allJobs = action.payload;
        },
        setSingleJob(state, action) {
            state.singleJob = action.payload;
        },
        setAllAdminJobs(state, action) {
            state.allAdminJobs = action.payload;
        },
        setSearchJobsByText(state, action) {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs(state, action) {
            state.allAppliedJobs = action.payload;
        }
    }
});
export const {setAllJobs,setSingleJob,setAllAdminJobs,setSearchJobsByText,setAllAppliedJobs} =jobSlice.actions;
export default jobSlice.reducer;