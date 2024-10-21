// GenerateProductModal.tsx
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalSuccessButton,
} from '@/components/Modal/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import React, { useEffect, useState } from 'react';

interface GenerateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (source: string, prompt: string, language: string) => Promise<void>;
}

const GenerateProductModal: React.FC<GenerateProductModalProps> = ({
    isOpen,
    onClose,
    onGenerate,
}) => {
    const [source, setSource] = useState<string>('AliExpress');
    const [url, setUrl] = useState<string>('');
    const [language, setLanguage] = useState<string>('English');
    const [urlError, setUrlError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateAliExpressUrl = (url: string) => {
        const aliExpressRegex =
            /^https?:\/\/([\w-]+\.)?aliexpress\.(com|us)(\/.*)?$/i;
        return aliExpressRegex.test(url);
    };

    useEffect(() => {
        if (url) {
            if (!validateAliExpressUrl(url)) {
                setUrlError('Please enter a valid AliExpress URL');
            } else {
                setUrlError('');
            }
        } else {
            setUrlError('');
        }
    }, [url]);

    const handleGenerate = async () => {
        if (!validateAliExpressUrl(url)) {
            setUrlError('Please enter a valid AliExpress URL');
            return;
        }
        setIsLoading(true);
        try {
            await onGenerate(source, url, language);
        } catch (error) {
            console.error('Error generating product:', error);
        } finally {
            setIsLoading(false);
            onClose();
        }
    };

    const isGenerateDisabled = !url || !!urlError || isLoading;

    return (
        <Modal isOpen={isOpen} className="w-full max-w-md">
            <ModalHeader>
                <h3 className="text-lg font-medium leading-6 text-gray-500">
                    Select Source
                </h3>
            </ModalHeader>
            <ModalBody>
                <div className="space-y-4">
                    <div className="flex justify-between space-x-4">
                        <Button variant="default" className="w-full">
                            AliExpress
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full opacity-50 cursor-not-allowed"
                            disabled
                        >
                            Shopify (Coming Soon)
                        </Button>
                    </div>
                    <div>
                        <label
                            htmlFor="prompt"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Product URL
                        </label>
                        <Input
                            type="text"
                            id="prompt"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className={`mt-1 ${urlError ? 'border-red-500' : ''}`}
                            placeholder="Enter AliExpress product URL here"
                        />
                        {urlError && (
                            <p className="mt-1 text-sm text-red-500">{urlError}</p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="language"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Language
                        </label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Spanish">Spanish</SelectItem>
                                <SelectItem value="French">French</SelectItem>
                                <SelectItem value="German">German</SelectItem>
                                <SelectItem value="Italian">Italian</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter className="flex justify-center">
                {isLoading ? (
                    <p className="text-sm text-gray-500">Loading... Please wait.</p>
                ) : (
                    <ModalSuccessButton
                        onClick={handleGenerate}
                        disabled={isGenerateDisabled}
                        className={`${isGenerateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Generate
                    </ModalSuccessButton>
                )}
            </ModalFooter>
        </Modal>
    );
};

export default GenerateProductModal;
