import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Box, Alert } from '@mui/material';
import ThemedTextField from './TextBox';

interface LoginFormProps {
    login_user: (username: string, password: string) => Promise<boolean>;
}

const LoginForm: React.FC<LoginFormProps> = ({ login_user }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const loggedIn = await login_user(username, password);
        if (loggedIn) {
            navigate('/demo');
        } else {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <Container 
            component="main" 
            maxWidth="xs" 
            sx={{
                border: '1px solid #ccc', // Outline the container with a light grey border
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Add a subtle shadow for a floating effect
                borderRadius: '8px', // Optional: add rounded corners for a softer look
                marginTop: '20px', // Add some top margin to ensure it's not too close to the top of the viewport
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <ThemedTextField
                    label="Username"
                    name="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete="username"
                    autoFocus
                />
                <ThemedTextField
                    label="Password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                />
                    {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            color: 'common.white',
                            backgroundColor: 'common.black',
                            '&:hover': {
                                backgroundColor: 'grey.800', // Darken the button on hover in light mode
                            },
                            '@media (prefers-color-scheme: dark)': {
                                color: 'common.black',
                                backgroundColor: 'common.white',
                                '&:hover': {
                                    backgroundColor: 'grey.300', // Lighten the button on hover in dark mode
                                },
                            }
                        }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>

    );
}

export default LoginForm;
