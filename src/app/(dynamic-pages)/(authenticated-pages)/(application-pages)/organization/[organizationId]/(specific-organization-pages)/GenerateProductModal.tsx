// GenerateProductModal.tsx
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalSuccessButton } from '@/components/Modal/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';

interface GenerateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (source: string, prompt: string, language: string) => void;
}

const GenerateProductModal: React.FC<GenerateProductModalProps> = ({ isOpen, onClose, onGenerate }) => {
    const [source, setSource] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');
    const [language, setLanguage] = useState<string>('English');

    const handleGenerate = () => {
        onGenerate(source, prompt, language);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} className="w-full max-w-md">
            <ModalHeader>
                <h3 className="text-lg font-medium leading-6 text-gray-400">Select Source</h3>
            </ModalHeader>
            <ModalBody>
                <div className="space-y-4">
                    <div className="flex justify-between space-x-4">
                        <Button
                            onClick={() => setSource('AliExpress')}
                            variant={source === 'AliExpress' ? 'default' : 'outline'}
                            className="w-full"
                        >
                            AliExpress
                        </Button>
                        <Button
                            onClick={() => setSource('Shopify')}
                            variant={source === 'Shopify' ? 'default' : 'outline'}
                            className="w-full"
                        >
                            Shopify
                        </Button>
                    </div>
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-400">
                            Product URL
                        </label>
                        <Input
                            type="text"
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="mt-1"
                            placeholder="Enter your prompt here"
                        />
                    </div>
                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                            Language
                        </label>

                    </div>
                </div>
            </ModalBody>
            <ModalFooter className="flex justify-center">
                <ModalSuccessButton onClick={handleGenerate} disabled={!source || !prompt}>
                    Generate
                </ModalSuccessButton>
            </ModalFooter>
        </Modal>
    );
};

export default GenerateProductModal;