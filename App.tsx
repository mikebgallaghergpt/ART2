// App.tsx (with Logout)
import React, { useState, useEffect, Suspense } from 'react';
import { Button } from './components/ui/button';
import { Settings, ArrowLeft, LogOut } from 'lucide-react'; // Added LogOut icon
import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';

// Import components (remains the same)
import { EnhancedImageCarousel } from './components/EnhancedImageCarousel';
import { SimpleSignupForm } from './components/SimpleSignupForm';
const SignupFormOriginal = React.lazy(() => import('./components/SignupFormOriginal'));
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard').then((module) => ({ default: module.AdminDashboard })) );

export default function App() {
  const [currentView, setCurrentView] = useState<'signup' | 'admin'>('signup');
  const [useSimpleForm, setUseSimpleForm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Session Listener (remains the same)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
      console.log('App: Initial getSession result:', session);
    }).catch(error => { console.error("App: Error getting initial session:", error); setLoadingSession(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log(`App: onAuthStateChange event: ${_event}`, session);
      setSession(session);
      if (_event === 'SIGNED_IN' || _event === 'SIGNED_OUT' || _event === 'INITIAL_SESSION') { setLoadingSession(false); }
    });
    return () => { subscription?.unsubscribe(); console.log("App: Unsubscribed from onAuthStateChange"); };
  }, []);

  // Screen resize listener (remains the same)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Admin check (remains the same)
  const checkAdminPassword = () => { /* ... */ return prompt('Enter admin password:') === 'gallagher2025'; };

  // --- ADDED: Logout Handler ---
  const handleLogout = async () => {
    console.log("Attempting logout...");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
      alert(`Logout failed: ${error.message}`); // Basic error feedback
    } else {
      console.log("Logout successful");
      // Session state will update via onAuthStateChange listener
      // Optionally reset other states if needed
      setCurrentView('signup'); // Go back to signup view after logout
    }
  };
  // --- END: Logout Handler ---

  // Show loading indicator
  if (loadingSession) {
    return ( /* ... Loading indicator JSX ... */ <div className="flex items-center justify-center min-h-screen bg-gray-50"><div className="text-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-gray-600">Loading...</p></div></div> );
  }

  // Admin view
  if (currentView === 'admin') {
     return ( /* ... Admin view JSX ... */ <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/80"> <div className="absolute top-4 left-4 z-20"> <Button variant="outline" onClick={() => setCurrentView('signup')} className="flex items-center gap-2" > <ArrowLeft className="w-4 h-4" /> Back to Signup </Button> </div> <Suspense fallback={ <div className="flex items-center justify-center min-h-screen"> <div className="text-center space-y-4"> <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div> <p>Loading Dashboard...</p> </div> </div> } > <AdminDashboard /> </Suspense> </div> );
  }

  // Form Component Wrapper
  const FormSection = () => {
    // --- ADDED: Conditional Rendering for Logged In State ---
    if (session) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold mb-2">Welcome!</h2>
                <p className="text-sm text-gray-600 mb-4">
                    You are logged in as: <br />
                    <strong className="break-all">{session.user?.email}</strong>
                </p>
                <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 mx-auto border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                    <LogOut className="w-4 h-4" />
                    Log Out
                </Button>
            </div>
        );
    }
    // --- END: Conditional Rendering ---

    // Original Form rendering (if not logged in)
    return (
       <> {useSimpleForm ? ( <SimpleSignupForm /> ) : ( <Suspense fallback={ <div className="text-center py-8"> <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div> <p className="text-sm text-gray-600">Loading signup form...</p> </div> } > <SignupFormOriginal /> </Suspense> )} </>
    );
   };


  // MOBILE LAYOUT (remains the same structure, uses FormSection)
  if (isMobile) {
     return ( <div className="min-h-screen"> {/* Carousel */} <div className="h-64 relative"> <EnhancedImageCarousel /> </div> {/* Form Area */} <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100/80 min-h-[calc(100vh-16rem)] flex items-start justify-center px-5 py-8 relative"> {/* Admin button */} <div className="absolute top-4 right-4 z-10"> <Button variant="outline" size="sm" onClick={() => { if (checkAdminPassword()) { setCurrentView('admin'); } }} className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-xs" > <Settings className="w-3 h-3" /> <span className="hidden sm:inline">Admin</span> </Button> </div> {/* Form Section */} <div className="w-full max-w-6xl"> <FormSection /> </div> </div> </div> );
  }

  // DESKTOP LAYOUT (remains the same structure, uses FormSection)
  return (
     <div className="flex min-h-screen"> {/* Carousel */} <div className="w-2/5 h-screen relative"> <EnhancedImageCarousel /> </div> {/* Form Area */} <div className="w-3/5 h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/80 relative overflow-y-auto py-4"> {/* Admin button */} <div className="absolute top-6 right-6 z-10"> <Button variant="outline" size="sm" onClick={() => { if (checkAdminPassword()) { setCurrentView('admin'); } }} className="flex items-center gap-2 bg-white/90 backdrop-blur-sm shadow-sm" > <Settings className="w-4 h-4" /> <span>Admin</span> </Button> </div> {/* Spacing wrapper */} <div className="flex"> <div style={{ width: '25%' }}></div> <div style={{ width: '50%' }}> <FormSection /> </div> <div style={{ width: '25%' }}></div> </div> </div> </div>
  );
}