
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Starry Background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
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

        {/* Loading Content */}
        <motion.div
          className="text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-white font-bold text-4xl mb-4"
            animate={{
              textShadow: [
                "0 0 0px rgba(249, 115, 22, 0)",
                "0 0 10px rgba(249, 115, 22, 0.5)",
                "0 0 0px rgba(249, 115, 22, 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Agentic<span className="text-orange-400">AI</span>
          </motion.div>
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-400" />
          <p className="text-gray-300">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
