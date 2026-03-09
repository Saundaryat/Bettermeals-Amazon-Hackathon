import React, { useState } from 'react';
import { OnboardingMember as Member } from '@/services/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X, Upload, Loader2 } from 'lucide-react';
import { COMMON_CLASSES } from './styles';
import MealScheduleSelector from './MealScheduleSelector';
import AllergyAutocomplete from './AllergyAutocomplete';

interface MemberCardProps {
    member: Member;
    index: number;
    onUpdate: (updates: Partial<Member>) => void;
    onRemove: () => void;
    canRemove: boolean;
}

const commonAllergies = ['Tree Nuts', 'Fish', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Peanuts', 'None'];
const commonHealthGoals = ['Weight Loss', 'Muscle Gain', 'Improved Digestion', 'Better Sleep', 'Immunity Boosting', 'General Wellness'];

export default function MemberCard({
    member,
    index,
    onUpdate,
    onRemove,
    canRemove
}: MemberCardProps) {
    const [uploadingFile, setUploadingFile] = useState(false);

    const toggleArrayItem = (field: 'allergies' | 'healthGoals', item: string) => {
        const currentArray = member[field] as string[];
        let newArray: string[];

        if (field === 'allergies') {
            if (item === 'None') {
                newArray = currentArray.includes('None') ? [] : ['None'];
            } else {
                const arrayWithoutNone = currentArray.filter(i => i !== 'None');
                newArray = arrayWithoutNone.includes(item)
                    ? arrayWithoutNone.filter(i => i !== item)
                    : [...arrayWithoutNone, item];
            }
        } else {
            newArray = currentArray.includes(item)
                ? currentArray.filter(i => i !== item)
                : [...currentArray, item];
        }

        onUpdate({ [field]: newArray });
    };

    const handleAddCustomAllergy = (allergy: string) => {
        const customAllergy = allergy.trim();
        if (!customAllergy) return;

        const allergyExists = member.allergies.some(a =>
            a.toLowerCase() === customAllergy.toLowerCase()
        );

        if (!allergyExists) {
            const newAllergies = [...member.allergies, customAllergy];
            onUpdate({ allergies: newAllergies });
        }
    };

    const removeCustomAllergy = (allergyToRemove: string) => {
        const newAllergies = member.allergies.filter(allergy => allergy !== allergyToRemove);
        onUpdate({ allergies: newAllergies });
    };

    const handleFileUpload = async (file: File) => {
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        const allowedTypes = ['application/pdf', 'application/msword', 'text/plain', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please upload a PDF, DOC, TXT, JPG, or PNG file');
            return;
        }

        setUploadingFile(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            onUpdate({ healthReport: file, fileName: file.name });
        } catch (error) {
            console.error('File upload error:', error);
            alert('Failed to upload file. Please try again.');
        } finally {
            setUploadingFile(false);
        }
    };

    return (
        <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className={COMMON_CLASSES.memberTitle}>
                    Member {index + 1}
                </h3>
                {canRemove && (
                    <Button
                        onClick={onRemove}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {/* Name and Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <Label htmlFor={`name-${member.id}`} className={COMMON_CLASSES.labelSmall}>
                        Name *
                    </Label>
                    <Input
                        id={`name-${member.id}`}
                        type="text"
                        placeholder="Enter name"
                        value={member.name}
                        onChange={(e) => onUpdate({ name: e.target.value })}
                        className="w-full"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor={`age-${member.id}`} className={COMMON_CLASSES.labelSmall}>
                        Age *
                    </Label>
                    <Input
                        id={`age-${member.id}`}
                        type="number"
                        min="1"
                        max="120"
                        placeholder="Enter age"
                        value={member.age}
                        onFocus={(e) => {
                            if (member.age === 0) {
                                onUpdate({ age: '' });
                            }
                        }}
                        onBlur={(e) => {
                            if (member.age === '') {
                                onUpdate({ age: 0 });
                            }
                        }}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                                onUpdate({ age: '' });
                                return;
                            }
                            const numVal = parseInt(val);
                            if (!isNaN(numVal)) {
                                onUpdate({ age: numVal });
                            }
                        }}
                        className="w-full"
                        required
                    />
                </div>
            </div>

            {/* Email and WhatsApp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <Label htmlFor={`email-${member.id}`} className={COMMON_CLASSES.labelSmall}>
                        Email
                    </Label>
                    <Input
                        id={`email-${member.id}`}
                        type="email"
                        placeholder="Enter email address"
                        value={member.email || ''}
                        onChange={(e) => onUpdate({ email: e.target.value })}
                        className="w-full"
                    />
                </div>
                <div>
                    <Label htmlFor={`whatsapp-${member.id}`} className={COMMON_CLASSES.labelSmall}>
                        WhatsApp Number
                    </Label>
                    <Input
                        id={`whatsapp-${member.id}`}
                        type="tel"
                        placeholder="+91XXXXXXXXXX"
                        value={member.whatsappNumber || ''}
                        onFocus={(e) => {
                            if (!member.whatsappNumber || !member.whatsappNumber.startsWith('+91')) {
                                onUpdate({ whatsappNumber: '+91' });
                            }
                            const target = e.target;
                            setTimeout(() => {
                                target.setSelectionRange(target.value.length, target.value.length);
                            }, 0);
                        }}
                        onChange={(e) => {
                            let digits = e.target.value.replace(/\D/g, '');
                            if (digits.startsWith('91')) digits = digits.slice(2);
                            const formattedNumber = '+91' + digits.slice(0, 10);
                            onUpdate({ whatsappNumber: formattedNumber });
                        }}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Sex */}
            <div className="mb-6">
                <Label className={COMMON_CLASSES.labelSmall}>
                    Sex *
                </Label>
                <RadioGroup
                    value={member.sex}
                    onValueChange={(value) => onUpdate({ sex: value })}
                    className="flex space-x-6"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id={`sex-male-${member.id}`} />
                        <Label htmlFor={`sex-male-${member.id}`} className="text-sm text-gray-700">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id={`sex-female-${member.id}`} />
                        <Label htmlFor={`sex-female-${member.id}`} className="text-sm text-gray-700">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="non-binary" id={`sex-non-binary-${member.id}`} />
                        <Label htmlFor={`sex-non-binary-${member.id}`} className="text-sm text-gray-700">Non-binary</Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Height and Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <Label htmlFor={`height-${member.id}`} className={COMMON_CLASSES.labelSmall}>
                        Height (cm) *
                    </Label>
                    <Input
                        id={`height-${member.id}`}
                        type="number"
                        min="50"
                        max="250"
                        placeholder="Enter height in cm"
                        value={member.height}
                        onFocus={(e) => {
                            if (member.height === 0) {
                                onUpdate({ height: '' });
                            }
                        }}
                        onBlur={(e) => {
                            if (member.height === '') {
                                onUpdate({ height: 0 });
                            }
                        }}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                                onUpdate({ height: '' });
                                return;
                            }
                            const numVal = parseInt(val);
                            if (!isNaN(numVal)) {
                                onUpdate({ height: numVal });
                            }
                        }}
                        className="w-full"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor={`weight-${member.id}`} className={COMMON_CLASSES.labelSmall}>
                        Weight (kg) *
                    </Label>
                    <Input
                        id={`weight-${member.id}`}
                        type="number"
                        min="10"
                        max="300"
                        placeholder="Enter weight in kg"
                        value={member.weight}
                        onFocus={(e) => {
                            if (member.weight === 0) {
                                onUpdate({ weight: '' });
                            }
                        }}
                        onBlur={(e) => {
                            if (member.weight === '') {
                                onUpdate({ weight: 0 });
                            }
                        }}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                                onUpdate({ weight: '' });
                                return;
                            }
                            const numVal = parseInt(val);
                            if (!isNaN(numVal)) {
                                onUpdate({ weight: numVal });
                            }
                        }}
                        className="w-full"
                        required
                    />
                </div>
            </div>

            {/* Allergies */}
            <div className="mb-6">
                <Label className={COMMON_CLASSES.labelSmall}>
                    Allergies & Dietary Restrictions *
                </Label>

                {/* Common Allergies */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                    {commonAllergies.map((allergy) => (
                        <div key={allergy} className="flex items-center space-x-2">
                            <Checkbox
                                id={`allergy-${member.id}-${allergy}`}
                                checked={member.allergies.includes(allergy)}
                                onCheckedChange={() => toggleArrayItem('allergies', allergy)}
                            />
                            <Label htmlFor={`allergy-${member.id}-${allergy}`} className="text-sm text-gray-700">
                                {allergy}
                            </Label>
                        </div>
                    ))}
                </div>

                {/* Custom Allergies */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                        Other allergies (specify):
                    </Label>

                    <AllergyAutocomplete onAdd={handleAddCustomAllergy} />

                    {member.allergies.filter(allergy => !commonAllergies.includes(allergy)).length > 0 && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Added allergies:
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {member.allergies
                                    .filter(allergy => !commonAllergies.includes(allergy))
                                    .map((allergy) => (
                                        <div
                                            key={allergy}
                                            className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            <span>{allergy}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeCustomAllergy(allergy)}
                                                className="text-green-600 hover:text-green-800 font-bold"
                                                aria-label={`Remove ${allergy} allergy`}
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Health Goals */}
            <div className="mb-6">
                <Label className={COMMON_CLASSES.labelSmall}>
                    Health Goals *
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonHealthGoals.map((goal) => (
                        <div key={goal} className="flex items-center space-x-2">
                            <Checkbox
                                id={`goal-${member.id}-${goal}`}
                                checked={member.healthGoals.includes(goal)}
                                onCheckedChange={() => toggleArrayItem('healthGoals', goal)}
                            />
                            <Label htmlFor={`goal-${member.id}-${goal}`} className="text-sm text-gray-700">
                                {goal}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Meal Schedule */}
            <MealScheduleSelector
                memberId={member.id}
                schedule={member.mealSchedule}
                onChange={(newSchedule) => onUpdate({ mealSchedule: newSchedule })}
            />

            {/* File Upload Section */}
            <div className="mb-6">
                <Label className={COMMON_CLASSES.labelSmall}>
                    Health Report (Optional)
                </Label>
                <label
                    htmlFor={`file-upload-${member.id}`}
                    className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors relative cursor-pointer block"
                >
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="bg-gray-50 rounded-full p-3">
                            {uploadingFile ? (
                                <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                            ) : (
                                <Upload className="w-6 h-6 text-gray-500" />
                            )}
                        </div>
                        <div className="text-center">
                            {uploadingFile ? (
                                <p className="text-sm text-gray-600">Uploading health report...</p>
                            ) : member.fileName ? (
                                <div>
                                    <p className="text-sm text-green-600 font-medium">✓ {member.fileName}</p>
                                    <p className="text-xs text-gray-500 mt-1">File uploaded successfully</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">
                                    Drop your file here or browse
                                </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Supports: PDF, DOC, TXT, JPG, PNG (max 10MB)</p>
                        </div>
                    </div>
                </label>
                <input
                    id={`file-upload-${member.id}`}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.txt,.jpg,.jpeg,.png"
                    disabled={uploadingFile}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            handleFileUpload(file);
                        }
                    }}
                />
            </div>
        </div>
    );
}
