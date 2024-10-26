


export const getUserData = async () => {
    const token = localStorage.getItem("jwt");
    console.log(token);
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
    if (response.status === 403) {
      throw new Error('token expired');
    } 
    else if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

  
    return await response.json();
  };
  