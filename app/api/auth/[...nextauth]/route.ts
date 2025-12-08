import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account && profile) {
        token.googleId = profile.sub;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.id = token.googleId as string;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };
