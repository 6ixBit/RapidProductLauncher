'use client';

import { CheckCircle, ShoppingBag, XCircle } from 'lucide-react';
import { useState } from 'react';

interface StoreIntegration {
    id: string;
    name: string;
    isConnected: boolean;
}

const IntegrationsPage = () => {
    const [storeIntegrations, setStoreIntegrations] = useState<StoreIntegration[]>([
        { id: '1', name: 'Shopify Store 1', isConnected: true },
        { id: '2', name: 'Shopify Store 2', isConnected: false },
    ]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Your Stores</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storeIntegrations.map((store) => (
                    <div
                        key={store.id}
                        className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
                    >
                        <ShoppingBag className="w-12 h-12 mb-4 text-gray-600" />
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