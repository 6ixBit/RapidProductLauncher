'use client';
import { EmailAndPassword } from '@/components/Auth/EmailAndPassword';
import { google as GoogleIcon } from '@/components/Auth/Icons';
import { RenderProviders } from '@/components/Auth/RenderProviders';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  signInWithProvider,
  signUp,
} from '@/data/auth/auth';
import { useSAToastMutation } from '@/hooks/useSAToastMutation';
import type { AuthProvider } from '@/types';
import logo from '@public/logos/rpd-logo.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function SignUp() {
  const router = useRouter();

  const passwordMutation = useSAToastMutation(
    async ({ email, password }: { email: string; password: string }) => {
      const response = await signUp(email, password);
      if (response.status === 'success') {
        // Redirect to onboarding flow
        router.push('/onboarding');
      }
      return response;
    },
    {
      loadingMessage: 'Creating your account...',
      errorMessage(error) {
        try {
          if (error instanceof Error) {
            return String(error.message);
          }
          return `Sign up failed ${String(error)}`;
        } catch (_err) {
          console.warn(_err);
          return 'Sign up failed';
        }
      },
      successMessage: 'Welcome to Rapid Product Launcher!',
    },
  );

  const providerMutation = useSAToastMutation(
    async (provider: AuthProvider) => {
      return signInWithProvider(provider, '/onboarding'); // Pass onboarding as next path
    },
    {
      loadingMessage: 'Creating your account...',
      successMessage: 'Redirecting...',
      errorMessage: 'Failed to create account',
      onSuccess: (payload) => {
        window.location.href = payload.data.url;
      },
    },
  );

  return (
    <div className="container text-left max-w-lg mx-auto overflow-auto min-h-[470px]">
      <div className="space-y-8 bg-background p-6 rounded-lg shadow">
        <div className="flex justify-center mb-4">
          <Image
            src={logo}
            alt="Rapid Product Launcher Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
        <Tabs defaultValue="password" className="md:min-w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password">Password</TabsTrigger>

            <TabsTrigger value="social-login" className="flex items-center gap-2">
              <GoogleIcon />
              Social Login
            </TabsTrigger>
          </TabsList>

          <TabsContent value="password">
            <Card className="border-none shadow-none">
              <CardHeader className="py-6 px-0">
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                  Create your account to start launching products
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 p-0">
                <EmailAndPassword
                  isLoading={passwordMutation.isLoading}
                  onSubmit={(data) => {
                    passwordMutation.mutate(data);
                  }}
                  view="sign-up"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social-login">
            <Card className="border-none shadow-none">
              <CardHeader className="py-6 px-0">
                <CardTitle>Get Started with Rapid Product Launcher</CardTitle>
                <CardDescription>
                  Create your account using your Google account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 p-0">
                <RenderProviders
                  providers={['google']}
                  isLoading={providerMutation.isLoading}
                  onProviderLoginRequested={providerMutation.mutate}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}