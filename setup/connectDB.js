import { MongoClient } from "mongodb";

const mongoURI = process.env.MONGODB_URI;
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

export default async function connectDB() {
    if (!client.isConnected()) await client.connect();

    return client.db("MyMed");
}
