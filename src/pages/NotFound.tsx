import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleBackToDashboard = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="text-center space-y-6 p-8 rounded-lg bg-white/5 backdrop-blur-lg">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <p className="text-xl text-gray-300">Oops! Page not found</p>
        <p className="text-gray-400 max-w-md">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <div className="space-x-4">
          <Button
            onClick={handleBackToDashboard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            {user ? 'Back to Dashboard' : 'Back to Home'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
