import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/httpClient';
import { MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlacePrediction {
  placeId: string;
  description: string;
  structuredFormatting?: {
    mainText: string;
    mainTextMatchedSubstrings?: any;
    secondaryText: string;
  };
  city?: string | null;
  category?: string;
}

interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (place: PlacePrediction) => void;
  error?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  city?: string;
}

export default function PlacesAutocomplete({
  value,
  onChange,
  onSelect,
  error,
  placeholder = "Search for your locality",
  label = "Location",
  disabled = false,
  city,
}: PlacesAutocompleteProps) {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch predictions from API
  const fetchPredictions = async (hint: string) => {
    if (disabled || !hint || hint.trim().length < 2) {
      setPredictions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    const endpoint = city
      ? `/places/autocomplete?city=${encodeURIComponent(city)}&hint=${encodeURIComponent(hint)}`
      : `/places/autocomplete?hint=${encodeURIComponent(hint)}`;
    console.log('Calling Places API:', endpoint);

    try {
      const response = await api.get<PlacePrediction[]>(
        endpoint,
        {
          requireAuth: false,
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (response.success && response.data) {
        // Handle both array response and wrapped response
        const predictionsData = Array.isArray(response.data)
          ? response.data
          : (response.data as any).predictions || (response.data as any).results || [];

        console.log('Places API Response:', { response, predictionsData });

        if (predictionsData.length > 0) {
          setPredictions(predictionsData);
          setShowSuggestions(true);
          setSelectedIndex(-1);
        } else {
          setPredictions([]);
          setShowSuggestions(false);
        }
      } else {
        console.log('Places API Error Response:', response);
        setPredictions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching place predictions:', error);
      setPredictions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      fetchPredictions(newValue);
    }, 300);
  };

  const handleSelect = (place: PlacePrediction) => {
    onChange(place.description);
    onSelect(place);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || predictions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < predictions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < predictions.length) {
          handleSelect(predictions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="space-y-2 relative" ref={wrapperRef}>
      <Label htmlFor="location" className="font-medium">{label}</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="location"
          type="text"
          placeholder={disabled ? "Please select a city first" : placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (!disabled && predictions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={cn(
            error ? 'border-red-500 pr-10' : 'pr-10',
            disabled && 'bg-gray-100 cursor-not-allowed opacity-60'
          )}
          autoComplete="off"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <MapPin className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && predictions.length > 0 && (
        <div
          className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          style={{ top: '100%' }}
        >
          {predictions.map((prediction, index) => {
            // Extract main text and secondary text
            let mainText = '';
            let secondaryText = '';

            if (prediction.structuredFormatting) {
              mainText = prediction.structuredFormatting.mainText || '';
              secondaryText = prediction.structuredFormatting.secondaryText || '';
            } else {
              // Fallback: split by comma
              const parts = prediction.description.split(',');
              mainText = parts[0]?.trim() || prediction.description;
              secondaryText = parts.slice(1).join(',').trim();
            }

            return (
              <button
                key={prediction.placeId || index}
                type="button"
                onClick={() => handleSelect(prediction)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${index === selectedIndex ? 'bg-gray-50' : ''
                  } ${index !== predictions.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">{mainText}</div>
                    {secondaryText && (
                      <div className="text-sm text-gray-500 truncate">{secondaryText}</div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
          <div className="px-4 py-2 text-xs text-gray-400 text-right border-t border-gray-100 bg-gray-50">
            powered by{' '}
            <span className="text-blue-600 font-medium">Google</span>
          </div>
        </div>
      )}
    </div>
  );
}
