import React from 'react';
import { CycleSyncingStyles } from './CycleSyncing.styles';

export const BeforeAfterVisual = () => {
    return (
        <div className={CycleSyncingStyles.beforeAfter.container}>
            <div className={CycleSyncingStyles.beforeAfter.imageWrapper}>
                <div className={CycleSyncingStyles.beforeAfter.imageInner}>
                    <img
                        src="/app/images/cyclesyncing/before_after_comparison.png"
                        alt="Cycle syncing impact comparison"
                        className={CycleSyncingStyles.beforeAfter.image}
                        loading="lazy"
                    />
                </div>
            </div>

            <div className={CycleSyncingStyles.beforeAfter.textRow}>
                <div className={CycleSyncingStyles.beforeAfter.textCol}>
                    <p className={CycleSyncingStyles.text.beforeAfterTitle}>
                        Before
                    </p>
                </div>
                <div className={CycleSyncingStyles.beforeAfter.textCol}>
                    <p className={CycleSyncingStyles.text.beforeAfterTitle}>
                        After
                    </p>
                </div>
            </div>
        </div>
    );
};
