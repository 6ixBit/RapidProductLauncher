'use client';
import { Product } from '@/app/(dynamic-pages)/(authenticated-pages)/products/page';
import GenerateProductModal from '@/components/GenerateProductModal';
import { ProductCard } from '@/components/ProductCard';
import H1 from '@/components/Text/H1';
import H3 from '@/components/Text/H3';
import { TooltipProvider } from '@/components/ui/tooltip';
import UserActivityCalendar from '@/components/UserActivityCalendar';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
interface HomeProps {
  userName?: string;
  userEmail?: string;
}

export const Home: React.FC<HomeProps> = ({ userName, userEmail }) => {
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

  // Add this query to fetch the count of generated products
  const { data: productsCount = 0 } = useQuery({
    queryKey: ['productsGenerated', userData?.user?.id],
    queryFn: async () => {
      if (!userData?.user?.id) return 0;

      const { count, error } = await supabase
        .from('html_templates')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userData.user.id);

      if (error) {
        console.error('Error fetching products count:', error);
        return 0;
      }

      return count || 0;
    },
    enabled: !!userData?.user?.id,
  });

  // Add this query to fetch the user's credits
  const { data: userCredits } = useQuery({
    queryKey: ['userCredits', userData?.user?.id],
    queryFn: async () => {
      if (!userData?.user?.id) return null;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('credits')
        .eq('id', userData.user.id)
        .single();

      if (error) {
        console.error('Error fetching user credits:', error);
        return null;
      }

      return data?.credits || 0;
    },
    enabled: !!userData?.user?.id,
  });

  const { data: recentProducts = [] } = useQuery<Product[]>({
    queryKey: ['recentProducts', userData?.user?.id],
    queryFn: async () => {
      if (!userData?.user?.id) return [];

      const { data, error } = await supabase
        .from('html_templates')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })
        .limit(6); // Limit to 4 recent products

      if (error) {
        console.error('Error fetching recent products:', error);
        return [];
      }

      return data as unknown as Product[];
    },
    enabled: !!userData?.user?.id,
  });

  const handleGenerateProduct = async (
    source: string,
    url: string,
    language: string,
  ): Promise<void> => {
    if (!userData?.user?.id || !organizationId) return;

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
    <TooltipProvider>
      <div className="space-y-6 py-4 px-4 container mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <H1 className="text-xl md:text-2xl font-extrabold lg:text-3xl">
              ⚡️ Launch Faster
              <span className="hidden sm:inline text-lg md:text-2xl lg:text-3xl">
                , Profit Sooner.
              </span>
            </H1>
            {userEmail && (
              <p className="text-xs md:text-sm text-gray-500">{userEmail}</p>
            )}
          </div>
          <button
            className="flex items-center justify-center px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 whitespace-nowrap transition-colors"
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
          <div className="flex items-center space-x-4 p-4 rounded-lg shadow bg-blue-500 text-white">
            <div className="bg-blue-400 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-white"
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
              <H3 className="text-lg font-semibold text-white">Products Tested</H3>
              <p className="text-2xl font-bold text-white">{productsCount}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-lg shadow bg-green-500 text-white">
            <div className="bg-green-400 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-white"
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
              <H3 className="text-lg font-semibold text-white">Time Saved</H3>
              <p className="text-2xl font-bold text-white">
                {(() => {
                  const { hours, minutes } = calculateTimeSaved(productsCount);
                  return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
                })()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-lg shadow bg-yellow-500 text-white">
            <div className="bg-yellow-400 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-white"
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
              <H3 className="text-lg font-semibold text-white">Credits Left</H3>
              <p className="text-2xl font-bold text-white">{userCredits}</p>
            </div>
          </div>
        </div>
        <div className="pt-6 w-full">
          <div className="overflow-x-auto">
            <UserActivityCalendar />
          </div>
        </div>
        {/* Recent Products Section */}
        {recentProducts.length > 0 && (
          <div className="mt-12 pt-6 ">
            <div className="flex justify-between items-center mb-6">
              <H3 className="text-2xl font-bold">Your Recent Products</H3>
              <button
                onClick={() => router.push('/products')}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                View All →
              </button>
            </div>
            <div className="relative">
              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-4 w-full">
                  {recentProducts.map((product) => (
                    <div key={product.id} className="w-[300px] flex-shrink-0">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Promotional Banner */}
        {/* <div className="bg-gradient-to-r from-green-600 to-green-500 text-white text-center py-6 mt-16 rounded-lg shadow-lg flex items-center justify-center transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer px-4">
          <a
            href="your-affiliate-link-here"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-4 text-lg font-semibold"
          >
            <FontAwesomeIcon icon={faShopify} size="2x" />
            <span className="flex items-center">
              Click here to get a Shopify store for only
              <span className="text-2xl font-semibold text-white ml-2 underline decoration-white">
                $1
              </span>
              !
            </span>
          </a>
        </div> */}
      </div>
    </TooltipProvider>
  );
};

const calculateTimeSaved = (productsCount: number) => {
  const timePerProduct = {
    manualTime: 80, // 80 minutes for manual process
    toolTime: 10, // 10 minutes with your tool
  };

  const totalMinutesSaved =
    (timePerProduct.manualTime - timePerProduct.toolTime) * productsCount;
  const hours = Math.floor(totalMinutesSaved / 60);
  const minutes = totalMinutesSaved % 60;

  return {
    hours,
    minutes,
    totalMinutesSaved,
  };
};
