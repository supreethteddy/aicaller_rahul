
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

type AuthMode = 'signin' | 'signup' | 'forgot';

interface AuthFormProps {
  mode: AuthMode;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  isLoading: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onFullNameChange: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onModeSwitch: (mode: AuthMode) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  email,
  password,
  confirmPassword,
  fullName,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onFullNameChange,
  onSubmit,
  onModeSwitch,
}) => {
  return (
    <div className="flex items-center justify-center p-6 lg:p-8 xl:pl-4 h-full">
      <div className="w-full max-w-md">
        {/* Mobile Logo */}
        <div className="lg:hidden text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl font-bold text-white">AgenticAI</h1>
          </div>
          <p className="text-slate-300">Your AI Calling Assistant Awaits</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">
              {mode === 'signin' && 'Welcome Back'}
              {mode === 'signup' && 'Join AgenticAI'}
              {mode === 'forgot' && 'Reset Password'}
            </CardTitle>
            <CardDescription className="text-slate-300">
              {mode === 'signin' && 'Sign in to access your AI calling dashboard'}
              {mode === 'signup' && 'Start automating your lead qualification today'}
              {mode === 'forgot' && 'Enter your email to receive reset instructions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={e => onFullNameChange(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => onEmailChange(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => onPasswordChange(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400"
                  />
                </div>
              )}

              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={e => onConfirmPasswordChange(e.target.value)}
                    required
                    placeholder="Confirm your password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'signin' && !isLoading && 'Access Dashboard'}
                {mode === 'signup' && !isLoading && 'Start Free Trial'}
                {mode === 'forgot' && !isLoading && 'Send Reset Link'}
                {isLoading && 'Please wait...'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              {mode === 'signin' && (
                <>
                  <button
                    type="button"
                    onClick={() => onModeSwitch('forgot')}
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Forgot your password?
                  </button>
                  <div>
                    <span className="text-sm text-slate-300">New to AgenticAI? </span>
                    <button
                      type="button"
                      onClick={() => onModeSwitch('signup')}
                      className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                      Start your free trial
                    </button>
                  </div>
                </>
              )}

              {mode === 'signup' && (
                <div>
                  <span className="text-sm text-slate-300">Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => onModeSwitch('signin')}
                    className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    Sign in here
                  </button>
                </div>
              )}

              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => onModeSwitch('signin')}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Back to sign in
                </button>
              )}
            </div>

            {/* Trust indicators */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex justify-center items-center space-x-4 text-xs text-slate-400">
                <span>🔒 Enterprise Security</span>
                <span>•</span>
                <span>⚡ Instant Setup</span>
                <span>•</span>
                <span>📞 24/7 AI Calling</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
