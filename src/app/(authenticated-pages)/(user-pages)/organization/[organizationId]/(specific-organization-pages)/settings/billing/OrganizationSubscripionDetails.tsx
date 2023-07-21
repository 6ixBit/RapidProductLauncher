import { LoadingSpinner } from '@/components/presentational/tailwind/LoadingSpinner';
import { PricingModeToggle } from '@/components/presentational/tailwind/PricingModeToggle';
import H3 from '@/components/presentational/tailwind/Text/H3';
import { classNames } from '@/utils/classNames';
import {
  useCreateOrganizationCheckoutSessionMutation,
  useCreateOrganizationCustomerPortalMutation,
  useGetAllActiveProducts,
} from '@/utils/react-query-hooks';
import { getStripe } from '@/utils/stripe-client';
import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import CheckIcon from 'lucide-react/dist/esm/icons/check';
import ExternalLinkIcon from 'lucide-react/dist/esm/icons/external-link';
import XIcon from 'lucide-react/dist/esm/icons/x';
import { useOrganizationContext } from '@/contexts/OrganizationContext';
import { Button } from '@/components/ui/Button';
import { T } from '@/components/ui/Typography';
import { formatNormalizedSubscription } from '@/utils/formatNormalizedSubscription';
import { H2 } from '@/components/ui/Typography/H2';

