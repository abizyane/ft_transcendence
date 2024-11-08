'use client'

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Switch } from "@/components/ui/switch"
import {useUser} from "@/services/context/usercontext";

const SettingsPage = () => {
   
  const [activeTab, setActiveTab] = useState<'profile' | 'game'>('profile');

  return (
    <div className="w-full h-full m-20 px-20">
      <div className='bg-gray-800/60 w-full h-full text-white border-2 border-violet-primary p-20'>

        <h1 className="text-3xl font-bold mb-4 text-center">Settings</h1>

        {/* Tab Navigation */}
        <div className="flex space-x-4 pb-2 w-full">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 w-1/2 ${
              activeTab === 'profile' ? 'border-b-2 border-white text-white' : 'text-gray-500'
            }`}
          >
            Profile Settings
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`px-4 py-2 w-1/2 ${
              activeTab === 'game' ? 'border-b-2 border-white text-white' : 'text-gray-500'
            }`}
          >
            Game Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'profile' ? <ProfileSettings /> : <GameSettings />}
        </div>
      </div>
    </div>
  );
};





const ProfileSettings = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const {user} =useUser();
    if(!user)
        return null;
  
  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
    console.log("Profile Image:", profileImage);
    console.log("2FA Enabled:", is2FAEnabled);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    <div className="flex flex-wrap lg:flex-nowrap gap-8">
      <div className="flex flex-col space-y-4 w-full lg:w-1/2 relative">
        <div className="flex flex-col items-center">
          <label className="block font-semibold mb-2 mt-6">Upload New Picture</label>
          <div className="relative w-32 h-32  overflow-hidden">
    <img
      src={user.profile_pic_url}
      alt="Profile"
      className="w-full h-full object-cover  rounded-full"
    />
<div
    className="absolute bottom-0 right-0 w-10 h-10 order-1 bg-white rounded-full flex items-center justify-center cursor-pointer text-blue-500 border-2 border-blue-500 "
    onClick={() => document.getElementById('fileInput')?.click()}
  >
    &#43;
  </div>

</div>

<input
  type="file"
  id="fileInput"
  accept="image/*"
  onChange={handleImageUpload}
  className="hidden"
/>


          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
            {/* New Password */}
            <div className='text-center'>
              <label className="block font-semibold mb-4">New Password </label>
              <input
                type="password"
                {...register('newPassword', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
                className="w-1/2 p-2 border rounded text-black"
              />
              {errors.newPassword && <p className="text-red-500 text-sm mt-4">{errors.newPassword.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className='text-center'>
              <label className="block font-semibold mb-4">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === watch('newPassword') || 'Passwords do not match'
                })}
                className="w-1/2 p-2 border rounded text-black"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mb-4">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Right Section: 2FA Toggle and QR Code */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start space-y-4">
            <div className="flex items-center">
              <label className="font-semibold mr-2">Enable Two-Factor Authentication (2FA)</label>
              <Switch />

            </div>

            {/* QR Code for 2FA */}
            {is2FAEnabled && (
              <div className="mt-4 text-center lg:text-left">
                <p className="font-semibold">Scan this QR code to enable 2FA:</p>
                <div className="flex justify-center lg:justify-start mt-2">
                  <img src="/path-to-your-qr-code.png" alt="2FA QR Code" className="w-32 h-32" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center w-1/2 mt-4">
          <button
            type="submit"
            className="px-4 py-2 mt-10 bg-blue-500 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};






// Game Settings Component
const GameSettings = () => (
  <div>
    <h2 className="text-xl font-semibold mb-2">Game Settings</h2>
    <p>Adjust your game preferences here.</p>
  </div>
);

export default SettingsPage;
