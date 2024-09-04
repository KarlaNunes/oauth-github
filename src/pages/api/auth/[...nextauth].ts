import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '',
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      try {
        const accessToken = account?.access_token; 

        if (!accessToken) {
          throw new Error('No access token found');
        }

        const res = await fetch('http://localhost:8000/api/auth/github/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ access_token: accessToken }), 
        });

        if (res.ok) {
          return true;
        } else {
          const errorData = await res.json();
          console.error('Sign in error:', errorData);
          return false;
        }
      } catch (error) {
        console.error('Error during sign in:', error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login', 
  },
});
