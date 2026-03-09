import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Play, Pause } from 'lucide-react';

interface CookDetailsSectionProps {
    hasCook: string;
    cookPhoneNumber?: string;
    onHasCookChange: (value: string) => void;
    onPhoneChange: (value: string) => void;
}

export default function CookDetailsSection({
    hasCook,
    cookPhoneNumber,
    onHasCookChange,
    onPhoneChange
}: CookDetailsSectionProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleAudioToggle = () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }

            audioRef.current = new Audio('/app/audio/cook-message-example.mp3');
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch((error) => {
                console.error('Error playing audio:', error);
            });

            audioRef.current.onended = () => {
                setIsPlaying(false);
            };
        }
    };

    return (
        <>
            {/* Cook Question */}
            <div className="mt-4 max-w-md">
                <Label className="text-lg font-semibold text-gray-900 mb-2 block text-left">
                    Do you have a cook at home? *
                </Label>
                <RadioGroup
                    value={hasCook}
                    onValueChange={onHasCookChange}
                    className="flex space-x-6"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes" className="text-gray-700 text-base">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no" className="text-gray-700 text-base">No</Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Cook Phone Number - Conditional */}
            <div className="mt-4 max-w-md">
                {hasCook === 'yes' ? (
                    <div>
                        <Label htmlFor="cookPhoneNumber" className="text-lg font-semibold text-gray-900 mb-2 block text-left">
                            Cook's Phone Number *
                        </Label>

                        {/* Explanation Message */}
                        <div className="mb-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-700 leading-relaxed mb-3">
                                We need this so we can send your cook a daily voice note with exactly what to make, for how many people, and any special tips or diet notes, basically, we do the explaining so you don't have to 😄
                            </p>

                            {/* Audio Example */}
                            <div className="mt-3">
                                <p className="text-xs text-gray-600 mb-2 font-medium">Example of a daily voice note:</p>
                                <div className="relative inline-block">
                                    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3">
                                        <button
                                            onClick={handleAudioToggle}
                                            className="bg-[#51754f] hover:bg-[#3d5a3b] text-white rounded-full p-2 shadow-sm 
                               transition-all duration-200 hover:scale-105 group flex-shrink-0"
                                            aria-label={isPlaying ? "Pause audio" : "Play audio"}
                                        >
                                            {isPlaying ? (
                                                <Pause className="w-4 h-4" />
                                            ) : (
                                                <Play className="w-4 h-4 ml-0.5" />
                                            )}
                                        </button>
                                        <span className="text-sm text-gray-700">
                                            {isPlaying ? 'Playing...' : 'Click to listen'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Input
                            id="cookPhoneNumber"
                            type="tel"
                            placeholder="+91XXXXXXXXXX"
                            value={cookPhoneNumber ? `+${cookPhoneNumber.replace(/^\+/, '')}` : ''}
                            onFocus={e => {
                                if (!cookPhoneNumber) {
                                    onPhoneChange('91');
                                }
                            }}
                            onKeyDown={e => {
                                // Prevent deleting the prefix
                                const input = e.target as HTMLInputElement;
                                if ((e.key === 'Backspace' || e.key === 'Delete') && input.selectionStart !== null && input.selectionStart <= 3) {
                                    e.preventDefault();
                                }
                            }}
                            onChange={(e) => {
                                let digits = e.target.value.replace(/\D/g, '');

                                // Remove 91 prefix if present (we'll add it back)
                                if (digits.startsWith('91')) {
                                    digits = digits.slice(2);
                                }

                                // Limit to 10 digits and store with 91 prefix (no +)
                                const formattedNumber = '91' + digits.slice(0, 10);
                                onPhoneChange(formattedNumber);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                            required
                        />
                    </div>
                ) : (
                    <div className="text-xs text-gray-500 text-left">
                        {hasCook === 'no' ? 'No cook phone number needed' : 'Please select if you have a cook'}
                    </div>
                )}
            </div>
        </>
    );
}
