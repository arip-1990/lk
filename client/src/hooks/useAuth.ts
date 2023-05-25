import React from 'react';
import AuthContext from '../services/auth/AuthContext';

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context)
    throw new Error("useAuth should only be used inside <Auth />");
  
  return context;
};

export { useAuth };
