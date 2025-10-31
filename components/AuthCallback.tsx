// components/AuthCallback.tsx
// Ultra-simple version: Immediately navigates home.
// Relies on Supabase JS automatically handling the session from the URL hash
// and the listener in App.tsx detecting the change upon return to '/'.

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Immediately navigate back to the home page.
    console.log('AuthCallback mounted, immediately redirecting home...');
    navigate('/', { replace: true });
  }, [navigate]);

  // Render minimal loading indicator while redirecting briefly
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Processing...</p>
      </div>
    </div>
  );
}