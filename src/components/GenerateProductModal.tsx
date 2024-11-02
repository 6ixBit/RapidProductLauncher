'use client'

import robotAnimation from '@/app/animations/robot-working.json';
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
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { faAmazon, faEtsy } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import Lottie from 'lottie-react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import { toast } from "sonner";

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

interface UrlEntry {
  url: string;
  marketplace: string;
}

const ExternalUrlLink: React.FC<{ url: string }> = ({ url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="text-xs text-blue-500 hover:text-blue-600 truncate max-w-[200px] hover:underline"
    title={url}
  >
    {url}
  </a>
);

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
  const [multiUrls, setMultiUrls] = useState<UrlEntry[]>([{ url: '', marketplace: 'AliExpress' }]);
  const [processingProducts, setProcessingProducts] = useState<Record<number, boolean>>({});
  const [completedProducts, setCompletedProducts] = useState<Record<number, string>>({});
  const router = useRouter();
  const supabase = supabaseUserClientComponentClient;

  const user = useLoggedInUser();

  const { data: organizationId } = useQuery({
    queryKey: ['userOrganization', user.id],
    queryFn: async () => {
      const { data: orgMember, error } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('member_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (error) {
        throw error;
      }

      return orgMember.organization_id;
    },
  });

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
    const newErrors = multiUrls.map(entry => getUrlErrorMessage(entry.url));
    setMultiUrlErrors(newErrors);
  }, [multiUrls]);

  useEffect(() => {
    console.log('Auth State:', {
      user,
      userId: user?.id,
      orgId: organizationId
    });
  }, [user, organizationId]);

  const LOADING_MESSAGES = [
    "Still faster than your competition's manual copy-paste...",
    "While you automate, your competitors are still formatting product descriptions...",
    "Grab a coffee - you're still saving hours of manual work!",
    "In the time you wait, others are still writing product titles...",
    "Your competition is wondering why you're launching products so quickly...",
    "Working our magic... much faster than doing this by hand!",
    "Taking care of hours of work in just minutes...",
    "Automating what your competitors do manually...",
  ];

  const [loadingMessage, setLoadingMessage] = useState<string>("");

  const [isMultiComplete, setIsMultiComplete] = useState(false);

  const getWaitTimeMessage = (productCount: number) => {
    if (activeTab === 'single') {
      return "Processing time: ~1 minute";
    }

    return `Processing ${productCount === 1 ? 'product' : 'products'}: ~${productCount} ${productCount === 1 ? 'minute' : 'minutes'}`;
  };

  const handleGenerate = async () => {
    setLoadingMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    setIsLoading(true);

    if (activeTab === 'multi') {
      const validProducts = multiUrls.filter(entry => entry.url.trim());

      if (!user?.id || !organizationId) {
        toast.error('Authentication error. Please try again.');
        return;
      }

      console.log('Starting multi-generate with products:', validProducts);

      const initialProcessing = validProducts.reduce((acc, _, index) => {
        acc[index] = true;
        return acc;
      }, {} as Record<number, boolean>);

      setProcessingProducts(initialProcessing);
      setIsLoading(true);

      try {
        for (let i = 0; i < validProducts.length; i++) {
          const entry = validProducts[i];
          console.log(`Processing product ${i + 1}:`, entry);

          try {
            const response = await fetch('/api/fetch-aliexpress', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                source: entry.marketplace,
                url: entry.url,
                language,
                user_id: user.id,
                organization_id: organizationId,
              }),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Product ${i + 1} response:`, data);

            if (data.productID) {
              setCompletedProducts(prev => ({
                ...prev,
                [i]: `/product/${data.productID}/info`
              }));
              toast.success(`Product ${i + 1} generated successfully!`, {
                action: {
                  label: "View",
                  onClick: () => router.push(`/product/${data.productID}/info`)
                },
              });
            }
          } catch (error) {
            console.error(`Error generating product ${i + 1}:`, error);
            toast.error(`Failed to generate product ${i + 1}`);
          } finally {
            setProcessingProducts(prev => ({
              ...prev,
              [i]: false
            }));
          }
        }
      } catch (error) {
        console.error('Multi-generate error:', error);
        toast.error('Failed to process products');
      } finally {
        setIsLoading(false);
        setIsMultiComplete(true);
      }
      return;
    }

    if (!validateAliExpressUrl(url)) {
      setUrlError('Please enter a valid AliExpress URL');
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
    const hasValidUrls = multiUrls.some(entry => entry.url.trim() !== '');
    const allUrlsValid = multiUrls.every(entry =>
      !entry.url.trim() || validateAliExpressUrl(entry.url)
    );

    const hasRequiredData = !!user?.id && !!organizationId;

    console.log('Multi URL Validation:', {
      hasValidUrls,
      allUrlsValid,
      hasRequiredData,
      userId: user?.id,
      orgId: organizationId
    });

    return hasValidUrls && allUrlsValid && hasRequiredData;
  };

  const isGenerateDisabled = activeTab === 'single'
    ? (!url || !!urlError || isLoading)
    : (!areMultiUrlsValid() || isLoading);

  const handleClose = () => {
    setIsMultiComplete(false);
    setCompletedProducts({});
    setProcessingProducts({});
    setMultiUrls([{ url: '', marketplace: 'AliExpress' }]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} className="w-full max-w-md">
      <ModalHeader>
        <div className="flex justify-between items-center">
          <H3>{isLoading ? 'Generating Product Page' : 'Select Source'}</H3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </ModalHeader>
      <ModalBody>
        {(isLoading || isMultiComplete) ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center space-y-2">
              {isLoading && (
                <>
                  <div className="w-48 h-48 mx-auto">
                    <Lottie
                      animationData={robotAnimation}
                      loop={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {getWaitTimeMessage(activeTab === 'multi' ? multiUrls.length : 1)}
                  </p>
                  <p className="text-sm text-gray-400 italic">
                    {loadingMessage}
                  </p>
                </>
              )}
              {isMultiComplete && !isLoading && (
                <p className="text-sm text-green-600 font-medium mb-4">
                  All products have been generated successfully!
                </p>
              )}
            </div>

            <div className="w-full space-y-3 max-h-[300px] overflow-y-auto">
              {multiUrls.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border bg-gray-50"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      Product {index + 1}
                    </span>
                    <ExternalUrlLink url={entry.url} />
                  </div>
                  <div className="flex items-center gap-2">
                    {processingProducts[index] ? (
                      <LoadingSpinner className="h-4 w-4" />
                    ) : completedProducts[index] ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-500 hover:text-blue-600"
                          onClick={() => window.open(completedProducts[index], '_blank')}
                        >
                          View Product
                        </Button>
                      </div>
                    ) : (
                      <span className="text-gray-400">Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
                  <div className="space-y-4">
                    {multiUrls.map((entry, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex gap-2">
                          <Select
                            value={entry.marketplace}
                            onValueChange={(value) => {
                              const newUrls = [...multiUrls];
                              newUrls[index].marketplace = value;
                              setMultiUrls(newUrls);
                            }}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AliExpress">AliExpress</SelectItem>
                              <SelectItem value="Temu" disabled>Temu</SelectItem>
                              <SelectItem value="Etsy" disabled>Etsy</SelectItem>
                              <SelectItem value="Amazon" disabled>Amazon</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="text"
                            value={entry.url}
                            onChange={(e) => {
                              const newUrls = [...multiUrls];
                              newUrls[index].url = e.target.value;
                              setMultiUrls(newUrls);
                            }}
                            placeholder={`Product URL ${index + 1}`}
                            className={`${multiUrlErrors[index] ? 'border-red-500' : ''}`}
                          />
                          {index === multiUrls.length - 1 && multiUrls.length < 5 && (
                            <Button
                              variant="outline"
                              onClick={() => setMultiUrls([...multiUrls, { url: '', marketplace: 'AliExpress' }])}
                              disabled={!entry.url}
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
        {!isLoading && !isMultiComplete && (
          <ModalSuccessButton
            onClick={handleGenerate}
            disabled={isGenerateDisabled}
            className={`bg-green-500 hover:bg-green-600 text-white ${isGenerateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Generate
          </ModalSuccessButton>
        )}
        {isMultiComplete && (
          <Button
            onClick={handleClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Close
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default GenerateProductModal;
