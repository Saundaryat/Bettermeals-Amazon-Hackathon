import React from 'react';
import { Lock, ChevronRight, Check } from 'lucide-react';

export type ActionStatus =
    | 'PENDING'
    | 'BLOCKED'
    | 'SCHEDULED'
    | 'IN_PROGRESS'
    | 'NEEDS_ATTENTION'
    | 'DONE';

interface ActionCardProps {
    title: string;
    description?: string;
    status: ActionStatus;
    dueLabel?: string;
    primaryCtaLabel?: string;
    onPrimaryClick?: () => void;
    secondaryCtaLabel?: string;
    onSecondaryClick?: () => void;
    rightElement?: React.ReactNode;
    icon?: React.ElementType; // Optional icon for the card itself
}

export default function ActionCard({
    title,
    description,
    status,
    dueLabel,
    primaryCtaLabel,
    onPrimaryClick,
    secondaryCtaLabel,
    onSecondaryClick,
    rightElement,
    icon: Icon
}: ActionCardProps) {

    const getStatusStyles = (status: ActionStatus) => {
        switch (status) {
            case 'PENDING':
                return 'bg-gray-100 text-gray-700';
            case 'NEEDS_ATTENTION':
                return 'bg-orange-100 text-orange-700';
            case 'BLOCKED':
                return 'bg-gray-100 text-gray-400';
            case 'SCHEDULED':
                return 'bg-gray-50 text-gray-400';
            case 'IN_PROGRESS':
                return 'bg-emerald-50 text-emerald-700';
            case 'DONE':
                return 'bg-green-50 text-green-600';
            default:
                return 'bg-gray-50 text-gray-500';
        }
    };

    const getStatusLabel = (status: ActionStatus) => {
        switch (status) {
            case 'PENDING': return 'Pending';
            case 'NEEDS_ATTENTION': return 'Needs Attention';
            case 'BLOCKED': return 'Blocked';
            case 'SCHEDULED': return 'Scheduled';
            case 'IN_PROGRESS': return 'In Progress';
            case 'DONE': return 'Done';
            default: return status;
        }
    };

    return (
        <div className={`
      flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg border border-gray-100 
      ${status === 'BLOCKED' ? 'opacity-75' : ''}
      hover:border-gray-200 transition-colors gap-4 sm:gap-0
    `}>
            <div className="flex items-start sm:items-center space-x-4">
                {Icon && (
                    <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                        <Icon className="w-5 h-5 text-gray-500" />
                    </div>
                )}

                {/* Title & Badge */}
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`font-medium ${status === 'DONE' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {title}
                        </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs mt-0.5">
                        {/* If description is present, show it. */}
                        {description ? (
                            <span className="text-gray-500">{description}</span>
                        ) : dueLabel ? (
                            <span className="text-gray-500 italic">{dueLabel}</span>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pl-14 sm:pl-0 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
                {rightElement && (
                    <span className="text-xs font-medium text-gray-900 mr-2">{rightElement}</span>
                )}

                {/* Status Chip */}
                <div className={`
          flex items-center px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap
          ${getStatusStyles(status)}
        `}>
                    {status === 'BLOCKED' && <Lock className="w-3 h-3 mr-1.5" />}
                    {status === 'DONE' && <Check className="w-3 h-3 mr-1.5" />}
                    {getStatusLabel(status)}
                </div>

                {/* Primary CTA */}
                {primaryCtaLabel && (status === 'PENDING' || status === 'NEEDS_ATTENTION') && (
                    <button
                        onClick={onPrimaryClick}
                        className="px-4 py-1.5 bg-[#f7e6cf] hover:bg-[#ebd5b5] text-amber-900 text-xs font-medium rounded-md transition-colors whitespace-nowrap"
                    >
                        {primaryCtaLabel}
                    </button>
                )}

                {/* Secondary / Why Blocked */}
                {secondaryCtaLabel && (
                    <button
                        onClick={onSecondaryClick}
                        className="flex items-center px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium rounded-md transition-colors whitespace-nowrap"
                    >
                        {secondaryCtaLabel} <ChevronRight className="w-3 h-3 ml-1" />
                    </button>
                )}
            </div>
        </div>
    );
}
