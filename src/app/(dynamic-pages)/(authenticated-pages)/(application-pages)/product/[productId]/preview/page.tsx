'use client'
import H1 from '@/components/Text/H1';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const productID = params?.productId as string;

    return (
        <div>
            <button
                onClick={() => router.push('/products')}
                className="flex items-center mb-4 text-blue-600 hover:text-blue-800"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back To Products
            </button>
            <H1>Product Preview</H1>
            {productID ? (
                <p>Product ID: {productID}</p>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
