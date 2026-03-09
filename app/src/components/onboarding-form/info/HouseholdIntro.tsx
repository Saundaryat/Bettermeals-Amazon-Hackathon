import React from 'react';
import { Heart, Smile, Apple, Activity, Home, ShieldCheck } from 'lucide-react';

const HouseholdIntro: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
            <div className="w-full bg-white/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Heart className="w-8 h-8 text-[#7DA27E] fill-[#7DA27E]" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
                        Section 2 : Because you don't eat alone.
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        We know you may be sharing meals with family or people at home.
                        A meal plan only works when everyone's needs are considered.
                    </p>
                </div>

                {/* Content Card */}
                <div className="bg-[#F8F6F1] rounded-2xl p-6 md:p-8 space-y-8">
                    {/* First Section */}
                    <div>
                        <h3 className="font-semibold text-gray-800 text-lg mb-4">
                            By understanding each member's:
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#DDE7DE] p-2 rounded-full flex-shrink-0">
                                    <Smile className="w-5 h-5 text-[#5E7E62]" />
                                </div>
                                <span className="text-gray-600">likes & dislikes</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-[#EFEBE4] p-2 rounded-full flex-shrink-0">
                                    <Apple className="w-5 h-5 text-[#8C8C8C]" />
                                </div>
                                <span className="text-gray-600">allergies or restrictions</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-[#DDE7DE] p-2 rounded-full flex-shrink-0">
                                    <Activity className="w-5 h-5 text-[#5E7E62]" />
                                </div>
                                <span className="text-gray-600">health goals</span>
                            </div>
                        </div>
                    </div>

                    {/* Second Section */}
                    <div>
                        <h3 className="font-semibold text-gray-800 text-lg mb-4">
                            we make sure the plan:
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-[#DDE7DE] p-2 rounded-full flex-shrink-0 mt-0.5">
                                    <Home className="w-5 h-5 text-[#5E7E62]" />
                                </div>
                                <span className="text-gray-600">works for the entire household</span>
                            </div>
                            <div className="flex items-start gap-3 ml-12">
                                <span className="text-gray-500 text-sm">
                                    doesn't create extra stress or adjustments for you
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-[#DDE7DE] p-2 rounded-full flex-shrink-0 mt-0.5">
                                    <ShieldCheck className="w-5 h-5 text-[#5E7E62]" />
                                </div>
                                <span className="text-gray-600">
                                    lets you follow it with <span className="font-semibold text-gray-800">peace of mind</span>, knowing everyone is taken care of
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HouseholdIntro;
