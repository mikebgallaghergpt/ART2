// ✅ SignupFormOriginal.tsx (Optimized with ShadCN Toast)
// Assumes ShadCN's toast utility is installed
// Run: npm install sonner

import React, { useState, useEffect, Suspense } from 'react';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { toast } from 'sonner'; // ✅ Import ShadCN toast
import {
  ArrowLeft,
  ChevronRight,
  User,
  Target,
  Palette,
  Mail,
} from 'lucide-react';

// ... other state declarations and constants

function SignupFormOriginal() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    goals: [],
    experienceLevel: '',
    interests: [],
    referralSource: '',
    password: '',
    confirmPassword: '',
    newsletterOptIn: false,
  });

  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    const stepErrors = {};
    if (currentStep === 1) {
      if (!formData.firstName) stepErrors.firstName = 'First name is required';
      if (!formData.lastName) stepErrors.lastName = 'Last name is required';
      if (!formData.email) stepErrors.email = 'Email is required';
    } else if (currentStep === 2 && formData.goals.length === 0) {
      stepErrors.goals = 'Select at least one goal';
    } else if (currentStep === 3) {
      if (!formData.experienceLevel) stepErrors.experienceLevel = 'Select your level';
      if (formData.interests.length === 0) stepErrors.interests = 'Pick at least one area';
    } else if (currentStep === 4) {
      if (!formData.referralSource) stepErrors.referralSource = 'This field is required';
      if (!formData.newsletterOptIn) {
        if (!formData.password) stepErrors.password = 'Password required';
        if (formData.password !== formData.confirmPassword)
          stepErrors.confirmPassword = 'Passwords do not match';
      }
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep === totalSteps) {
        handleSubmit();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      toast.error('Please correct the errors before continuing.');
    }
  };

  const handleRestart = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      goals: [],
      experienceLevel: '',
      interests: [],
      referralSource: '',
      password: '',
      confirmPassword: '',
      newsletterOptIn: false,
    });
    setCurrentStep(1);
    setErrors({});
    setShowConfirmation(false);
    toast.success('Form has been reset.');
  };

  const handleSubmit = async () => {
    try {
      // 🔄 Placeholder for sending email via Resend
      console.log('Sending submission to Resend or Supabase...');
      setShowConfirmation(true);
      toast.success('Submission successful!');
    } catch (error) {
      console.error(error);
      toast.error('Submission failed. Please try again.');
    }
  };

  // Render logic remains unchanged...
  return (
    <div className="w-full bg-white rounded-xl shadow-sm p-4">
      {/* Steps, Form fields, and Submit navigation remain */}
      {/* Toasts will show automatically on error/success */}
    </div>
  );
}

export default SignupFormOriginal;