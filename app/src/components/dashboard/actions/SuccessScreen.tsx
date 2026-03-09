import React, { useState } from 'react';
import { CheckCircle, ArrowRight, MessageCircle, Calendar, Phone } from 'lucide-react';

interface SuccessScreenProps {
    onComplete: () => void;
    dateRangeStr?: string; // e.g., "Week of Feb 10-16"
}

export default function SuccessScreen({ onComplete, dateRangeStr }: SuccessScreenProps) {
    const [cookNumber, setCookNumber] = useState('');

    const handleCookNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Allow only numbers and typical phone characters
        const value = e.target.value.replace(/[^\d\+\-\(\)\s]/g, '');
        setCookNumber(value);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-36">
            <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-100 flex flex-col items-center text-center">

                {/* Header Section */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="w-20 h-20 bg-[#dcfcdc] rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <CheckCircle className="w-10 h-10 text-[#51754f]" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">You are all set!</h2>
                    <p className="text-gray-500 text-sm sm:text-base">
                        Your weekly plan is confirmed ({dateRangeStr ? `${dateRangeStr}` : ''}).
                    </p>
                </div>

                {/* WhatsApp Info Section */}
                <div className="w-full max-w-2xl bg-gray-50 rounded-2xl p-6 sm:p-8 mb-8 text-left">
                    <div className="flex items-center gap-3 mb-6">
                        <MessageCircle className="w-6 h-6 text-[#51754f]" />
                        <h3 className="text-lg font-semibold text-gray-900">WhatsApp Updates</h3>
                    </div>

                    <p className="text-gray-600 mb-6 text-sm">
                        You will receive the following automated messages:
                    </p>

                    <div className="space-y-6">
                        {/* Daily Messages */}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#51754f]"></span>
                                Daily Meal Reminders
                            </h4>
                            <div className="ml-4 space-y-3">
                                <div className="flex justify-between items-start text-sm">
                                    <span className="text-gray-500 w-24 flex-shrink-0">Before 7:00 AM</span>
                                    <span className="text-gray-900 font-medium">Lunch & Breakfast menu</span>
                                </div>
                                <div className="flex justify-between items-start text-sm">
                                    <span className="text-gray-500 w-24 flex-shrink-0">Before 5:00 PM</span>
                                    <span className="text-gray-900 font-medium">Dinner menu</span>
                                </div>
                            </div>
                        </div>

                        {/* Other Reminders Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#51754f]"></span>
                                    Grocery Order Schedule
                                </h4>
                                <div className="space-y-2 mt-2">
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-900 block">Saturday</span>
                                        <span className="text-gray-600 pl-2 border-l-2 border-[#51754f]/20 block">Order for Mon - Wed</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-900 block">Tuesday</span>
                                        <span className="text-gray-600 pl-2 border-l-2 border-[#51754f]/20 block">Order for Thu - Sat</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#51754f]"></span>
                                    Monthly
                                </h4>
                                <p className="text-sm text-gray-600">Cycle syncing reminder</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cook Number Section */}
                <div className="w-full max-w-2xl bg-[#51754f]/5 border border-[#51754f]/10 rounded-2xl p-6 sm:p-8 mb-8 text-left">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Phone className="w-6 h-6 text-[#51754f]" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Enable Cook Voice Notes</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                We can send audio instructions directly to your cook. Optional.
                            </p>

                            <div className="relative">
                                <input
                                    type="tel"
                                    value={cookNumber}
                                    onChange={handleCookNumberChange}
                                    placeholder="Enter cook's mobile number"
                                    className="w-full sm:w-2/3 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#51754f] focus:ring-2 focus:ring-[#51754f]/20 outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Action Button */}
            <div className="fixed bottom-[72px] lg:bottom-0 left-0 right-0 lg:left-64 pointer-events-none p-4 sm:p-6 flex justify-center z-40">
                <button
                    onClick={onComplete}
                    className="pointer-events-auto w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#51754f] text-white px-8 sm:px-16 py-3 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-bold shadow-lg shadow-[#51754f]/20 hover:scale-[1.02] transition-all transform active:scale-95"
                >
                    <span className="text-sm uppercase tracking-wider">Done</span>
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div >
    );
}
