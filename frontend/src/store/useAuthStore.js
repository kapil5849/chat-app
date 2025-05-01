import {create} from 'zustand';
import {axiosInstance} from "../lib/axios.js"
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try{
            const response = await axiosInstance.get('/auth/check')
            set({authUser: response.data})
        }catch(error){
            console.log("Error in checkAuth:", error)
            set({authUser: null})
        }finally{
            set({isCheckingAuth: false})
        }
    },

    signup: async (data) => {
        set({isSigningUp: true})
        try{
            const response = await axiosInstance.post('/auth/signup',data);
            set({authUser: response.data});
            toast.success("Account created successfully")
        }catch(error){
            toast.error(error.response?.data?.message);
        }finally{
            set({isSigningUp: false});
        }
    },
    logout: async () => {
        try{
            const response = await axiosInstance.post('/auth/logout');
            set({authUser: null});
            toast.success(response.data.message);
        }catch(error){
            toast.error(error.response?.data?.message);
        }
    },
    login: async (data) => {
        set({isLoggingIng: true});
        try{
            const response = await axiosInstance.post('/auth/login', data);
            set({authUser: response.data});
            toast.success("logged in successfully");
        }catch(error){
            toast.error(error.response?.data?.message);
        }finally{
            set({isLoggingIng: false});
        }
    },
    updateProfile: async (data) => {
        set({isUpdatingProfile: true});
        try{
            const response = await axiosInstance.put('/auth/update-profile', data);
            set({authUser: response.data});
            toast.success("Profile updated successfully")
        }catch(error){
            console.log("error in update profile", error);
            toast.error(error.response?.data?.message);
        }finally{
            set({isUpdatingProfile: false});
        }
    },

}))