import { AuthProvider } from '@/types';
import * as SocialIcons from '@/components/presentational/tailwind/Auth/Icons';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/HoverCard';
import { T } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button/ButtonShadcn';

function capitalize(word: string) {
  const lower = word.toLowerCase();
  return word.charAt(0).toUpperCase() + lower.slice(1);
}

const isDemo = true;

export const RenderProviders = ({
  providers,
  onProviderLoginRequested,
  isLoading,
}: {
  providers: AuthProvider[];
  onProviderLoginRequested: (provider: AuthProvider) => void;
  isLoading: boolean;
}) => {
  return (
    <div className="space-y-2">
      {providers.map((provider) => {
        const AuthIcon = SocialIcons[provider];
        const component = (
          <Button
            variant="default"
            key={provider}
            disabled={isLoading || isDemo}
            onClick={() => onProviderLoginRequested(provider)}
            className="bg-white dark:bg-white text-black dark:text-black border h-10 border-gray-400 dark:border-gray-600 rounded-lg"
          >
            <AuthIcon />
            <span className="">{capitalize(provider)}</span>
          </Button>
        );
        return (
          <>
            {isDemo ? (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="w-full [&>button]:w-full">{component}</div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 dark:bg-black bg-white border border-gray-300 dark:border-gray-700">
                  <T.Small className="text-muted-foreground">
                    ⚠️ As this is a demo, the social media authentication
                    buttons aren't linked. However, you can connect them in your
                    dev environment using the supabase dashboard for your
                    project.
                  </T.Small>
                </HoverCardContent>
              </HoverCard>
            ) : (
              component
            )}
          </>
        );
      })}
    </div>
  );
};
