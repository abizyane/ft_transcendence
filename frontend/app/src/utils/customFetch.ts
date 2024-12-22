import toast from 'react-hot-toast';
export const customFetch = async (url: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    ...options,
    credentials: 'include',
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (response.status === 401) {
      window.location.href = '/auth/login';
      return null;
    }
    if (response.status === 403) {
      const data = await response.json();
      if (data.detail === "2FA verification required")
      {
        window.location.href = '/auth/mfa';
        return null;
      }
    }
    
    return response;
  } catch (error) {
    toast.error('Fetch error', error);
  }
}; 