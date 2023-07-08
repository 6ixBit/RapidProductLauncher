import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createOrganization,
  getActiveProductsWithPrices,
  getAllOrganizationsForUser,
  getPendingTeamInvitationsInOrganization,
  getOrganizationById,
  getOrganizationSubscription,
  getTeamMembersInOrganization,
  getUserProfile,
  getUserOrganizationRole,
  resetPassword,
  signInWithMagicLink,
  signInWithPassword,
  signInWithProvider,
  signUp,
  updatePassword,
  updateOrganizationTitle,
  updateUserProfileNameAndAvatar,
  createTeam,
} from './supabase-queries';
import { AuthProvider, Table, Enum, UnwrapPromise } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { uploadPublicUserAvatar } from './supabase-storage-queries';
import { useRef } from 'react';
import { getPossibleAxiosErrorMessage } from './getAxiosErrorMessage';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';

// update organization title mutation

export const useUpdateOrganizationTitleMutation = ({
  onSuccess,
  onError,
  organizationId,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  organizationId: string;
}) => {
  const queryClient = useQueryClient();
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async ({ title }: { title: string }) => {
      return updateOrganizationTitle(
        supabaseUserClientComponentClient,
        organizationId,
        title
      );
    },
    {
      onMutate: () => {
        const toastId = toast.loading('Updating organization title...');
        toastRef.current = toastId;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['organization', organizationId]);
        toast.success('Organization title updated', {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
        onSuccess?.();
      },
      onError: (error) => {
        onError?.(error);
        toast.error('Failed to update organization title', {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
      },
    }
  );
};

/* ==================== */
/* USER PROFILE */
/* ==================== */

export const useUserProfile = (initialData?: Table<'user_profiles'>) => {
  const user = useLoggedInUser();
  return useQuery<Table<'user_profiles'>>(
    ['user-profile', user.id],
    async () => {
      return getUserProfile(supabaseUserClientComponentClient, user.id);
    },
    {
      initialData,
    }
  );
};

export const useUpdateUserFullnameAndAvatarMutation = ({
  onSuccess,
  onError,
  onMutate,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  onMutate?: () => void;
}) => {
  const user = useLoggedInUser();
  const queryClient = useQueryClient();
  const toastRef = useRef<string | null>(null);

  return useMutation(
    async (data: { avatarUrl?: string; fullName?: string }) => {
      return updateUserProfileNameAndAvatar(
        supabaseUserClientComponentClient,
        user.id,
        data
      );
    },

    {
      onMutate: () => {
        toastRef.current = toast.loading('Updating profile...');
        onMutate?.();
      },
      onSuccess: () => {
        toast.success('Profile updated', {
          id: toastRef.current ?? undefined,
        });
        queryClient.invalidateQueries(['user-profile', user.id]);
        onSuccess?.();
      },
      onError: (error) => {
        toast.error('Failed to update profile', {
          id: toastRef.current ?? undefined,
        });
        onError?.(error);
      },
    }
  );
};

export const useUploadUserAvatarMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (avatarUrlPath: string) => void;
  onError?: (error: unknown) => void;
}) => {
  const user = useLoggedInUser();
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async (file: File) =>
      await uploadPublicUserAvatar(
        supabaseUserClientComponentClient,
        user.id,
        file,
        file.name,
        {
          upsert: true,
        }
      ),
    {
      onMutate: () => {
        toastRef.current = toast.loading('Uploading avatar...');
      },
      onSuccess: (avatarUrl: string) => {
        onSuccess?.(avatarUrl);
        toast.success('Avatar uploaded', {
          id: toastRef.current ?? undefined,
        });
      },
      onError: (error) => {
        onError?.(error);
        toast.error('Failed to upload avatar', {
          id: toastRef.current ?? undefined,
        });
      },
    }
  );
};

/* ==================== */
/* Organizations */
/* ==================== */

export type InitialOrganizationListType = UnwrapPromise<
  ReturnType<typeof getAllOrganizationsForUser>
>;

export const useOrganizationsList = (
  initialOrganizationList: InitialOrganizationListType
) => {
  const user = useLoggedInUser();
  return useQuery<InitialOrganizationListType>(
    ['organization-list', user.id],
    async () => {
      return getAllOrganizationsForUser(
        supabaseUserClientComponentClient,
        user.id
      );
    },
    {
      initialData: initialOrganizationList,
    }
  );
};

