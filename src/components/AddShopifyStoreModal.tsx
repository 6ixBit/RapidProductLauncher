'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/components/Modal/Modal';
import H3 from '@/components/Text/H3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getDefaultOrganization } from '@/data/user/organizations';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// const adminApiKey = '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';

interface AddShopifyStoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;  // Add this line
}

function AddShopifyStoreModal({ isOpen, onClose, onSuccess }: AddShopifyStoreModalProps) {
    const [url, setUrl] = useState<string>('');
    const [apiKey, setApiKey] = useState<string>('');
    const [urlError, setUrlError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<number>(0);
    const user = useLoggedInUser();
    const [defaultOrganizationId, setDefaultOrganizationId] = useState<string | null>(null);
    const totalSteps = 5;

    useEffect(() => {
        const fetchDefaultOrganization = async () => {
            const organizationId = await getDefaultOrganization();
            setDefaultOrganizationId(organizationId);
        };

        fetchDefaultOrganization();
    }, []); // Empty dependency array to run once on mount

    const validateUrl = (url: string) => {
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
        return urlRegex.test(url);
    };

    useEffect(() => {
        if (url) {
            setUrlError(validateUrl(url) ? '' : 'Please enter a valid Shopify URL');
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
        setError(null);
        try {
            const response = await fetch('/api/validate-shopify-store', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shopDomain: url, adminApiKey: apiKey }),
            });

            const data = await response.json();

            if (response.ok) {
                const { error: supabaseError } = await supabaseUserClientComponentClient
                    .from('shopify_integrations')
                    .insert([
                        {
                            user_id: user.id,
                            organization_id: defaultOrganizationId as string,
                            shopify_store_url: url,
                            is_connected: true,
                            connected_at: new Date().toISOString(),
                            admin_api_key: apiKey,
                        },
                    ]);

                if (supabaseError) {
                    setError('Failed to save Shopify store to the database.');
                    console.error(supabaseError);
                } else {
                    setError(null);
                    onSuccess();  // Add this line
                    onClose();
                }
            } else {
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
                    <div className="space-y-2">
                        <p className="text-lg font-semibold">Step 1: Connect your Shopify store.</p>
                        <p className="text-sm text-gray-600">
                            Follow the instructions in the image above to connect your Shopify store.
                        </p>
                        <div className="relative w-full h-96">
                            <Image
                                src="https://s3.us-east-2.amazonaws.com/rapid-product-launcher.ai/shopify-onboarding/step1.png"
                                alt="Shopify Onboarding Step 1"
                                layout="fill"
                                objectFit="contain"
                                className="py-4 rounded-md"
                            />
                        </div>
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
                        <div className="flex items-center">
                            <span className="mr-2 text-sm text-gray-500">{step + 1}/{totalSteps}</span>
                            <Button
                                onClick={() => setStep((prev) => Math.min(prev + 1, totalSteps - 1))}
                                disabled={step >= totalSteps - 1}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                )}
            </ModalFooter>
        </Modal>
    );
}

export default AddShopifyStoreModal;
