'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useState } from "react";

const HelpPage = () => {
    const [requestType, setRequestType] = useState<'help' | 'feature'>('help');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const user = useLoggedInUser();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            type: requestType,
            message,
            email: user.email,
            timestamp: new Date().toISOString()
        };
        console.log(payload);
        // Here you would typically send the payload to your backend
        // For now, we'll just simulate a successful submission
        toast({
            title: "Request Submitted",
            description: "We've received your request and will get back to you soon.",
        });
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Thank You!
                </h1>
                <p className="text-gray-600 mb-6">
                    Your {requestType === 'help' ? 'help request' : 'feature idea'} has been submitted successfully.
                    We'll review it and get back to you as soon as possible.
                </p>
                <Button
                    onClick={() => {
                        setIsSubmitted(false);
                        setMessage('');
                    }}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    Submit Another Request
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    How Can We Help?
                </h1>
                <p className="text-gray-600 mb-2">
                    Just like your e-commerce customers need support, we understand that you might need assistance or have ideas to make your experience better.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-4 mb-6">
                        <Button
                            type="button"
                            onClick={() => setRequestType('help')}
                            className={`flex-1 ${requestType === 'help'
                                ? 'bg-blue-500 hover:bg-blue-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            I Need Help
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setRequestType('feature')}
                            className={`flex-1 ${requestType === 'feature'
                                ? 'bg-blue-500 hover:bg-blue-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Feature Request
                        </Button>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {requestType === 'help'
                                ? 'What do you need help with?'
                                : 'Describe the feature you\'d like to see'}
                        </label>
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={requestType === 'help'
                                ? 'Please include as much detail as possible...'
                                : 'Describe your magical feature idea...'}
                            className="min-h-[200px]"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        disabled={!message.trim()}
                    >
                        {requestType === 'help' ? 'Submit Request' : 'Submit Idea'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default HelpPage;
