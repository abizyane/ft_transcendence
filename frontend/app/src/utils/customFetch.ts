export const customFetch = async (url: string, options: RequestInit = {}) => {
  // Ensure credentials are included by default
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
    console.error('Fetch error:', error);
    throw error;
  }
}; 