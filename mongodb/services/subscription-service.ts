import { mongoDBConfig } from "@/config/mongodb";
import { Collection, ObjectId } from "mongodb";
import clientPromise from "../client";
import { Subscription } from "../models/subscription";

export async function insertSubscription(
  subscription: Subscription
): Promise<ObjectId> {
  const collection = await getCollectionSubscriptions();
  const insertOneResult = await collection.insertOne(subscription);
  return insertOneResult.insertedId;
}

async function getCollectionSubscriptions(): Promise<Collection<Subscription>> {
  const client = await clientPromise;
  const db = client.db(mongoDBConfig.database);
  return db.collection<Subscription>(mongoDBConfig.collectionSubscriptions);
}
