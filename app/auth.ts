import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Export NextAuth configuration with route handlers and helpers
export const {
  handlers: { GET, POST }, // API route handlers for auth requests
  auth,                    // Auth middleware (can be used in server routes)
  signIn,                  // Function to trigger login
  signOut,                 // Function to trigger logout
} = NextAuth({
  // Authentication providers
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,         // Google Client ID from Google Cloud Console
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Google Client Secret
      authorization: {
        params: {
          prompt: "consent",      // Always ask the user for consent when loggin in
          access_type: "offline", // Request refresh token for long-lived access
          response_type: "code", 
        },
      },
    }),
  ],
  // Callbacks to customize tokens and session behavior 
  callbacks: {
    // Called whenever a JWT is created/updated
    async jwt({ token, account, profile }) {
      if (account && profile) {
        // Store Google user ID (sub) in the token for later use
        token.googleId = profile.sub;
      }
      return token;
    },
    // Called whenever a session is checked or created
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token.googleId ?? token.sub ?? "") as string;
      }
      return session;
    },
  },
});
