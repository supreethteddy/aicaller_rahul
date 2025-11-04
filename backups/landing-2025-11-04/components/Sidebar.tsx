import React, { useState, useEffect } from 'react';
import { Home, Users, Phone, Settings, BarChart3, Zap, Bot, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigation = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: Home
  },
  {
    id: 'leads',
    name: 'Lead Management',
    icon: Users
  },
  {
    id: 'bland-ai',
    name: 'AI Calls',
    icon: Bot
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: BarChart3
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    // Static profile data
    setProfile({
      full_name: 'Test User',
      avatar_url: ''
    });
  };

  const handleSignOut = async () => {
    // Prevent multiple signout attempts
    if (isSigningOut) {
      console.log('Signout already in progress, ignoring additional click');
      return;
    }

    setIsSigningOut(true);

    try {
      console.log('Starting signout process...');
      const { error } = await signOut();

      if (error) {
        console.error('Signout failed:', error);
        toast({
          title: "Signout Issue",
          description: "There was an issue signing out, but you've been logged out locally.",
          variant: "default"
        });
      } else {
        console.log('Signout completed successfully');
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out."
        });
      }
      // Navigation will be handled by the auth context
    } catch (err) {
      console.error('Unexpected error during signout:', err);
      toast({
        title: "Signed Out",
        description: "You have been signed out locally.",
        variant: "default"
      });
    } finally {
      // Reset the loading state after a short delay to prevent rapid clicking
      setTimeout(() => {
        setIsSigningOut(false);
      }, 1000);
    }
  };

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-center">AgenticAI</h1>
        <p className="text-slate-400 text-sm mt-1 text-center">AI Calling Assistant</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 max-h-[calc(100vh_-_12rem)] overflow-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors',
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-slate-700 space-y-4">
        {user && (
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2 bg-slate-800 rounded-lg">
              <Avatar className="w-8 h-8">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>
                  {profile.full_name?.split(' ').map(n => n[0]).join('') || user.email?.[0].toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.email}
                </p>
                <p className="text-xs text-slate-400">Basic Plan</p>
              </div>
            </div>

            <Button
              onClick={handleSignOut}
              disabled={isSigningOut}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isSigningOut ? 'Signing Out...' : 'Sign Out'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
