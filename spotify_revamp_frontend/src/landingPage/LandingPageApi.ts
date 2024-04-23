export const getUsername = async (): Promise<string> => {
    try {
        const response = await fetch('http://127.0.0.1:8000/username/', {
            method: 'GET',
            credentials: "include",  // to include cookies in the request
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return "Failed to fetch username.";
        }

        const data = await response.json();  // This parses the JSON response body
        console.log("Username fetched:", data.username);
        return data.username;  // Assuming the backend sends a JSON object with a username field

    } catch (error) {
        console.error('Error:', error);
        return "Error fetching username.";
    }
};

export const spotifyLogin = async (): Promise<string> => {
    const csrftoken = document.cookie.split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];

    const headers = new Headers({
        Accept: "application/json",
        'Content-Type': 'application/json',
    });

    // Add the CSRF token to the headers if it's available
    if (csrftoken) {
        headers.append('X-CSRFToken', csrftoken);
    }
    
    try {
        const response = await fetch('http://127.0.0.1:8000/spotify/login/', {
            method: 'GET',
            headers: headers,
            credentials: "include",
            mode: "cors",
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return "error"; 
        } else {
            const data = await response.json(); 
            // Assuming the redirect is handled server-side or through some other mechanism
            console.log('Successfully initiated Spotify login process.');
            return data.authorization_link; 
        }
    } catch (error) {
        console.error('Error initiating Spotify login:', error);
        return "error"; 
    }
}

