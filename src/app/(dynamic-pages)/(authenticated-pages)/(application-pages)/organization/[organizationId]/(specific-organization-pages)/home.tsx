'use client';
import GenerateProductModal from '@/components/GenerateProductModal';
import H1 from '@/components/Text/H1';
import UserActivityCalendar from '@/components/UserActivityCalendar';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { faShopify } from '@fortawesome/free-brands-svg-icons';
import { faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
interface WelcomeHeaderProps {
    userName?: string;
    userEmail?: string;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
    userName,
    userEmail,
}) => {
    // TODO: Add a github-like calendar below the cards so user can see their progress on sign on.
    const router = useRouter();
    const params = useParams();
    const organizationId = params?.organizationId as string;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [userError, setUserError] = useState<any>(null);

    const supabase = supabaseUserClientComponentClient;

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            setUserData(data);
            setUserError(error);
        };
        fetchUser();
    }, []);
    const handleGenerateProduct = async (
        source: string,
        url: string,
        language: string,
    ): Promise<void> => {
        if (!userData?.user) {
            console.error('User data not available');
            return;
        }
        try {
            const response = await fetch('/api/fetch-aliexpress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    source,
                    url,
                    language,
                    user_id: userData.user.id,
                    organization_id: organizationId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            console.log('Response from fetch:', data);

            // Redirect to the product preview page
            if (data.productID) {
                router.push(`/product/${data.productID}/info`);
            } else {
                console.error('Product ID not received in the response');
            }
        } catch (error) {
            console.error('Error generating product:', error);
        }
    };

    return (
        <div className="space-y-6 py-8 px-4 container mx-auto">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <H1 className="text-xl md:text-2xl font-bold lg:text-3xl">

                        🚀 Launch Faster
                        <span className="hidden sm:inline text-lg md:text-2xl lg:text-3xl">, Profit Sooner.</span>
                    </H1>
                    {userEmail && (
                        <p className="text-xs md:text-sm text-gray-500">{userEmail}</p>
                    )}
                </div>
                <button
                    className="flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap"
                    onClick={() => setIsModalOpen(true)}
                >
                    <FontAwesomeIcon icon={faMagicWandSparkles} className="mr-2" />
                    <span className="hidden sm:inline">Generate Product</span>
                    <span className="inline sm:hidden">Generate</span>
                </button>

                <GenerateProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onGenerate={handleGenerateProduct}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow border-4 border-blue-500">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <svg
                            className="w-6 h-6 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">
                            Products Tested
                        </h2>
                        <p className="text-2xl font-bold">15</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow border-4 border-green-500 ">
                    <div className="bg-green-100 p-3 rounded-full">
                        <svg
                            className="w-6 h-6 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">
                            Time Saved
                        </h2>
                        <p className="text-2xl font-bold">24h</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow border-4 border-yellow-500 animate-pulse">
                    <div className="bg-yellow-100 p-3 rounded-full">
                        <svg
                            className="w-6 h-6 text-yellow-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08-.402 2.599-1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">
                            Credits Left
                        </h2>
                        <p className="text-2xl font-bold">50</p>
                    </div>
                </div>
            </div>
            <div className="pt-12 w-full">
                <div className="overflow-x-auto">
                    <UserActivityCalendar />
                </div>
            </div>
            {/* Promotional Banner */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white text-center py-6 mt-12 rounded-lg shadow-lg flex items-center justify-center transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer px-4">
                <a
                    href="your-affiliate-link-here"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 text-lg font-semibold"
                >
                    <FontAwesomeIcon icon={faShopify} size='2x' />
                    <span className="flex items-center">
                        Click here to get a Shopify store for only
                        <span className="text-2xl font-semibold text-white ml-2 underline decoration-white">
                            $1
                        </span>
                        !
                    </span>
                </a>
            </div>
        </div>
    );
};
