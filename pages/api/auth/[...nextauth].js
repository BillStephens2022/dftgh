import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "../../../components/lib/db";
import { verifyPassword } from "../../../components/lib/auth";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const client = await connectToDatabase();

        const usersCollection = client.db().collection("users");
        const user = await usersCollection.findOne({
          username: credentials.username,
        });

        if (!user) {
          client.close();
          throw new Error("No user found!");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Could not log you in!");
        }

        client.close();
        console.log(user.username);
        console.log("Authorized User:", user);

        return { id: user.id, username: user.username, name: user.username };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        console.log("token: ", token);
        session.user = {
          username: token.name,
        };
      }
      console.log(session);
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});