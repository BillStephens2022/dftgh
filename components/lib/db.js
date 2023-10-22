import { MongoClient } from "mongodb";

export default async function connectToDatabase() {
  const pwParam = encodeURIComponent(process.env.MONGODB_PW);
  const client = await MongoClient.connect(
    `mongodb+srv://two4onebill:${pwParam}@cluster0.xvwjnur.mongodb.net/dftgh?retryWrites=true&w=majority`
  );

  return client;
}