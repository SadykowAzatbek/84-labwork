import mongoose from "mongoose";
import config from "./config";

const run = async () => {
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('tasks');
  } catch (err) {
    console.log(err);
  }
};

void run();