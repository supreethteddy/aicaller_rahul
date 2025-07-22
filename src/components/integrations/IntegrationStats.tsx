
import React from 'react';

interface IntegrationStatsProps {
  activeIntegrations: number;
  totalLeads: number;
  lastSync: any;
}

export const IntegrationStats: React.FC<IntegrationStatsProps> = ({
  activeIntegrations,
  totalLeads,
  lastSync
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-background/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-border/50 glass-card-elegant hover-scale-elegant group stagger-animation stagger-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-2xl"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-4 rounded-2xl pulse-glow">
            <span className="text-3xl">🔗</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground/80 font-medium">Active Integrations</p>
            <p className="text-3xl font-bold text-foreground counter-animation animate-counter">{activeIntegrations}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-background/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-border/50 glass-card-elegant hover-scale-elegant group stagger-animation stagger-2">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-2xl"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-2xl pulse-glow">
            <span className="text-3xl">📥</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground/80 font-medium">Total Leads Imported</p>
            <p className="text-3xl font-bold text-foreground counter-animation animate-counter">{totalLeads}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-background/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-border/50 glass-card-elegant hover-scale-elegant group stagger-animation stagger-3">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-2xl"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 p-4 rounded-2xl pulse-glow">
            <span className="text-3xl">⚡</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground/80 font-medium">Last Sync</p>
            <p className="text-3xl font-bold text-foreground counter-animation">
              {lastSync ? new Date(lastSync.last_sync_at!).toLocaleTimeString() : 'Never'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