function ChoosePricingTable() {
  const { organizationId, organizationRole } = useOrganizationContext();
  const isOrganizationAdmin =
    organizationRole === 'admin' || organizationRole === 'owner';
  const {
    data: activeProducts,
    isLoading: isLoadingProducts,
    error,
  } = useGetAllActiveProducts();
  const { mutate, isLoading: isCreatingCheckoutSession } =
    useCreateOrganizationCheckoutSessionMutation({
      onSuccess: async (sessionId) => {
        const stripe = await getStripe();
        stripe?.redirectToCheckout({ sessionId });
      },
      onError: (error) => {
        toast.error(String(error));
      },
    });

  // supabase cannot sort by foreign table, so we do it here
  const productsSortedByPrice = useMemo(() => {
    if (!activeProducts) return [];
    const products = activeProducts
      .map((product) => {
        const prices = Array.isArray(product.prices)
          ? product.prices
          : [product.prices];

        const pricesForProduct = prices.map((price) => {
          const priceString = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: price?.currency ?? undefined,
            minimumFractionDigits: 0,
          }).format((price?.unit_amount || 0) / 100);
          return {
            ...product,
            price,
            priceString,
          };
        });
        return pricesForProduct;
      })
      .flat();

    return products
      .sort(
        (a, b) => (a?.price?.unit_amount ?? 0) - (b?.price?.unit_amount ?? 0)
      )
      .filter(Boolean);
  }, [activeProducts]);

  if (isLoadingProducts)
    return (
      <div>
        <LoadingSpinner className="text-blue-500" />
      </div>
    );

  if (error) return <div>Error</div>;
  return (
    <div className="max-w-7xl space-y-4">
      {/* <Overline>Pricing table</Overline> */}
      {/* <H3 className='border-none mt-3 mb-0'>Pricing table</H3> */}
      <div className="space-y-2">
        {/* <PricingModeToggle mode={pricingMode} onChange={setPricingMode} /> */}
        <div className="flex space-x-5 w-full">
          {productsSortedByPrice.map((product) => {
            if (!product.price) {
              return null;
            }
            if (
              product.price.id === null ||
              product.price.id === undefined ||
              product.price.id === undefined ||
              product.price.unit_amount === null ||
              product.price.unit_amount === undefined
            ) {
              return null;
            }
            const priceId = product.price.id;
            return (
              <>
                <div
                  key={product.id + priceId}
                  className="w-full flex-1 mt-4 order-2 bg-white shadow-none rounded-xl hover:shadow-xl transition sm:w-96 lg:w-full lg:order-1 border border-gray-300 hover:border-gray-400 "
                >
                  <div className="mb-6 p-7 pt-6 flex items-center border-b border-gray-300">
                    <div>
                      <span className="block text-xl mb-3 text-gray-700 font-medium">
                        {' '}
                        {product.name}
                      </span>
                      <span>
                        <span key={priceId} className="text-4xl font-bold">
                          {' '}
                          {product.priceString}
                          <span className="text-base text-gray-700 font-medium">
                            {' '}
                            per {product.price.interval}
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="px-5 pl-6 pt-0 mb-8">
                    <ul className="font-medium text-gray-600">
                      <li className="grid grid-cols-[24px,1fr] gap-0 text-md items-start mb-2">
                        <CheckIcon className="text-green-600 w-6 h-6" />
                        <span className="ml-3">{product.description}</span>
                      </li>
                      <li className="grid grid-cols-[24px,1fr] gap-0 text-md items-start mb-2">
                        <CheckIcon className="text-green-600 w-6 h-6" />
                        <span className="ml-3">A nice feature</span>
                      </li>
                      <li className="grid grid-cols-[24px,1fr] gap-0 text-md items-start mb-2">
                        <CheckIcon className="text-green-600 w-6 h-6" />
                        <span className="ml-3">Another nice feature</span>
                      </li>
                      <li className="grid grid-cols-[24px,1fr] gap-0 text-md items-start mb-2">
                        {product.price.unit_amount > 0 ? (
                          <CheckIcon className="text-green-600 w-6 h-6" />
                        ) : (
                          <XIcon className="text-red-500" />
                        )}
                        <span className="ml-3">A premium feature</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-xl py-1 mb-5 mx-5 mt-4 text-center text-white text-xl space-y-2">
                    {isOrganizationAdmin ? (
                      <>
                        <Button
                          className="w-full"
                          onClick={() => {
                            mutate({
                              organizationId: organizationId,
                              priceId: priceId,
                              isTrial: true,
                            });
                          }}
                        >
                          Start free trial
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            mutate({
                              organizationId: organizationId,
                              priceId: priceId,
                            });
                          }}
                        >
                          {isCreatingCheckoutSession ? 'Loading...' : 'Choose'}
                        </Button>
                      </>
                    ) : (
                      <span className="text-sm bg-green-50 px-3 py-2 text-gray-900 rounded-lg">
                        Contact your administrator to upgrade plan
                      </span>
                    )}
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function OrganizationSubscripionDetails() {
  const { organizationId, normalizedSubscription, organizationRole } =
    useOrganizationContext();
  const isOrganizationAdmin =
    organizationRole === 'admin' || organizationRole === 'owner';

  const { mutate, isLoading: isLoadingCustomerPortalLink } =
    useCreateOrganizationCustomerPortalMutation({
      onSuccess: (url) => {
        window.location.assign(url);
      },
    });

  const subscriptionDetails = formatNormalizedSubscription(
    normalizedSubscription
  );

  if (
    !subscriptionDetails.title ||
    normalizedSubscription.type === 'no-subscription'
  ) {
    return (
      <>
        <div className="space-y-1">
          <H3>Subscription</H3>
          <p className="text-gray-500 text-sm">
            This organization doesn't have any plan at the moment.
          </p>
        </div>
        <ChoosePricingTable />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <H3>Subscription</H3>
        <T.P>
          You are currently on the{' '}
          <span className="text-blue-500">
            {subscriptionDetails.title}{' '}
            <span>{subscriptionDetails.sidenote}</span>
          </span>
          .{' '}
        </T.P>
        <T.Subtle>{subscriptionDetails.description}</T.Subtle>
      </div>
      {isOrganizationAdmin ? (
        <div className="space-y-2">
          <button
            className={classNames(
              'inline-flex space-x-1 items-center  justify-center rounded border border-transparent py-2 px-4 text-sm font-medium  shadow-sm focus:outline-none focus:ring-2  focus:ring-offset-2',
              'bg-blue-500 focus:ring-blue-500 hover:bg-blue-600  text-white'
            )}
            onClick={() => {
              mutate({
                organizationId: organizationId,
              });
            }}
          >
            <span>
              {isLoadingCustomerPortalLink
                ? 'Loading...'
                : 'Manage Subscription'}{' '}
            </span>
            <ExternalLinkIcon aria-hidden="true" />{' '}
          </button>
          <p className="text-gray-500 text-xs">
            Manage your subscription. You can modify, upgrade or cancel your
            membership from here.
          </p>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">
          Contact your administrator to upgrade plan.
        </p>
      )}
    </div>
  );
}
