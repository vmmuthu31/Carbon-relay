import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import  LinkedinProvider from "next-auth/providers/linkedin"
import  GitHubProvider from "next-auth/providers/github"
import { NextAuthOptions } from "next-auth"; 

const options: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.NEXTAUTH_CLIENT_ID as string, 
            clientSecret: process.env.NEXTAUTH_CLIENT_SECRET as string,
        }),
        LinkedinProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID as string, 
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
            authorization: {
                params: { scope: 'openid profile email w_member_social' },
              },
              issuer: 'https://www.linkedin.com',
              jwks_endpoint: 'https://www.linkedin.com/oauth/openid/jwks',
              profile(profile, tokens) {
                const defaultImage =
                  'https://cdn-icons-png.flaticon.com/512/174/174857.png';
                return {
                  id: profile.sub,
                  name: profile.name,
                  email: profile.email,
                  image: profile.picture ?? defaultImage,
                };
              },
        }),

            GitHubProvider({
              clientId: process.env.GITHUB_ID as string,
              clientSecret: process.env.GITHUB_SECRET as string
            })
          
    ],
    secret: "good",
};

export default NextAuth(options);
