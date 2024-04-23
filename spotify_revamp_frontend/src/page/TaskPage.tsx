import React from 'react';
import { login_user } from './TaskPageApi';
import LoginForm from '../sharedComponents/LoginForm';

const TokenDisplay: React.FC = () => {
  return (
    <div>
      <LoginForm login_user={login_user} />
    </div>
  );
};

export default TokenDisplay;

