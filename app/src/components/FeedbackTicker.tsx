import React, { useState } from 'react';
import { MessageCircle, Camera, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { submitFeedback } from '@/services/feedback.service';

export default function FeedbackTicker() {
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const { user } = useAuth();
    const householdId = user?.household_id;

    const handleSubmit = async () => {
        if (!feedback.trim()) {
            toast.error("Please enter some feedback first.");
            return;
        }

        if (!householdId) {
            toast.error("You need to be logged in to share feedback.");
            return;
        }

        setIsSubmitting(true);

        try {
            await submitFeedback({
                feedback,
                household_id: householdId,
                image: selectedFile
            });

            setIsOpen(false);
            setFeedback('');
            setSelectedFile(null);
            toast.success("Thanks for your feedback! We've received it.");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className={`fixed bottom-24 right-6 md:bottom-8 h-14 w-14 rounded-full shadow-2xl bg-[#51754f] hover:bg-[#3d5a3b] text-white p-0 z-[100] flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-white/20 ${isOpen ? 'hidden' : 'flex'}`}
                    aria-label="Share feedback"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="fixed left-[50%] top-[50%] z-[101] grid w-[85vw] max-w-[380px] translate-x-[-50%] translate-y-[-50%] gap-3 border bg-background p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-2xl border-0 overflow-hidden">
                <div className="p-5 pb-1">
                    <DialogHeader className="space-y-2 text-center items-center justify-center pt-2">
                        <DialogTitle className="text-xl font-bold tracking-tight text-gray-900">Share your feedback</DialogTitle>
                        <DialogDescription className="text-xs text-gray-500">
                            Help us make BetterMeals better for you
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-5 pt-0 space-y-3">
                    <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="What's working well? What could be better?"
                        className="min-h-[80px] resize-none bg-gray-50 border-gray-100 focus-visible:ring-[#51754f] text-xs placeholder:text-gray-500"
                    />

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">
                            Add screenshot (optional)
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="feedback-screenshot"
                            />
                            <label
                                htmlFor="feedback-screenshot"
                                className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                {selectedFile ? (
                                    <div className="flex items-center gap-2 text-[#51754f]">
                                        <Camera className="w-5 h-5" />
                                        <span className="text-xs font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-1.5 text-gray-400">
                                        <Camera className="w-6 h-6" />
                                        <span className="text-xs">Tap to attach</span>
                                    </div>
                                )}
                            </label>
                            {selectedFile && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedFile(null);
                                    }}
                                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-100"
                                >
                                    <X className="w-3 h-3 text-gray-500" />
                                </button>
                            )}
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full h-10 text-sm font-semibold bg-[#51754f] hover:bg-[#3d5a3b] rounded-lg mt-1"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Send feedback"
                        )}
                    </Button>

                    <p className="text-center text-[10px] text-gray-400 mt-2">
                        We read every message • Usually reply in 24hrs
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