export const useCreateOrganizationMutation = ({
  onSuccess,
  onSettled,
  onError,
}: {
  onSuccess?: (data: Table<'organizations'>) => void;
  onSettled?: () => void;
  onError?: (error: Error) => void;
}) => {
  const user = useLoggedInUser();
  const queryClient = useQueryClient();
  const toastRef = useRef<string>();
  return useMutation(
    async (name: string) => {
      return createOrganization(supabaseUserClientComponentClient, user, name);
    },
    {
      onMutate: async (name) => {
        toastRef.current = toast.loading(`Creating organization ${name}...`);
      },
      onSuccess: (data) => {
        // Invalidate the organization list query
        queryClient.invalidateQueries(['organization-list', user?.id]);
        onSuccess?.(data);
        toast.success(`Organization ${data.title} created!`, {
          id: toastRef.current,
        });
        toastRef.current = undefined;
      },
      onSettled,
      onError: (error) => {
        const customError =
          error instanceof Error ? error : new Error(String(error));
        onError?.(customError);
        toast.error(`Error creating organization: ${customError.message}`, {
          id: toastRef.current,
        });
        toastRef.current = undefined;
      },
    }
  );
};

/* ==================== */
/* Organization */
/* ==================== */

export type OrganizationByIdData = UnwrapPromise<
  ReturnType<typeof getOrganizationById>
>;

export const useGetOrganizationById = (
  organizationId: string,
  initialOrganizationData?: OrganizationByIdData
) => {
  return useQuery(
    ['organization', organizationId],
    async () => {
      return getOrganizationById(
        supabaseUserClientComponentClient,
        organizationId
      );
    },
    {
      initialData: initialOrganizationData,
    }
  );
};

export const useGetTeamMembersInOrganization = (organizationId: string) => {
  return useQuery(['team-members', organizationId], async () => {
    return getTeamMembersInOrganization(
      supabaseUserClientComponentClient,
      organizationId
    );
  });
};

export const useGetTeamInvitationsInOrganization = (organizationId: string) => {
  return useQuery(['team-invitations', organizationId], async () => {
    return getPendingTeamInvitationsInOrganization(
      supabaseUserClientComponentClient,
      organizationId
    );
  });
};

export const useInviteUserMutation = (
  organizationId: string,
  {
    onSuccess,
    onSettled,
    onError,
  }: {
    onSuccess?: () => void;
    onSettled?: () => void;
    onError?: (error: unknown) => void;
  }
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      email,
      organizationId,
      role,
    }: {
      email: string;
      organizationId: string;
      role: Enum<'organization_member_role'>;
    }) => {
      return axios.post(
        '/api/invitations/create',
        {
          email,
          organizationId,
          role,
        },
        {
          withCredentials: true,
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['team-invitations', organizationId]);
        onSuccess?.();
      },
      onSettled: () => {
        onSettled?.();
      },
      onError: (error) => {
        onError?.(error);
      },
    }
  );
};

export const useGetOrganizationSubscription = (organizationId: string) => {
  return useQuery(
    ['organization-subscription', organizationId],
    async () => {
      return getOrganizationSubscription(
        supabaseUserClientComponentClient,
        organizationId
      );
    },
    {
      retry: false,
      retryDelay: 0,
      refetchOnWindowFocus: false,
    }
  );
};

export const useGetAllActiveProducts = () => {
  return useQuery(
    ['all-active-products'],
    async () => {
      return getActiveProductsWithPrices(supabaseUserClientComponentClient);
    },
    {
      refetchOnWindowFocus: false,
    }
  );
};

/* ==================== */
/* Subscription */
/*==================== */

export const useCreateOrganizationCheckoutSessionMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (url: string) => void;
  onError?: (error: unknown) => void;
}) => {
  return useMutation(
    async ({
      organizationId: organizationId,
      priceId,
      isTrial = false,
    }: {
      organizationId: string;
      priceId: string;
      isTrial?: boolean;
    }) => {
      return axios.post<{
        sessionId: string;
      }>(
        `/api/stripe/${organizationId}/create-checkout-session`,
        {
          priceId,
          isTrial,
        },
        {
          withCredentials: true,
        }
      );
    },
    {
      onSuccess: (axiosResponse) => {
        onSuccess?.(axiosResponse.data.sessionId);
      },
      onError: (error) => {
        onError?.(error);
      },
    }
  );
};
export const useCreateOrganizationCustomerPortalMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (url: string) => void;
  onError?: (error: unknown) => void;
}) => {
  return useMutation(
    async ({ organizationId }: { organizationId: string }) => {
      return axios.post<{
        url: string;
      }>(
        `/api/stripe/${organizationId}/create-portal-link`,
        {},
        {
          withCredentials: true,
        }
      );
    },
    {
      onSuccess: (axiosResponse) => {
        onSuccess?.(axiosResponse.data.url);
      },
      onError: (error) => {
        const errorMessage = getPossibleAxiosErrorMessage(error);
        toast.error(`Error creating portal link: ${errorMessage}`);
        onError?.(error);
      },
    }
  );
};

