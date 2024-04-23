import React, { useState, useEffect } from 'react';

interface SpotifyLoginButtonProps {
    onClick: (...args: any[]) => any; // Allows any function
    text: string; // Button text
}

const SpotifyLoginButton: React.FC<SpotifyLoginButtonProps> = ({ onClick, text }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLightMode, setIsLightMode] = useState(window.matchMedia('(prefers-color-scheme: light)').matches);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        const changeHandler = (e: MediaQueryListEvent) => {
            setIsLightMode(e.matches);
        };

        mediaQuery.addEventListener('change', changeHandler);

        return () => mediaQuery.removeEventListener('change', changeHandler);
    }, []);

    const defaultStyle = {
        color: isLightMode ? 'black' : 'white',
        backgroundColor: isLightMode ? 'white' : 'transparent',
        border: `1px solid ${isLightMode ? 'gray' : 'white'}`,
        fontSize: '16px',
        padding: '12px 20px',
        cursor: 'pointer',
        boxShadow: isHovered ? '0px 0px 10px rgba(0, 0, 0, 0.2)' : 'none',
        transition: 'all 0.3s ease',
    };

    const hoverStyle = {
        ...defaultStyle,
        backgroundColor: isLightMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
    };

    return (
        <button
            style={isHovered ? hoverStyle : defaultStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default SpotifyLoginButton;
