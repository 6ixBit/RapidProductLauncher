import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalSuccessButton,
} from '@/components/Modal/Modal';
import H3 from '@/components/Text/H3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { faAmazon, faEtsy } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
interface GenerateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (
    source: string,
    prompt: string,
    language: string,
    signal?: AbortSignal,
  ) => Promise<void>;
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
  const [error, setError] = useState<string | null>(null);

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
    setError(null);

    // Add AbortController
    const abortController = new AbortController();

    try {
      await onGenerate(source, url, language, abortController.signal);
      if (!abortController.signal.aborted) {
        onClose();
      }
    } catch (error) {
      if (!abortController.signal.aborted) {
        setError('Failed to generate product. Please try again.');
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
    }

    return () => abortController.abort();
  };

  const isGenerateDisabled = !url || !!urlError || isLoading;

  return (
    <Modal isOpen={isOpen} className="w-full max-w-md">
      <ModalHeader>
        <div className="flex justify-between items-center">
          <H3>{isLoading ? 'Generating Product Page' : 'Select Source'}</H3>
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
            <p className="text-sm text-gray-500">Est time: 1 minute.</p>
            <p className="text-sm text-gray-400 italic">
              "Psst...Your competitor is still manually creating their product
              page right now..."
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className={`w-full ${source === 'AliExpress' ? 'bg-blue-100 border-blue-500 text-blue-400' : ''}`}
                onClick={() => setSource('AliExpress')}
              >
                <Image
                  src="/logos/aliexpress.svg"
                  alt="AliExpress"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                AliExpress
              </Button>
              <Button
                variant="outline"
                className="w-full opacity-50 cursor-not-allowed"
                disabled
              >
                <Image
                  src="/logos/temu.svg"
                  alt="Temu"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Temu
              </Button>
              <Button
                variant="outline"
                className="w-full opacity-50 cursor-not-allowed"
                disabled
              >
                <FontAwesomeIcon icon={faEtsy} className="mr-2" />
                <span>Etsy</span>
              </Button>
              <Button
                variant="outline"
                className="w-full opacity-50 cursor-not-allowed"
                disabled
              >
                <FontAwesomeIcon icon={faAmazon} className="mr-2" />
                Amazon
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
        )}
      </ModalBody>
      <ModalFooter className="flex justify-center">
        {!isLoading && (
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
