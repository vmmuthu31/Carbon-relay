import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth"; 

const options: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.NEXTAUTH_CLIENT_ID as string, 
            clientSecret: process.env.NEXTAUTH_CLIENT_SECRET as string,
        }),
    ],
    secret: "good",
};

export default NextAuth(options);
