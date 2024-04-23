import React from 'react';
import { useMediaQuery, TextField } from '@mui/material';

interface ThemedTextFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    autoComplete?: string;
    autoFocus?: boolean;
}

const ThemedTextField: React.FC<ThemedTextFieldProps> = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    autoComplete,
    autoFocus = false
}) => {
    const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const sxProps = {
        '& label.Mui-focused': {
            color: isDarkMode ? 'white' : 'black',
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: isDarkMode ? 'white' : 'black',
            },
        },
    };

    return (
        <TextField
            margin="normal"
            required
            fullWidth
            id={name}
            label={label}
            name={name}
            type={type}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            value={value}
            onChange={onChange}
            sx={sxProps}
        />
    );
};

export default ThemedTextField;
