import mongoose from "mongoose";
import config from "./config";

const dropCollection = async (db: mongoose.Connection, collectionName: string) => {
  try {
    await db.dropCollection(collectionName);
  } catch (err) {
    console.log(`Collection ${collectionName} was missing, skipping drop...`);
  }
};

const run = async () => {
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection;

 const collections = ['users', 'tasks'];

 for (const collectionName of collections) {
   await dropCollection(db, collectionName);
 }


};

void run();