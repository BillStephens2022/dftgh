import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../components/lib/db";
import User from "@/models/User";
import { verifyPassword } from "../../../components/lib/auth";

console.log("Model imported in [...nextauth].js!");

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await dbConnect();

        try {
          const user = await User.findOne({ username: credentials.username });

          if (!user) {
            throw new Error("No user found!");
          }

          const isValid = await verifyPassword(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error("Could not log you in!");
          }

          console.log("Authorized User:", user);

          return {
            id: user.id,
            username: user.username,
            name: user.username,
            accessToken: user.token,
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          throw new Error("Could not log you in!");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        console.log("token: ", token);
        session.user = {
          username: token.name,
          accessToken: token
        };
      }
      console.log(session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
