import { useQuery } from '@tanstack/react-query';

export interface Voice {
  id: string;
  name: string;
  accent: string;
  gender: string;
  sample_url: string;
}

// Static voices data - this could be moved to Supabase in the future
const voices: Voice[] = [
  { id: 'maya', name: 'Maya', accent: 'American', gender: 'Female', sample_url: 'https://example.com/maya.mp3' },
  { id: 'ryan', name: 'Ryan', accent: 'American', gender: 'Male', sample_url: 'https://example.com/ryan.mp3' },
  { id: 'sarah', name: 'Sarah', accent: 'British', gender: 'Female', sample_url: 'https://example.com/sarah.mp3' },
  { id: 'alex', name: 'Alex', accent: 'Australian', gender: 'Male', sample_url: 'https://example.com/alex.mp3' }
];

export const useVoices = () => {
  return useQuery({
    queryKey: ['voices'],
    queryFn: async () => {
      return voices;
    },
    enabled: true,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - voices don't change often
  });
};
