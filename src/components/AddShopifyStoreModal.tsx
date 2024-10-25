import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from '@/components/Modal/Modal';
import H3 from '@/components/Text/H3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface AddShopifyStoreModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddShopifyStoreModal: React.FC<AddShopifyStoreModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [source, setSource] = useState<string>('AliExpress');
    const [url, setUrl] = useState<string>('');
    const [apiKey, setApiKey] = useState<string>('');
    const [language, setLanguage] = useState<string>('English');
    const [urlError, setUrlError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<number>(0);

    const adminApiKey = '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';

    const validateUrl = (url: string) => {
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
        return urlRegex.test(url);
    };

    useEffect(() => {
        if (url) {
            if (!validateUrl(url)) {
                setUrlError('Please enter a valid Shopify URL');
            } else {
                setUrlError('');
            }
        } else {
            setUrlError('');
        }
    }, [url]);

    const handleAddStore = async () => {
        if (!validateUrl(url)) {
            setUrlError('Please enter a valid Shopify URL');
            return;
        }
        setIsLoading(true);
        setError(null); // Reset error state before starting the request
        try {
            const response = await fetch('/api/validate-shopify-store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shopDomain: url,
                    adminApiKey: apiKey,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Show success message
                setError(null);
                alert('Shopify store added successfully!');
                onClose();
            } else {
                // Show error message
                setError(data.error || 'Failed to add Shopify store. Please try again.');
            }
        } catch (error) {
            setError('Failed to add Shopify store. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const isAddStoreDisabled = !url || !!urlError || !apiKey || isLoading;

    const renderStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <div className="space-y-4">
                        <p className="text-lg font-semibold">Step 1: Connect your Shopify store.</p>
                        <div className="relative w-full h-96">
                            <Image
                                src="https://s3.us-east-2.amazonaws.com/rapid-product-launcher.ai/shopify-onboarding/step1.png"
                                alt="Shopify Onboarding Step 1"
                                layout="fill"
                                objectFit="contain"
                            />
                        </div>
                        <p className="text-sm text-gray-600">
                            Follow the instructions in the image above to connect your Shopify store.
                        </p>
                    </div>
                );
            case 1:
                return <p className="text-lg font-semibold">Step 2: Configure your settings.</p>;
            default:
                return <p className="text-lg font-semibold">Thank you for completing the onboarding!</p>;
        }
    };

    return (
        <Modal isOpen={isOpen} className="w-full max-w-4xl">
            <ModalHeader>
                <div className="flex justify-between items-center">
                    <H3>
                        {isLoading ? 'Adding Shopify Store' : 'Add Shopify Store'}
                    </H3>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </ModalHeader>
            <ModalBody>
                {isLoading ? (
                    <div className="flex flex-col items-center space-y-4">
                        <LoadingSpinner className="text-blue-500" />
                        <p className="text-sm text-gray-500">
                            Adding your Shopify store...
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {error && (
                            <p className="text-sm text-red-500">
                                {error}
                            </p>
                        )}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="shopify-url"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Store URL
                                </label>
                                <Input
                                    type="text"
                                    id="shopify-url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className={`mt-1 ${urlError ? 'border-red-500' : ''}`}
                                    placeholder="Enter Shopify store URL"
                                />
                                {urlError && (
                                    <p className="mt-1 text-sm text-red-500">{urlError}</p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="shopify-api-key"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Shopify API Key
                                </label>
                                <Input
                                    type="text"
                                    id="shopify-api-key"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="mt-1"
                                    placeholder="Enter Shopify API Key"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            {renderStepContent()}
                        </div>
                    </div>
                )}
            </ModalBody>
            <ModalFooter className="flex justify-between">
                {!isLoading && (
                    <>
                        <Button
                            onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
                            disabled={step === 0}
                            className="mr-2"
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleAddStore}
                            disabled={isAddStoreDisabled}
                            className={`bg-green-500 hover:bg-green-600 text-white ${isAddStoreDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Add Store
                        </Button>
                        <Button
                            onClick={() => setStep((prev) => prev + 1)}
                            disabled={step >= 2}
                            className="ml-2"
                        >
                            Next
                        </Button>
                    </>
                )}
            </ModalFooter>
        </Modal>
    );
};

export default AddShopifyStoreModal;
