
import React from 'react';
import { Home, Users, Phone, Settings, BarChart3, Zap, Bot, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface MobileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'leads', name: 'Leads', icon: Users },
  { id: 'bland-ai', name: 'AI Calls', icon: Bot },
  { id: 'reports', name: 'Reports', icon: BarChart3 },
  { id: 'settings', name: 'Settings', icon: Settings }
];

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Signout Issue",
          description: "There was an issue signing out, but you've been logged out locally.",
          variant: "default"
        });
      } else {
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out."
        });
      }
    } catch (err) {
      toast({
        title: "Signed Out",
        description: "You have been signed out locally.",
        variant: "default"
      });
    }
  };

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm shadow-lg"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex flex-col h-full bg-slate-900 text-white">
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-xl font-bold text-center">AgenticAI</h1>
            <p className="text-slate-400 text-sm mt-1 text-center">AI Calling Assistant</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    'w-full flex items-center space-x-3 px-4 py-4 rounded-lg text-left transition-colors touch-manipulation',
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
          <div className="p-4 border-t border-slate-700">
            {user && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-slate-800 rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {user.email?.[0].toUpperCase() || 'U'}
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
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800 touch-manipulation min-h-[44px]"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
