import  {createSlice} from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: "application",
    initialState: {
        applicants: [],
    },
    reducers: {
        setAllApplication: (state, action) => {
            state.applicants = action.payload;
        }
    }
})
export const {setAllApplication} = applicationSlice.actions;
export default applicationSlice.reducer;