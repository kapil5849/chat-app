import { Bell, LogOut, MessageSquare, Settings, User } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import Notification from './Notifications/Notification'

const Navbar = () => {
  const {authUser, logout} = useAuthStore();
  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} className="btn btn-sm gap-2">
                    <Bell className="size-5" />
                    <span className="hidden sm:inline">Notifications</span>
                  </div>
                  <ul 
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-10 w-64 shadow-sm max-h-[40vh] overflow-y-auto overflow-x-hidden"
                  >
                    <div className="flex flex-col"> 
                      {[...Array(22)].map((_, i) => (
                        <li key={i} className="w-full">
                          <a className="block w-full whitespace-normal truncate hover:bg-base-200 px-4 py-2">
                            <Notification />
                          </a>
                        </li>
                      ))}
                    </div>
                  </ul>
                </div>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar