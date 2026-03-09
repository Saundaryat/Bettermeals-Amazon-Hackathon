import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import freshMenusIcon from '@/assets/icon-fresh-menus.png';
import effortlessShoppingIcon from '@/assets/icon-effortless-shopping.png';
import knowYourWhyIcon from '@/assets/icon-know-your-why.png';

const FEATURES = [
    {
        icon: freshMenusIcon,
        alt: "Fresh Menus",
        title: "Fresh Menus, Every Evening",
        description: "Receive tomorrow's personalized meal plan on WhatsApp by 8 PM with recipe videos you can forward to your cook"
    },
    {
        icon: effortlessShoppingIcon,
        alt: "Effortless Shopping",
        title: "Effortless Shopping",
        description: "Get organized grocery lists per day. Order directly or share with your household"
    },
    {
        icon: knowYourWhyIcon,
        alt: "Know Your Why",
        title: "Know Your Why",
        description: "See detailed meal breakdowns and why each dish was chosen for your family's health goals"
    }
];

export default function OnboardingSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const householdId = searchParams.get('householdId');

    const handleContinue = () => {
        if (householdId) {
            navigate(`/dashboard/${householdId}?tab=planner`);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 text-center">
            <div className="max-w-md w-full space-y-6 sm:space-y-8">

                {/* Header Section */}
                <div className="space-y-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight px-2">
                        You're All Set!
                        <br />
                        Here's How <span className="text-[#51754f]">BetterMeals</span> Works
                    </h1>
                    <div className="pt-2 px-1">
                        <span className="inline-block bg-[#51754f] text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-normal leading-normal">
                            Your personalized meal journey starts tonight
                        </span>
                    </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 text-left">
                    {FEATURES.map((feature, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-3 sm:gap-4">
                            <img
                                src={feature.icon}
                                alt={feature.alt}
                                className="w-10 h-10 sm:w-12 sm:h-12 object-contain flex-shrink-0"
                                loading="lazy"
                                width={48}
                                height={48}
                            />
                            <div>
                                <h3 className="font-bold text-gray-900 text-base sm:text-lg">{feature.title}</h3>
                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mt-1">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>


                {/* Action Button */}
                <div className="pt-2 sm:pt-4">
                    <Button
                        onClick={handleContinue}
                        className="w-full bg-[#51754f] hover:bg-[#3d5a3b] text-white text-lg font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                        Got It, Let's Start!
                    </Button>
                </div>

            </div>
        </div>
    );
}
