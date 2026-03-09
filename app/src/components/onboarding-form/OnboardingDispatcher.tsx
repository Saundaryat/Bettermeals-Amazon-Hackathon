import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MultiStepOnboarding } from './standard';
import { CycleSyncingOnboarding } from './cycle-syncing';
import LocalStorageManager from '@/lib/localStorageManager';
import { Loader2 } from 'lucide-react';

export default function OnboardingDispatcher() {
    const { user, loading } = useAuth();
    const [flowType, setFlowType] = useState<string | null>(null);

    useEffect(() => {
        if (loading) return;

        // 1. Try to get flow from user profile (backend)
        if (user?.onboarding_flow) {
            setFlowType(user.onboarding_flow);
            return;
        }

        // 2. Fallback to LocalStorage (legacy/cache)
        const localFlow = LocalStorageManager.getItem('onboarding_flow');
        if (localFlow) {
            setFlowType(localFlow);
            return;
        }

        // 3. Default fallback
        setFlowType('standard');
    }, [user, loading]);

    if (loading || !flowType) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-green-700" />
            </div>
        );
    }

    // Dispatch based on flow type
    switch (flowType) {
        case 'cycle-syncing':
            return <CycleSyncingOnboarding />;

        // Future expansion:
        case 'age-tech':
            // return <AgeTechOnboarding />;
            return <div className="p-8 text-center">Age Tech Onboarding Coming Soon</div>;

        case 'standard':
        default:
            return <MultiStepOnboarding />;
    }
}
