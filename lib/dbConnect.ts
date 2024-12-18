import mongoose from "mongoose";
import { DB_NAME } from "@/constant";

type connectionObject = {
  isConnected?: boolean;
};

const connection: connectionObject = {
  isConnected: false,
};

export const connectToDatabase = async (retries = 5) => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) {
    return console.log("MONGODB_URI is not defined");
  }

  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    connection.isConnected = db.connections[0].readyState === 1;
    if (connection.isConnected) {
      console.log(
        `MongoDB connected successfully to host: ${db.connection.host}`,
      );
    } else {
      console.log("MongoDB connection failed.");
    }
  } catch (error) {
    console.log("DB Connection Failed: ", error);
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} retries left)`);
      setTimeout(() => connectToDatabase(retries - 1), 5000);
    } else {
      process.exit(1);
    }
  }
};
