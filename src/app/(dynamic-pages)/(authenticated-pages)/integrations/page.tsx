'use client';

import AddShopifyStoreModal from '@/components/AddShopifyStoreModal';
import {
  Modal,
  ModalBody,
  ModalCancelButton,
  ModalFooter,
  ModalHeader,
  ModalSuccessButton,
} from '@/components/Modal';
import { useFeaturePermissions } from '@/hooks/useFeaturePermissions';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { useStripeData } from '@/utils/stripe-queries';
import { faShopify } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

interface StoreIntegration {
  id: string;
  name: string;
  isConnected: boolean;
  myshopify_domain: string;
}

const StoreCard = ({
  store,
  onDisconnect,
  canRemove
}: {
  store: StoreIntegration;
  onDisconnect: (id: string) => Promise<void>;
  canRemove: boolean;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreIntegration | null>(
    null,
  );
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
    },
  });

  const handleConfirmDisconnect = async () => {
    if (selectedStore) {
      disconnectMutation.mutate(selectedStore.id);
    }
  };

  const handleDisconnectClick = (store: StoreIntegration) => {
    if (!canRemove) {
      toast.error('Store removal is not available on the free plan');
      return;
    }
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center border-4 border-blue-100">
      <div className="flex items-center mb-4">
        <FontAwesomeIcon
          icon={faShopify}
          className="w-12 h-12 text-green-500 mr-2"
        />
      </div>
      <div className="flex flex-col items-center mb-2">
        <h2 className="text-xl font-semibold">{store.name}</h2>
        <span className="text-sm text-gray-500 mt-1">{store.myshopify_domain}</span>

      </div>
      <button
        className={`mt-4 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${store.isConnected
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        onClick={
          store.isConnected ? () => handleDisconnectClick(store) : undefined
        }
      >
        {store.isConnected ? 'Disconnect' : 'Connect'}
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-md"
      >
        <ModalHeader>
          <h2 className="text-2xl font-bold text-gray-900">Remove Store</h2>
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600 text-lg">
            Are you sure you want to disconnect from{' '}
            <span className="font-semibold">{selectedStore?.name}</span>?
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

const EmptyState = ({ onAddStore }: { onAddStore: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md border-2 border-dashed border-gray-300 min-h-[300px]">
    <FontAwesomeIcon
      icon={faShopify}
      className="w-16 h-16 text-red-500 mb-4"
    />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">
      No Stores Connected
    </h3>
    <p className="text-gray-500 text-center mb-6 max-w-md">
      Connect your Shopify store to start importing AI-generated products and manage them seamlessly.
    </p>
    <button
      onClick={onAddStore}
      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full flex items-center transition-colors duration-300"
    >
      <FontAwesomeIcon icon={faShopify} className="mr-2" />
      Add Your First Store
    </button>
  </div>
);

const IntegrationsPage = () => {
  const queryClient = useQueryClient();
  const supabaseClient = supabaseUserClientComponentClient;
  const user = useLoggedInUser();
  const [isAddShopifyStoreModalOpen, setIsAddShopifyStoreModalOpen] =
    useState<boolean>(false);

  const { subscriptionTier } = useStripeData();

  console.log('Subscription Tier:', subscriptionTier);

  const { data: storeIntegrations = [], isLoading } = useQuery({
    queryKey: ['getStoreIntegrations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabaseClient
        .from('shopify_integrations')
        .select('id, shopify_store_url, is_connected, myshopify_domain')
        .eq('user_id', user.id);

      if (error) throw error;

      return data.map((store) => ({
        id: store.id.toString(),
        name: store.shopify_store_url,
        isConnected: store.is_connected,
        myshopify_domain: store.myshopify_domain,
      }));
    },
    enabled: !!user,
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

  const permissions = useFeaturePermissions(subscriptionTier, storeIntegrations.length);

  const handleAddStoreClick = () => {
    if (!permissions.stores.canAccess) {
      toast.error(permissions.stores.reason);
      return;
    }
    setIsAddShopifyStoreModalOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Your Stores</h1>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center">
              <span className=" text-sm text-gray-600 font-medium">
                {permissions.stores.current} / {permissions.stores.limit} stores
              </span>
              <div className="h-2 ml-3 w-32 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-300"

                  style={{
                    // @ts-expect-error current and limit may be undefined from permissions object
                    width: `${(permissions.stores.current / permissions.stores.limit) * 100}%`
                  }}
                />
              </div>

            </div>
            {subscriptionTier !== 'mega_scaler' && (
              <Link
                href="/organization/60f6526a-0eb5-4822-9800-46ab4cfaeaf9/settings/billing"
                className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors duration-300 flex items-center group"
              >
                Upgrade for more stores
                <svg
                  className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
        <button
          className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center
            ${!permissions.stores.canAccess ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleAddStoreClick}
          disabled={!permissions.stores.canAccess}
        >
          <FontAwesomeIcon icon={faShopify} size="2x" className="mr-3" />
          Add Store
        </button>
      </div>
      <AddShopifyStoreModal
        isOpen={isAddShopifyStoreModalOpen}
        onClose={() => setIsAddShopifyStoreModalOpen(false)}
        onSuccess={handleAddStoreSuccess}
      />

      {storeIntegrations.length === 0 ? (
        <EmptyState onAddStore={() => setIsAddShopifyStoreModalOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storeIntegrations.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onDisconnect={handleDisconnect}
              canRemove={permissions.stores.canRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IntegrationsPage;
