import React, { useState } from "react";
import { profileStyles } from "@/pages/styles/Profile.styles";
import { AlertCircle, CheckCircle, AlertTriangle, FileText, ExternalLink, X } from "lucide-react";
import { format } from "date-fns";
import { BiomarkerData, HealthReportSummaryResponse } from "../../services/healthReportService";

type HealthStatus = "low" | "normal" | "high" | string;

const STATUS_CONFIG: Record<
    HealthStatus,
    { bg: string; text: string; border: string; icon: React.ReactNode; valueColor: string }
> = {
    low: {
        bg: "bg-yellow-500",
        text: "text-white",
        border: "border-yellow-200",
        icon: <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />,
        valueColor: "text-yellow-600",
    },
    normal: {
        bg: "bg-[#51754f]",
        text: "text-white",
        border: "border-green-200",
        icon: <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#51754f]" />,
        valueColor: "text-[#51754f]",
    },
    high: {
        bg: "bg-red-500",
        text: "text-white",
        border: "border-red-200",
        icon: <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />,
        valueColor: "text-red-500",
    },
};

const MetricRow: React.FC<{ metric: BiomarkerData }> = ({ metric }) => {
    // Fallback to normal if status is not found
    const cfg = STATUS_CONFIG[metric.flag?.toLowerCase()] || STATUS_CONFIG["normal"];

    return (
        <div className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-1 sm:px-2 rounded-lg">
            <div className="flex-1 min-w-0 pr-3">
                <p className="text-sm font-medium text-gray-900 capitalize">{metric.name.replace(/_/g, ' ')}</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">Normal: {metric.ref_range}</p>
                {metric.test_group && <p className="text-[9px] text-gray-300 mt-0.5 capitalize">{metric.test_group}</p>}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-right">
                    <span className={`font-semibold text-sm ${cfg.valueColor}`}>
                        {metric.value} <span className="text-[10px] sm:text-xs font-normal opacity-80">{metric.unit}</span>
                    </span>
                    <div className="text-[10px] sm:text-xs text-gray-400">Normal: {metric.ref_range}</div>
                </div>

                <div className="flex-shrink-0">{cfg.icon}</div>

                <span
                    className={`flex-shrink-0 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold ${cfg.bg} ${cfg.text} min-w-[60px] text-center shadow-sm capitalize`}
                >
                    {metric.flag}
                </span>
            </div>
        </div>
    );
};

interface Props {
    userId: string;
    userName?: string;
    healthReportSummary?: HealthReportSummaryResponse;
    healthReportUrl?: string;
}

const HealthReportSection: React.FC<Props> = ({ userId, userName, healthReportSummary, healthReportUrl }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!healthReportSummary || healthReportSummary.status === 'no_report') {
        return (
            <div className="flex flex-col">
                <div className={profileStyles.detailKey + " mb-2 flex items-center justify-between"}>
                    <span>Health Reports</span>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 mt-2">
                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-sm text-gray-500">No health report available for this user.</p>
                    </div>
                </div>
            </div>
        );
    }

    const { report_date, biomarkers } = healthReportSummary;
    const formattedDate = report_date ? format(new Date(report_date), 'MMM d, yyyy') : '';

    // Filter for preview: top 2 high, top 2 low
    const highBiomarkers = (biomarkers || []).filter(b => b.flag?.toLowerCase() === 'high').slice(0, 2);
    const lowBiomarkers = (biomarkers || []).filter(b => b.flag?.toLowerCase() === 'low').slice(0, 2);
    const previewBiomarkers = [...highBiomarkers, ...lowBiomarkers];

    return (
        <div className="flex flex-col">
            <div className={profileStyles.detailKey + " mb-2 flex items-center justify-between"}>
                <span>Health Reports</span>
                {(biomarkers && biomarkers.length > 0) && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors cursor-pointer"
                    >
                        <FileText className="w-3 h-3 mr-1" />
                        Full Report
                        <ExternalLink className="w-3 h-3 ml-1" />
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 mt-2">
                {formattedDate && (
                    <div className="mb-4">
                        <span className={profileStyles.tag}>
                            {formattedDate}
                        </span>
                    </div>
                )}

                {previewBiomarkers.length > 0 ? (
                    <div className="flex flex-col gap-1">
                        {previewBiomarkers.map((m, idx) => (
                            <MetricRow key={`preview-${m.name}-${idx}`} metric={m} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 text-sm text-gray-500">
                        No high or low biomarkers found in the summary.
                    </div>
                )}
            </div>

            {/* Full Report Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 sm:p-6 overflow-y-auto backdrop-blur-sm">
                    <div className="bg-[#fcfdfa] rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="bg-white px-5 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <h2 className="text-lg font-bold text-gray-900">Health Report</h2>
                            </div>

                            {/* User Pill */}
                            {userName && (
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                    <div className="w-6 h-6 rounded bg-[#e8ede7] text-[#51754f] flex items-center justify-center text-xs font-bold">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{userName}</span>
                                </div>
                            )}
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 font-space">
                                Comprehensive Blood Test Results
                            </h3>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 sm:p-4">
                                <div className="flex flex-col">
                                    {biomarkers?.map((m, idx) => (
                                        <MetricRow key={`full-${m.name}-${idx}`} metric={m} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthReportSection;
