import { AuthProvider } from '@/types';
import * as SocialIcons from '@/components/presentational/tailwind/Auth/Icons';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/HoverCard';
import { T } from '@/components/ui/Typography';

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
          <button
            disabled={isLoading || isDemo}
            onClick={() => onProviderLoginRequested(provider)}
            key={provider}
            className="border overflow-auto flex w-full items-center justify-center py-1.5 space-x-2 border-slate-400  text-base  text-slate-700 rounded-md hover:bg-slate-100 hover:text-slate-900"
          >
            <AuthIcon />
            <span className="text-base">{capitalize(provider)}</span>
          </button>
        );
        return (
          <>
            {isDemo ? (
              <HoverCard>
                <HoverCardTrigger asChild>{component}</HoverCardTrigger>
                <HoverCardContent className="w-80 bg-slate-900">
                  <T.Small className="text-slate-50">
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
