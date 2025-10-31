// SignupFormOriginal.tsx (Focused Restart)
// ... (Keep existing imports)
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ChevronRight, User, Target, Palette, Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Ensure path is correct

// ... (Keep FormData interface) ...
interface FormData { firstName: string; lastName: string; email: string; phone: string; goals: string[]; experienceLevel: string; interests: string[]; password: string; confirmPassword: string; referralSource: string; newsletterOptIn: boolean; }


export default function SignupFormOriginal() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '',
    goals: [], experienceLevel: '', interests: [],
    password: '', confirmPassword: '', referralSource: '', newsletterOptIn: false,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProfileUpdate, setIsProfileUpdate] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [oAuthError, setOAuthError] = useState<string | null>(null);

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // --- RE-IMPLEMENTED Google Sign-In Handler ---
  const handleGoogleSignIn = async () => {
    setIsOAuthLoading(true);
    setOAuthError(null);
    console.log("Attempting Google Sign In...");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Ensure this matches exactly what's in Supabase & Google Cloud config
        redirectTo: window.location.origin + '/auth/callback',
      },
    });

    if (error) {
      console.error('Google Sign-In Error:', error.message);
      setOAuthError('Could not sign in with Google. Please try again.');
      setIsOAuthLoading(false); // Stop loading only if there's an immediate error
    }
    // No need to set loading false here, Supabase handles the redirect if successful
    console.log("signInWithOAuth initiated, awaiting redirect...");
  };
  // --- END RE-IMPLEMENTATION ---


  // --- All other functions (validateStep, handleNext, etc.) remain the same ---
  const validateStep = () => { /* Validation logic remains the same */
    const newErrors: any = {};
    if (currentStep === 1) { if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'; if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'; if (!formData.email.trim()) { newErrors.email = 'Email is required'; } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { newErrors.email = 'Please enter a valid email'; } }
    if (currentStep === 2) { if (formData.goals.length === 0) newErrors.goals = 'Please select at least one goal'; }
    if (currentStep === 3) { if (!formData.experienceLevel) newErrors.experienceLevel = 'Please select your experience level'; if (formData.interests.length === 0) newErrors.interests = 'Please select at least one interest'; }
    if (currentStep === 4) { if (!(formData.newsletterOptIn && !formData.password && !formData.confirmPassword)) { if (!formData.password) { newErrors.password = 'Password is required'; } else if (formData.password.length < 8) { newErrors.password = 'Password must be at least 8 characters'; } if (formData.password !== formData.confirmPassword) { newErrors.confirmPassword = 'Passwords do not match'; } } if (!formData.referralSource) newErrors.referralSource = 'Please tell us how you heard about us'; }
    setErrors(newErrors); return Object.keys(newErrors).length === 0;
   };
   const handleNext = async () => { /* handleNext logic remains the same */
    if (validateStep()) { if (currentStep < totalSteps) { setCurrentStep(currentStep + 1); } else { try { const response = await fetch('https://zpgvjrmupplqqwlnmfiy.supabase.co/functions/v1/make-server-9c2430a9/signup', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwZ3Zqcm11cHBscXF3bG5tZml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NTI3MjYsImV4cCI6MjA3NTQyODcyNn0.TtZLtRnnKnC8vtsyEsc41MISK0aRwF8UfUDSmULzFjQ' }, body: JSON.stringify({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email, phone: formData.phone, goals: formData.goals, experienceLevel: formData.experienceLevel, interests: formData.interests, referralSource: formData.referralSource, password: (formData.newsletterOptIn && !formData.password) ? undefined : formData.password, newsletterOptIn: formData.newsletterOptIn }) }); const result = await response.json(); if (result.success) { setIsProfileUpdate(result.isUpdate || false); setShowConfirmation(true); } else { if (result.error === 'User already exists.') { setErrors({ email: 'This email is already registered. Try logging in or use a different email.' }); setCurrentStep(1); } else { alert(`Signup Error: ${result.error || 'Unknown error'}`); } } } catch (error) { console.error('Signup fetch error:', error); alert('An error occurred connecting to the server. Please try again.'); } } }
   };
   const handleRestart = () => { /* handleRestart logic remains the same */
    setShowConfirmation(false); setCurrentStep(1); setIsProfileUpdate(false); setFormData({ firstName: '', lastName: '', email: '', phone: '', goals: [], experienceLevel: '', interests: [], password: '', confirmPassword: '', referralSource: '', newsletterOptIn: false }); setErrors({});
   };
   const handleInputChange = (field: keyof FormData, value: any) => { /* handleInputChange logic remains the same */
    if (field === 'phone') { const digits = value.replace(/\D/g, ''); let formatted = digits; if (digits.length > 0) { formatted = `(${digits.slice(0, 3)})${digits.length > 3 ? ' ' : ''}${digits.slice(3, 6)}${digits.length > 6 ? '-' : ''}${digits.slice(6, 10)}`; } setFormData((prev) => ({ ...prev, [field]: formatted })); } else { setFormData((prev) => ({ ...prev, [field]: value })); } if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
   };
   const toggleInterest = (interest: string) => { /* toggleInterest logic remains the same */
    const newInterests = formData.interests.includes(interest) ? formData.interests.filter((i) => i !== interest) : [...formData.interests, interest]; handleInputChange('interests', newInterests);
   };
   const toggleGoal = (goal: string) => { /* toggleGoal logic remains the same */
    const newGoals = formData.goals.includes(goal) ? formData.goals.filter((g) => g !== goal) : [...formData.goals, goal]; handleInputChange('goals', newGoals);
   };
   const stepTitles = [ 'Tell us about yourself', 'What brings you here?', 'What interests you?', 'Set up your login' ];
   const interestOptions = [ { value: 'drawing', label: 'Drawing', image: '/assets/drawing.webp' }, { value: 'painting', label: 'Painting', image: '/assets/painting.webp' }, { value: 'sculpture', label: 'Sculpture', image: '/assets/sculpture.webp' }, { value: 'mixed-media', label: 'Mixed Media AI & Collage', image: '/assets/mixedmedia.webp' }, { value: 'color-theory', label: 'Color Theory', image: '/assets/colortheory.webp' } ];
   const goalOptions = [ { value: 'develop-skills', label: 'Develop fundamental art skills' }, { value: 'portfolio', label: 'Prepare portfolio for college/university' }, { value: 'creativity', label: 'Explore creativity and self-expression' }, { value: 'learn-techniques', label: 'Learn specific techniques (painting, drawing, etc.)' }, { value: 'professional-dev', label: 'Professional development' }, { value: 'career-change', label: 'Career change or advancement' }, { value: 'gift-certificate', label: 'Gift certificate for someone' } ];

  // --- Rest of the component (JSX) remains the same ---
  return (
    <div className="w-full">
      <style>{`
        /* Styles remain the same */
        input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active { -webkit-box-shadow: 0 0 0 1000px #f3f4f6 inset !important; box-shadow: 0 0 0 1000px #f3f4f6 inset !important; -webkit-text-fill-color: #111827 !important; background-color: #f3f4f6 !important; transition: background-color 5000s ease-in-out 0s; font-size: 0.9rem !important; }
        input { background-color: #f3f4f6 !important; color: #111827 !important; font-size: 0.9rem !important; }
        input::placeholder { color: #6B7280 !important; font-size: 0.9rem !important; }
      `}</style>
      <div className="w-full bg-white rounded-xl shadow-sm p-1">
        {showConfirmation ? (
            <div className="text-center py-6"> <div className="mb-1"> <div className={`w-16 h-16 ${ isProfileUpdate ? 'bg-blue-500' : 'bg-green-500' } rounded-full flex items-center justify-center mx-auto mb-1`} > <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /> </svg> </div> <h2 className="text-2xl font-semibold text-gray-900 mb-1"> {isProfileUpdate ? 'Profile Updated!' : formData.newsletterOptIn && !formData.password ? 'Thank You!' : 'Account Created!'} </h2> </div> {formData.newsletterOptIn && !formData.password ? ( <div className="space-y-2"><p className="text-base text-gray-700">Thank you, <strong>{formData.firstName}</strong>!</p><p className="text-sm text-gray-600">You have been added to our newsletter subscription.</p></div> ) : isProfileUpdate ? ( <div className="space-y-2"><p className="text-base text-gray-700">Welcome back, <strong>{formData.firstName}</strong>!</p><p className="text-sm text-gray-600 mb-1">Your profile has been successfully updated. Check your email for confirmation of the changes.</p><div className="bg-blue-50 rounded-lg p-4 text-left space-y-2"><h3 className="font-semibold text-sm text-gray-900 mb-1">Updated Information:</h3> {formData.goals.length > 0 && (<div className="text-sm"><span className="text-gray-600">Your Goals: </span><span className="text-gray-900 font-medium">{formData.goals.map(goal => goalOptions.find(opt => opt.value === goal)?.label || goal).join(', ')}</span></div>)} {formData.experienceLevel && (<div className="text-sm"><span className="text-gray-600">Experience Level: </span><span className="text-gray-900 font-medium">{formData.experienceLevel.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span></div>)} {formData.interests.length > 0 && (<div className="text-sm"><span className="text-gray-600">Interests: </span><span className="text-gray-900 font-medium">{formData.interests.map((interest) => interestOptions.find((opt) => opt.value === interest)?.label).join(', ')}</span></div>)} {formData.referralSource && (<div className="text-sm"><span className="text-gray-600">How you heard about us:{' '}</span><span className="text-gray-900 font-medium">{formData.referralSource.charAt(0).toUpperCase() + formData.referralSource.slice(1)}</span></div>)}</div><p className="text-xs text-gray-600 mt-2">💡 Your existing account login details remain the same.</p></div> ) : ( <div className="space-y-2"><p className="text-base text-gray-700">Dear <strong>{formData.firstName}</strong>,</p><p className="text-sm text-gray-600 mb-1">Your account has been successfully created! Please check your email for more information.</p><div className="bg-gray-50 rounded-lg p-4 text-left space-y-2"><h3 className="font-semibold text-sm text-gray-900 mb-1">Your Selections:</h3> {formData.goals.length > 0 && (<div className="text-sm"><span className="text-gray-600">Your Goals: </span><span className="text-gray-900 font-medium">{formData.goals.map(goal => goalOptions.find(opt => opt.value === goal)?.label || goal).join(', ')}</span></div>)} {formData.experienceLevel && (<div className="text-sm"><span className="text-gray-600">Experience Level: </span><span className="text-gray-900 font-medium">{formData.experienceLevel.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span></div>)} {formData.interests.length > 0 && (<div className="text-sm"><span className="text-gray-600">Interests: </span><span className="text-gray-900 font-medium">{formData.interests.map((interest) => interestOptions.find((opt) => opt.value === interest)?.label).join(', ')}</span></div>)} {formData.referralSource && (<div className="text-sm"><span className="text-gray-600">How you heard about us:{' '}</span><span className="text-gray-900 font-medium">{formData.referralSource.charAt(0).toUpperCase() + formData.referralSource.slice(1)}</span></div>)}</div></div> )}
            <Button onClick={handleRestart} className="mt-6 h-11 px-6 text-sm font-medium bg-black hover:bg-gray-800 text-white">Back to Start</Button>
          </div>
        ) : (
          <>
            {/* Progress Icons */}
             <div className="flex justify-center items-center mb-4"> {[1, 2, 3, 4].map((step, index) => { const icons = [User, Target, Palette, Mail]; const IconComponent = icons[step - 1]; return (<div key={step} className="flex items-center"><div className={`flex items-center justify-center rounded-full transition-all duration-300 ${ step < currentStep ? 'bg-green-500 text-white' : step === currentStep ? 'bg-black text-white' : 'bg-gray-200 text-gray-400' }`} style={{ width: '40px', height: '40px' }}><IconComponent className="w-5 h-5" /></div> {index < 3 && (<div className={`h-px w-12 mx-1 transition-all duration-300 ${ step < currentStep ? 'bg-green-500' : 'bg-gray-200' }`}/>)}</div>); })} </div>
            {/* Titles */}
             <h1 className="text-4xl font-semibold text-gray-900 text-center mb-1">Join Gallagher Art School</h1> <p className="text-lg text-gray-600 text-center mb-1">{stepTitles[currentStep - 1]}</p>
            {/* Progress Bar */}
             <div className="w-full bg-gray-200 rounded-full mb-1 overflow-hidden" style={{ height: '8px' }}><div className="bg-black transition-all duration-500 ease-out rounded-full" style={{ width: `${progressPercentage}%`, height: '8px' }}/></div>

             {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="space-y-3">
                {/* Social Buttons */}
                <div className="space-y-2 mb-1">
                  <Button variant="outline" className="w-full h-10 text-sm font-medium flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 disabled:opacity-50" onClick={handleGoogleSignIn} disabled={isOAuthLoading} > {isOAuthLoading ? ( <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div> ) : ( <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> )} Google </Button>
                   {oAuthError && <p className="text-red-500 text-xs mt-1 text-center">{oAuthError}</p>}
                   <div className="relative my-2"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div><div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">OR CONTINUE WITH EMAIL</span></div></div>
                </div>
                 {/* Fields */}
                 <div className="grid grid-cols-2 gap-1"><div><Label htmlFor="firstName" className="text-xs font-semibold text-gray-900 mb-1 block">First Name *</Label><Input id="firstName" type="text" placeholder="John" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className={`h-10 text-base px-3 bg-gray-100 text-gray-900 placeholder:text-gray-500 ${ errors.firstName ? 'border-red-500' : '' }`}/>{errors.firstName && (<p className="text-red-500 text-xs mt-1">{errors.firstName}</p>)}</div><div><Label htmlFor="lastName" className="text-xs font-semibold text-gray-900 mb-1 block">Last Name *</Label><Input id="lastName" type="text" placeholder="Doe" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} className={`h-10 text-base px-3 bg-gray-100 text-gray-900 placeholder:text-gray-500 ${ errors.lastName ? 'border-red-500' : '' }`}/>{errors.lastName && (<p className="text-red-500 text-xs mt-1">{errors.lastName}</p>)}</div></div><div><Label htmlFor="email" className="text-xs font-semibold text-gray-900 mb-1 block">Email *</Label><Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={`h-10 text-base px-3 bg-gray-100 text-gray-900 placeholder:text-gray-500 ${ errors.email ? 'border-red-500' : '' }`}/>{errors.email && (<p className="text-red-500 text-xs mt-1">{errors.email}</p>)}</div><div><Label htmlFor="phone" className="text-xs font-semibold text-gray-900 mb-1 block">Phone Number (Optional)</Label><Input id="phone" type="tel" placeholder="(555) 123-4567" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} maxLength={14} className={`h-10 text-base px-3 bg-gray-100 text-gray-900 placeholder:text-gray-500 ${ errors.phone ? 'border-red-500' : '' }`}/></div>
              </div>
            )}

             {/* Step 2, 3, 4, Navigation, Privacy Text remain the same */}
             {currentStep === 2 && ( <div className="space-y-2"> <Label className="text-xs font-semibold text-gray-900 mb-1 block"> What do you hope to achieve? (select all that apply) * </Label> <div className="space-y-1"> {goalOptions.map((option) => ( <div key={option.value} onClick={() => toggleGoal(option.value)} className={`flex items-center border rounded-lg p-2 cursor-pointer transition-all ${ formData.goals.includes(option.value) ? 'border-gray-400' : 'border-gray-300 bg-white hover:border-gray-400' }`} > <div className="w-4 h-4 border border-gray-400 rounded flex items-center justify-center flex-shrink-0 mr-2"> {formData.goals.includes(option.value) && ( <div className="w-1.5 h-1.5 bg-black rounded-sm"></div> )} </div> <span className="text-xs font-medium"> {option.label} </span> </div> ))} </div> {errors.goals && ( <p className="text-red-500 text-xs mt-1">{errors.goals}</p> )} </div> )}
             {currentStep === 3 && ( <div className="space-y-2"> <div> <Label className="text-xs font-semibold text-gray-900 mb-1 block"> Art Experience Level * </Label> <select value={formData.experienceLevel} onChange={(e) => handleInputChange('experienceLevel', e.target.value)} className={`w-full h-10 text-base px-3 border rounded-lg bg-gray-100 text-gray-900 ${ errors.experienceLevel ? 'border-red-500' : 'border-gray-300' }`} > <option value="">Select your experience level</option> <option value="complete-beginner">Complete beginner</option> <option value="some-experience">Some experience</option> <option value="intermediate">Intermediate</option> <option value="advanced">Advanced</option> <option value="professional">Professional</option> </select> {errors.experienceLevel && (<p className="text-red-500 text-xs mt-1">{errors.experienceLevel}</p>)} </div> <div> <Label className="text-xs font-semibold text-gray-900 mb-1 block"> Areas of Interest (select all that apply) </Label> <div className="space-y-1"> {interestOptions.map((option) => ( <div key={option.value} onClick={() => toggleInterest(option.value)} className={`flex items-center border rounded-lg p-1 cursor-pointer transition-all ${ formData.interests.includes(option.value) ? 'border-gray-400' : 'border-gray-300 bg-white hover:border-gray-400' }`} > <div className="w-4 h-4 border border-gray-400 rounded flex items-center justify-center flex-shrink-0 mr-1"> {formData.interests.includes(option.value) && (<div className="w-1.5 h-1.5 bg-black rounded-sm"></div>)} </div> <img src={option.image} alt={option.label} className="w-6 h-6 object-cover rounded mr-1"/> <span className="text-xs font-medium">{option.label}</span> </div> ))} </div> {errors.interests && (<p className="text-red-500 text-xs mt-1">{errors.interests}</p>)} </div> </div> )}
             {currentStep === 4 && ( <div className="space-y-3"> <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 flex items-center justify-between"> <div><p className="font-medium text-sm text-blue-900">Just sign up for newsletter</p><p className="text-xs text-blue-700">Skip account creation and only subscribe</p></div> <input type="checkbox" role="switch" className="h-5 w-9 appearance-none rounded-full bg-gray-300 checked:bg-blue-600 transition duration-200 ease-in-out cursor-pointer relative before:inline-block before:w-4 before:h-4 before:bg-white before:rounded-full before:shadow-sm before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 checked:before:translate-x-4" checked={formData.newsletterOptIn} onChange={(e) => handleInputChange('newsletterOptIn', e.target.checked)}/> </div> <div> <Label className="text-xs font-semibold text-gray-900 mb-1 block">How did you hear about us? *</Label> <select value={formData.referralSource} onChange={(e) => handleInputChange('referralSource', e.target.value)} className={`w-full h-10 text-base px-3 border rounded-lg bg-gray-100 text-gray-900 ${ errors.referralSource ? 'border-red-500' : 'border-gray-300' }`} > <option value="">Select how you heard about us</option> <option value="google">Google Search</option> <option value="social">Social Media</option> <option value="friend">Friend/Referral</option> <option value="ad">Advertisement</option> <option value="other">Other</option> </select> {errors.referralSource && (<p className="text-red-500 text-xs mt-1">{errors.referralSource}</p>)} </div> {!(formData.newsletterOptIn && !formData.password) && ( <> <div> <Label htmlFor="password" className="text-xs font-semibold text-gray-900 mb-1 block">Password *</Label> <Input id="password" type="password" placeholder="Enter your password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className={`h-10 text-base px-3 bg-gray-100 text-gray-900 placeholder:text-gray-500 ${ errors.password ? 'border-red-500' : '' }`}/> {errors.password && (<p className="text-red-500 text-xs mt-1">{errors.password}</p>)} </div> <div> <Label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-900 mb-1 block">Confirm Password *</Label> <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} className={`h-10 text-base px-3 bg-gray-100 text-gray-900 placeholder:text-gray-500 ${ errors.confirmPassword ? 'border-red-500' : '' }`}/> {errors.confirmPassword && (<p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>)} </div> </> )} <div className="flex items-start gap-2 p-2 border border-gray-200 rounded-lg"> <input type="checkbox" id="newsletter" className="mt-1 w-4 h-4" checked={formData.newsletterOptIn} onChange={(e) => handleInputChange('newsletterOptIn', e.target.checked)}/> <label htmlFor="newsletter" className="text-sm text-gray-700"> {(formData.newsletterOptIn && !formData.password) ? "Confirm newsletter subscription" : "Subscribe to newsletter for tips & updates"} </label> </div> </div> )}
             <div className="flex justify-between items-center gap-1 mt-4"><div>{currentStep > 1 && (<Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} className="h-8 px-3 py-1 text-xs font-medium border flex items-center gap-1"><ArrowLeft className="w-3 h-3" />Previous</Button>)}</div><div><Button onClick={handleNext} className="h-8 px-4 py-1 text-xs font-medium bg-black hover:bg-gray-800 text-white flex items-center gap-1">{currentStep === totalSteps ? (formData.newsletterOptIn && !formData.password ? 'Submit' : 'Create Account') : 'Next'}{currentStep < totalSteps && (<ChevronRight className="w-3 h-3" />)}</Button></div></div>
             <p className="text-xs text-gray-500 text-center mt-4">By continuing, you agree to our{' '}<a href="#" className="text-xs text-black underline hover:text-gray-700">Terms of Service</a>{' '}and{' '}<a href="#" className="text-xs text-black underline hover:text-gray-700">Privacy Policy</a></p>
          </>
        )}
      </div>
    </div>
  );
}