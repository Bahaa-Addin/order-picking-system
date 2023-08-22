import { MongoClient, Db } from 'mongodb';

// const uri = process.env.DATABASE_URL;
// console.log('mongodb uri', uri)
const uri = "mongodb+srv://bahaa:BemvBNixFGkp0OVs@seoudi.pcbwpox.mongodb.net/test?retryWrites=true&w=majority"

export const client = new MongoClient(uri);


export async function connectDb(dbName: string): Promise<Db> {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(dbName);
  } catch (error) {
    await client.close();
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

