import { AlertTriangle, BookHeart, Camera, Database, Loader2, Mail, MapPin, Phone, Shell, User, UserPen } from 'lucide-react'
import { useAuthStore} from '../store/useAuthStore.js';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProfilePage = ({forceCompleteMode = false}) => {
  const navigate = useNavigate();
  const {authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    bio: '',
    mobile: '',
    dob: '',
    location: '',
    gender: '',
  });
  const [isCompleteMode, setIsCompleteMode] = useState(false);
  useEffect(() => {
    if(forceCompleteMode || !authUser?.isProfileComplete){
      setIsCompleteMode(true);
      toast("Please complete your profile", {
        icon: '👏',
        duration: 5000
      });
    }
  },[authUser,forceCompleteMode]);
  useEffect(() =>{
    if (authUser) {
      setFormData({
        userName: authUser.userName || '',
        bio: authUser.bio || '',
        mobile: authUser.mobile || '',
        dob: authUser.dob ? new Date(authUser.dob).toISOString().split('T')[0] : '',
        location: authUser.location || '',
        gender: authUser.gender || ''
      });
      if (authUser.profilePic) {
        setSelectedImg(authUser.profilePic);
      }
    }
  },[authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    if (!file.type.match('image.*')) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image size should be less than 2MB");
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
    }
  }

  const genders = ["boy", "girl", "others"];

  const validateForm = () => {
    if (!selectedImg && !authUser.profilePic) {
      toast.error("Profile picture is required");
      return false;
    }
    if (!formData.userName.trim()) {
      toast.error("Username is required");
      return false;
    }
    if (!formData.bio.trim()) {
      toast.error("Bio is required");
      return false;
    }
    if (!formData.mobile.trim()) {
      toast.error("Mobile number is required");
      return false;
    }
    if (!/^\d{10,15}$/.test(formData.mobile)) {
      toast.error("Mobile number must be 10-15 digits");
      return false;
    }
    if (!formData.gender) {
      toast.error("Gender is required");
      return false;
    }
  
    if (!formData.dob.trim()) {
      toast.error("Date of birth is required");
      return false;
    }
    
    const dobDate = new Date(formData.dob);
    if (isNaN(dobDate.getTime())) {
      toast.error("Invalid date of birth");
      return false;
    }
  
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    
    if (age < 14) {
      toast.error("You must be at least 14 years old");
      return false;
    }
  
    if (!formData.location.trim()) {
      toast.error("Location is required");
      return false;
    }
  
    return true;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!validateForm()) return;
    try{
      const formDataToUpdate = {
        ...formData,
        profilePic: selectedImg || authUser.profilePic,
      }
      await updateProfile(formDataToUpdate);
      if (forceCompleteMode) {
        navigate('/');
      }
    }catch(error){
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error(error?.response?.data?.message || "Update failed");
      }
    }
  }

  const handleChangeInput = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    })) 
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="h-screen pt-20">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-300 rounded-xl p-6 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold ">Profile</h1>
              <p className="mt-2">Your profile information</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 "
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-0 right-0 
                    bg-base-content hover:scale-105
                    p-2 rounded-full cursor-pointer 
                    transition-all duration-200
                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                  `}
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400">
                {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
              </div>


              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <UserPen className="w-4 h-4" />
                  User Name
                </div>
                <input 
                  type='text'
                  name="userName"
                  className='px-4 py-2.5 bg-base-200 rounded-lg border w-full'
                  placeholder="Enter your unique username"
                  value={formData.userName}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Shell className="w-4 h-4" />
                  Bio
                </div>
                <input 
                  type='text'
                  name="bio"
                  className='px-4 py-2.5 bg-base-200 rounded-lg border w-full'
                  placeholder="Type something to get started..."
                  value={formData.bio}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Mobile 
                </div>
                <input 
                  type='text'
                  name="mobile"
                  className='px-4 py-2.5 bg-base-200 rounded-lg border w-full'
                  placeholder="Enter your mobile number"
                  value={formData.mobile}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <BookHeart className="w-4 h-4" />
                  Gender
                </div>
                <select 
                  type='text'
                  name='gender'
                  className='px-4 py-2.5 bg-base-200 rounded-lg border w-full'
                  placeholder="9458768880"
                  value={formData.gender}
                  onChange={handleChangeInput}
                >
                  <option value="">Select Gender</option>
                    {genders.map((gender) => (
                      <option key={gender} value={gender}> 
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  DOB
                </div>
                <input 
                  type='date'
                  name="dob"
                  className='px-4 py-2.5 bg-base-200 rounded-lg border w-full'
                  value={formData.dob}
                  onChange={handleChangeInput}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </div>
                <input 
                  type='text'
                  name='location'
                  className='px-4 py-2.5 bg-base-200 rounded-lg border w-full'
                  placeholder="Jaipur, India"
                  value={formData.location}
                  onChange={handleChangeInput}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={isUpdatingProfile}>
        {isUpdatingProfile ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Loading...
          </>
        ) : (
          "Save"
        )}
      </button>

            <div className="mt-6 bg-base-300 rounded-xl p-6">
              <h2 className="text-lg font-medium  mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>Member Since</span>
                  <span>{authUser.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Account Status</span>
                  <span className="text-green-500">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default ProfilePage