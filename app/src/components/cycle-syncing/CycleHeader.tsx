import React from 'react';
import { Menu } from 'lucide-react';
import { CycleSyncingStyles } from './CycleSyncing.styles';

export const CycleHeader = () => {
    return (
        <header className={CycleSyncingStyles.header.container}>
            <div className={CycleSyncingStyles.header.menuIconWrapper}>
                <Menu className={CycleSyncingStyles.header.menuIcon} />
            </div>

            <div className={CycleSyncingStyles.header.logoWrapper}>
                <img
                    src="/app/images/icon2.png"
                    alt="Logo"
                    className={CycleSyncingStyles.header.logoImg}
                />
                <span className={CycleSyncingStyles.header.logoText}>bettermeals</span>
            </div>

            <div className={CycleSyncingStyles.header.spacer} /> {/* Spacer for balance */}
        </header>
    );
};
