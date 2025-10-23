import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { ElevenLabsProvider } from '@/integrations/elevenlabs/client';
import { Voice } from '@/integrations/voice/Provider';
import { useToast } from '@/hooks/use-toast';

interface VoiceSelectorProps {
    onVoiceSelect: (voiceId: string) => void;
    selectedVoice: string;
    className?: string;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
    onVoiceSelect,
    selectedVoice = '',
    className = '',
}) => {
    const [voices, setVoices] = useState<Voice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const elevenLabs = new ElevenLabsProvider();

    // Format voice name for display
    const formatVoiceName = (voice: Voice): string => {
        if (!voice || !voice.name) return '';

        // For ElevenLabs voices, use the name and category/description
        const name = voice.name;
        const category = voice.category || '';
        const description = voice.description || '';

        if (category) {
            return `${name} (${category})`;
        } else if (description) {
            return `${name} (${description})`;
        }
        
        return name;
    };

    useEffect(() => {
        const fetchVoices = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Get the API key first
                const apiKey = await elevenLabs.getApiKey();
                if (!apiKey) {
                    setError('Please configure your ElevenLabs API key in Settings');
                    setVoices([]);
                    setLoading(false);
                    return;
                }
                
                // Set the API key before fetching
                elevenLabs.setApiKey(apiKey);
                
                const fetchedVoices = await elevenLabs.fetchVoices();
                
                // Sort voices by name
                const sortedVoices = fetchedVoices.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                
                setVoices(sortedVoices);

                // Auto-select first voice if no voice is selected
                if (!selectedVoice && sortedVoices.length > 0) {
                    onVoiceSelect(sortedVoices[0].voice_id);
                }
                // If we have a selectedVoice but it's not in the fetched voices,
                // notify the user and select the first available voice
                else if (selectedVoice && !sortedVoices.some(v => v.voice_id === selectedVoice)) {
                    if (sortedVoices.length > 0) {
                        onVoiceSelect(sortedVoices[0].voice_id);
                    }
                    toast({
                        title: "Warning",
                        description: "Previously selected voice is no longer available. Selected first available voice.",
                        variant: "destructive",
                    });
                }
            } catch (error: any) {
                console.error('Error fetching ElevenLabs voices:', error);
                setError(error.message || 'Failed to load voices. Please check your ElevenLabs API key.');
                setVoices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVoices();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-[52px]">
                    <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center space-x-2 text-red-600 h-[52px]">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                </div>
            );
        }

        if (voices.length === 0) {
            return (
                <div className="text-center text-gray-600 h-[52px] flex items-center justify-center">
                    No voices available
                </div>
            );
        }

        return (
            <Select
                value={selectedVoice}
                onValueChange={onVoiceSelect}
            >
                <SelectTrigger className="h-[52px]">
                    <SelectValue placeholder="Select voice">
                        {selectedVoice && voices.length > 0
                            ? formatVoiceName(voices.find(v => v.voice_id === selectedVoice) || voices[0])
                            : 'Select voice'}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                    {voices.map((voice) => (
                        <SelectItem key={voice.voice_id} value={voice.voice_id}>
                            {formatVoiceName(voice)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    };

    return (
        <div className={className}>
            <div className="space-y-2">
                <Label>Voice</Label>
                {renderContent()}
            </div>
        </div>
    );
}; 