'use client'

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Switch } from "@/components/ui/switch"
import { useUser } from "@/services/context/usercontext";
import toast from 'react-hot-toast';
import Loader from "@/components/loader/loader";
import { useGame } from '@/services/context/gameContext';


const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'game'>('profile');

  return (
    <div className="w-full h-full m-4 p-4 flex justify-center items-center">
      <div className='bg-gray-800/60 w-full h-fit text-white border-2 border-violet-primary p-4 sm:p-6 md:p-10 rounded-xl'>

        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Settings</h1>

        {/* Tab Navigation */}
        <div className="flex space-x-2 sm:space-x-4 pb-2 w-full">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 sm:px-6 sm:py-3 w-1/2 ${
              activeTab === 'profile' ? 'border-b-2 border-white text-white' : 'text-gray-500'
            }`}
          >
            Profile Settings
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`px-4 py-2 sm:px-6 sm:py-3 w-1/2 ${
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
  const [otpValue, setOtpValue] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { user, fetchUser } = useUser();
  if (!user) return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader />
    </div>
  );


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const previewUrl = URL.createObjectURL(file); // Create a preview URL for the selected file
      setImagePreview(previewUrl);
    }
  };
  const handleImage = async (profileImage: File) => {
    const formData = new FormData();
    formData.append('profile_pic', profileImage);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+':8000/api/upload_image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const responseData = await response.json();
      if (!response.ok) {
        toast.error('Image upload failed');
      } else {
        toast.success('Image updated successfully');
        fetchUser(); 
      }
    } catch (error) {
      toast.error('Error uploading image');
    }
  };
  const updatePassword = async (formData: any) => {
      try {
          const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+':8000/api/changepassword', { // Added http://
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ new_password: formData.newPassword }),
          });
          
          const responseData = await response.json(); 
          if (!response.ok) {
              toast.error(responseData.message);
          } else {
              toast.success('Password updated successfully');
          }
      } catch (error) {
        toast.error('Error:', error);
      }
  };
  const onSubmit = (formData: any) => {
    // If `newPassword` is filled, call the updatePassword function
    if (formData.newPassword) {
        updatePassword(formData);
    }
    // If a profile image is provided, handle the image upload
    if (profileImage) {
        handleImage(profileImage);
    }
};



  const disable2FA = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+':8000/api/2fa_code', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error:', error);
    }
    fetchUser();
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+':8000/api/2fa_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ otp: otpValue }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error:', error);
    }
    fetchUser();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-6 lg:gap-8">
          <div className="flex flex-col space-y-4 w-full sm:w-1/2 lg:w-1/2">
            <div className="flex flex-col items-center">
              <label className="block font-semibold mb-2 mt-6 text-center">Upload New Picture</label>
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 overflow-hidden">
                <img
                  src={imagePreview || user.profile_pic_url}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
                <div
                  className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center  text-violet-800 border-2 border-violet-800 cursor-pointer"
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
            </div>

            <div className="text-center">
              <label className="block font-semibold mb-4">New Password</label>
              <input
                type="password"
                {...register('newPassword', { minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
                className="w-3/4 sm:w-1/2 p-2 border rounded text-black"
              />
              {errors.newPassword && <p className="text-red-500 text-sm mt-4">{errors.newPassword.message}</p>}
            </div>

            <div className="text-center">
              <label className="block font-semibold mb-4">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword', {
                  // required: 'Please confirm your password',
                  validate: (value) => value === watch('newPassword') || 'Passwords do not match'
                })}
                className="w-3/4 sm:w-1/2 p-2 border rounded text-black"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mb-4">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="w-full sm:w-1/2 lg:w-1/2 flex flex-col justify-center items-center space-y-4 lg:ml-auto">

            {user.mfa_enabled === false && (
              <div className="mt-4 text-center lg:text-left">
                <p className="font-semibold">Scan this QR code to enable 2FA:</p>
                <div className="flex justify-center lg:justify-start mt-2">
                  <img src={process.env.NEXT_PUBLIC_HOST_URL+":8000/api/2fa_code"} alt="2FA QR Code" className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32" />
                </div>
                <div className="flex mt-4 justify-center lg:justify-start items-end">
                  <div>
                    <p className="font-semibold mb-1">OTP:</p>
                    <input value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      className='border rounded text-black w-2/3 sm:w-1/2'
                    />
                  </div>
                  <button
                    onClick={handleVerifyOtp}
                    className="px-4 py-2 ml-4 bg-violet-800 text-white rounded"
                  >
                    Enable 2FA
                  </button>
                </div>
              </div>
            )}

            {user.mfa_enabled === true && (
              <div className="mt-4 w-full text-center md:text-left">
                <p className="font-semibold">2FA is enabled for your account.</p>
                <button
                  onClick={disable2FA}
                  className="px-4 py-2 mt-4 bg-blue-500 text-white rounded"
                >
                  Disable 2FA
                </button>
              </div>
            )}
          </div>
        </div>


        <div className="flex justify-center w-3/4 sm:w-1/2 mt-4 mx-auto">
          <button
            type="submit"
            className="px-4 py-2 mt-10 bg-violet-800 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};


