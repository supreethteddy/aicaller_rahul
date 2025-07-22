import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Mail, MessageSquare, Phone } from 'lucide-react';

interface SetupRequiredNoticeProps {
    onContactClick: () => void;
    onChatClick: () => void;
}

export const SetupRequiredNotice: React.FC<SetupRequiredNoticeProps> = ({
    onContactClick,
    onChatClick
}) => {
    const handleContactClick = (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.href = 'mailto:support@aicaller.com';
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Card className="relative overflow-hidden max-w-2xl w-full mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                <CardHeader className="text-center relative z-10">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Setup Required</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6 relative z-10">
                    <p className="text-muted-foreground text-lg">
                        To activate your AI Calling Dashboard, please reach out to our team.
                        Our team will assist you in configuring the complete system for your business needs.
                    </p>

                    <div className="flex flex-col items-center max-w-md mx-auto space-y-4">
                        <Button
                            onClick={handleContactClick}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                            <Mail className="w-4 h-4" />
                            Contact Support
                        </Button>

                        <div className="text-sm text-muted-foreground">or</div>

                        <Button
                            variant="outline"
                            onClick={onChatClick}
                            className="w-full flex items-center justify-center gap-2 border-blue-200 hover:bg-blue-50"
                        >
                            <MessageSquare className="w-4 h-4" />
                            Chat with Us
                        </Button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="space-y-3">
                            <div className="flex items-center justify-center gap-2 text-blue-600">
                                <Mail className="w-4 h-4" />
                                <a href="mailto:support@aicaller.com" className="hover:underline">
                                    support@aicaller.com
                                </a>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-blue-600">
                                <Phone className="w-4 h-4" />
                                <a href="tel:+1-800-123-4567" className="hover:underline">
                                    +1-800-123-4567
                                </a>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Note: The dashboard will remain inactive until setup is completed.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 