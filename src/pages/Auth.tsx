
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { AuthHeroSection } from '@/components/auth/AuthHeroSection';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuthForm } from '@/hooks/useAuthForm';

const Auth = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    mode,
    email,
    password,
    confirmPassword,
    fullName,
    isLoading,
    setEmail,
    setPassword,
    setConfirmPassword,
    setFullName,
    handleSubmit,
    switchMode
  } = useAuthForm();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Back Button */}
      <div className="sm:absolute top-6 left-6 z-20 p-4 sm:p-0">
        <Button
          onClick={handleGoBack}
          variant="ghost"
          size="sm"
          className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Background animations */}
      <AuthBackground isPlaying={isPlaying} />

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-6/12">
          <AuthHeroSection />
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 lg:w-6/12">
          <AuthForm
            mode={mode}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            fullName={fullName}
            isLoading={isLoading}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onFullNameChange={setFullName}
            onSubmit={handleSubmit}
            onModeSwitch={switchMode}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
