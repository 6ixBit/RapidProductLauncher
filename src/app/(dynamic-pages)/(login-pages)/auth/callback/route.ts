import { updateGoogleAuthTokens } from '@/data/user/user';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Failed to exchange code for session!: ', error);
        return NextResponse.redirect(new URL('/login', requestUrl.origin));
      }

      console.log('callback data: ', data);

      await updateGoogleAuthTokens({
        google_access_token: data?.session?.provider_token || undefined,
        google_refresh_token:
          data?.session?.provider_refresh_token || undefined,
      });
    } catch (error) {
      console.error('Failed to exchange code for session: ', error);
    }
  }
  revalidatePath('/');
  const productionDomain = 'https://app.rapidproductlauncher.ai';
  let redirectTo = new URL('/dashboard', productionDomain);
  if (next) {
    const decodedNext = decodeURIComponent(next);
    redirectTo = new URL(
      decodedNext.startsWith('http') ? decodedNext : decodedNext,
      productionDomain,
    );
  }
  return NextResponse.redirect(redirectTo);
}
