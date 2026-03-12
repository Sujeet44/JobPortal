import {asyncThunkCreator, createSlice} from "@reduxjs/toolkit";
import { act } from "react";

const applicationSlice = createSlice({
    name:"applications",
    initialState:{
        applications:[],
        page:1,
        totalPage:0,
        loading:false
    },
    reducers:{
        setLoading:(state,action)=>{
            state.loading = action.payload;
        },

        setApplications:(state,action)=>{
            state.applications= action.payload.data;
            state.page = action.payload.page;
            state.totalPage = action.payload.totalPage;
        }
    }
})

export const { setApplications, setLoading } = applicationSlice.actions;

export default applicationSlice.reducer;