export const useGetIsOrganizationAdmin = (organizationId: string) => {
  const user = useLoggedInUser();
  return useQuery(['isOrganizationAdmin', user.id], async () => {
    const memberInfo = await getUserOrganizationRole(
      supabaseUserClientComponentClient,
      user.id,
      organizationId
    );
    return (
      memberInfo.member_role === 'admin' || memberInfo.member_role === 'owner'
    );
  });
};

/* ================= */
/* Update email */
/* ================= */

export function useUpdateUserEmailMutation() {
  const queryClient = useQueryClient();
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async ({ newEmail }: { newEmail: string }) => {
      const { data } = await supabaseUserClientComponentClient.auth.updateUser({
        email: newEmail,
      });
      return data;
    },
    {
      onMutate: async () => {
        toastRef.current = toast.loading('Updating email...');
      },
      onSuccess: () => {
        toast.success('Email updated!', {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
        queryClient.invalidateQueries(['user']);
        window.location.reload();
      },
      onError: (error) => {
        toast.error(String(error), {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
      },
    }
  );
}

/* ==================== */
/* AUTH */
/* ==================== */

export const useSignInWithMagicLink = ({
  onSuccess,
  onMutate,
  onError,
}: {
  onSuccess?: () => void;
  onMutate?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async ({ email }: { email: string }) => {
      return signInWithMagicLink(supabaseUserClientComponentClient, email);
    },
    {
      onMutate: () => {
        toastRef.current = toast.loading('Sending magic link...');
        onMutate?.();
      },
      onSuccess: () => {
        toast.success('Check your email for the magic link!', {
          id: toastRef.current ?? undefined,
        });

        toastRef.current = null;
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(String(error), {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
        onError?.(error);
      },
    }
  );
};

export const useSignInWithPassword = ({
  onSuccess,
  onMutate,
  onError,
}: {
  onSuccess?: () => void;
  onMutate?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async ({ email, password }: { email: string; password: string }) => {
      return signInWithPassword(
        supabaseUserClientComponentClient,
        email,
        password
      );
    },
    {
      onMutate: () => {
        toastRef.current = toast.loading('Signing in...');
        onMutate?.();
      },
      onSuccess: () => {
        toast.success('Signed in!', {
          id: toastRef.current ?? undefined,
        });

        toastRef.current = null;
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(String(error), {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
        onError?.(error);
      },
    }
  );
};

export const useResetPassword = ({
  onSuccess,
  onMutate,
  onError,
}: {
  onSuccess?: () => void;
  onMutate?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async ({ email }: { email: string }) => {
      return resetPassword(supabaseUserClientComponentClient, email);
    },
    {
      onMutate: () => {
        toastRef.current = toast.loading('Sending password reset email...');
        onMutate?.();
      },
      onSuccess: () => {
        toast.success('Check your email for the password reset link!', {
          id: toastRef.current ?? undefined,
        });

        toastRef.current = null;
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(String(error), {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
        onError?.(error);
      },
    }
  );
};

export const useUpdatePassword = ({
  onSuccess,
  onMutate,
  onError,
}: {
  onSuccess?: () => void;
  onMutate?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async ({ password }: { password: string }) => {
      return updatePassword(supabaseUserClientComponentClient, password);
    },
    {
      onMutate: () => {
        toastRef.current = toast.loading('Updating password...');
        onMutate?.();
      },
      onSuccess: () => {
        toast.success('Password updated!', {
          id: toastRef.current ?? undefined,
        });

        toastRef.current = null;
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(String(error), {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
        onError?.(error);
      },
    }
  );
};

export const useSignInWithProvider = () => {
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async ({ provider }: { provider: AuthProvider }) => {
      return signInWithProvider(supabaseUserClientComponentClient, provider);
    },
    {
      onMutate: ({ provider }) => {
        toastRef.current = toast.loading(`Signing in with ${provider}...`);
      },
    }
  );
};

export const useSignUp = ({
  onSuccess,
  onMutate,
  onError,
}: {
  onSuccess?: () => void;
  onMutate?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async ({ email, password }: { email: string; password: string }) => {
      return signUp(supabaseUserClientComponentClient, email, password);
    },
    {
      onMutate: () => {
        toastRef.current = toast.loading('Signing up...');
        onMutate?.();
      },
      onSuccess: () => {
        toast.success('Signed up!', {
          id: toastRef.current ?? undefined,
        });

        toastRef.current = null;
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(String(error), {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
        onError?.(error);
      },
    }
  );
};
