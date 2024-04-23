import React, { useState, useEffect } from 'react';
import { getUsername } from './LandingPageApi';
import { TypeAnimation } from 'react-type-animation';
import SpotifyLoginButton from '../sharedComponents/SpotifyButton';
import { spotifyLogin } from './LandingPageApi';

const LandingPage: React.FC = () => {
    const [opacity, setOpacity] = useState(0);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const fetchedUsername = await getUsername();  // Ensure this function correctly fetches the username
                console.log('Fetched username:', fetchedUsername);
                setUsername(fetchedUsername);
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };

        fetchUsername();

        const timer = setTimeout(() => {
            setOpacity(1);
        }, 4800);

        return () => clearTimeout(timer);
    }, []);

    const handleSpotifyLogin = async () => {
        try {
            const strLink = await spotifyLogin();
            if (strLink !== "error") {
                window.location.href = strLink;
            } else {
                // Handle the error case, perhaps display a message to the user
                console.error("Error during the Spotify login process.");
            }
        } catch (error) {
            // Handle any potential errors that could occur during the login process
            console.error("An exception occurred during Spotify login:", error);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            marginTop: '-100px'
        }}>
            {username && (
                <TypeAnimation
                    style={{
                        fontSize: '1em',
                        display: 'block',
                        minHeight: '180px',
                        paddingLeft: '40px',
                        paddingRight: '40px',
                        whiteSpace: 'pre-line'
                    }}
                    splitter={(str) => str.split(/(?= )/)}
                    sequence={[
                        `Hi, ${username},
                         \n My app is an innovative Spotify tool designed for music enthusiasts and data lovers. It offers advanced statistics and features an intuitive interface reminiscent of Scratch, allowing users to connect different analytical building blocks effortlessly. This unique approach enables a deep dive into one\'s music library, providing insights into listening habits, genre preferences, and much more. With its user-friendly drag-and-drop functionality, users can craft complex queries and analyses without needing advanced technical skills. This app is not just a tool for music exploration but also a playful and educational platform for those curious about statistics and data analysis, making the intricate world of music analytics accessible and engaging. Login below to continue...`,
                        3000,
                    ]}
                    speed={{ type: 'keyStrokeDelayInMs', value: 30 }}
                    omitDeletionAnimation={false}
                    repeat={0}
                />
            )}
            <br />
            <div style={{ opacity, transition: 'opacity 1s ease-in-out' }}>
                <SpotifyLoginButton onClick={handleSpotifyLogin} text='Spotify Login'/>
            </div>
        </div>
    );
};

export default LandingPage;
