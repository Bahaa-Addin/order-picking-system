import { MongoClient, Db } from 'mongodb';
import EnvVars from './constants/EnvVars';

const uri = EnvVars.DatabaseUrl;
console.log('mongodb uri', uri)


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

