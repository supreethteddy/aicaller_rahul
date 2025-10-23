
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

type AuthMode = 'signin' | 'signup' | 'forgot';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const { user, signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords don't match",
            variant: "destructive"
          });
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation link"
          });
        }
      } else if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive"
          });
        }
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) {
          toast({
            title: "Reset failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Check your email",
            description: "We've sent you a password reset link"
          });
          setMode('signin');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Enhanced Starry Background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 0.5 + "px",
              height: Math.random() * 2 + 0.5 + "px",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.8, 0.2, 0.6, 0],
              scale: [0, 1, 0.9, 1.1, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 10 + 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Animated Grid Background */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(249, 115, 22, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "80px 80px"],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Mouse Follower Effect */}
      <motion.div
        className="fixed pointer-events-none z-50"
        style={{
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(20px)",
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.8 : 0.3,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Back Button */}
      <motion.div
        className="absolute top-6 left-6 z-20"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
         <Button
           onClick={handleGoBack}
           variant="ghost"
           size="sm"
           className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
         >
           <ArrowLeft className="w-4 h-4 mr-2" />
           Back
         </Button>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div
              className="text-white font-bold text-4xl mb-2"
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
            >
              <motion.span
                animate={{
                  textShadow: [
                    "0 0 0px rgba(249, 115, 22, 0)",
                    "0 0 10px rgba(249, 115, 22, 0.5)",
                    "0 0 0px rgba(249, 115, 22, 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                Agentic
              </motion.span>
              <span className="text-orange-400">AI</span>
            </motion.div>
            <p className="text-gray-300">AI Calling Assistant</p>
          </motion.div>

          {/* Auth Form */}
          <motion.div
            className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{
              borderColor: "rgba(249, 115, 22, 0.3)",
              boxShadow: "0 20px 40px rgba(249, 115, 22, 0.1)",
            }}
          >
            <div className="text-center mb-6">
              <motion.h1
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                {mode === 'signin' && 'Welcome Back'}
                {mode === 'signup' && 'Join AgenticAI'}
                {mode === 'forgot' && 'Reset Password'}
              </motion.h1>
              <motion.p
                className="text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
              >
                {mode === 'signin' && 'Sign in to access your AI calling dashboard'}
                {mode === 'signup' && 'Start automating your lead qualification today'}
                {mode === 'forgot' && 'Enter your email to receive reset instructions'}
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'signup' && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0, duration: 0.4 }}
                >
                  <Label htmlFor="fullName" className="text-white font-medium">Full Name</Label>
                   <Input
                     id="fullName"
                     type="text"
                     value={fullName}
                     onChange={e => setFullName(e.target.value)}
                     required
                     placeholder="Enter your full name"
                     className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500 transition-all"
                   />
                </motion.div>
              )}

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: mode === 'signup' ? 1.1 : 1.0, duration: 0.4 }}
              >
                <Label htmlFor="email" className="text-white font-medium">Email</Label>
                 <Input
                   id="email"
                   type="email"
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   required
                   placeholder="Enter your email"
                   className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500 transition-all"
                 />
              </motion.div>

              {mode !== 'forgot' && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: mode === 'signup' ? 1.2 : 1.1, duration: 0.4 }}
                >
                  <Label htmlFor="password" className="text-white font-medium">Password</Label>
                   <Input
                     id="password"
                     type="password"
                     value={password}
                     onChange={e => setPassword(e.target.value)}
                     required
                     placeholder="Enter your password"
                     className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500 transition-all"
                   />
                </motion.div>
              )}

              {mode === 'signup' && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3, duration: 0.4 }}
                >
                  <Label htmlFor="confirmPassword" className="text-white font-medium">Confirm Password</Label>
                   <Input
                     id="confirmPassword"
                     type="password"
                     value={confirmPassword}
                     onChange={e => setConfirmPassword(e.target.value)}
                     required
                     placeholder="Confirm your password"
                     className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500 transition-all"
                   />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mode === 'signup' ? 1.4 : 1.2, duration: 0.4 }}
              >
                 <Button
                   type="submit"
                   className="w-full bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
                   disabled={isLoading}
                 >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {mode === 'signin' && !isLoading && 'Access Dashboard'}
                  {mode === 'signup' && !isLoading && 'Start Free Trial'}
                  {mode === 'forgot' && !isLoading && 'Send Reset Link'}
                  {isLoading && 'Please wait...'}
                </Button>
              </motion.div>
            </form>

            <motion.div
              className="mt-6 text-center space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.4 }}
            >
              {mode === 'signin' && (
                <>
                   <button
                     type="button"
                     onClick={() => switchMode('forgot')}
                     className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                   >
                     Forgot your password?
                   </button>
                  <div>
                    <span className="text-sm text-gray-300">New to AgenticAI? </span>
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className="text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors"
                    >
                      Start your free trial
                    </button>
                  </div>
                </>
              )}

              {mode === 'signup' && (
                <div>
                  <span className="text-sm text-gray-300">Already have an account? </span>
                   <button
                     type="button"
                     onClick={() => switchMode('signin')}
                     className="text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors"
                   >
                     Sign in here
                   </button>
                </div>
              )}

              {mode === 'forgot' && (
                 <button
                   type="button"
                   onClick={() => switchMode('signin')}
                   className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                 >
                   Back to sign in
                 </button>
              )}
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="mt-6 pt-6 border-t border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.4 }}
            >
              <div className="flex justify-center items-center space-x-4 text-xs text-gray-400">
                <span>🔒 Enterprise Security</span>
                <span>•</span>
                <span>⚡ Instant Setup</span>
                <span>•</span>
                <span>📞 24/7 AI Calling</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed rounded-full pointer-events-none"
          style={{
            width: Math.random() * 4 + 2 + "px",
            height: Math.random() * 4 + 2 + "px",
            left: `${10 + i * 6}%`,
            top: `${20 + (i % 5) * 15}%`,
            background: `rgba(249, 115, 22, ${Math.random() * 0.5 + 0.2})`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0.5, 1, 0],
            scale: [0, 1, 0.8, 1.2, 0],
            y: [-50, -200, -50],
            x: [0, Math.sin(i) * 30, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 6 + i * 0.2,
            repeat: Number.POSITIVE_INFINITY,
            delay: 1.5 + i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default Auth;
