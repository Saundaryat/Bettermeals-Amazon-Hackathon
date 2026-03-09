import React from 'react';
import { Activity, Check } from 'lucide-react';

interface ClinicalFocusCardProps {
    clinical_matching: {
        biomarker_interventions: {
            marker: {
                name: string;
                status: string;
                value?: string;
                unit?: string;
            };
            nutritional_interventions: {
                strategy: string;
                implementation: string;
            }[];
            expected_outcome: string;
        }[];
    };
    profile_context?: {
        nutrition_profile: string;
    };
}

export const ClinicalFocusCard: React.FC<ClinicalFocusCardProps> = ({ clinical_matching, profile_context }) => {
    return (
        <div className="bg-white rounded-xl p-8 border border-gray-100 relative">
            <div className="flex items-center gap-2 mb-8">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f7e6cf]">
                    <Activity className="w-4 h-4 text-[#51754f]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Clinical Focus & Biomarkers</h3>
            </div>

            <div className="space-y-6 relative">
                {/* Headers - hidden on mobile, visible on md */}
                <div className="hidden md:grid grid-cols-2 gap-8 mb-2 px-2">
                    <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider">Target Marker</h4>
                    <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider">Intervention & Outcome</h4>
                </div>

                {/* Rows */}
                <div className="space-y-6">
                    {(clinical_matching?.biomarker_interventions || []).map((intervention, idx) => {
                        return (
                            <div key={idx} className="grid grid-cols-2 gap-4 md:gap-8 relative items-stretch group">
                                {/* Marker */}
                                <div className="bg-[#f7e6cf]/20 rounded-2xl p-4 transition-all duration-300 hover:shadow-sm hover:border-[#f7e6cf] flex flex-col justify-center group-hover:bg-[#f7e6cf]/50">
                                    <div className="font-bold text-gray-900 text-base mb-1">{intervention.marker.name}</div>
                                    <div className="text-[#51754f] font-semibold text-sm">
                                        Status: <span className="uppercase">{intervention.marker.status}</span>
                                        {intervention.marker.value && <span className="text-xs text-[#51754f]/70 font-medium ml-2">({intervention.marker.value} {intervention.marker.unit})</span>}
                                    </div>
                                </div>

                                {/* Benefit / Outcome */}
                                <div className="bg-[#51754f]/10 rounded-2xl p-4 transition-all duration-300 hover:shadow-sm hover:border-[#51754f]/40 flex flex-col justify-center group-hover:bg-[#51754f]/20">
                                    {(intervention.nutritional_interventions || []).map((step, i) => (
                                        <div key={i} className={`flex flex-col ${i > 0 ? 'mt-3 pt-3 border-t border-[#51754f]/10' : ''}`}>
                                            <div className="text-gray-900 font-medium text-sm leading-relaxed mb-1">
                                                {step.strategy}
                                            </div>
                                            <div className="text-xs text-gray-500 leading-snug">
                                                {step.implementation}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Profile Context Footer */}
            {profile_context && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 rounded-2xl p-4">
                    <div className="text-center md:text-left">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Active Profile</p>
                        <p className="text-base font-bold text-gray-900">{profile_context.nutrition_profile}</p>
                    </div>
                    <div className="bg-[#51754f] rounded-full p-2 flex-shrink-0">
                        <Check className="w-5 h-5 text-white" />
                    </div>
                </div>
            )}
        </div>
    );
};
