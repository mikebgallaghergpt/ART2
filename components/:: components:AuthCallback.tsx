// components/AuthCallback.tsx
// Handles redirecting the user back to the main app after OAuth.
// Supabase handles session processing from the URL hash automatically.

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// We don't necessarily need the supabase client here anymore,
// as Supabase handles the session from the URL hash.

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase JS library automatically detects the session info from the URL hash
    // when the page loads. We just need to navigate the user away from this
    // temporary callback page back to the main application.
    console.log('AuthCallback mounted. Redirecting home...');
    // Redirect to the home page after a very short delay to ensure Supabase processes hash
    const timer = setTimeout(() => {
      navigate('/', { replace: true }); // Use replace to remove callback from history
    }, 100); // 100ms delay

    return () => clearTimeout(timer); // Cleanup timer on unmount

  }, [navigate]); // Dependency array includes navigate

  // Display a loading indicator while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in, please wait...</p>
      </div>
    </div>
  );
}