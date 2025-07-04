import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'

import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import {Loader} from 'lucide-react'
import { Toaster } from "react-hot-toast"
import { useThemeStore } from './store/useThemeStore'
import SettingsPage from "./pages/SettingsPage";

const App = () => {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  const {theme} = useThemeStore();
  console.log(onlineUsers)
  useEffect(() => {
    checkAuth();
  },[checkAuth]);

  if(isCheckingAuth && !authUser){
    return(
      <div className='flex justify-center items-center h-screen'>
        <Loader className='size-10 animate-spin'/>
      </div>
    )
  }

const requireAuth = (element) => {
  if (!authUser) return <Navigate to="/login" replace />;
  
  if (!authUser.isProfileComplete) {
    return <Navigate to="/profile" state={{ forceComplete: true }} replace />;
  }
  
  return element;
};

  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path='/' element={requireAuth(<HomePage />)} />
        <Route path='/signup' element={!authUser ? <SignupPage/> : <Navigate to="/"/>}/>
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to="/"/>}/>
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/profile' element={authUser ?(
          authUser?.isProfileComplete ? <ProfilePage/> : (<ProfilePage forceCompleteMode={true}/>)
        ): (
          <Navigate to="/login"/>
        )}/>
        
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App