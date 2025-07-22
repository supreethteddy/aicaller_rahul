import React, { useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, User, Clock, DollarSign, Target, Lightbulb, Brain, MessageSquare, Zap, Users, PhoneCall } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AIAnalysisDialogProps {
  open: boolean;
  onClose: () => void;
  analysis: any;
  callData?: any;
}

// Create a memoized card component to improve rendering performance
const AnalysisCard = React.memo(({ 
  title, 
  icon, 
  children, 
  className = "" 
}: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
  className?: string;
}) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle className="text-base flex items-center space-x-2">
        {icon}
        <span>{title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
));

export const AIAnalysisDialog: React.FC<AIAnalysisDialogProps> = ({
  open,
  onClose,
  analysis,
  callData
}) => {
  // Try to parse analysis if it's a string - with error handling
  const parsedAnalysis = useMemo(() => {
    if (!analysis) return null;
    try {
      return typeof analysis === 'string' ? JSON.parse(analysis) : analysis;
    } catch (error) {
      console.error('Error parsing analysis:', error);
      return null;
    }
  }, [analysis]);

  if (!parsedAnalysis) return null;

  // Memoized helper functions to prevent recalculation
  const getScoreColor = useCallback((score: number) => {
    if (score >= 71) return 'text-green-600 bg-green-50';
    if (score >= 51) return 'text-yellow-600 bg-yellow-50';
    if (score >= 31) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  }, []);

  const getQualificationColor = useCallback((status: string) => {
    switch (status) {
      case 'Hot': return 'bg-red-100 text-red-800';
      case 'Warm': return 'bg-yellow-100 text-yellow-800';
      case 'Cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>AI Lead Analysis & Persuasion Strategy</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-120px)]">
          <div className="space-y-6 pr-4">
            {/* Lead Score Overview */}
            <AnalysisCard 
              title="Lead Score & Classification" 
              icon={<Target className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 px-4 py-2 rounded-lg ${getScoreColor(parsedAnalysis.leadScore)}`}>
                    {parsedAnalysis.leadScore}/100
                  </div>
                  <p className="text-sm text-gray-600">Overall Score</p>
                </div>
                <div className="text-center">
                  <Badge className={getQualificationColor(parsedAnalysis.qualificationStatus)}>
                    {parsedAnalysis.qualificationStatus}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">Qualification Status</p>
                </div>
                <div className="text-center">
                  <Badge variant={parsedAnalysis.sentiment === 'Positive' ? 'default' : 'secondary'}>
                    {parsedAnalysis.sentiment}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">Sentiment</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Lead Score</span>
                  <span>{parsedAnalysis.leadScore}%</span>
                </div>
                <Progress value={parsedAnalysis.leadScore} className="h-3" />
              </div>

              {/* Analysis Method */}
              <div className="mt-4 text-center">
                <Badge variant="outline" className="bg-blue-50">
                  Analysis by: {parsedAnalysis.analyzerUsed === 'openai' ? 'OpenAI GPT-4' : 'Basic Analyzer'}
                </Badge>
                {parsedAnalysis.openAIError && (
                  <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                    OpenAI Error: {parsedAnalysis.openAIError.message}
                  </div>
                )}
              </div>
            </AnalysisCard>

            {/* Detailed Summary */}
            {parsedAnalysis.detailedSummary && (
              <AnalysisCard 
                title="Detailed Conversation Analysis" 
                icon={<MessageSquare className="w-4 h-4 text-blue-600" />}
                className="border-blue-200 bg-blue-50/30"
              >
                <p className="text-sm text-gray-700 leading-relaxed">{parsedAnalysis.detailedSummary}</p>
              </AnalysisCard>
            )}

            {/* Psychology Profile & Persuasion Strategy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {parsedAnalysis.psychologyProfile && (
                <AnalysisCard 
                  title="Psychology Profile" 
                  icon={<User className="w-4 h-4 text-purple-600" />}
                  className="border-purple-200 bg-purple-50/30"
                >
                  <p className="text-sm text-gray-700 leading-relaxed">{parsedAnalysis.psychologyProfile}</p>
                  {parsedAnalysis.communicationStyle && (
                    <div className="mt-3">
                      <span className="text-sm font-medium text-purple-700">Communication Style:</span>
                      <p className="text-sm text-gray-600 mt-1">{parsedAnalysis.communicationStyle}</p>
                    </div>
                  )}
                </AnalysisCard>
              )}

              {parsedAnalysis.persuasionStrategy && (
                <AnalysisCard 
                  title="Persuasion Strategy" 
                  icon={<Zap className="w-4 h-4 text-green-600" />}
                  className="border-green-200 bg-green-50/30"
                >
                  <p className="text-sm text-gray-700 leading-relaxed">{parsedAnalysis.persuasionStrategy}</p>
                </AnalysisCard>
              )}
            </div>

            {/* Objections & Handling */}
            {parsedAnalysis.objections?.length > 0 && (
              <AnalysisCard 
                title="Objections & Handling Strategies" 
                icon={<Target className="w-4 h-4 text-orange-600" />}
                className="border-orange-200 bg-orange-50/30"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium text-orange-700 mb-2">Objections Raised:</h4>
                    <ul className="space-y-1">
                      {parsedAnalysis.objections.slice(0, 10).map((objection: string, index: number) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {objection}
                        </li>
                      ))}
                      {parsedAnalysis.objections.length > 10 && (
                        <li className="text-xs text-gray-500">
                          +{parsedAnalysis.objections.length - 10} more objections
                        </li>
                      )}
                    </ul>
                  </div>
                  {parsedAnalysis.objectionHandling?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-orange-700 mb-2">Handling Strategies:</h4>
                      <ul className="space-y-1">
                        {parsedAnalysis.objectionHandling.slice(0, 10).map((strategy: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {strategy}
                          </li>
                        ))}
                        {parsedAnalysis.objectionHandling.length > 10 && (
                          <li className="text-xs text-gray-500">
                            +{parsedAnalysis.objectionHandling.length - 10} more strategies
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </AnalysisCard>
            )}

            {/* Persuasion Tactics & Talking Points */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {parsedAnalysis.persuasionTactics?.length > 0 && (
                <AnalysisCard 
                  title="Persuasion Tactics" 
                  icon={<Lightbulb className="w-4 h-4" />}
                >
                  <div className="space-y-2">
                    {parsedAnalysis.persuasionTactics.slice(0, 8).map((tactic: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                        <Zap className="w-3 h-3 text-blue-600" />
                        <span className="text-sm">{tactic}</span>
                      </div>
                    ))}
                    {parsedAnalysis.persuasionTactics.length > 8 && (
                      <div className="text-xs text-gray-500">
                        +{parsedAnalysis.persuasionTactics.length - 8} more tactics
                      </div>
                    )}
                  </div>
                </AnalysisCard>
              )}

              {parsedAnalysis.talkingPoints?.length > 0 && (
                <AnalysisCard 
                  title="Key Talking Points" 
                  icon={<MessageSquare className="w-4 h-4" />}
                >
                  <div className="space-y-2">
                    {parsedAnalysis.talkingPoints.slice(0, 8).map((point: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-green-50 rounded">
                        <span className="w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-medium mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-sm">{point}</span>
                      </div>
                    ))}
                    {parsedAnalysis.talkingPoints.length > 8 && (
                      <div className="text-xs text-gray-500">
                        +{parsedAnalysis.talkingPoints.length - 8} more points
                      </div>
                    )}
                  </div>
                </AnalysisCard>
              )}
            </div>

            {/* Follow-up Recommendations */}
            {parsedAnalysis.followUpRecommendations && (
              <AnalysisCard 
                title="Follow-up Strategy" 
                icon={<PhoneCall className="w-4 h-4 text-indigo-600" />}
                className="border-indigo-200 bg-indigo-50/30"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium text-indigo-700">Timing:</span>
                    <p className="text-sm text-gray-700 mt-1">{parsedAnalysis.followUpRecommendations.timing}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-indigo-700">Channel:</span>
                    <p className="text-sm text-gray-700 mt-1">{parsedAnalysis.followUpRecommendations.channel}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-indigo-700">Approach:</span>
                    <p className="text-sm text-gray-700 mt-1">{parsedAnalysis.followUpRecommendations.approach}</p>
                  </div>
                </div>
              </AnalysisCard>
            )}

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnalysisCard 
                title="Interest & Authority" 
                icon={<Target className="w-4 h-4 text-purple-600" />}
                className="border-purple-200 bg-purple-50/30"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-purple-700 mb-2">Interest Level</h4>
                    <div className="flex items-center space-x-2">
                      <Progress value={(parsedAnalysis.interestLevel || 0) * 10} className="h-2" />
                      <span className="text-sm font-medium">{parsedAnalysis.interestLevel || 0}/10</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-700 mb-2">Decision Authority</h4>
                    <p className="text-sm text-gray-700">{parsedAnalysis.decisionAuthority || 'Unknown'}</p>
                  </div>
                </div>
              </AnalysisCard>

              <AnalysisCard 
                title="Timeline & Budget" 
                icon={<Clock className="w-4 h-4" />}
              >
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Timeline:</span>
                    <Badge variant="outline" className="ml-2">
                      {parsedAnalysis.timelineUrgency || parsedAnalysis.timeline || 'Not specified'}
                    </Badge>
                  </div>
                  {parsedAnalysis.budgetIndicators?.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Budget Signals:</span>
                      <div className="mt-1 space-y-1">
                        {parsedAnalysis.budgetIndicators.slice(0, 2).map((indicator: string, index: number) => (
                          <div key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {indicator}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AnalysisCard>
            </div>

            {/* Timeline & Next Action */}
            <AnalysisCard 
              title="Timeline & Next Steps" 
              icon={<Clock className="w-4 h-4 text-green-600" />}
              className="border-green-200 bg-green-50/30"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-700 mb-2">Timeline</h4>
                  <p className="text-sm text-gray-700">{parsedAnalysis.timeline || 'Not specified in conversation'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-green-700 mb-2">Recommended Next Action</h4>
                  <p className="text-sm text-gray-700">{parsedAnalysis.nextBestAction || 'No specific recommendation available'}</p>
                </div>
              </div>
            </AnalysisCard>

            {/* Basic Summary (fallback) */}
            {parsedAnalysis.summary && !parsedAnalysis.detailedSummary && (
              <AnalysisCard 
                title="AI Summary" 
                icon={<MessageSquare className="w-4 h-4" />}
              >
                <p className="text-sm text-gray-700 leading-relaxed">{parsedAnalysis.summary}</p>
              </AnalysisCard>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};