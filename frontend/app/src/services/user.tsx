


export const getUserData = async () => {
    const token = localStorage.getItem('jwt');
  
    if (!token) {
      throw new Error('No token found');
    }
  
    const response = await fetch('http://localhost:8000/api/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
  
    return await response.json();
  };
  