import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchIngredients, IngredientAlias } from '@/services/ingredients.service';
import { Loader2 } from 'lucide-react';

interface AllergyAutocompleteProps {
    onAdd: (allergy: string) => void;
    placeholder?: string;
}

export default function AllergyAutocomplete({ onAdd, placeholder = "Enter custom allergy (e.g., Strawberries, Sesame)" }: AllergyAutocompleteProps) {
    const [input, setInput] = useState('');
    const [results, setResults] = useState<IngredientAlias[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchIngredients = async (query: string) => {
            if (!query.trim()) {
                setResults([]);
                setIsOpen(false);
                return;
            }
            setIsLoading(true);
            try {
                const response = await searchIngredients(query);
                if (response.success && response.data) {
                    setResults(response.data);
                    setIsOpen(true);
                } else {
                    setResults([]);
                    setIsOpen(true);
                }
            } catch (error) {
                console.error("Failed to search ingredients", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchIngredients(input);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [input]);

    const handleAdd = (value: string) => {
        if (!value.trim()) return;
        onAdd(value.trim());
        setInput('');
        setIsOpen(false);
        setResults([]);
    };

    return (
        <div className="flex gap-2 relative" ref={wrapperRef}>
            <div className="relative flex-1">
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAdd(input);
                        }
                    }}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                    className="w-full"
                />

                {isOpen && input.trim() && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                            </div>
                        ) : results.length > 0 ? (
                            <ul className="py-1">
                                {results.map((item) => (
                                    <li
                                        key={item._id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                        onClick={() => handleAdd(item.name)}
                                    >
                                        <div className="font-medium text-gray-900">{item.name}</div>
                                        {item.aliases && item.aliases.length > 0 && (
                                            <div className="text-xs text-gray-500 truncate mt-0.5">
                                                Also known as: {item.aliases.join(', ')}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                No exact matches found. Press Add to use "{input}" anyway.
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Button
                type="button"
                onClick={() => handleAdd(input)}
                disabled={!input.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Add
            </Button>
        </div>
    );
}
