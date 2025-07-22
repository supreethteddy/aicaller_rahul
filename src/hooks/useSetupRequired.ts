import { useQuery } from '@tanstack/react-query';

export const useSetupRequired = () => {
    const { data: setupRequired, isLoading } = useQuery({
        queryKey: ['activation_status', 'mock-user-123'],
        queryFn: async () => {
            // Always return false for static app - no setup required
            return false;
        },
        enabled: true,
        refetchOnWindowFocus: true
    });

    return {
        setupRequired: setupRequired ?? false,
        isLoading
    };
}; 