const GameSettings = () => {
  const {gameCustomization,isLoading, updateGameCustomization} = useGame();
  const [paddleColor, setPaddleColor] = useState(gameCustomization.user_paddle_color);
  const [opponentColor, setOpponentColor] = useState(gameCustomization.opponent_paddle_color);
  const [ballColor, setBallColor] = useState(gameCustomization.ball_color);

  const changeColor = (type, color) => {
    if (type === 'paddle') {
      setPaddleColor(color);
    } else if (type === 'ball') {
      setBallColor(color);
    } else {
      setOpponentColor(color);
    }
  };

  const loadColors = () => {
    setPaddleColor(gameCustomization.user_paddle_color);
    setOpponentColor(gameCustomization.opponent_paddle_color);
    setBallColor(gameCustomization.ball_color);
  };

  const resetColors = () => {
    setPaddleColor('#0015ff');
    setOpponentColor('#ff0000');
    setBallColor('#ffffff');
  };

  const saveSettings = () => {
    updateGameCustomization({
      user_paddle_color: paddleColor,
      opponent_paddle_color: opponentColor,
      ball_color: ballColor
    }).then((res) => {
      if (!res) {
        loadColors();
      }
    });
  };

  if (isLoading) return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader />
    </div>
  );
  return (
    <div className="max-w-xl mx-auto p-6">

      <div className="flex flex-col md:flex-row gap-6 lg:gap-16 justify-center items-center">
        
        <div className="flex flex-col items-center">
  <label htmlFor="paddleColor" className="text-sm font-medium text-white mb-2 lg:font-bold lg:text-nowrap lg:text-2xl">
    Paddle Color
  </label>
  <div className="relative w-24 h-6 border-2 border-white mt-2 rounded-full overflow-hidden">
    <input
      type="color"
      id="paddleColor"
      name="paddleColor"
      value={paddleColor}
      onChange={(e) => changeColor('paddle', e.target.value)}
      className="absolute inset-0 w-full h-full bg-transparent border-none rounded-full"
    />
  </div>
</div>


        <div className="flex flex-col items-center">
          <label htmlFor="opponentpaddle" className="text-sm font-medium text-white mb-2 lg:font-bold lg:text-nowrap lg:text-2xl">
            Opponent Paddle Color
          </label>
          <div className="relative w-24 border-2 border-white h-6 mt-2 rounded-full overflow-hidden">
            <input
              type="color"
              id="opponentpaddle"
              name="opponentpaddle"
              value={opponentColor}  
              onChange={(e) => changeColor('opponent', e.target.value)}  
              className="absolute inset-0 w-full h-full bg-transparent  rounded-full"
            />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <label htmlFor="ballColor" className="text-sm font-medium text-white mb-2 mt-4 lg:font-bold lg:text-nowrap lg:text-2xl">
            Ball Color
          </label>
          <div className="relative w-12 h-12 border-2 border-white rounded-full overflow-hidden ">
            <input
              type="color"
              id="ballColor"
              name="ballColor"
              value={ballColor}
              onChange={(e) => changeColor('ball', e.target.value)}
              className="absolute inset-0 w-full h-full bg-transparent outline-none	border-none  rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4 lg:gap-20">
        <button
          onClick={saveSettings}
          className="px-6 py-2 bg-violet-800 text-white rounded-lg "
        >
          Save
        </button>
        <button
          onClick={resetColors}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg "
        >
          Reset
        </button>
      </div>
    </div>
);
  };
export default SettingsPage;
