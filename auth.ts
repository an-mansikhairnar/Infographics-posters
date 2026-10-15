import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Facebook from 'next-auth/providers/facebook';
import Google from 'next-auth/providers/google';
import type { OAuthConfig } from 'next-auth/providers';
import { authAdapter, getInstagramUsername, updateInstagramUsername } from '@/app/lib/authAdapter';
import { authenticateCreator } from '@/app/lib/passwordAuth';

type InstagramBusinessProfile = {
  user_id?: string;
  id?: string;
  username?: string;
  profile_picture_url?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getProfileName(profile: Record<string, unknown>): string | undefined {
  if (typeof profile.name === 'string') return profile.name;
  if (typeof profile.username === 'string') return profile.username;
  return undefined;
}

function getProfileImage(profile: Record<string, unknown>): string | undefined {
  if (typeof profile.profile_picture_url === 'string') return profile.profile_picture_url;
  if (typeof profile.picture === 'string') return profile.picture;
  if (!isRecord(profile.picture) || !isRecord(profile.picture.data)) return undefined;
  return typeof profile.picture.data.url === 'string' ? profile.picture.data.url : undefined;
}

async function syncInstagramUsername(
  userId: string | undefined,
  provider: string | undefined,
  providerAccountId: string | undefined,
  profile: unknown
): Promise<string | undefined> {
  if (!userId || !providerAccountId || provider !== 'instagram' || !isRecord(profile)) {
    return undefined;
  }
  if (typeof profile.username !== 'string' || !profile.username.trim()) return undefined;

  const username = profile.username.trim().replace(/^@/, '');
  await updateInstagramUsername(userId, providerAccountId, username);
  return username;
}

// type FacebookBusinessProfile = {
//   id?: string;
//   name?: string;
//   email?: string;
//   picture?: { data?: { url?: string } };
// };

// const facebookLoginConfigId = process.env.FACEBOOK_LOGIN_CONFIG_ID;
// const facebookBusiness: OAuthConfig<FacebookBusinessProfile> = {
//   id: 'facebook',
//   name: 'Facebook',
//   type: 'oauth',
//   clientId: process.env.FACEBOOK_CLIENT_ID,
//   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//   authorization: {
//     // Auth.js otherwise adds OIDC's unsupported "profile" scope by default.
//     url: 'https://www.facebook.com/v19.0/dialog/oauth?scope=email',
//     params: {
//       config_id: facebookLoginConfigId ?? '',
//       response_type: 'code',
//       override_default_response_type: 'true',
//     },
//   },
//   token: {
//     url: 'https://graph.facebook.com/v19.0/oauth/access_token',
//   },
//   userinfo: {
//     url: 'https://graph.facebook.com/v19.0/me?fields=id,name,email,picture',
//     async request({ tokens }: { tokens: TokenSet }) {
//       if (!tokens.access_token) {
//         throw new Error('Facebook did not return an access token.');
//       }

//       const response = await fetch(
//         'https://graph.facebook.com/v19.0/me?fields=id,name,email,picture',
//         { headers: { Authorization: `Bearer ${tokens.access_token}` } }
//       );
//       if (!response.ok) {
//         throw new Error(`Facebook profile lookup failed (${response.status}).`);
//       }

//       const profile: unknown = await response.json();
//       if (!isRecord(profile) || typeof profile.id !== 'string') {
//         throw new Error('Facebook did not return an account identifier.');
//       }

//       const picture = isRecord(profile.picture) ? profile.picture : undefined;
//       const pictureData = picture && isRecord(picture.data) ? picture.data : undefined;
//       return {
//         id: profile.id,
//         name: typeof profile.name === 'string' ? profile.name : undefined,
//         email: typeof profile.email === 'string' ? profile.email : undefined,
//         picture: pictureData && typeof pictureData.url === 'string'
//           ? { data: { url: pictureData.url } }
//           : undefined,
//       };
//     },
//   },
//   profile(profile) {
//     if (!profile.id) throw new Error('Facebook did not return an account identifier.');
//     return {
//       id: profile.id,
//       name: profile.name ?? null,
//       email: profile.email ?? null,
//       image: profile.picture?.data?.url ?? null,
//     };
//   },
// };

const instagramBusiness: OAuthConfig<InstagramBusinessProfile> = {
  id: 'instagram',
  name: 'Instagram',
  type: 'oauth',
  clientId: process.env.INSTAGRAM_CLIENT_ID,
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  checks: ['state'],
  authorization: {
    url: 'https://www.instagram.com/oauth/authorize',
    params: {
      enable_fb_login: 'false',
      scope: 'instagram_business_basic',
      response_type: 'code',
    },
  },
  token: {
    url: 'https://api.instagram.com/oauth/access_token',
    async conform(response: Response) {
      if (!response.ok) return response;

      const tokenResponse: unknown = await response.clone().json();
      if (
        !isRecord(tokenResponse) ||
        typeof tokenResponse.access_token !== 'string' ||
        typeof tokenResponse.token_type === 'string'
      ) {
        return response;
      }

      const headers = new Headers(response.headers);
      headers.delete('content-length');
      headers.delete('content-encoding');
      headers.set('content-type', 'application/json');

      return new Response(
        JSON.stringify({ ...tokenResponse, token_type: 'bearer' }),
        {
          status: response.status,
          statusText: response.statusText,
          headers,
        }
      );
    },
  },
  userinfo: {
    url: 'https://graph.instagram.com/me?fields=user_id,username,profile_picture_url',
  },
  client: {
    token_endpoint_auth_method: 'client_secret_post',
  },
  profile(profile) {
    const id = profile.user_id ?? profile.id;
    if (!id) throw new Error('Instagram did not return an account identifier.');
    return {
      id: String(id),
      name: profile.username ?? null,
      email: null,
      image: profile.profile_picture_url ?? null,
    };
  },
};
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: authAdapter,
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        mode: { label: 'Mode', type: 'text' },
      },
      async authorize(credentials) {
        return authenticateCreator(credentials);
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // facebookLoginConfigId
    //   ? { ...facebookBusiness, allowDangerousEmailAccountLinking: true }
    //   :
      Facebook({
          clientId: process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          authorization: {
            params: {
              scope: 'public_profile,email',
            },
          },
          allowDangerousEmailAccountLinking: true,
        }),
    instagramBusiness,
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user?.id) {
        token.sub = user.id;
        if (user.name) token.name = user.name;
        if (user.image) token.picture = user.image;
        if (user.email?.endsWith('@users.invalid')) token.email = '';
      }
      if (account && profile && isRecord(profile)) {
        const name = getProfileName(profile);
        const image = getProfileImage(profile);
        if (!token.name && name) token.name = name;
        if (image) token.picture = image;
      }
      const instagramUsername = await syncInstagramUsername(
        user?.id,
        account?.provider,
        account?.providerAccountId,
        profile
      );
      if (instagramUsername) token.instagramUsername = instagramUsername;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.name = typeof token.name === 'string' ? token.name : null;
        session.user.image = typeof token.picture === 'string' ? token.picture : null;
        if (!token.email || token.email.endsWith('@users.invalid')) {
          session.user.email = '';
        }
        const instagramUsername =
          typeof token.instagramUsername === 'string'
            ? token.instagramUsername
            : await getInstagramUsername(token.sub);
        if (instagramUsername) session.user.instagramUsername = instagramUsername;
      }
      return session;
    },
  },
});
