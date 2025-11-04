import React, { useState } from 'react';
import { VoiceSelector } from './VoiceSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Volume2, CheckCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export const VoicesPage: React.FC = () => {
    const [selectedVoice, setSelectedVoice] = useState<string>();
    const [testText, setTestText] = useState('Hello! This is a test of the selected voice.');
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const { toast } = useToast();

    const handleVoiceSelect = (voiceId: string) => {
        setSelectedVoice(voiceId);
    };

    const handleTestVoice = async () => {
        if (!selectedVoice) return;

        try {
            setIsLoading(true);
            
            // Simulate voice testing (in real implementation, this would call the API)
            toast({
                title: 'Voice Test',
                description: `Testing voice: ${selectedVoice}`,
            });
            
            // Simulate audio generation delay
            setTimeout(() => {
                setIsLoading(false);
                toast({
                    title: 'Success',
                    description: 'Voice test completed successfully',
                });
            }, 2000);

        } catch (error: any) {
            console.error('Error testing voice:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to test voice. Please try again.',
                variant: 'destructive',
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">AI Voices</h1>
                    <p className="text-gray-600 mt-2">
                        Browse and test from our collection of AI voices across multiple languages
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <VoiceSelector
                        onVoiceSelect={handleVoiceSelect}
                        selectedVoice={selectedVoice}
                        className="h-full"
                    />
                </div>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Volume2 className="w-5 h-5" />
                                <span>Voice Preview</span>
                            </CardTitle>
                            <CardDescription>
                                Test the selected voice with custom text
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Enter text to test the voice..."
                                    value={testText}
                                    onChange={(e) => setTestText(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <audio ref={audioRef} className="w-full" controls />

                            <Button
                                className="w-full"
                                onClick={handleTestVoice}
                                disabled={!selectedVoice || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 mr-2" />
                                        Test Voice
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};