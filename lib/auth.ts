import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import bcrypt from 'bcryptjs';
import clientPromise from './mongodb-adapter';
import { IAccount, User } from '@/models/User';
import dbConnect from './mongodb';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email }).select('+password');

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password);

        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
      }

      if (trigger === 'update' && session) {
        if (session.user.name) token.name = session.user.name;
        if (session.user.avatar) token.avatar = session.user.avatar;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'credentials') {
        return true;
      }

      if (account?.provider === 'google' || account?.provider === 'github') {
        await dbConnect();

        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          existingUser = await User.create({
            name: user.name,
            email: user.email,
            avatar: user.image,
            emailVerified: new Date(),
            role: 'user',
            accounts: [{
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
            }]
          });
        } else {
          const hasAccount = existingUser.accounts?.some(
            (acc: IAccount) => acc.provider === account.provider
          );


          if (!hasAccount) {
            existingUser.accounts.push({
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
            });
            await existingUser.save();
          }
        }

        user.id = existingUser._id.toString();
        user.role = existingUser.role;

        return true;
      }

      return true;
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/register'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
});