import clientPromise from "@/lib/clientPromise";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "john@doe.com" },
                password: { label: "Password", type: "password", required: true }
            },
            async authorize(credentials, req) {
                await dbConnect();
                if (credentials == null) return null;
                try {
                    const user = await User.findOne({ email: credentials.email }, {}, { select: '+password' });
                    if (user) {
                        const isMatch = await compare(
                            credentials.password,
                            user?.password!,
                        );
                        if (isMatch) {
                            return { id: user._id, name: user.name, email: user.email, image: user.image } as any;
                        } else {
                            throw new Error("Email or password is incorrect");
                        }
                    } else {
                        throw new Error("Email or password is incorrect");
                    }
                } catch (e: any) {
                    throw new Error(e)
                }
            }
        })
    ],
    pages: {
        error: '/auth/error',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                (session as any).user = token.user;
            }
            return session;
        }
    },
    theme: {
        logo: '',
        colorScheme: 'auto',
        buttonText: 'Login'
    }
}


export default NextAuth(authOptions);