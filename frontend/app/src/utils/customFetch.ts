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
    
    return response;
  } catch (error) {
    toast.error('Fetch error', error);
  }
}; 