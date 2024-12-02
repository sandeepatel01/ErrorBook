import mongoose from "mongoose";
import { DB_NAME } from "@/constant";

type connectionObject = {
  isConnected?: boolean;
};

const connection: connectionObject = {
  isConnected: false,
};

export const connectToDatabase = async () => {
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
    process.exit(1);
  }
};
