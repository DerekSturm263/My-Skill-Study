'use server'

import { MongoClient, ObjectId, WithId } from 'mongodb';
import { Sharable } from './types';

const client = new MongoClient(process.env.MONGODB_URI ?? '', {
  serverSelectionTimeoutMS: 120000,
  connectTimeoutMS: 120000
});

export async function get<T extends Sharable>(collection: string, id: string): Promise<WithId<T>> {
  const skill = await client.db('database').collection(collection).findOne(
    { _id: new ObjectId(id) }
  );

  return skill as WithId<T>;
}

export async function getAll<T extends Sharable>(collection: string): Promise<WithId<T>[]> {
  const courses = await client.db('database').collection(collection).find().toArray();

  return courses.map(item => item as WithId<T>);
}

export async function create<T extends Sharable>(collection: string): Promise<{ value: T, id: ObjectId }> {
  const item: T = {} as T;
  const result = await client.db('database').collection(collection).insertOne(item);

  return { value: item, id: result.insertedId };
}

export async function save<T extends Sharable>(collection: string, id: string, value: T) {
  const result = await client.db('database').collection(collection).updateOne(
    { _id: new ObjectId(id) },
    { $set: value }
  );

  return result;
}

export async function remove(collection: string, id: string) {
  await client.db('database').collection(collection).deleteOne(
    { _id: new ObjectId(id) }
  );
}