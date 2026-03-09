import React from 'react';
import { Clock, Leaf, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CycleScienceInfoProps {
    // onNext is no longer needed here as it's handled by the layout footer
}

const CycleScienceInfo: React.FC<CycleScienceInfoProps> = () => {
    return (
        <div className="flex flex-col items-center justify-center p-3 md:p-6 max-w-xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-10 w-full flex flex-col justify-center min-h-0">
                <div className="text-left mb-4 md:mb-8 flex-shrink-0">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2 leading-tight">
                        Section 1 : Your cycle tells a story<br />about your body.
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg mt-1">
                        We use it to plan meals that support you.
                    </p>
                </div>

                <div className="bg-[#F9F8F6] rounded-xl p-4 md:p-8 space-y-4 md:space-y-6 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 bg-[#E3ECE4] w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 md:w-6 md:h-6 text-[#51754f]" />
                        </div>
                        <h3 className="text-gray-700 font-normal text-base md:text-lg leading-snug">
                            Time meals to your natural hormonal changes
                        </h3>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 bg-[#EFEBE4] w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center">
                            <Leaf className="w-5 h-5 md:w-6 md:h-6 text-[#7DA27E]" />
                        </div>
                        <h3 className="text-gray-700 font-normal text-base md:text-lg leading-snug">
                            Prioritise nutrients when your body needs them most
                        </h3>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 bg-[#E3ECE4] w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center">
                            <Smile className="w-5 h-5 md:w-6 md:h-6 text-[#51754f]" />
                        </div>
                        <h3 className="text-gray-700 font-normal text-base md:text-lg leading-snug">
                            Reduce symptoms like cramps, low energy & mood swings
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CycleScienceInfo;
