import {create} from 'zustand';
import {axiosInstance} from "../lib/axios.js"
import toast from 'react-hot-toast';
import {io} from 'socket.io-client';
const BASEURL = import.meta.env.MODE === 'development' ? "http://localhost:5001" : '/';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    checkAuth: async () => {
        try{
            const response = await axiosInstance.get('/auth/check')
            set({authUser: response.data})
            get().connectSocket();
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
            get().connectSocket();
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
            get().disconnectSocket();
        }catch(error){
            toast.error(error.response.data.message);
        }
    },
    login: async (data) => {
        set({isLoggingIng: true});
        try{
            const response = await axiosInstance.post('/auth/login', data);
            set({authUser: response.data});
            toast.success("logged in successfully");
            get().connectSocket();
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
            set(state => ({
                authUser: {
                  ...state.authUser,
                  ...response.data,
                  isProfileComplete: true
                }
            }));
            toast.success("Profile updated successfully.");
            return response.data;
        }catch(error){
            console.log("error in update profile", error);
            toast.error(error.response?.data?.message || "Update failed.");
        }finally{
            set({isUpdatingProfile: false});
        }
    },
    connectSocket: () =>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;
        const socket = io(BASEURL,{
            query: {
                userId: authUser._id,
            }
        })
        socket.connect();
        set({socket : socket});
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
            socket.disconnect();
            set({ onlineUsers: [], socket: null});
        }
    },
    
}))