import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { registrationSchema, registrationSchemaSimple } from '@/components/registration/types';
import type { RegistrationFormData } from '@/components/registration/types';
import { handleRegistration } from '@/services/registrationService';
import LocalStorageManager from '@/lib/localStorageManager';
import PlacesAutocomplete from '@/components/registration/PlacesAutocomplete';
import AuthLayout from '@/components/layouts/AuthLayout';

// List of cities for the dropdown
const CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Others'
] as const;

interface RegistrationFormProps {
  isSimplified?: boolean;
}

export default function RegistrationForm({ isSimplified = false }: RegistrationFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Ensure 91 prefix if number exists but is missing it (stored without +)
  const getFormattedPhone = (phone: string) => {
    if (!phone) return '';
    // Remove + sign if present
    let cleaned = phone.replace(/\+/g, '');
    // Remove all non-digits
    cleaned = cleaned.replace(/\D/g, '');
    // If it starts with 91, return as is, otherwise add 91 prefix
    if (cleaned.startsWith('91')) return cleaned;
    return `91${cleaned}`;
  };

  const defaultPhone = getFormattedPhone(location.state?.whatsappNumber);

  const {
    register,
    handleSubmit,
    watch,
    control,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(isSimplified ? registrationSchemaSimple : registrationSchema),
    mode: 'onChange',
    defaultValues: {
      whatsappNumber: defaultPhone
    }
  });

  const selectedCity = watch('city');

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);

    await handleRegistration(
      data,
      (response) => {
        // Success callback
        // Store the flow type to determine which onboarding to show
        LocalStorageManager.setItem('onboarding_flow', isSimplified ? 'cycle-syncing' : 'standard');
        navigate('/onboarding');
      },
      (error) => {
        // Error callback
        console.error('Registration error:', error);
      },
      isSimplified ? 'cycle-syncing' : 'standard'
    );

    setIsSubmitting(false);
  };

  return (
    <AuthLayout>
      {/* Top Toggle */}
      <div className="bg-gray-100 p-1 rounded-lg flex mb-4 sm:mb-6">
        <button
          className="flex-1 py-1.5 sm:py-2 text-sm font-medium text-gray-900 bg-white rounded-md shadow-sm"
        >
          Sign Up
        </button>
        <button
          onClick={() => {
            const searchParams = new URLSearchParams(location.search);
            navigate(`/login?${searchParams.toString()}`);
          }}
          className="flex-1 py-1.5 sm:py-2 text-sm font-medium text-gray-500 rounded-md hover:text-gray-900 transition-colors"
        >
          Login
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register('email')}
            className={cn("h-9 sm:h-11 bg-gray-50 border-gray-200", errors.email ? 'border-red-500' : '')}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* WhatsApp Number */}
        <div className="space-y-1.5">
          <Label htmlFor="whatsappNumber" className="text-sm font-medium">WhatsApp Number</Label>
          <Input
            id="whatsappNumber"
            type="tel"
            placeholder="+91XXXXXXXXXX"
            value={watch('whatsappNumber') ? `+${watch('whatsappNumber')}` : ''}
            className={cn("h-9 sm:h-11 bg-gray-50 border-gray-200", errors.whatsappNumber ? 'border-red-500' : '')}
            onKeyDown={e => {
              // Prevent deleting the prefix
              const input = e.target as HTMLInputElement;
              if ((e.key === 'Backspace' || e.key === 'Delete') && input.selectionStart !== null && input.selectionStart <= 3) {
                e.preventDefault();
              }
            }}
            onClick={e => {
              // Move cursor after +91 if clicked before it
              const input = e.target as HTMLInputElement;
              if (input.selectionStart !== null && input.selectionStart < 3) {
                setTimeout(() => input.setSelectionRange(3, 3), 0);
              }
            }}
            onChange={e => {
              // Extract only digits
              let digits = e.target.value.replace(/\D/g, '');

              // Remove 91 prefix if present (we'll add it back)
              if (digits.startsWith('91')) {
                digits = digits.slice(2);
              }

              // Limit to 10 digits and store with 91 prefix (no +)
              const phoneNumber = '91' + digits.slice(0, 10);
              setValue('whatsappNumber', phoneNumber);
            }}
          />
          {errors.whatsappNumber && (
            <p className="text-xs text-red-500">{errors.whatsappNumber.message}</p>
          )}
        </div>

        {/* City - Only show if not simplified */}
        {!isSimplified && (
          <div className="space-y-1.5">
            <Label htmlFor="city" className="text-sm font-medium">City</Label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  trigger('city');
                  // Clear location when city changes
                  // @ts-ignore - these fields exist on the full schema but might not be on the simple one, safe to ignore for this logic
                  setValue('location', '');
                  // @ts-ignore
                  setValue('place_id', undefined);
                }} value={field.value}>
                  <SelectTrigger
                    id="city"
                    className={cn(
                      "w-full h-9 sm:h-11 bg-gray-50 border-gray-200",
                      // @ts-ignore
                      errors.city ? 'border-red-500' : ''
                    )}
                  >
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white border border-gray-200 shadow-lg z-[9999]"
                    position="popper"
                    side="bottom"
                    sideOffset={4}
                  >
                    {CITIES.map((city) => (
                      <SelectItem
                        key={city}
                        value={city}
                        className="cursor-pointer hover:bg-[#51754e] hover:text-white focus:bg-[#51754e] focus:text-white"
                      >
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {/* @ts-ignore */}
            {errors.city && (
              // @ts-ignore
              <p className="text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>
        )}

        {/* Location - Only show if not simplified */}
        {/* {!isSimplified && (
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <PlacesAutocomplete
                value={field.value || ''}
                onChange={(value) => {
                  field.onChange(value);
                  // @ts-ignore
                  trigger('location');
                  // Clear place_id if user manually types/changes location
                  // @ts-ignore
                  setValue('place_id', undefined);
                }}
                onSelect={(place) => {
                  field.onChange(place.description);
                  // @ts-ignore
                  setValue('place_id', place.placeId);
                  // @ts-ignore
                  trigger('location');
                }}
                // @ts-ignore
                error={errors.location?.message}
                disabled={!selectedCity}
                city={selectedCity}
              />
            )}
          />
        )} */}

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              {...register('password')}
              className={cn("h-9 sm:h-11 bg-gray-50 border-gray-200 pr-10", errors.password ? 'border-red-500' : '')}
              onChange={(e) => {
                register('password').onChange(e);
                trigger(['password', 'confirmPassword']);
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              {...register('confirmPassword')}
              className={cn("h-9 sm:h-11 bg-gray-50 border-gray-200 pr-10", errors.confirmPassword ? 'border-red-500' : '')}
              onChange={(e) => {
                register('confirmPassword').onChange(e);
                trigger('confirmPassword');
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms of Service */}
        <div className="flex items-start space-x-2">
          <Controller
            name="termsAccepted"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={field.onChange}
                className={cn("mt-1", errors.termsAccepted ? 'border-red-500' : '')}
              />
            )}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="terms"
              className="text-xs text-gray-500 leading-snug font-normal"
            >
              I agree to the{' '}
              <a
                href="https://bettermeals.in/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
                style={{ color: '#51754f' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#4a6b46'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#51754f'}
              >
                Terms of Service
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Label>
            {errors.termsAccepted && (
              <p className="text-sm text-red-500">{errors.termsAccepted.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full text-white rounded-lg h-10 sm:h-11 font-medium text-sm sm:text-base flex items-center justify-center space-x-2"
          style={{ backgroundColor: '#51754f' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a6b46'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#51754f'}
          disabled={isSubmitting}
        >
          <span>{isSubmitting ? 'Creating Account...' : 'Sign Up'}</span>
        </Button>
      </form>
    </AuthLayout>
  );
}
