'use client';

import AddShopifyStoreModal from '@/components/AddShopifyStoreModal';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { faShopify } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StoreIntegration {
    id: string;
    name: string;
    isConnected: boolean;
}

const IntegrationsPage = () => {
    const supabaseClient = supabaseUserClientComponentClient;
    const user = useLoggedInUser();
    const [isAddShopifyStoreModalOpen, setIsAddShopifyStoreModalOpen] = useState<boolean>(false);
    const [storeIntegrations, setStoreIntegrations] = useState<StoreIntegration[]>([]);

    useEffect(() => {
        const fetchStoreIntegrations = async () => {
            if (!user) return;

            const { data, error } = await supabaseClient
                .from('shopify_integrations')
                .select('id, shopify_store_url, is_connected')
                .eq('user_id', user.id);

            if (error) {
                console.error('Error fetching store integrations:', error);
            } else {
                const integrations = data.map((store) => ({
                    id: store.id,
                    name: store.shopify_store_url,
                    isConnected: store.is_connected,
                }));

                const formattedIntegrations = integrations.map(integration => ({
                    ...integration,
                    id: integration.id.toString(),
                }));

                setStoreIntegrations(formattedIntegrations);
            }
        };

        fetchStoreIntegrations();
    }, [user, supabaseClient]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Your Stores</h1>
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
                    onClick={() => {
                        setIsAddShopifyStoreModalOpen(true);
                    }}
                >
                    <FontAwesomeIcon icon={faShopify} size='2x' className="mr-3" />
                    Add Store
                </button>
            </div>
            <AddShopifyStoreModal
                isOpen={isAddShopifyStoreModalOpen}
                onClose={() => setIsAddShopifyStoreModalOpen(false)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storeIntegrations.map((store) => (
                    <div
                        key={store.id}
                        className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
                    >
                        <FontAwesomeIcon icon={faShopify} className="w-12 h-12 mb-4 text-green-500" />
                        <h2 className="text-xl font-semibold mb-2">{store.name}</h2>
                        {store.isConnected ? (
                            <div className="flex items-center text-green-500">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                <span>Connected</span>
                            </div>
                        ) : (
                            <div className="flex items-center text-red-500">
                                <XCircle className="w-5 h-5 mr-2" />
                                <span>Not Connected</span>
                            </div>
                        )}
                        <button
                            className={`mt-4 px-4 py-2 rounded-md ${store.isConnected
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                        >
                            {store.isConnected ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IntegrationsPage;
