'use client';

import RouterProgressionContext from '@/contexts/RouterProgressionContext';
// import Link from 'next/link';
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  forwardRef,
  useContext,
} from 'react';
import { useRouter } from 'next/navigation';

// Workaround for this issue - https://github.com/vercel/next.js/issues/42991#issuecomment-1365230317
const DynamicLink = forwardRef<
  HTMLAnchorElement,
  ComponentProps<'a'> & {
    prefetch?: boolean;
  }
>(({ href, prefetch: _prefetch, ...props }, ref) => {
  const router = useRouter();
  return (
    <a
      ref={ref}
      href={String(href)}
      {...props}
      onClick={(e) => {
        e.preventDefault();
        props.onClick?.(e);
        router.push(String(href));
      }}
    >
      {props.children}
    </a>
  );
});

/**
 * The original Link component from Next.js no longer has router events.
 * This component is a wrapper around the Link component that adds the router events.
 * Helpful for adding a loading bar to the top of the page.
 */
export const Anchor = forwardRef<
  HTMLAnchorElement,
  Omit<ComponentPropsWithoutRef<typeof DynamicLink>, 'href'> & {
    href: string;
  }
>((props, ref) => {
  const startChange = useContext(RouterProgressionContext);
  const { href, onClick, ...otherProps } = props;
  const useLink = href.toString().startsWith('/');
  if (useLink)
    return (
      <DynamicLink
        ref={ref}
        href={href}
        onClick={(event) => {
          const { pathname, search, hash } = window.location;
          if (href !== pathname + search + hash) startChange();
          onClick?.(event);
        }}
        {...otherProps}
      ></DynamicLink>
    );
  return <a href={href.toString()} {...otherProps}></a>;
});
