export const createAccount = async () => {  
  // Use the fetch API to send the POST request
  try {
    const response = await fetch('http://127.0.0.1:8000/register/', {
      method: 'POST',
      credentials: 'include', // if your server expects credentials like cookies
    });

    // Check if the response was ok (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the response text (the content of the response body)
    const data = await response.text();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

export const login_user = async (username: string, password: string): Promise<boolean> => {
  try {
    const headers = {
      Accept: "application/json",
      'Content-Type': 'application/json',
  };
  
  const response = await fetch('http://127.0.0.1:8000/login/', {
      method: 'POST',
      headers: headers,
      credentials: "include",
      body: JSON.stringify({ username, password }),
      mode: "cors",
  });
  

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return false;
    }

    const data = await response.json();
    console.log(data);

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};



