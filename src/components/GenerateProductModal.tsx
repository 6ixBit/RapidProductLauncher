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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { faAmazon, faEtsy } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface GenerateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (
    source?: string,
    prompt?: string,
    language?: string,
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
  const [urls, setUrls] = useState<string[]>(['']);
  const [activeTab, setActiveTab] = useState<string>('single');
  const [multiUrlErrors, setMultiUrlErrors] = useState<string[]>([]);

  const validateAliExpressUrl = (url: string) => {
    const aliExpressRegex =
      /^https?:\/\/([\w-]+\.)?aliexpress\.(com|us)(\/.*)?$/i;
    return aliExpressRegex.test(url);
  };

  const getUrlErrorMessage = (url: string) => {
    if (!url.trim()) return '';
    if (!url.startsWith('https://')) {
      return 'URL must start with https://';
    }
    if (!validateAliExpressUrl(url)) {
      return 'Please enter a valid AliExpress URL';
    }
    return '';
  };

  useEffect(() => {
    if (url) {
      setUrlError(getUrlErrorMessage(url));
    } else {
      setUrlError('');
    }
  }, [url]);

  useEffect(() => {
    const newErrors = urls.map(url => getUrlErrorMessage(url));
    setMultiUrlErrors(newErrors);
  }, [urls]);

  const handleGenerate = async () => {
    if (activeTab === 'single') {
      if (!validateAliExpressUrl(url)) {
        setUrlError('Please enter a valid AliExpress URL');
        return;
      }
    } else {
      console.log('Generating multiple products:', urls.filter(url => url.trim()));
      return;
    }

    setIsLoading(true);
    setError(null);

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

  const areMultiUrlsValid = () => {
    return urls.some(url => url.trim() !== '') &&
      urls.every(url => !url.trim() || validateAliExpressUrl(url));
  };

  const isGenerateDisabled = activeTab === 'single'
    ? (!url || !!urlError || isLoading)
    : (!areMultiUrlsValid() || isLoading);

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
            <p className="text-sm text-gray-500 mb-2">Est time: 1 - 3 minutes.</p>
            <p className="text-sm text-gray-400 italic">
              "Psst...Your competitor is still manually creating their product
              page right now..."
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Tabs defaultValue="single" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="single">Single Product</TabsTrigger>
                <TabsTrigger value="multi">Multiple Products</TabsTrigger>
              </TabsList>

              <TabsContent value="single">
                <div className="space-y-8 pt-4">
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
                  <div className="space-y-3">
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                      Product URL
                    </label>
                    <Input
                      type="text"
                      id="prompt"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className={`${urlError ? 'border-red-500' : ''}`}
                      placeholder="Enter AliExpress product URL here"
                    />
                    {urlError && <p className="text-sm text-red-500">{urlError}</p>}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="multi">
                <div className="space-y-8 pt-4">
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
                  <div className="space-y-4">
                    {urls.map((url, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            value={url}
                            onChange={(e) => {
                              const newUrls = [...urls];
                              newUrls[index] = e.target.value;
                              setUrls(newUrls);
                            }}
                            placeholder={`Product URL ${index + 1}`}
                            className={`${multiUrlErrors[index] ? 'border-red-500' : ''}`}
                          />
                          {index === urls.length - 1 && urls.length < 5 && (
                            <Button
                              variant="outline"
                              onClick={() => setUrls([...urls, ''])}
                              disabled={!url}
                            >
                              +
                            </Button>
                          )}
                        </div>
                        {multiUrlErrors[index] && (
                          <p className="text-sm text-red-500">{multiUrlErrors[index]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

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
            className={`bg-green-500 hover:bg-green-600 text-white ${isGenerateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Generate
          </ModalSuccessButton>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default GenerateProductModal;
