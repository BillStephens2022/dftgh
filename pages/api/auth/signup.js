import { hashPassword } from "../../../components/lib/auth";
import connectToDatabase from "../../../components/lib/db";

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    const { username, password } = data;
    if (
      !username ||
      !password ||
      password.trim().length < 7
    ) {
      res.status(422).json({
        message:
          "Invalid input - password should be at least 7 characters long.",
      });
      return;
    }
    const client = await connectToDatabase();
    const db = client.db();

    const hashedPassword = await hashPassword(password);

    const existingUser = await db.collection("users").findOne({username: username});
    if (existingUser) {
        res.status(422).json({ message: "User exists already!"});
        client.close();
        return;
    }
    const result = await db.collection("users").insertOne({
      username: username,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Created User!" });
    client.close();
  }
}

export default handler;