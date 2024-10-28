'use client';

import AddShopifyStoreModal from '@/components/AddShopifyStoreModal';
import { Modal, ModalBody, ModalCancelButton, ModalFooter, ModalHeader, ModalSuccessButton } from '@/components/Modal';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { faShopify } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface StoreIntegration {
    id: string;
    name: string;
    isConnected: boolean;
}

const StoreCard = ({ store, onDisconnect }: { store: StoreIntegration; onDisconnect: (id: string) => Promise<void> }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState<StoreIntegration | null>(null);
    const queryClient = useQueryClient();

    const disconnectMutation = useMutation({
        mutationFn: async (storeId: string) => {
            const { error } = await supabaseUserClientComponentClient
                .from('shopify_integrations')
                .delete()
                .eq('id', storeId);

            if (error) throw error;
            return storeId;
        },
        onSuccess: (storeId) => {
            // Invalidate both queries to ensure proper refresh
            queryClient.invalidateQueries({ queryKey: ['getStoreIntegrations'] });
            queryClient.invalidateQueries({ queryKey: ['storeIntegrations'] });
            toast.success(`Store was successfully disconnected.`);
            setIsModalOpen(false);
        },
        onError: (error) => {
            console.error('Error disconnecting store:', error);
            toast.error('Failed to disconnect store. Please try again.');
        }
    });

    const handleConfirmDisconnect = async () => {
        if (selectedStore) {
            disconnectMutation.mutate(selectedStore.id);
        }
    };

    const handleDisconnectClick = (store: StoreIntegration) => {
        setSelectedStore(store);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center border-4 border-blue-100">
            <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faShopify} className="w-12 h-12 text-green-500 mr-2" />
            </div>
            <div className="flex items-center">
                <h2 className="text-xl font-semibold">{store.name}</h2>
                {store.isConnected && <CheckCircle className="pl-2 w-6 h-6 text-green-500" />}
            </div>
            <button
                className={`mt-4 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${store.isConnected
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                onClick={store.isConnected ? () => handleDisconnectClick(store) : undefined}
            >
                {store.isConnected ? 'Disconnect' : 'Connect'}
            </button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-md">
                <ModalHeader>
                    <h2 className="text-2xl font-bold text-gray-900">Remove Store</h2>
                </ModalHeader>
                <ModalBody>
                    <p className="text-gray-600 text-lg">
                        Are you sure you want to disconnect from <span className="font-semibold">{selectedStore?.name}</span>?
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        This action cannot be undone.
                    </p>
                </ModalBody>
                <ModalFooter className="flex justify-end space-x-4">
                    <ModalCancelButton
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-2 rounded-full text-gray-600 hover:text-gray-900 transition-colors duration-300"
                    >
                        Cancel
                    </ModalCancelButton>
                    <ModalSuccessButton
                        onClick={handleConfirmDisconnect}
                        className="px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
                    >
                        Disconnect
                    </ModalSuccessButton>
                </ModalFooter>
            </Modal>
        </div>
    );
};

const IntegrationsPage = () => {
    const queryClient = useQueryClient();
    const supabaseClient = supabaseUserClientComponentClient;
    const user = useLoggedInUser();
    const [isAddShopifyStoreModalOpen, setIsAddShopifyStoreModalOpen] = useState<boolean>(false);

    const { data: storeIntegrations = [], isLoading } = useQuery({
        queryKey: ['getStoreIntegrations', user?.id],
        queryFn: async () => {
            if (!user) return [];

            const { data, error } = await supabaseClient
                .from('shopify_integrations')
                .select('id, shopify_store_url, is_connected')
                .eq('user_id', user.id);

            if (error) throw error;

            return data.map((store) => ({
                id: store.id.toString(),
                name: store.shopify_store_url,
                isConnected: store.is_connected,
            }));
        },
        enabled: !!user
    });

    const handleDisconnect = async (id: string) => {
        // This is now handled by the mutation in StoreCard
    };

    const handleAddStoreSuccess = () => {
        // Invalidate both related queries
        queryClient.invalidateQueries({ queryKey: ['getStoreIntegrations'] });
        queryClient.invalidateQueries({ queryKey: ['storeIntegrations'] });
        setIsAddShopifyStoreModalOpen(false);
        toast.success('Store added successfully');
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

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
                onSuccess={handleAddStoreSuccess}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storeIntegrations.map((store) => (
                    <StoreCard
                        store={store}
                        onDisconnect={handleDisconnect}
                    />
                ))}
            </div>
        </div>
    );
};

export default IntegrationsPage;
