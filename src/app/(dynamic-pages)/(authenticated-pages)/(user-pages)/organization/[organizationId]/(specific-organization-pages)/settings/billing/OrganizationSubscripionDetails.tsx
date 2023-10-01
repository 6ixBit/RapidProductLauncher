'use client';
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
import { PageHeading } from '@/components/presentational/tailwind/PageHeading';
import { H4 } from '@/components/ui/Typography/H4';

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
        (a, b) => (a?.price?.unit_amount ?? 0) - (b?.price?.unit_amount ?? 0),
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
        <div className="flex space-x-6 w-full">
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
                  className="w-full flex flex-col justify-between mt-3 order-2 dark:bg-slate-900 bg-gray-200/10 shadow-none overflow-hidden rounded-xl hover:shadow-xl transition sm:w-96 lg:w-full lg:order-1 border mb-2  hover:border-gray-400 dark:hover:border-gray-700 "
                >
                  <div>
                    <div className="mb-6 p-7 pt-6 flex items-center border-b bg-gray-200/40 dark:bg-slate-800">
                      <div>
                        <T.H4 className="mt-0 mb-4 dark:text-slate-300">
                          {' '}
                          {product.name}
                        </T.H4>
                        <span>
                          <T.H1 className="dark:text-slate-50" key={priceId}>
                            {' '}
                            {product.priceString}
                            <span className="text-base tracking-normal text-muted-foreground font-medium">
                              {' '}
                              per {product.price.interval}
                            </span>
                          </T.H1>
                        </span>
                      </div>
                    </div>

                    <div className="px-5 pl-6 pt-0 mb-8">
                      <ul className="font-medium text-muted-foreground">
                        <li className="grid grid-cols-[24px,1fr] gap-0 text-md items-start mb-2">
                          <CheckIcon className="text-green-600 w-6 h-6" />
                          <T.P className="leading-6 ml-3">
                            {product.description}
                          </T.P>
                        </li>
                        <li className="grid grid-cols-[24px,1fr] gap-0 text-md items-start mb-2">
                          <CheckIcon className="text-green-600 w-6 h-6" />
                          <T.P className="leading-6 ml-3">A nice feature</T.P>
                        </li>
                        <li className="grid grid-cols-[24px,1fr] gap-0 text-md items-start mb-2">
                          <CheckIcon className="text-green-600 w-6 h-6" />
                          <T.P className="leading-6 ml-3">
                            Another nice feature
                          </T.P>
                        </li>
                        <li className="grid grid-cols-[24px,1fr] gap-0 text-md items-start mb-2">
                          {product.price.unit_amount > 0 ? (
                            <CheckIcon className="text-green-600 w-6 h-6" />
                          ) : (
                            <XIcon className="text-red-500" />
                          )}
                          <T.P className="leading-6 ml-3">
                            A premium feature
                          </T.P>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="rounded-xl py-1 mb-5 mx-5 mt-4 text-white text-xl space-y-2">
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
                      <T.P className=" py-2 px-4 bg-gray-100 dark:bg-slate-400/20 text-sm text-gray-900 dark:text-slate-100 rounded-lg">
                        Contact your administrator to upgrade plan
                      </T.P>
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
    normalizedSubscription,
  );

  if (
    !subscriptionDetails.title ||
    normalizedSubscription.type === 'no-subscription'
  ) {
    return (
      <>
        <div className="">
          <T.H2 className="border-none text-2xl mb-0 text-gray-900 dark:text-slate-100">
            Subscription
          </T.H2>
          <T.P className="text-muted-foreground">
            This organization doesn't have any plan at the moment
          </T.P>
        </div>
        <ChoosePricingTable />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <T.H3 className="text-gray-900 dark:text-slate-100 ">Subscription</T.H3>
        <T.P className="text-muted-foreground">
          You are currently on the{' '}
          <span className="text-blue-500 dark:text-blue-400">
            {subscriptionDetails.title}{' '}
            <span className="ml-2">{subscriptionDetails.sidenote}</span>
          </span>
          .{' '}
        </T.P>
        <T.Subtle>{subscriptionDetails.description}</T.Subtle>
      </div>
      {isOrganizationAdmin ? (
        <div className="space-y-2">
          <Button
            variant="default"
            onClick={() => {
              mutate({
                organizationId: organizationId,
              });
            }}
          >
            {isLoadingCustomerPortalLink ? 'Loading...' : 'Manage Subscription'}{' '}
            <ExternalLinkIcon aria-hidden="true" className="ml-2 w-5 h-5" />{' '}
          </Button>
          <T.P className="text-gray-500 dark:text-slate-400 text-sm">
            Manage your subscription. You can modify, upgrade or cancel your
            membership from here.
          </T.P>
        </div>
      ) : (
        <T.P className=" py-2 px-4 bg-gray-100 dark:bg-slate-400/20 text-sm text-gray-900 dark:text-slate-100 rounded-lg">
          Contact your administrator to upgrade plan.
        </T.P>
      )}
    </div>
  );
}
